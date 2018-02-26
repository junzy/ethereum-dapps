var wallet = artifacts.require("./MyWallet.sol");

contract("MyWallet", function(accounts) {
	it("should be possible to put money inside", function() {
		var contractInstance;
		return wallet.deployed().then(function(instance) {
			contractInstance = instance;
			return contractInstance.sendTransaction({value: web3.toWei(10, 'ether'), address:contractInstance.address, from: accounts[1]});
		}).then(function(tx){
			console.log("tx hash", tx);
			assert.equal(web3.eth.getBalance(contractInstance.address), web3.toWei(10, 'ether'), "the balance is the same");
		})
	})

    it('should be possible to get money back as the owner', function() {
        var walletInstance;
        var balanceBeforeSend;
        var balanceAfterSend;
        var amountToSend = web3.toWei(5, 'ether');
        return wallet.deployed().then(function(instance) {
            walletInstance = instance;
            balanceBeforeSend = web3.eth.getBalance(instance.address).toNumber();
            return walletInstance.spendMoneyOn(accounts[0], amountToSend, "Because I'm the owner", {from: accounts[0]});
        }).then(function() {
            return web3.eth.getBalance(walletInstance.address).toNumber();
        }).then(function(balance) {
            balanceAfterSend = balance;
            assert.equal(balanceBeforeSend - amountToSend, balanceAfterSend, 'Balance is now 5 ether less than before');
        });
    });

    it('should be possible to propose and confirm spending money', function() {
        var walletInstance;
        return wallet.deployed().then(function(instance) {
            walletInstance = instance;
            return walletInstance.spendMoneyOn(accounts[1], web3.toWei(5,'ether'), "Because I need money", {from: accounts[1]});
        }).then(function() {
            assert.equal(web3.eth.getBalance(walletInstance.address).toNumber(), web3.toWei(5, 'ether'), 'Balance is now 5 ether less than before');
        });
    });

	// spendMoneyOn
    it('should be possible to propose and confirm spending money', function() {
        var walletInstance;
        return wallet.deployed().then(function(instance) {
            walletInstance = instance;
            return walletInstance.spendMoneyOn(accounts[1], web3.toWei(5,'ether'), "Because I need money", {from: accounts[1]});
        }).then(function(transactionResult) {
        	  // We can loop through transactionResult.logs to see if we triggered the Transfer event.
			for (var i = 0; i < transactionResult.logs.length; i++) {
			   // We found the event!
			   var log = transactionResult.logs[i];
			   assert.equal(log.event, "proposalReceived", "proposalReceived Event received correctly");
			}
            assert.equal(web3.eth.getBalance(walletInstance.address).toNumber(), web3.toWei(5, 'ether'), 'Balance is 5 ether less than before');
            var proposal_id = transactionResult.logs[0].args.proposal_id;
            return walletInstance.confirmProposal(proposal_id, {from: accounts[0]})
        }).then(function(transactionResult) {
        	for (var i = 0; i < transactionResult.logs.length; i++) {
			   // We found the event!
			   var log = transactionResult.logs[i];
			   assert.equal(log.event, "receivedFunds", "receivedFunds Event received correctly");
			}
            return web3.eth.getBalance(walletInstance.address).toNumber();
        }).then(function(balance) {
          assert.equal(balance, web3.toWei(0, 'ether'), 'Wallet balance is 0 now.');
        });
});
});


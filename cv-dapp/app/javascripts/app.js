// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import "bootstrap";
// import "bootstrap/dist/css/bootstrap.css"

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import mycv_artifacts from '../../build/contracts/MyCV.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MyCV = contract(mycv_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MyCV.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      App.initialize();
    });
  },
  
  // displays the contract address, authorname, title and summary
  showBasicInfo: function(){
    MyCV.deployed().then(function(instance){
      document.getElementById("contractAddress").innerHTML = instance.address;
      return instance.basicInfo({from: accounts[0]});
    }).then(function(basicInfo){
      var [authorName, title, email, phoneno, website, summary] = basicInfo;
      document.getElementById("title").innerHTML = title;
      document.getElementById("authorName").innerHTML = authorName;
      document.getElementById("summary").innerHTML = summary;
    }).catch(function(error){
      console.error(error);
    })
  },
  
  // Populates the experiences into a div
  showExperiences: function(experience_counter) {
    if (experience_counter > 0){
      MyCV.deployed().then(function(instance){
        return instance.m_experiences(experience_counter, {from: accounts[0], gas:500000});
    }).then(function(result){
      console.log(result);
      var [role, date, description] = result;
      document.getElementById("experience").innerHTML += "</br></br>" + date + "," + role + "</br>" + description;
      experience_counter--;
      App.showExperiences(experience_counter);
    }).catch(function(error){
      console.error(error);
    })
    }
  },
  // adds an experience to the experience mapping
  addExperience: function() {
    MyCV.deployed().then(function(instance){
      var title = document.getElementById("experience_title").value;
      var description = document.getElementById("experience_description").value;
      var period = document.getElementById("experience_date").value;
      return instance.addExperience(period, title, description, {from: accounts[0], gas:500000})
    }).then(function(result){
      console.log(result);
      App.initializeExperiences();
    }).catch(function(error){
      console.error(error);
    })
  },

  // gets the count of experiences and calls showExperience that many times
  initializeExperiences: function(){
    MyCV.deployed().then(function(instance){
      return instance.experience_counter({from: accounts[0]})
    }).then(function(result){
      // clear existing experiences
      document.getElementById("experience").innerHTML = "";
      // get the count of experiences and show them all
      App.showExperiences(result.c);
    }).catch(function(error){
      console.error(error);
    })
  },

  initialize: function() {
    App.showBasicInfo();
    App.initializeExperiences();    
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your name doesn't appear or you have no address displayed, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});

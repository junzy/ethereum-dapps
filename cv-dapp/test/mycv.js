var MyCV = artifacts.require("./MyCV.sol");

contract('MyCV', function(accounts) {
  it("should update basic info correctly", function() {
    var contractInstance;
    return MyCV.deployed().then(function(instance) {
      contractInstance = instance;
      return instance.setBasicInfo("Rick Sanchez", "World Dominator", 
        "riggityrekt@mort.com", "+91 9642084724", "junzy.github.io",
        "Peace among worlds");
    }).then(function(result) {
      console.log(result);
      for (var i = 0; i < result.logs.length; i++) {
         // We found the event!
         var log = result.logs[i];
         assert.equal(log.event, "basicInfoSet", "basicInfoSet Event received correctly");
      }
    }).then(function(){
      return contractInstance.getAddress();
    }).then(function(result){
      var address = result;
      assert.equal(address, "junzy.github.io", "Address set correctly");
    }).then(function(){
      return contractInstance.getTitle();
    }).then(function(result){
      var title = result;
      assert.equal(title, "World Dominator", "Title set correctly");
    }).then(function(){
      return contractInstance.getAuthor();
    }).then(function(result){
      var [author, email] = result;
      assert.equal(author, "Rick Sanchez", "Author set correctly");
      assert.equal(email, "riggityrekt@mort.com", "Email set correctly");
    }).then(function(){
      return contractInstance.getDescription();
    }).then(function(result){
      var description = result;
      assert.equal(description, "Peace among worlds", "Summary set correctly");
    });
  });
});
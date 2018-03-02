// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '*', // Match any network id
      gas: 4600000,
      from: "0x627306090abab3a6e1400e9345bc60c78a8bef57"
    }
  }
}

const HDWalletProvider = require('@truffle/hdwallet-provider');
//
// const fs = require('fs');
const mnemonic = "sorry nerve enable alley forget program cash color alarm fatal ten trim";

module.exports = {

  networks: {
    kardiachain: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc.kardiachain.io`),
      network_id: "0",        // KardiaChain network ID
      gas: 5500000,           // Default gas limit
      confirmations: 2,       // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,     // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true        // Skip dry run before migrations?
    },
    kardiachain_testnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://dev.kardiachain.io`),
      network_id: "69",       // KardiaChain Testnet network id
      gas: 5500000,           // Default gas limit
      confirmations: 2,       // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,     // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,       // Skip dry run before migrations? (default: false for public nets )
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.12",      // Fetch exact version from solc-bin (default: truffle's version)
      settings: {             // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        },
      }
    }
  },
};
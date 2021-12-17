const HDWalletProvider = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv');
dotenv.config();
const mnemonicPhrase = process.env.MNEMONIC;
const infuraKey = process.env.INFURA_KEY;
const account = process.env.ACCOUNT;

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    rinkeby: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: mnemonicPhrase
        },
        providerOrUrl: 'wss://rinkeby.infura.io/ws/v3/' + infuraKey
      }),
      network_id: '4',
      gas: 5500000,
      confirmations: 2,
      timeoutBlock: 200,
      skyDryRun: true,
      from: account
    }
  },
  compilers: {
    solc: {
      version: "0.5.0",    // Fetch exact version from solc-bin (default: truffle's version)
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "byzantium"
    }
  }
};
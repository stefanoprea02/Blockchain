require('@nomiclabs/hardhat-ethers');
require("@nomicfoundation/hardhat-chai-matchers");
require('hardhat-deploy');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      gas: 2100000,
      gasPrice: 8000000000,
      chainId: 31337
    },
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: ["0xc374d65e831399f4e88b05760ee80e6ac769e0432b20043c7b4bd074c0c1ba7b"],
      chainId: 11155111,
      blockConfirmations: 6,
    }
  },
  solidity: {
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000
          }
        }
      },
    ]
  },
  namedAccounts: {
    deployer: {
        default: 0,
        1: 0,
  },
},
};

require("@nomiclabs/hardhat-waffle");

const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()
const chainAPIKey = process.env.CHAIN_API_KEY


module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${chainAPIKey}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${chainAPIKey}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
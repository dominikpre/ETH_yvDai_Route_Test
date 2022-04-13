require("@nomiclabs/hardhat-waffle");
require("@tenderly/hardhat-tenderly");
const dotenv = require("dotenv");
dotenv.config();


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.11",
  // tenderly: {
	// 	username: "DomiPre",
	// 	project: "rca"
	// },
  networks: {
    tenderly: {
      url: process.env.TENDERLY_FORK || "",
      // url: 'https://rpc.tenderly.co/fork/7559aec5-ca8f-4600-bce3-b1a6569685cd',
      // accounts: process.env.MAINNET_PRIVATE_KEY ? [`0x${process.env.MAINNET_PRIVATE_KEY}`] : [],
      chainId: 1,
    },
    hardhat: {
      forking:{
        url: process.env.MAINNET_URL_ALCHEMY || "",
        blockNumber: 14576259,
      }
    }
  }
};

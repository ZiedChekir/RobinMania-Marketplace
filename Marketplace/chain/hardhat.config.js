require("@nomiclabs/hardhat-waffle");

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
  defaultNetwork: "kardiachain",
  networks: {
    hardhat: {
    },
    kardiachain: {
      url: "https://rpc.kardiachain.io",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  },
  solidity: {
    version: "0.8.12", // Recommended version >= 0.5.0
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY as string;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL as string;
const POLYSCAN_KEY = process.env.POLYSCAN_KEY as string;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: "matic",
  networks: {
    hardhat: {},
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [METAMASK_PRIVATE_KEY],
      gas: 6000000,
      gasPrice: 3000000000,
    },
    matic: {
      url: "https://speedy-nodes-nyc.moralis.io/fe2c1d1a765cf3f554ee0f77/polygon/mainnet",
      accounts: [METAMASK_PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: POLYSCAN_KEY,
  },
};

export default config;

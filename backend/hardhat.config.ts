import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
require("dotenv").config()

const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/"

const PRIVATE_KEY = process.env.ALCHEMY_PRIVATE_KEY!
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const POLYSCAN_API_KEY = process.env.POLYSCAN_API_KEY || ""

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
      polygonMumbai: POLYSCAN_API_KEY,
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  paths: {
    artifacts: "../frontend/artifacts",
  },
}

export default config

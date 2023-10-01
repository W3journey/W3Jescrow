import { AlchemyProvider, JsonRpcProvider } from "ethers"

export const hardhat = "http://127.0.0.1:8545"

const sepolia = {
  chainId: 11155111,
  apiKey: process.env.ALCHEMY_API_KEY,
}

export const IS_DEV_ENV = process.env.NODE_ENV === "development"

const DEVELOPMENT_CHAIN = hardhat
const PRODUCTION_CHAIN = sepolia

export const CHAIN = IS_DEV_ENV ? DEVELOPMENT_CHAIN : PRODUCTION_CHAIN

const LOCAL_PROVIDER = new JsonRpcProvider(hardhat)
const ALCHEMY_PROVIDER = new AlchemyProvider(sepolia.chainId, sepolia.apiKey)

export const PROVIDER = IS_DEV_ENV ? LOCAL_PROVIDER : ALCHEMY_PROVIDER

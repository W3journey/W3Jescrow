import { createPublicClient, http } from "viem"
import { sepolia, hardhat } from "viem/chains"

const IS_DEV_ENV = process.env.NODE_ENV === "development"

const chain = IS_DEV_ENV ? hardhat : sepolia

export const viemPublicClient = createPublicClient({
  chain: chain,
  transport: http(),
})

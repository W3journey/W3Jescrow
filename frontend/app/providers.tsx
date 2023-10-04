"use client"

import "@rainbow-me/rainbowkit/styles.css"

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { sepolia, hardhat } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { useEffect, useState } from "react"

const { chains, publicClient } = configureChains(
  [sepolia, hardhat],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
    publicProvider(),
  ]
)

const appInfo = {
  appName: "W3J-escrow",
}

const { connectors } = getDefaultWallets({
  appName: appInfo.appName,
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={appInfo} coolMode>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
export default Provider

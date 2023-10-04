"use client"

import { Button } from "@/components/ui/button"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"

interface CustomConnectButtonProps {
  label?: string
  showBalance?: boolean
  chainStatus?: "full" | "icon" | "name" | "none"
}

export const CustomConnectButton: React.FC<CustomConnectButtonProps> = ({
  label = "Connect Wallet",
  showBalance = true,
  chainStatus = "full",
}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated")

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} type="button">
                    {label}
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                )
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  {chainStatus !== "none" && (
                    <Button
                      onClick={openChainModal}
                      className="flex items-center"
                      type="button"
                    >
                      {chain.hasIcon && chainStatus !== "name" && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <Image
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              width={12}
                              height={12}
                            />
                          )}
                        </div>
                      )}
                      {chainStatus !== "icon" && chain.name}
                    </Button>
                  )}

                  <Button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {showBalance && account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

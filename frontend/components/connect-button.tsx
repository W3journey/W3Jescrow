"use client"

import * as React from "react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { VariantProps } from "class-variance-authority"

import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { toast } from "@/components/ui/use-toast"
import { useEthereum } from "@/hooks/useEthereum"
import { useIsMounted } from "@/hooks/useIsMounted"
import { cn, truncateAddress } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"

export interface ConnectButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
const ConnectButton: React.FC<ConnectButtonProps> = ({
  className,
  ...props
}) => {
  const { connected, connect, accounts, error } = useEthereum()
  const isMounted = useIsMounted()
  const [buttonText, setButtonText] = useState("Connect")
  const [_, copy] = useCopyToClipboard()

  const handleButtonClick = () => {
    if (!connected) {
      connect()
    } else {
      copy(accounts[0])
      toast({
        title: "Address Copied.",
        description: `${accounts[0]} copied to clipboard`,
      })
    }
  }

  useEffect(() => {
    const establishConnection = async () => {
      await connect()
    }

    if (isMounted()) {
      establishConnection()
    }
    // eslint-disable-next-line
  }, [isMounted])

  useEffect(() => {
    if (accounts.length && connected) {
      setButtonText(truncateAddress(accounts[0]))
    }
  }, [accounts, connected])

  if (!isMounted()) {
    return <Skeleton className="w-32 px-4 py-2 rounded-full h-9" />
  }

  return (
    <>
      {error ? (
        <Button asChild className={cn("", className)}>
          <Link href={"https://metamask.io/"} target="_blank" rel="noreferrer">
            Get Metamask
          </Link>
        </Button>
      ) : (
        <Button
          className={cn("", className)}
          onClick={handleButtonClick}
          {...props}
        >
          {buttonText}
        </Button>
      )}
    </>
  )
}
export default ConnectButton

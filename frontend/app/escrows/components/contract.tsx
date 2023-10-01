"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { formatEther, isError, BaseContract } from "ethers"
import { FaBalanceScale, FaEthereum, FaFileUpload } from "react-icons/fa"
import { FaHandHoldingDollar } from "react-icons/fa6"
import { RxUpdate } from "react-icons/rx"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import Escrow from "@/artifacts/contracts/EscrowRegistry.sol/Escrow.json"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Entity } from "@/app/escrows/components/entity"
import { Button } from "@/components/ui/button"

import { useEthereum } from "@/hooks/useEthereum"
import { useIsMounted } from "@/hooks/useIsMounted"
import { useContractWrite } from "@/hooks/useContractWrite"
import { useApprovedEvent } from "@/hooks/useApprovedEvent"
import { toast } from "@/components/ui/use-toast"
import { EscrowContract } from "@/types"
import { Typography } from "@/components/ui/typography"
import { cn, truncateAddress } from "@/lib/utils"

export const Contract = ({ contract }: { contract: EscrowContract }) => {
  const {
    address,
    arbiter,
    beneficiary,
    escrowAmount,
    feeBps,
    isApproved,
    depositor,
  } = contract

  const [approved, setApproved] = useState(isApproved)
  const [approvedTx, setApprovedTx] = useState("")
  const isMounted = useIsMounted()
  const { provider, signer, accountAddress, connect, accounts } = useEthereum()

  const { status, writeToContract } = useContractWrite({
    address: address,
    abi: Escrow.abi,
    signer: signer,
  })
  useApprovedEvent(address, Escrow.abi, setApproved)

  const arbiterAmount = useMemo(
    () => (BigInt(escrowAmount) * BigInt(feeBps)) / BigInt(10_000),
    [escrowAmount, feeBps]
  )
  const beneficiaryAmount = useMemo(
    () => BigInt(escrowAmount) - arbiterAmount,
    [escrowAmount, arbiterAmount]
  )

  /**
   * @param {unknown} error - The error object.
   */
  const handleApprovalError = useCallback((error: unknown) => {
    if (isError(error, "ACTION_REJECTED")) {
      toast({
        variant: "destructive",
        description: "User rejected.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "There was a problem with your request.",
        description: "Please try again.",
      })
      console.warn("Approval failed:", error)
    }
  }, [])

  const approve = useCallback(async () => {
    try {
      await writeToContract("approve")
    } catch (error) {
      handleApprovalError(error)
    }
  }, [writeToContract, handleApprovalError])

  useEffect(() => {
    const fetchTxWithApproval = async () => {
      if (provider) {
        const contract = new BaseContract(address, Escrow.abi, provider)

        const events = await contract.queryFilter("Approved")
        const approvalTx = events[0].transactionHash
        setApprovedTx(approvalTx)
      }
    }

    if (approved) {
      fetchTxWithApproval()
    }
  }, [approved, address, provider])

  useEffect(() => {
    if (accounts.length) {
      connect()
    }
    // eslint-disable-next-line
  }, [accounts])

  if (!isMounted()) return null

  return (
    <Card className="shadow-lg border-box bg-gradient-to-br from-card to-background hover:border-border">
      <CardHeader>
        <CardTitle className="space-x-2">
          <Typography variant="h6" as="span" className="break-words">
            <Link
              href={`https://sepolia.etherscan.io/address/${address}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-x-2 hover:underline"
            >
              <span className="break-all">{address}</span>
              <ExternalLinkIcon className="w-4 h-4 text-muted" />
            </Link>
          </Typography>
        </CardTitle>

        <div className="flex space-x-2 text-sm text-muted-foreground">
          <Typography variant="mutedText" as="span">
            Status:
          </Typography>
          <div className="flex gap-x-2 items-center">
            <Badge variant={approved ? "success" : "pending"}>
              {approved ? "Approved" : "waiting for approval"}
            </Badge>
            {approvedTx && (
              <Link
                href={`https://sepolia.etherscan.io/tx/${approvedTx}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLinkIcon className="w-4 h-4 text-muted" />
              </Link>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid items-center justify-center grid-cols-5 grid-rows-3">
        <Entity
          className="col-start-1 row-start-3"
          value={depositor}
          description={truncateAddress(depositor)}
          name="Depositor"
          icon={FaFileUpload}
        />

        <Entity
          className="col-start-3"
          value={arbiter}
          description={truncateAddress(arbiter)}
          name="Arbiter"
          icon={FaBalanceScale}
        />

        <Separator className="col-start-2 row-start-3 bg-success" />

        <Entity
          className="col-start-3 row-start-3"
          value={formatEther(escrowAmount)}
          name="Amount"
          description={`${formatEther(escrowAmount)} ETH`}
          icon={FaEthereum}
        />

        {arbiterAmount > 0 && (
          <div className="relative flex flex-col items-center justify-center h-full col-start-3 row-start-2">
            <Separator
              orientation="vertical"
              className={cn(
                "justify-self-center self-center absolute",
                approved ? "bg-success" : "bg-pending"
              )}
            />

            <Badge
              className="z-20 w-fit"
              variant={approved ? "success" : "pending"}
            >
              {formatEther(arbiterAmount)} ETH
            </Badge>
          </div>
        )}

        <div className="relative flex flex-col items-center justify-center col-start-4 row-start-3">
          <Separator
            className={cn(
              "justify-self-center self-center absolute",
              approved ? "bg-success" : "bg-pending"
            )}
          />

          <Badge
            className="z-20 w-fit"
            variant={approved ? "success" : "pending"}
          >
            {formatEther(beneficiaryAmount)} ETH
          </Badge>
        </div>

        <Entity
          className="col-start-5 row-start-3"
          value={beneficiary}
          description={truncateAddress(beneficiary)}
          name="Beneficiary"
          icon={FaHandHoldingDollar}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-center my-auto">
        {accounts[0] === arbiter.toLowerCase() ? (
          // Release Funds Button
          <Button
            className={cn(
              "px-6 mt-12 mb-6 disabled:opacity-95",
              approved && "text-success"
            )}
            variant={approved ? "secondary" : "default"}
            onClick={approve}
            disabled={approved || status === "pending"}
          >
            <div className="flex items-center gap-2">
              {approved ? "Released" : "Release funds"}
              {status === "pending" && (
                <RxUpdate className="w-4 h-4 animate-spin" />
              )}
            </div>
          </Button>
        ) : (
          // Waiting for Approval Button
          <Button
            className={cn(
              "px-6 mt-12 mb-6 disabled:opacity-70",
              approved && "text-success"
            )}
            variant="secondary"
            disabled
          >
            {approved ? "Released" : "Waiting for approval"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

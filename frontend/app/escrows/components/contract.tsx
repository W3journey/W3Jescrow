"use client"
import { useMemo, useState } from "react"
import Link from "next/link"
import { FaBalanceScale, FaEthereum, FaFileUpload } from "react-icons/fa"
import { FaHandHoldingDollar } from "react-icons/fa6"
import { RxUpdate } from "react-icons/rx"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { TransactionExecutionErrorType } from "viem"
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi"

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
import { Typography } from "@/components/ui/typography"

import { EscrowContract } from "@/types"
import { cn, truncateAddress } from "@/lib/utils"
import { escrowAbi } from "@/constants/abi"
import { CustomConnectButton } from "@/components/custom-connect-button"

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

  const { address: accountAddress } = useAccount()
  const { chain } = useNetwork()

  const { data, isSuccess, write } = useContractWrite({
    address: address as `0x${string}`,
    abi: escrowAbi,
    functionName: "approve",
    onError(e) {
      const error = e as TransactionExecutionErrorType
      toast.error(error.shortMessage)
    },
  })

  const { data: txReceipt, isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      toast.success(`Funds from ${truncateAddress(address)} released.`)
    },
  })

  const unwatch = useContractEvent({
    address: address as `0x${string}`,
    abi: escrowAbi,
    eventName: "Approved",
    listener() {
      setApproved(true)
      unwatch?.()
    },
  })

  const arbiterFeePercentage = useMemo(() => Number(feeBps) / 100, [feeBps])

  const arbiterAmount = useMemo(
    () => (Number(escrowAmount) * arbiterFeePercentage) / 100,
    [escrowAmount, arbiterFeePercentage]
  )

  const beneficiaryAmount = useMemo(
    () => Number(escrowAmount) - arbiterAmount,
    [escrowAmount, arbiterAmount]
  )

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
            {isSuccess && (
              <Link
                href={`https://sepolia.etherscan.io/tx/${data?.hash}`}
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
          value={escrowAmount}
          name="Amount"
          description={`${escrowAmount} ETH`}
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
              {arbiterAmount} ETH
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
            {beneficiaryAmount} ETH
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
        {accountAddress === arbiter ? (
          chain?.unsupported ? (
            <div className="px-6 mt-12 mb-6">
              <CustomConnectButton />
            </div>
          ) : (
            // Release Funds Button
            <Button
              className={cn(
                "px-6 mt-12 mb-6 disabled:opacity-95",
                approved && "text-success"
              )}
              variant={approved ? "secondary" : "default"}
              onClick={() => write()}
              disabled={approved || isLoading}
            >
              <div className="flex items-center gap-2">
                {approved ? "Released" : "Release funds"}
                {isLoading && <RxUpdate className="w-4 h-4 animate-spin" />}
              </div>
            </Button>
          )
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

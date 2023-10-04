import { SetStateAction } from "react"
import Link from "next/link"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { TransactionReceipt } from "viem"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import CopyButton from "@/components/ui/copy-button"

interface SuccessProps {
  address: string | null
  transaction: TransactionReceipt | undefined
  onNewContract: React.Dispatch<SetStateAction<string | null>>
}
const Success: React.FC<SuccessProps> = ({
  address,
  transaction,
  onNewContract,
}) => {
  return (
    <Card className="py-10 border-none">
      <CardHeader className="text-4xl font-extrabold tracking-tight text-center scroll-m-20 lg:text-5xl">
        Success
      </CardHeader>
      <CardDescription className="text-2xl font-semibold tracking-tight text-center scroll-m-20">
        The contract was successfully deployed
      </CardDescription>
      <CardContent className="flex flex-col items-center gap-5 mt-10 lg:items-start">
        <div className="flex flex-col items-center gap-x-2 lg:flex-row">
          <p>Transaction Hash:</p>
          <Link
            href={`https://sepolia.etherscan.io/tx/${transaction?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center gap-x-2">
              <span className="text-blue-500 break-all hover:underline">
                {transaction?.transactionHash}
              </span>
              <ExternalLinkIcon className="w-4 h-4 text-muted" />
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-x-2 lg:flex-row">
          <p>Contract address:</p>
          {address && (
            <>
              <Link
                href={`/escrows?contract=${address}`}
                className="text-blue-500 break-all hover:underline gap-x-4"
              >
                <span>{address}</span>
              </Link>
              <CopyButton value={address} />
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-center py-6">
        <Button className="font-semibold" onClick={() => onNewContract(null)}>
          Create New Escrow
        </Button>
      </CardFooter>
    </Card>
  )
}
export default Success

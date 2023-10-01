import { useCallback, useState } from "react"
import {
  Contract,
  ContractTransactionReceipt,
  Interface,
  InterfaceAbi,
  Signer,
  isAddress,
} from "ethers"

type ContractWriteProps = {
  address: string
  abi: Interface | InterfaceAbi
  signer?: Signer | null
}

enum ContractWriteStatus {
  Idle = "idle",
  Pending = "pending",
  Error = "error",
}

/**
 * Custom hook for writing to a EVM smart contract.
 *
 * @param {ContractWriteProps} props - Contract write properties.
 * @returns {Object} - Status, receipt, and writeToContract function.
 */
export const useContractWrite = ({
  address,
  abi,
  signer,
}: ContractWriteProps) => {
  const [status, setStatus] = useState<ContractWriteStatus>(
    ContractWriteStatus.Idle
  )
  const [isSuccess, setIsSuccess] = useState(false)
  const [receipt, setReceipt] = useState<ContractTransactionReceipt | null>(
    null
  )

  const writeToContract = useCallback(
    async (methodName: string, ...args: any[]) => {
      try {
        if (!signer) {
          throw new Error("Signer is not connected")
        }

        if (!isAddress(address)) {
          throw new Error("Invalid address")
        }

        setIsSuccess(false)
        const contract = new Contract(address, abi, signer)
        const tx = await contract[methodName](...args)
        setStatus(ContractWriteStatus.Pending)
        const txReceipt: ContractTransactionReceipt = await tx.wait(1, 30000)
        setReceipt(txReceipt)
        setIsSuccess(true)
        setStatus(ContractWriteStatus.Idle)
      } catch (error) {
        setIsSuccess(false)
        setStatus(ContractWriteStatus.Error)
        throw error
      }
    },
    [address, abi, signer]
  )

  return { status, isSuccess, receipt, writeToContract }
}

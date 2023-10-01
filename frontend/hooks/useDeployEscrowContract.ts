import { useCallback, useState } from "react"
import {
  Contract,
  ContractTransactionReceipt,
  EventLog,
  parseEther,
} from "ethers"

import { registryAddress } from "@/constants/contracts"
import { useEthereum } from "@/hooks/useEthereum"
import EscrowRegistry from "@/artifacts/contracts/EscrowRegistry.sol/EscrowRegistry.json"

export const useDeployEscrowContract = () => {
  const { signer, accountAddress } = useEthereum()
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const [txReceipt, setTxReceipt] = useState<ContractTransactionReceipt | null>(
    null
  )

  const deployEscrowContract = useCallback(
    async (
      arbiter: string,
      beneficiary: string,
      arbiterFee: number,
      amount: string
    ) => {
      if (!signer) {
        throw new Error("Signer is not available.")
      }
      try {
        const depositAmount = parseEther(amount)
        const calculateBps = arbiterFee * 100

        const escrowRegistry = new Contract(
          registryAddress,
          EscrowRegistry.abi,
          signer
        )

        const tx = await escrowRegistry.deployEscrowContract(
          arbiter,
          beneficiary,
          BigInt(calculateBps),
          {
            value: depositAmount,
          }
        )

        const receipt: ContractTransactionReceipt = await tx.wait()

        if (receipt.status === 0) {
          setTxReceipt(null)
          throw new Error("Transaction failed.")
        }

        const filter = escrowRegistry.filters.ContractDeployed(
          accountAddress,
          null
        )
        const events = (await escrowRegistry.queryFilter(filter)) as EventLog[]

        const address =
          events.length > 0
            ? (events[events.length - 1].args[1] as string)
            : null

        setTxReceipt(receipt)
        setContractAddress(address)

        await escrowRegistry.removeAllListeners()
        return receipt
      } catch (error) {
        throw error
      }
    },
    [signer, accountAddress]
  )

  return {
    contractAddress,
    deployEscrowContract,
    txReceipt,
    setContractAddress,
  }
}

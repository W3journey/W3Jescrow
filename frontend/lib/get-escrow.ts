import { viemPublicClient } from "@/lib/client"
import { escrowAbi } from "@/constants/abi"
import { EscrowContract } from "@/types"
import { formatEther } from "viem"

export const getEscrow = async (address: `0x${string}`) => {
  const escrowData = await viemPublicClient.readContract({
    address: address,
    abi: escrowAbi,
    functionName: "getContractData",
  })

  const escrow: EscrowContract = {
    address: address,
    arbiter: escrowData[0],
    beneficiary: escrowData[1],
    depositor: escrowData[2],
    escrowAmount: formatEther(escrowData[3]),
    feeBps: escrowData[4].toString(),
    isApproved: escrowData[5],
  }

  return escrow
}

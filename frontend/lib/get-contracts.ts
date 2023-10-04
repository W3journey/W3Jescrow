import { registryAddress } from "@/constants/contracts"
import { viemPublicClient } from "@/lib/client"
import { escrowRegistryAbi } from "@/constants/abi"

export const getContracts = async () => {
  try {
    const escrowAddresses = await viemPublicClient.readContract({
      address: registryAddress,
      abi: escrowRegistryAbi,
      functionName: "getEscrowAddresses",
    })

    return escrowAddresses
  } catch (error) {
    return []
  }
}

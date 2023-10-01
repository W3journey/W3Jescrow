import { Contract } from "ethers"

import EscrowRegistry from "../artifacts/contracts/EscrowRegistry.sol/EscrowRegistry.json"
import { registryAddress } from "@/constants/contracts"
import { PROVIDER } from "@/constants/chains"

export const getContracts = async () => {
  try {
    const registryContract = new Contract(
      registryAddress,
      EscrowRegistry.abi,
      PROVIDER
    )

    const escrowAddresses =
      (await registryContract.getEscrowAddresses()) as string[]

    return escrowAddresses
  } catch (error) {
    return []
  }
}

import { Contract } from "ethers"

import Escrow from "../artifacts/contracts/EscrowRegistry.sol/Escrow.json"
import { EscrowContract } from "@/types"
import { PROVIDER } from "@/constants/chains"

export const getEscrow = async (address: string) => {
  const contract = new Contract(address, Escrow.abi, PROVIDER)

  const escrowData = await contract.getContractData()
  const escrow: EscrowContract = {
    address: address,
    arbiter: escrowData[0],
    beneficiary: escrowData[1],
    depositor: escrowData[2],
    escrowAmount: escrowData[3].toString(),
    feeBps: escrowData[4].toString(),
    isApproved: escrowData[5],
  }
  return escrow
}

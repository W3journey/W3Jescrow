import {
  BrowserProvider,
  Contract,
  InterfaceAbi,
  Provider,
  isAddress,
} from "ethers"
import { useEffect } from "react"

type setApproved = React.Dispatch<React.SetStateAction<boolean>>

/**
 * Custom hook to listen for the "Approved" event on an Ethereum smart contract.
 *
 * @param {string} contractAddress - The address of the smart contract to monitor.
 * @param {Provider | null} provider - The Ethereum provider instance.
 * @param {InterfaceAbi} abi - The ABI (Application Binary Interface) for the contract.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setApproved - State setter function.
 */
export const useApprovedEvent = (
  contractAddress: string,
  abi: InterfaceAbi,
  setApproved: setApproved
) => {
  useEffect(() => {
    if (!window.ethereum) return
    const provider = new BrowserProvider(window.ethereum)
    const isValidAddress = isAddress(contractAddress)

    if (!provider || !isValidAddress) {
      return
    }

    const contract = new Contract(contractAddress, abi, provider)

    if (!contract) {
      return
    }

    const approvedEventListener = () => {
      setApproved(true)
    }

    contract.on("Approved", approvedEventListener)

    return () => {
      contract.off("Approved", approvedEventListener)
    }
  }, [contractAddress, abi, setApproved])
}

import { BrowserProvider, JsonRpcSigner, Network, parseUnits } from "ethers"
import { useEffect, useState } from "react"

interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

function useEthereum() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [accounts, setAccounts] = useState<string[]>([])
  const [accountAddress, setAccountAddress] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    if (signer) {
      setAccountAddress(signer.address)
    }
  }, [signer])

  const setupProvider = () => {
    if (!window.ethereum) throw Error("Could not find Metamask extension")
    if (provider) return provider

    const newProvider = new BrowserProvider(window.ethereum)
    listenToEvents(newProvider)
    setProvider(newProvider)

    return newProvider
  }

  const listenToEvents = (provider: BrowserProvider) => {
    window.ethereum.on("accountsChanged", (acc: string[]) => {
      setAccounts(acc)
      setAccountAddress(acc[0])
    })
    window.ethereum.on("chainChanged", async (net: number) => {
      console.log("chainChanged", net)
    })
    window.ethereum.on("disconnect", (error: ProviderRpcError) => {
      setConnected(false)
      throw Error(error.message)
    })
  }

  const connect = async () => {
    try {
      const provider = setupProvider()
      const accounts: string[] = await provider.send("eth_requestAccounts", [])
      const network: Network = await provider.getNetwork()
      const signer: JsonRpcSigner = await provider.getSigner()

      setProvider(provider)
      setAccounts(accounts)
      setSigner(signer)
      setConnected(true)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const getAccounts = async () => {
    const provider = setupProvider()
    const accounts: string[] = await provider.send("eth_accounts", [])
    setAccounts(accounts)
    return accounts
  }

  const sendTransaction = async (
    from: string,
    to: string,
    valueInEther: string
  ) => {
    const provider = setupProvider()
    const params = [
      {
        from,
        to,
        value: parseUnits(valueInEther, "ether"),
      },
    ]
    const transactionHash = await provider.send("eth_sendTransaction", params)
    return transactionHash
  }

  useEffect(() => {
    connect()

    //eslint-disable-next-line
  }, [])

  return {
    provider,
    signer,
    error,
    accounts,
    accountAddress,
    connect,
    connected,
    getAccounts,
    sendTransaction,
  }
}

export { useEthereum }

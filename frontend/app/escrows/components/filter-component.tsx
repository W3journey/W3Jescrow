"use client"

import ContractNav from "@/app/escrows/components/contract-nav"
import { Search } from "@/app/escrows/components/search"
import { useAccount } from "wagmi"

const FilterComponent = () => {
  const { address } = useAccount()

  return (
    <div className="container flex flex-col justify-center h-32 mt-6 lg:h-16 lg:flex-row lg:items-center">
      {address && <ContractNav address={address} />}
      <div className="mx-auto mt-6 lg:mx-0 lg:mt-0 lg:ml-auto">
        <Search />
      </div>
    </div>
  )
}
export default FilterComponent

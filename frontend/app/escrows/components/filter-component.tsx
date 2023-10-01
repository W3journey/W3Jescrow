"use client"

import ContractNav from "@/app/escrows/components/contract-nav"
import { Search } from "@/app/escrows/components/search"
import { useEthereum } from "@/hooks/useEthereum"

const FilterComponent = () => {
  const { accountAddress } = useEthereum()

  return (
    <div className="container flex flex-col justify-center h-32 mt-6 lg:h-16 lg:flex-row lg:items-center">
      {accountAddress && <ContractNav address={accountAddress} />}
      <div className="mx-auto mt-6 lg:mx-0 lg:mt-0 lg:ml-auto">
        <Search />
      </div>
    </div>
  )
}
export default FilterComponent

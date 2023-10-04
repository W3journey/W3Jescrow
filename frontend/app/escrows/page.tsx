import { getContracts } from "@/lib/get-contracts"
import { getEscrow } from "@/lib/get-escrow"
import { isFulfilled } from "@/lib/utils"
import { Contract } from "@/app/escrows/components/contract"
import CtaButton from "@/components/ui/cta-button"
import {
  NoContractFoundForRoleMessage,
  NoContractFoundMessage,
} from "@/app/escrows/components/no-contract-found"
import { EscrowContract, PromiseResult, ValidRoleQuery } from "@/types"

export const dynamic = "force-dynamic"

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: {
    contract?: string
    addr?: string
    role?: string
  }
}) {
  let contracts: EscrowContract[] = []

  const contractQuery = searchParams.contract
  const addrQuery = searchParams.addr
  const roleQuery = searchParams.role ?? ""

  function isValidRoleQuery(roleQuery: string): roleQuery is ValidRoleQuery {
    return (
      roleQuery === "arbiter" ||
      roleQuery === "beneficiary" ||
      roleQuery === "depositor"
    )
  }

  const deployedContractAddresses = await getContracts()

  const settledPromises: PromiseResult<EscrowContract>[] =
    await Promise.allSettled(
      deployedContractAddresses.map((address) => getEscrow(address))
    )

  const initialData = settledPromises
    .filter(isFulfilled)
    .map((result) => result.value)

  if (addrQuery || isValidRoleQuery(roleQuery) || contractQuery) {
    contracts = initialData.filter((contract) => {
      const addrMatch =
        !addrQuery || contract[roleQuery as ValidRoleQuery] === addrQuery
      const contractMatch = !contractQuery || contract.address === contractQuery

      return addrMatch && contractMatch
    })
  } else {
    contracts = initialData
  }

  const reversedContracts = [...contracts].reverse()

  return (
    <section className="flex flex-col items-center justify-between min-h-screen pt-6 pb-24 ">
      <div className="container p-12 mx-auto rounded-xl bg-box">
        {contracts.length < 1 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-center scroll-m-20 lg:text-5xl">
              No Contracts Found
            </h1>
            {addrQuery && roleQuery && (
              <NoContractFoundForRoleMessage role={roleQuery} />
            )}
            {contractQuery && !addrQuery && !roleQuery && (
              <NoContractFoundMessage contractAddress={contractQuery} />
            )}
            <CtaButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {reversedContracts.map((contract) => (
              <Contract key={contract.address} contract={contract} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

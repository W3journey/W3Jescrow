export function NoContractFoundMessage({
  contractAddress,
}: {
  contractAddress: string
}) {
  return (
    <p className="mt-6 leading-7">
      It appears that there are no contracts currently deployed with address{" "}
      <span className="text-pending">{contractAddress}</span>. If you were
      expecting to see a contract, please double-check the address.
    </p>
  )
}

export function NoContractFoundForRoleMessage({ role }: { role: string }) {
  return (
    <p className="mt-6 leading-7">
      It appears that there are no contracts currently deployed where you are
      listed as the <span className="text-blue-500 capitalize">{role}</span>.
    </p>
  )
}

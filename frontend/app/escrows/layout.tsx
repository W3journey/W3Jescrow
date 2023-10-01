import FilterComponent from "@/app/escrows/components/filter-component"

export default function EscrowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <FilterComponent />
      {children}
    </section>
  )
}

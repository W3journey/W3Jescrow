import NewContract from "@/app/new-escrow/components/new-contract"

const NewEscrowPage = () => {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="container flex flex-col items-center justify-between h-full py-12 mt-12 rounded-xl bg-box">
        <NewContract />
      </div>
    </main>
  )
}
export default NewEscrowPage

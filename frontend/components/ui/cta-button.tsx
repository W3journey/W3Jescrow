import { Button } from "@/components/ui/button"
import Link from "next/link"

const CtaButton = () => {
  return (
    <Button asChild className="h-12 mt-10 font-bold" size="lg">
      <Link href="/new-escrow">Create Your Escrow Contract</Link>
    </Button>
  )
}
export default CtaButton

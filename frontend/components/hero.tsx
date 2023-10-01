import CtaButton from "@/components/ui/cta-button"
import { Typography } from "@/components/ui/typography"
import Image from "next/image"

const Hero = () => {
  return (
    <div className="flex flex-col gap-16 md:gap-5 md:flex-row">
      <div className="flex flex-col items-center justify-center md:flex-1">
        <Typography as="h1" variant="h1">
          Create Your Perfect Escrow Contract
        </Typography>
        <p className="mt-5 text-2xl font-light">
          Customize your escrow contract by choosing the arbiter, beneficiary,
          and fee structure that suits your needs and deploy it to the
          <span className="text-primary"> Sepolia </span>testnet. It&apos;s your
          money, your rules.
        </p>
        <CtaButton />
      </div>
      {/* Image */}
      <div className="relative md:flex-[1.3] h-48 md:h-96 rounded-lg overflow-hidden">
        <Image src="/blockchain.jpg" alt="hero" fill className="object-cover" />
      </div>
    </div>
  )
}
export default Hero

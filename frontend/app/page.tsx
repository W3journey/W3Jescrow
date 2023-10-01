import Faq from "@/components/faq"
import Features from "@/components/features"
import Hero from "@/components/hero"

export default function Home() {
  return (
    <main className="min-h-screen pt-12 pb-24">
      <div className="container flex flex-col items-center justify-between py-12 mx-auto bg-box rounded-xl ">
        <Hero />
        <Features />
        <Faq />
      </div>
    </main>
  )
}

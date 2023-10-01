import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import Image from "next/image"
import Link from "next/link"

const footerConfig = [
  {
    name: "Privacy Policy",
    href: "#",
  },
  {
    name: "Terms of Service",
    href: "#",
  },
  {
    name: "Contact Us",
    href: "mailto:web3journey@proton.me",
  },
]

const Footer = () => {
  return (
    <footer className="relative py-8 overflow-hidden">
      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex flex-wrap items-center justify-between -m-8">
          <div className="w-auto p-8">
            <Link href={"/"} className="inline-flex items-center">
              <div className="items-center">
                <Image
                  src={"/Web3Journey-256.png"}
                  alt="Web3Journey Logo"
                  height={70}
                  width={70}
                  className="object-fill"
                />
              </div>
              <span className="text-lg font-bold">W3Journey Escrow</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center w-auto p-8 -m-5">
            {footerConfig.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                className="p-5 font-medium"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-wrap w-auto p-8 ">
              <Button asChild variant={"ghost"}>
                <Link href={siteConfig.links.twitter}>
                  <Icons.twitter className="w-5 h-5 fill-current" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button asChild variant={"ghost"}>
                <Link href={siteConfig.links.github}>
                  <Icons.gitHub className="w-5 h-5 fill-current" />
                  <span className="sr-only">Github</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer

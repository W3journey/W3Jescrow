import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import MobileNav from "@/components/mobile-nav"
import ThemeToggle from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import ConnectButton from "@/components/connect-button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-ring bg-box">
      <div className="container flex items-center justify-between h-16 mx-auto space-x-4 sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />

        <div className="flex items-center justify-end gap-4">
          <ConnectButton
            className="rounded-full bg-accent/30"
            variant={"ghost"}
          />
          <nav className="items-center hidden space-x-1 md:flex">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="w-5 h-5" />
                <span className="sr-only">Github</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="w-5 h-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
          <nav className="block md:hidden">
            <MobileNav items={siteConfig.mainNav} />
          </nav>
        </div>
      </div>
    </header>
  )
}

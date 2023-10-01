"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { RxHamburgerMenu, RxHome, RxFilePlus, RxArchive } from "react-icons/rx"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import ThemeToggle from "@/components/theme-toggle"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { NavItem } from "@/types"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const titleToIcon = {
  Home: <RxHome className="text-accent" />,
  "New Escrow": <RxFilePlus className="text-accent" />,
  Escrows: <RxArchive className="text-accent" />,
}

interface MobileNavProps {
  items?: NavItem[]
}
const MobileNav = ({ items }: MobileNavProps) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="block md:hidden">
          <RxHamburgerMenu />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-[250px] sm:w-[540px]"
        onClick={() => setOpen(false)}
      >
        <SheetHeader>
          <ThemeToggle />
        </SheetHeader>
        {items?.length ? (
          <nav className="flex flex-col items-start justify-center gap-6 my-10">
            {items?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium",
                      pathname !== item.href && "text-muted"
                    )}
                  >
                    {titleToIcon[item.title as keyof typeof titleToIcon] ||
                      null}
                    {item.title}
                  </Link>
                )
            )}
          </nav>
        ) : null}
        <SheetFooter>
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
export default MobileNav

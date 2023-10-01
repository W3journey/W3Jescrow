"use client"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { NavItem } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MainNavProps {
  items?: NavItem[]
}
export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        {/* <Icons.logo /> */}
        <div className="items-center">
          <Image
            src={"/Web3Journey-256.png"}
            alt="Web3Journey Logo"
            height={70}
            width={70}
            className="object-fill"
          />
        </div>
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium",
                    pathname !== item.href && "text-muted",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}

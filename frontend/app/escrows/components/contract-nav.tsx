"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RxReload } from "react-icons/rx"

import { Button } from "@/components/ui/button"
import { cn, formUrlQuery } from "@/lib/utils"

interface ContractNavProps {
  address: string
  className?: string
}

const ContractNav: React.FC<ContractNavProps> = ({
  address,
  className,
  ...props
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const roles = ["arbiter", "beneficiary", "depositor"]
  const [active, setActive] = useState<string | null>(searchParams.get("role"))

  useEffect(() => {
    setActive(searchParams.get("role"))
  }, [searchParams])

  const handleFilter = (role: string) => {
    if (active === role) {
      setActive("")
      handleRemoveFilter()
    } else {
      setActive(role)

      const addUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "addr",
        value: address,
      })

      const roleUrl = formUrlQuery({
        params: addUrl,
        key: "role",
        value: role,
      })

      startTransition(() => {
        router.replace(`${pathname}?${roleUrl}`, { scroll: false })
      })
    }
  }

  const handleRemoveFilter = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      keysToRemove: ["addr", "role"],
    })

    startTransition(() => {
      router.replace(`${pathname}?${newUrl}`, { scroll: false })
    })
  }

  return (
    <nav
      className={cn(
        "hidden sm:flex items-center space-x-4 lg:space-x-6 w-fit mx-auto lg:mx-0",
        className
      )}
      {...props}
    >
      <Button
        variant={!active ? "default" : "ghost"}
        onClick={handleRemoveFilter}
      >
        All
      </Button>
      {roles.map((role) => (
        <Button
          key={role}
          variant={active === role ? "default" : "ghost"}
          onClick={() => handleFilter(role)}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Button>
      ))}

      {isPending && (
        <div>
          <RxReload className="animate-spin" />
        </div>
      )}
    </nav>
  )
}
export default ContractNav

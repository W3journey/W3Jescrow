"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { RxReload } from "react-icons/rx"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formUrlQuery } from "@/lib/utils"

export function Search() {
  const [inputValue, setInputValue] = useState("")
  const [debouncedValue, setDebouncedValue] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearchParams = useCallback(
    (name: string, value: string) => {
      let newUrl = ""

      if (value.length > 0) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: name,
          value: value,
        })
      } else {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          keysToRemove: [name],
        })
      }

      startTransition(() => {
        router.replace(pathname + "?" + newUrl)
      })
    },
    [searchParams, pathname, router]
  )

  // Set Initial Params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const searchQuery = params.get("contract") ?? ""
    setInputValue(searchQuery)
  }, [])

  // Set Mounted
  useEffect(() => {
    if (debouncedValue.length > 0 && !mounted) {
      setMounted(true)
    }
  }, [debouncedValue, mounted])

  // Debounce Input Value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [inputValue])

  // Search Params
  useEffect(() => {
    if (mounted) handleSearchParams("contract", debouncedValue)
  }, [debouncedValue, handleSearchParams, mounted])

  return (
    <div className="relative">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search contract addresses..."
        className="w-[300px] sm:w-[500px]"
      />
      {isPending && (
        <div className="absolute top-[10px] right-3">
          <RxReload className="animate-spin" />
        </div>
      )}
      {debouncedValue.length > 0 && !isPending && (
        <Button
          variant="ghost"
          className="absolute top-0 right-0 rounded-l-none text-muted-foreground"
          onClick={() => setInputValue("")}
        >
          Clear
        </Button>
      )}
    </div>
  )
}

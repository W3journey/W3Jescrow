"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { RxSun, RxMoon } from "react-icons/rx"

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <Skeleton className="h-9 w-9" />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <RxMoon className="w-4 h-4 dark:hidden" />
      <RxSun className="hidden w-5 h-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
export default ThemeToggle

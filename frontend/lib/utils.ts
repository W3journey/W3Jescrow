import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PromiseResult } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isFulfilled<T>(
  result: PromiseResult<T>
): result is { status: "fulfilled"; value: T } {
  return result.status === "fulfilled"
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`
}

interface UrlQueryParams {
  params: string
  key?: string
  value?: string | null
  keysToRemove?: string[]
}

export function formUrlQuery({
  params,
  key,
  value,
  keysToRemove,
}: UrlQueryParams) {
  const searchParams = new URLSearchParams(params)

  if (keysToRemove) {
    keysToRemove.forEach((keyToRemove) => {
      searchParams.delete(keyToRemove)
    })
  } else if (key && value) {
    searchParams.set(key, value)
  }

  return `${searchParams.toString()}`
}

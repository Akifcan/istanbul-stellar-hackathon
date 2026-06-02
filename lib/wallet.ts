import { useSyncExternalStore } from "react"

const STORAGE_KEY = "adproof.wallet"

const listeners = new Set<() => void>()
let cache: string | null | undefined

function read(): string | null {
  if (typeof window === "undefined") return null
  if (cache !== undefined) return cache
  cache = window.localStorage.getItem(STORAGE_KEY)
  return cache
}

function write(next: string | null) {
  cache = next
  if (typeof window !== "undefined") {
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, next)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }
  listeners.forEach((listener) => listener())
}

export function setWallet(address: string) {
  write(address)
}

export function disconnectWallet() {
  write(null)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useWallet(): string | null {
  return useSyncExternalStore(subscribe, read, () => null)
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`
}

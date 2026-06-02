import { useSyncExternalStore } from "react"

import { DASHBOARD_MODE } from "@/lib/publisher"

const STORAGE_KEY = "adproof.dashboard-mode"

const listeners = new Set<() => void>()
let cache: string | undefined

function read(): string {
  if (typeof window === "undefined") return DASHBOARD_MODE.PUBLISHER
  if (cache !== undefined) return cache
  cache = window.localStorage.getItem(STORAGE_KEY) ?? DASHBOARD_MODE.PUBLISHER
  return cache
}

export function setDashboardMode(mode: string) {
  cache = mode
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, mode)
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useDashboardMode(): string {
  return useSyncExternalStore(subscribe, read, () => DASHBOARD_MODE.PUBLISHER)
}

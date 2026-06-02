import { useSyncExternalStore } from "react"

type Earnings = { total: number; count: number }

let state: Earnings = { total: 0, count: 0 }
const listeners = new Set<() => void>()

export function addImpressionEarning(amount: number) {
  state = {
    total: Math.round((state.total + amount) * 10000) / 10000,
    count: state.count + 1,
  }
  listeners.forEach((l) => l())
}

export function resetEarnings() {
  state = { total: 0, count: 0 }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const SERVER: Earnings = { total: 0, count: 0 }

export function useEarnings(): Earnings {
  return useSyncExternalStore(subscribe, () => state, () => SERVER)
}

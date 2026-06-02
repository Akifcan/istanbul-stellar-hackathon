import { useSyncExternalStore } from "react"

export type LogKind = "info" | "proof" | "success" | "chain" | "error"

export type LogEntry = {
  id: number
  time: string
  kind: LogKind
  text: string
  detail?: string
}

const MAX = 80
let entries: LogEntry[] = []
let counter = 0
const listeners = new Set<() => void>()

export function demoLog(kind: LogKind, text: string, detail?: string) {
  const time = new Date().toLocaleTimeString("en-US", { hour12: false })
  entries = [...entries, { id: ++counter, time, kind, text, detail }].slice(-MAX)
  listeners.forEach((l) => l())
}

export function clearDemoLog() {
  entries = []
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const EMPTY: LogEntry[] = []

export function useDemoLog(): LogEntry[] {
  return useSyncExternalStore(subscribe, () => entries, () => EMPTY)
}

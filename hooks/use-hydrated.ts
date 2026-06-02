import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * Returns false on the server and during the first client render, then true
 * after hydration — without an effect-driven setState. Lets us safely gate
 * client-only state (e.g. localStorage) before acting on it.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

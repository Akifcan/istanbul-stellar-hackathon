"use client"

import { useState } from "react"
import useSWR from "swr"
import { Coins } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet"
import { establishTrustline, getUsdcBalance } from "@/lib/usdc"

export default function UsdcFaucet() {
  const wallet = useWallet()
  const [loading, setLoading] = useState(false)

  const { data: balance, mutate } = useSWR(
    wallet ? ["usdc-balance", wallet] : null,
    () => getUsdcBalance(wallet as string)
  )

  const handleGet = async () => {
    if (!wallet) return
    setLoading(true)
    try {
      toast.loading("Approve the USDC trustline in Freighter…", { id: "faucet" })
      await establishTrustline(wallet)

      toast.loading("Minting test USDC…", { id: "faucet" })
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Mint failed")
      }

      await mutate()
      toast.success("Test USDC added", { id: "faucet" })
    } catch (err) {
      toast.error("Could not get test USDC", {
        id: "faucet",
        description: err instanceof Error ? err.message : "Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 px-4 py-3">
      <span className="flex items-center gap-2 text-sm">
        <Coins className="size-4 text-brand-teal" aria-hidden="true" />
        <span className="text-muted-foreground">Balance:</span>
        <span className="font-medium tabular-nums">
          {balance === undefined
            ? "…"
            : balance.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
          USDC
        </span>
      </span>
      <Button type="button" variant="outline" size="sm" disabled={loading} onClick={handleGet}>
        {loading ? "Working…" : "Get test USDC"}
      </Button>
    </div>
  )
}

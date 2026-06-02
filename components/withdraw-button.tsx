"use client"

import { useState } from "react"
import Image from "next/image"
import { useSWRConfig } from "swr"
import { ArrowDownToLine, Loader2, Wallet, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { truncateAddress, useWallet } from "@/lib/wallet"
import { withdrawFromVault } from "@/lib/withdraw"

const STELLAR_YELLOW = "#FDDA24"

export default function WithdrawButton({ apiKey }: { apiKey: PublisherApiKey }) {
  const wallet = useWallet()
  const { mutate } = useSWRConfig()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const canWithdraw = apiKey.earned > 0 && !!apiKey.vaultContractId && !!wallet

  const handleWithdraw = async () => {
    if (!wallet || !apiKey.vaultContractId) return
    setLoading(true)
    try {
      toast.loading("Releasing earnings to your vault…", { id: "wd" })
      const prep = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKeyId: apiKey.id, wallet }),
      })
      const prepData = await prep.json().catch(() => ({}))
      if (!prep.ok) throw new Error(prepData.error ?? "Release failed")

      toast.loading("Approve the withdrawal in Freighter…", { id: "wd" })
      const txHash = await withdrawFromVault(
        wallet,
        prepData.vaultContractId,
        prepData.amount
      )

      await fetch("/api/withdraw/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKeyId: apiKey.id, wallet }),
      })

      await mutate(`/api/api-keys?wallet=${encodeURIComponent(wallet)}`)
      toast.success(`Withdrew ${prepData.amount} USDC to your wallet`, {
        id: "wd",
        description: `${txHash.slice(0, 8)}…${txHash.slice(-8)}`,
      })
      setOpen(false)
    } catch (err) {
      toast.error("Withdraw failed", {
        id: "wd",
        description: err instanceof Error ? err.message : "Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!canWithdraw}
          className="gap-1.5"
        >
          <ArrowDownToLine className="size-3.5" aria-hidden="true" />
          Withdraw
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw earnings</DialogTitle>
          <DialogDescription>
            Confirm the payout from your vault contract to your connected wallet.
          </DialogDescription>
        </DialogHeader>

        {/* Amount */}
        <div className="rounded-xl border bg-muted/40 p-5 text-center">
          <p className="text-muted-foreground text-xs">You&apos;ll receive</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
            {apiKey.earned.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            <span className="text-muted-foreground text-lg font-normal">USDC</span>
          </p>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand-teal" aria-hidden="true" />
              From vault
            </span>
            <code className="font-mono text-xs">
              {apiKey.vaultContractId
                ? `${apiKey.vaultContractId.slice(0, 4)}…${apiKey.vaultContractId.slice(-4)}`
                : "—"}
            </code>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground flex items-center gap-2">
              <Wallet className="size-4 text-brand" aria-hidden="true" />
              To wallet
            </span>
            <code className="font-mono text-xs">
              {wallet ? truncateAddress(wallet) : "—"}
            </code>
          </div>
        </div>

        {/* Stellar branding strip */}
        <div
          className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5"
          style={{ backgroundColor: STELLAR_YELLOW }}
        >
          <Image
            src="/Stellar-Logo-Final-Black-RGB.png"
            alt="Stellar"
            width={64}
            height={16}
          />
          <span className="text-xs font-medium text-black/70">
            Settles on Stellar in seconds.
          </span>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={handleWithdraw}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Processing…
              </>
            ) : (
              <>
                <ArrowDownToLine className="size-4" aria-hidden="true" />
                Confirm withdrawal
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

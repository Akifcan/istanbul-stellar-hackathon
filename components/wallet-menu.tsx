"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Wallet } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { disconnectWallet, truncateAddress, useWallet } from "@/lib/wallet"

export default function WalletMenu() {
  const router = useRouter()
  const address = useWallet()

  if (!address) {
    return (
      <Button asChild size="sm">
        <Link href="/login">Connect wallet</Link>
      </Button>
    )
  }

  const handleLogout = () => {
    disconnectWallet()
    toast.success("Wallet disconnected")
    router.push("/login")
  }

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5">
        <Wallet className="size-3.5 text-brand-teal" aria-hidden="true" />
        <code className="font-mono text-xs">{truncateAddress(address)}</code>
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        aria-label="Log out"
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  )
}

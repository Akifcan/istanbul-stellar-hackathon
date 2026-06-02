"use client"

import { useState } from "react"
import { ArrowRight, Loader2, Wallet } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)

    // Frontend-only: real Freighter connection comes later, we just simulate the flow.
    setTimeout(() => {
      setIsConnecting(false)
      toast.info("Freighter connection coming soon", {
        description: "The interface is ready — wallet integration will be wired up next.",
      })
    }, 900)
  }

  return (
    <Button
      type="button"
      size="lg"
      disabled={isConnecting}
      onClick={handleConnect}
      aria-label="Connect with Freighter"
      className="group h-14 w-full justify-between gap-3 px-5 text-base"
    >
      <span className="flex items-center gap-3">
        {isConnecting ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Wallet className="size-5" />
        )}
        {isConnecting ? "Connecting…" : "Connect Freighter"}
      </span>
      {!isConnecting && (
        <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
      )}
    </Button>
  )
}

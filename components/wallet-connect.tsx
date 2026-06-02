"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Wallet } from "lucide-react"
import { toast } from "sonner"
import { isConnected, requestAccess } from "@stellar/freighter-api"

import { Button } from "@/components/ui/button"
import { setWallet } from "@/lib/wallet"

const FREIGHTER_URL = "https://www.freighter.app/"

export default function WalletConnect() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const connection = await isConnected()
      if (connection.error || !connection.isConnected) {
        toast.error("Freighter not detected", {
          description: "Install the Freighter extension to continue.",
          action: {
            label: "Get Freighter",
            onClick: () => window.open(FREIGHTER_URL, "_blank", "noreferrer"),
          },
        })
        return
      }

      const access = await requestAccess()
      if (access.error || !access.address) {
        toast.error("Connection rejected", {
          description: "Wallet access was not granted.",
        })
        return
      }

      setWallet(access.address)
      toast.success("Wallet connected")
      router.push("/dashboard")
    } catch {
      toast.error("Something went wrong", {
        description: "Could not connect to Freighter. Please try again.",
      })
    } finally {
      setIsConnecting(false)
    }
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

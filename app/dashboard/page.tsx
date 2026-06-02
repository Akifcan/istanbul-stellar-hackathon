import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import DashboardView from "@/components/dashboard-view"
import WalletMenu from "@/components/wallet-menu"

export const metadata: Metadata = {
  title: "Dashboard | AdProof",
  description:
    "Manage your AdProof publisher sites and API keys, and track impressions and USDC earnings.",
  openGraph: {
    title: "Dashboard | AdProof",
    description:
      "Manage your AdProof publisher sites and API keys, and track impressions and USDC earnings.",
    images: ["/logo.png"],
    url: "https://adproof.com/dashboard",
  },
}

export default function DashboardPage() {
  return (
    <div className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="AdProof home">
            <Image src="/logo.png" alt="AdProof logo" width={32} height={32} priority />
            <span className="text-lg font-semibold tracking-tight">AdProof</span>
          </Link>
          <WalletMenu />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage how AdProof works for you.
          </p>
        </header>

        <DashboardView />
      </main>
    </div>
  )
}

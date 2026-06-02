"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useWallet } from "@/lib/wallet"
import { useHydrated } from "@/hooks/use-hydrated"

function DashboardSkeleton() {
  return (
    <div className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="bg-muted h-8 w-32 animate-pulse rounded" />
          <div className="bg-muted h-8 w-40 animate-pulse rounded-full" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-12">
        <div className="bg-muted mb-8 h-9 w-48 animate-pulse rounded" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-muted h-24 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="bg-muted mt-8 h-64 animate-pulse rounded-xl" />
      </main>
    </div>
  )
}

export default function RequireWallet({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const address = useWallet()
  const hydrated = useHydrated()

  useEffect(() => {
    if (hydrated && !address) {
      router.replace("/login")
    }
  }, [hydrated, address, router])

  if (!hydrated || !address) {
    return <DashboardSkeleton />
  }

  return <>{children}</>
}

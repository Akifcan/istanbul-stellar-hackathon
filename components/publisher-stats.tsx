"use client"

import useSWR from "swr"
import { Globe, Eye, Coins } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { KEY_STATUS } from "@/lib/publisher"
import { fetcher } from "@/lib/fetcher"
import { useWallet } from "@/lib/wallet"

export default function PublisherStats() {
  const wallet = useWallet()
  const { data: keys, error, isLoading } = useSWR<PublisherApiKey[]>(
    wallet ? `/api/api-keys?wallet=${encodeURIComponent(wallet)}` : null,
    fetcher
  )

  const list = keys ?? []
  const activeSites = list.filter((key) => key.status === KEY_STATUS.ACTIVE).length
  const impressions = list.reduce((sum, key) => sum + key.impressions, 0)
  const earned = list.reduce((sum, key) => sum + key.earned, 0)

  const stats = [
    {
      label: "Active sites",
      value: activeSites.toLocaleString("en-US"),
      icon: Globe,
    },
    {
      label: "Ads shown",
      value: impressions.toLocaleString("en-US"),
      icon: Eye,
    },
    {
      label: "USDC earned",
      value: earned.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      icon: Coins,
    },
  ]

  return (
    <section aria-label="Overview" className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <stat.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              {isLoading || error ? (
                <span className="bg-muted my-1 h-7 w-20 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-semibold tracking-tight tabular-nums">
                  {stat.value}
                </span>
              )}
              <span className="text-muted-foreground text-sm">{stat.label}</span>
            </span>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

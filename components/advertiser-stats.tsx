"use client"

import { Coins, Megaphone, Users } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { CAMPAIGN_STATUS, useCampaigns } from "@/lib/campaigns"

export default function AdvertiserStats() {
  const campaigns = useCampaigns()

  const spent = campaigns.reduce((sum, c) => sum + c.spent, 0)
  const activeCampaigns = campaigns.filter(
    (c) => c.status === CAMPAIGN_STATUS.ACTIVE
  ).length
  const reached = campaigns.reduce((sum, c) => sum + c.impressions, 0)

  const stats = [
    {
      label: "USDC spent",
      value: spent.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      icon: Coins,
    },
    {
      label: "Active campaigns",
      value: activeCampaigns.toLocaleString("en-US"),
      icon: Megaphone,
    },
    {
      label: "People reached",
      value: reached.toLocaleString("en-US"),
      icon: Users,
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
              <span className="text-2xl font-semibold tracking-tight tabular-nums">
                {stat.value}
              </span>
              <span className="text-muted-foreground text-sm">{stat.label}</span>
            </span>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

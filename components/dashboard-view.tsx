"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { DASHBOARD_MODE } from "@/lib/publisher"
import { setDashboardMode, useDashboardMode } from "@/lib/dashboard-mode"
import PublisherDashboard from "@/components/publisher-dashboard"
import AdvertiserDashboard from "@/components/advertiser-dashboard"

export default function DashboardView() {
  const mode = useDashboardMode()
  const isAdvertiser = mode === DASHBOARD_MODE.ADVERTISER

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 self-start rounded-full border bg-card p-1.5 pr-4">
        <Switch
          id="dashboard-mode"
          checked={isAdvertiser}
          onCheckedChange={(checked) =>
            setDashboardMode(
              checked ? DASHBOARD_MODE.ADVERTISER : DASHBOARD_MODE.PUBLISHER
            )
          }
          aria-label="Toggle between publisher and advertiser mode"
        />
        <Label htmlFor="dashboard-mode" className="cursor-pointer gap-3">
          <span
            className={cn(
              "text-sm",
              !isAdvertiser ? "text-foreground font-medium" : "text-muted-foreground"
            )}
          >
            Publisher
          </span>
          <span className="text-muted-foreground">/</span>
          <span
            className={cn(
              "text-sm",
              isAdvertiser ? "text-foreground font-medium" : "text-muted-foreground"
            )}
          >
            Advertiser
          </span>
        </Label>
      </div>

      {isAdvertiser ? <AdvertiserDashboard /> : <PublisherDashboard />}
    </div>
  )
}

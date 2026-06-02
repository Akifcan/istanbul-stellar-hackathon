import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import AdvertiserStats from "@/components/advertiser-stats"
import CampaignsTable from "@/components/campaigns-table"

export default function AdvertiserDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <AdvertiserStats />

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Your campaigns</h2>
        <Button asChild className="gap-2">
          <Link href="/dashboard/campaigns/new">
            <Plus className="size-4" aria-hidden="true" />
            Create campaign
          </Link>
        </Button>
      </div>

      <CampaignsTable />
    </div>
  )
}

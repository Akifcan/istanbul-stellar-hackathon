import { Megaphone } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export default function AdvertiserDashboard() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Megaphone className="size-6" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold">Advertiser mode is coming soon</h2>
        <p className="text-muted-foreground max-w-sm text-sm text-balance">
          Create campaigns, set targeting conditions, and fund budgets — without
          ever collecting user data. Stay tuned.
        </p>
      </CardContent>
    </Card>
  )
}

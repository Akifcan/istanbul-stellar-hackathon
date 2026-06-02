"use client"

import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"
import { ImageIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CAMPAIGN_STATUS } from "@/lib/campaigns"
import { AD_FORMATS } from "@/lib/ad-formats"
import { fetcher } from "@/lib/fetcher"
import { useWallet } from "@/lib/wallet"

function formatLabel(id: string): string {
  return AD_FORMATS.find((format) => format.id === id)?.label ?? id
}

export default function CampaignsTable() {
  const wallet = useWallet()
  const { data: campaigns, error, isLoading } = useSWR<AdCampaign[]>(
    wallet ? `/api/campaigns?wallet=${encodeURIComponent(wallet)}` : null,
    fetcher
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaigns</CardTitle>
        <CardDescription>Ads you&apos;ve created.</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-destructive py-8 text-center text-sm">
            Could not load campaigns. Please refresh.
          </p>
        ) : isLoading ? (
          <div className="flex flex-col gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="bg-muted h-12 animate-pulse rounded" />
            ))}
          </div>
        ) : !campaigns || campaigns.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No campaigns yet. Create one to get started.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Ad</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">People reached</TableHead>
                <TableHead className="text-right">USDC spent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <span className="bg-muted flex size-10 items-center justify-center overflow-hidden rounded-md">
                      {campaign.imageUrl ? (
                        <Image
                          src={campaign.imageUrl}
                          alt={`${campaign.name} creative`}
                          width={40}
                          height={40}
                          unoptimized
                          className="size-full object-cover"
                        />
                      ) : (
                        <ImageIcon
                          className="text-muted-foreground size-4"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/campaigns/${campaign.id}`}
                      className="font-medium hover:underline"
                    >
                      {campaign.name}
                    </Link>
                    <span className="text-muted-foreground line-clamp-1 max-w-xs text-xs">
                      {campaign.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{formatLabel(campaign.format)}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {campaign.budget.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {campaign.impressions.toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {campaign.spent.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === CAMPAIGN_STATUS.ACTIVE
                          ? "default"
                          : "secondary"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

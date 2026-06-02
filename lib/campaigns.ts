export const CAMPAIGN_STATUS = {
  ACTIVE: "active",
  PAUSED: "paused",
} as const

export type CampaignRow = {
  id: string
  name: string
  format: string
  description: string
  image_url: string | null
  status: "active" | "paused"
  spent: number | string
  impressions: number | string
  created_at: string
  budget: number | string
  audiences: string[] | null
  interests: string[] | null
  estimated_reach: number | string
  tx_hash: string | null
}

export function toCampaign(row: CampaignRow): AdCampaign {
  return {
    id: row.id,
    name: row.name,
    format: row.format,
    description: row.description,
    imageUrl: row.image_url ?? "",
    status: row.status,
    spent: Number(row.spent),
    impressions: Number(row.impressions),
    createdAt: row.created_at.slice(0, 10),
    budget: Number(row.budget),
    audiences: row.audiences ?? [],
    interests: row.interests ?? [],
    estimatedReach: Number(row.estimated_reach),
    txHash: row.tx_hash,
  }
}

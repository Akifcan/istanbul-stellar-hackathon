declare global {
  interface AdCampaign {
    id: string
    name: string
    format: string
    description: string
    imageUrl: string
    createdAt: string
    status: "active" | "paused"
    spent: number
    impressions: number
  }
}

export {}

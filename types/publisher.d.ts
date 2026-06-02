declare global {
  interface PublisherApiKey {
    id: string
    name: string
    websiteUrl: string
    key: string
    createdAt: string
    impressions: number
    earned: number
    status: "active" | "inactive"
    vaultContractId: string | null
  }
}

export {}

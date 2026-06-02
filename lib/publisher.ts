export const DASHBOARD_MODE = {
  PUBLISHER: "publisher",
  ADVERTISER: "advertiser",
} as const

export const KEY_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const

export function generateApiKey(): string {
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 24)
  return `pk_live_${random}`
}

export const SEED_KEYS: PublisherApiKey[] = [
  {
    id: "1",
    name: "Main Blog",
    websiteUrl: "https://myblog.com",
    key: "pk_live_8f3a2c9b1e7d4a6f0b5c8d2e",
    createdAt: "2026-05-18",
    impressions: 12480,
    earned: 184.32,
    status: KEY_STATUS.ACTIVE,
  },
  {
    id: "2",
    name: "News Portal",
    websiteUrl: "https://dailynews.io",
    key: "pk_live_2b7e4d1a9c6f3082e5d7a1b4",
    createdAt: "2026-05-29",
    impressions: 5210,
    earned: 73.9,
    status: KEY_STATUS.ACTIVE,
  },
]

import { useSyncExternalStore } from "react"

export const CAMPAIGN_STATUS = {
  ACTIVE: "active",
  PAUSED: "paused",
} as const

const STORAGE_KEY = "adproof.campaigns"

const SEED_CAMPAIGNS: AdCampaign[] = [
  {
    id: "1",
    name: "Summer XLM Drop",
    format: "banner",
    description: "Promote our token launch to verified high-balance holders.",
    imageUrl: "",
    createdAt: "2026-05-20",
    status: CAMPAIGN_STATUS.ACTIVE,
    spent: 420.5,
    impressions: 9800,
  },
  {
    id: "2",
    name: "NFT Mint Teaser",
    format: "rectangle",
    description: "Reach collectors who hold a specific NFT — no identity needed.",
    imageUrl: "",
    createdAt: "2026-05-31",
    status: CAMPAIGN_STATUS.PAUSED,
    spent: 138.0,
    impressions: 3120,
  },
]

const listeners = new Set<() => void>()
let cache: AdCampaign[] | null = null

function read(): AdCampaign[] {
  if (typeof window === "undefined") return SEED_CAMPAIGNS
  if (cache) return cache

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    cache = raw ? (JSON.parse(raw) as AdCampaign[]) : SEED_CAMPAIGNS
  } catch {
    cache = SEED_CAMPAIGNS
  }
  return cache
}

function write(next: AdCampaign[]) {
  cache = next
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }
  listeners.forEach((listener) => listener())
}

export function addCampaign(campaign: AdCampaign) {
  write([campaign, ...read()])
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useCampaigns(): AdCampaign[] {
  return useSyncExternalStore(subscribe, read, () => SEED_CAMPAIGNS)
}

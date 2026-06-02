// Budget selection bounds (USDC)
export const BUDGET_MIN = 10
export const BUDGET_MAX = 5000
export const BUDGET_STEP = 10
export const BUDGET_DEFAULT = 250

// Estimated Stellar network fee for funding the campaign escrow (Soroban invoke).
// Display-only estimate — the real fee is computed at signing time.
export const ESTIMATED_GAS_XLM = 0.0042

// Targeting conditions — each is proven by the user with a zero-knowledge proof,
// so the advertiser never learns the underlying value or identity.
export const AD_AUDIENCES = [
  { id: "over_18", label: "Over 18" },
  { id: "age_18_34", label: "Age 18–34" },
  { id: "age_35_54", label: "Age 35–54" },
  { id: "frequent_shopper", label: "Frequent online shopper" },
  { id: "student", label: "University student" },
  { id: "active_30d", label: "Active in the last 30 days" },
] as const

export const AUDIENCE_IDS = AD_AUDIENCES.map((a) => a.id) as readonly string[]

export function audienceLabel(id: string): string {
  return AD_AUDIENCES.find((a) => a.id === id)?.label ?? id
}

// Interest categories the campaign targets.
export const AD_INTERESTS = [
  { id: "technology", label: "Technology" },
  { id: "gaming", label: "Gaming" },
  { id: "finance", label: "Finance" },
  { id: "sports", label: "Sports" },
  { id: "fashion", label: "Fashion" },
  { id: "travel", label: "Travel" },
  { id: "food", label: "Food & drink" },
  { id: "music", label: "Music" },
  { id: "fitness", label: "Health & fitness" },
  { id: "education", label: "Education" },
] as const

export const INTEREST_IDS = AD_INTERESTS.map((i) => i.id) as readonly string[]

export function interestLabel(id: string): string {
  return AD_INTERESTS.find((i) => i.id === id)?.label ?? id
}

// Deterministic, believable mock reach estimate driven by budget + how narrow
// the targeting is (more conditions = fewer matching people).
export function estimateReach(
  budget: number,
  audiences: string[],
  interests: string[]
): number {
  if (!budget) return 0
  const base = budget * 28
  const narrowing =
    Math.pow(0.72, audiences.length) * Math.pow(0.88, interests.length)
  const seed =
    (audiences.join("") + interests.join("")).length + Math.round(budget)
  const jitter = 0.9 + ((seed * 7) % 20) / 100 // 0.90 – 1.09, stable per input
  return Math.round(base * narrowing * jitter)
}

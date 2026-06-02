import { NextRequest, NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { toCampaign, type CampaignRow, CAMPAIGN_STATUS } from "@/lib/campaigns"

// Returns random active ads to display on a publisher site, plus the publisher
// api key id that earnings should be credited to. Demo: the publisher is the
// first registered api key.
export async function GET(request: NextRequest) {
  const count = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("count") ?? 4), 1),
    8
  )
  const interestsParam = request.nextUrl.searchParams.get("interests") ?? ""
  const interests = interestsParam.split(",").map((s) => s.trim()).filter(Boolean)

  const [{ data: campaignRows }, { data: keyRows }] = await Promise.all([
    supabaseAdmin
      .from("campaigns")
      .select("*")
      .eq("status", CAMPAIGN_STATUS.ACTIVE),
    supabaseAdmin
      .from("api_keys")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1),
  ])

  const eligible = (campaignRows as CampaignRow[] | null ?? []).filter((row) => {
    if (Number(row.spent) >= Number(row.budget)) return false
    // Interest-based targeting: campaign must share at least one interest with
    // the viewer's profile. (Eligibility is proven with a ZK proof per ad.)
    if (interests.length === 0) return true
    const campaignInterests = row.interests ?? []
    return campaignInterests.some((i) => interests.includes(i))
  })

  // Shuffle and take `count`.
  const shuffled = [...eligible].sort(() => Math.random() - 0.5).slice(0, count)
  const ads = shuffled.map(toCampaign)

  const apiKeyId = keyRows && keyRows.length > 0 ? keyRows[0].id : null

  return NextResponse.json({ apiKeyId, ads })
}

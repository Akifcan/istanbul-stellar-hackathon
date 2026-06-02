import { NextRequest, NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { PRICE_PER_IMPRESSION_USDC, PUBLISHER_SHARE } from "@/lib/serve"

// Records one ad impression: charges the campaign budget and credits the
// publisher's api key earnings (off-chain ledger).
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const campaignId = String(body.campaignId ?? "").trim()
  const apiKeyId = body.apiKeyId ? String(body.apiKeyId).trim() : null

  if (!campaignId) {
    return NextResponse.json({ error: "campaignId is required" }, { status: 400 })
  }

  const { data: campaign } = await supabaseAdmin
    .from("campaigns")
    .select("spent, budget, impressions")
    .eq("id", campaignId)
    .maybeSingle()

  if (!campaign) {
    return NextResponse.json({ error: "campaign not found" }, { status: 404 })
  }

  const spent = Number(campaign.spent)
  const budget = Number(campaign.budget)
  if (spent + PRICE_PER_IMPRESSION_USDC > budget) {
    return NextResponse.json({ ok: false, reason: "budget exhausted" })
  }

  const newSpent = Math.round((spent + PRICE_PER_IMPRESSION_USDC) * 100) / 100
  await supabaseAdmin
    .from("campaigns")
    .update({
      spent: newSpent,
      impressions: Number(campaign.impressions) + 1,
    })
    .eq("id", campaignId)

  // Credit the publisher.
  if (apiKeyId) {
    const { data: key } = await supabaseAdmin
      .from("api_keys")
      .select("earned, impressions")
      .eq("id", apiKeyId)
      .maybeSingle()

    if (key) {
      const reward =
        Math.round(PRICE_PER_IMPRESSION_USDC * PUBLISHER_SHARE * 100) / 100
      await supabaseAdmin
        .from("api_keys")
        .update({
          earned: Math.round((Number(key.earned) + reward) * 100) / 100,
          impressions: Number(key.impressions) + 1,
        })
        .eq("id", apiKeyId)
    }
  }

  return NextResponse.json({ ok: true })
}

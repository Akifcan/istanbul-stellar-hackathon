import { NextRequest, NextResponse } from "next/server"
import * as snarkjs from "snarkjs"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { PRICE_PER_IMPRESSION_USDC, PUBLISHER_SHARE } from "@/lib/serve"
import { interestRoot, campaignIdToField } from "@/lib/zk"
import vkey from "@/lib/zk/verification_key.json"

// Records one verified ad impression. The viewer's device sends a zero-knowledge
// proof that they belong to one of the campaign's target interest sets — no
// identity or personal data. We verify the proof, enforce a per-campaign
// nullifier, then update the off-chain ledger.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const campaignId = String(body.campaignId ?? "").trim()
  const apiKeyId = body.apiKeyId ? String(body.apiKeyId).trim() : null
  const interest = String(body.interest ?? "").trim()
  const proof = body.proof
  const publicSignals: string[] = Array.isArray(body.publicSignals)
    ? body.publicSignals.map(String)
    : []

  if (!campaignId || !interest || !proof || publicSignals.length !== 3) {
    return NextResponse.json({ error: "missing proof data" }, { status: 400 })
  }

  const [nullifier, root, campaignField] = publicSignals

  // 1. Public inputs must bind to THIS campaign and interest.
  if (campaignField !== campaignIdToField(campaignId)) {
    return NextResponse.json({ error: "campaign mismatch" }, { status: 400 })
  }
  const expectedRoot = await interestRoot(interest)
  if (root !== expectedRoot) {
    return NextResponse.json({ error: "unknown interest set" }, { status: 400 })
  }

  // 2. Campaign must actually target that interest.
  const { data: campaign } = await supabaseAdmin
    .from("campaigns")
    .select("spent, budget, impressions, interests")
    .eq("id", campaignId)
    .maybeSingle()
  if (!campaign) {
    return NextResponse.json({ error: "campaign not found" }, { status: 404 })
  }
  if (!(campaign.interests ?? []).includes(interest)) {
    return NextResponse.json({ error: "interest not targeted" }, { status: 400 })
  }

  // 3. Verify the zero-knowledge proof.
  const valid = await snarkjs.groth16.verify(vkey, publicSignals, proof)
  if (!valid) {
    return NextResponse.json({ ok: false, reason: "invalid proof" }, { status: 400 })
  }

  // 4. Enforce the nullifier (one count per eligible user per campaign).
  const { error: nullErr } = await supabaseAdmin
    .from("nullifiers")
    .insert({ nullifier, campaign_id: campaignId })
  if (nullErr) {
    // Duplicate nullifier => already counted. Still a valid proof.
    return NextResponse.json({ ok: true, counted: false, reason: "already counted" })
  }

  // 5. Budget check + ledger update.
  const spent = Number(campaign.spent)
  const budget = Number(campaign.budget)
  if (spent + PRICE_PER_IMPRESSION_USDC > budget) {
    return NextResponse.json({ ok: true, counted: false, reason: "budget exhausted" })
  }

  const newSpent = Math.round((spent + PRICE_PER_IMPRESSION_USDC) * 100) / 100
  await supabaseAdmin
    .from("campaigns")
    .update({ spent: newSpent, impressions: Number(campaign.impressions) + 1 })
    .eq("id", campaignId)

  let earned = 0
  if (apiKeyId) {
    const { data: key } = await supabaseAdmin
      .from("api_keys")
      .select("earned, impressions")
      .eq("id", apiKeyId)
      .maybeSingle()
    if (key) {
      earned = Math.round(PRICE_PER_IMPRESSION_USDC * PUBLISHER_SHARE * 100) / 100
      await supabaseAdmin
        .from("api_keys")
        .update({
          earned: Math.round((Number(key.earned) + earned) * 100) / 100,
          impressions: Number(key.impressions) + 1,
        })
        .eq("id", apiKeyId)
    }
  }

  return NextResponse.json({ ok: true, counted: true, earned })
}

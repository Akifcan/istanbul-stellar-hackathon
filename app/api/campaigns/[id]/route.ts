import { NextRequest, NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { CAMPAIGN_STATUS, toCampaign, type CampaignRow } from "@/lib/campaigns"

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabaseAdmin
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: "campaign not found" }, { status: 404 })
  }

  return NextResponse.json(toCampaign(data as CampaignRow))
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const wallet = String(body.wallet ?? "").trim()
  if (!wallet) {
    return NextResponse.json({ error: "wallet is required" }, { status: 401 })
  }

  const updates: Record<string, unknown> = {}

  if (body.name !== undefined) {
    const name = String(body.name).trim()
    if (!name) {
      return NextResponse.json({ error: "name cannot be empty" }, { status: 400 })
    }
    updates.name = name
  }

  if (body.description !== undefined) {
    const description = String(body.description).trim()
    if (description.length < 10) {
      return NextResponse.json(
        { error: "description must be at least 10 characters" },
        { status: 400 }
      )
    }
    updates.description = description
  }

  if (body.imageUrl !== undefined) {
    const imageUrl = String(body.imageUrl).trim()
    if (!isHttpUrl(imageUrl)) {
      return NextResponse.json({ error: "a valid image URL is required" }, { status: 400 })
    }
    updates.image_url = imageUrl
  }

  if (body.status !== undefined) {
    const status = String(body.status)
    if (status !== CAMPAIGN_STATUS.ACTIVE && status !== CAMPAIGN_STATUS.PAUSED) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 })
    }
    updates.status = status
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 })
  }

  // Only the owner may edit their campaign.
  const { data, error } = await supabaseAdmin
    .from("campaigns")
    .update(updates)
    .eq("id", id)
    .eq("advertiser_wallet", wallet)
    .select("*")
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json(
      { error: "campaign not found or not yours" },
      { status: 404 }
    )
  }

  return NextResponse.json(toCampaign(data as CampaignRow))
}

import { NextRequest, NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { CAMPAIGN_STATUS } from "@/lib/campaigns"
import { AD_FORMATS } from "@/lib/ad-formats"
import { AUDIENCE_IDS, INTEREST_IDS, estimateReach } from "@/lib/targeting"

const FORMAT_IDS = AD_FORMATS.map((format) => format.id) as readonly string[]

type CampaignRow = {
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
}

function toCampaign(row: CampaignRow): AdCampaign {
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
  }
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet")
  if (!wallet) {
    return NextResponse.json({ error: "wallet is required" }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from("campaigns")
    .select("*")
    .eq("advertiser_wallet", wallet)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json((data as CampaignRow[]).map(toCampaign))
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const wallet = String(body.wallet ?? "").trim()
  const name = String(body.name ?? "").trim()
  const format = String(body.format ?? "").trim()
  const description = String(body.description ?? "").trim()
  const imageUrl = String(body.imageUrl ?? "").trim()
  const budget = Number(body.budget)
  const audiences = Array.isArray(body.audiences)
    ? body.audiences.map(String).filter((a: string) => AUDIENCE_IDS.includes(a))
    : []
  const interests = Array.isArray(body.interests)
    ? body.interests.map(String).filter((i: string) => INTEREST_IDS.includes(i))
    : []

  if (!wallet) {
    return NextResponse.json({ error: "wallet is required" }, { status: 401 })
  }
  if (!name || !description) {
    return NextResponse.json(
      { error: "name and description are required" },
      { status: 400 }
    )
  }
  if (!FORMAT_IDS.includes(format)) {
    return NextResponse.json({ error: "invalid ad format" }, { status: 400 })
  }
  if (!isHttpUrl(imageUrl)) {
    return NextResponse.json({ error: "a valid image URL is required" }, { status: 400 })
  }
  if (!Number.isFinite(budget) || budget <= 0) {
    return NextResponse.json({ error: "a valid budget is required" }, { status: 400 })
  }
  if (audiences.length === 0) {
    return NextResponse.json(
      { error: "select at least one target audience" },
      { status: 400 }
    )
  }
  if (interests.length === 0) {
    return NextResponse.json(
      { error: "select at least one interest" },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from("campaigns")
    .insert({
      advertiser_wallet: wallet,
      name,
      format,
      description,
      image_url: imageUrl,
      status: CAMPAIGN_STATUS.ACTIVE,
      spent: 0,
      impressions: 0,
      budget,
      audiences,
      interests,
      estimated_reach: estimateReach(budget, audiences, interests),
    })
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(toCampaign(data as CampaignRow), { status: 201 })
}

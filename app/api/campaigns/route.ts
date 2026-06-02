import { NextRequest, NextResponse } from "next/server"

import { supabaseAdmin, AD_CREATIVES_BUCKET } from "@/lib/supabase-admin"
import { CAMPAIGN_STATUS } from "@/lib/campaigns"
import { AD_FORMATS } from "@/lib/ad-formats"

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
  const formData = await request.formData()

  const wallet = String(formData.get("wallet") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const format = String(formData.get("format") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const image = formData.get("image")

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
  if (!(image instanceof File) || !image.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "an image file is required" },
      { status: 400 }
    )
  }

  // Upload the creative to Storage.
  const ext = image.name.split(".").pop()?.toLowerCase() || "png"
  const path = `${wallet}/${crypto.randomUUID()}.${ext}`
  const { error: uploadError } = await supabaseAdmin.storage
    .from(AD_CREATIVES_BUCKET)
    .upload(path, await image.arrayBuffer(), { contentType: image.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(AD_CREATIVES_BUCKET).getPublicUrl(path)

  const { data, error } = await supabaseAdmin
    .from("campaigns")
    .insert({
      advertiser_wallet: wallet,
      name,
      format,
      description,
      image_url: publicUrl,
      status: CAMPAIGN_STATUS.ACTIVE,
      spent: 0,
      impressions: 0,
    })
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(toCampaign(data as CampaignRow), { status: 201 })
}

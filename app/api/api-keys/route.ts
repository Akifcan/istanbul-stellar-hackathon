import { NextRequest, NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { KEY_STATUS } from "@/lib/publisher"

type ApiKeyRow = {
  id: string
  name: string
  website_url: string
  key: string
  impressions: number | string
  earned: number | string
  status: "active" | "inactive"
  created_at: string
  vault_contract_id: string | null
}

function toApiKey(row: ApiKeyRow): PublisherApiKey {
  return {
    id: row.id,
    name: row.name,
    websiteUrl: row.website_url,
    key: row.key,
    impressions: Number(row.impressions),
    earned: Number(row.earned),
    status: row.status,
    createdAt: row.created_at.slice(0, 10),
    vaultContractId: row.vault_contract_id,
  }
}

function generateApiKey(): string {
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 24)
  return `pk_live_${random}`
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
    .from("api_keys")
    .select("*")
    .eq("owner_wallet", wallet)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json((data as ApiKeyRow[]).map(toApiKey))
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const wallet = String(body.wallet ?? "").trim()
  const name = String(body.name ?? "").trim()
  const websiteUrl = String(body.websiteUrl ?? "").trim()
  const vaultContractId = body.vaultContractId
    ? String(body.vaultContractId).trim()
    : null

  if (!wallet) {
    return NextResponse.json({ error: "wallet is required" }, { status: 401 })
  }
  if (!name) {
    return NextResponse.json({ error: "key name is required" }, { status: 400 })
  }
  if (!isHttpUrl(websiteUrl)) {
    return NextResponse.json(
      { error: "a valid website URL is required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .insert({
      owner_wallet: wallet,
      name,
      website_url: websiteUrl,
      key: generateApiKey(),
      impressions: 0,
      earned: 0,
      status: KEY_STATUS.ACTIVE,
      vault_contract_id: vaultContractId,
    })
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(toApiKey(data as ApiKeyRow), { status: 201 })
}

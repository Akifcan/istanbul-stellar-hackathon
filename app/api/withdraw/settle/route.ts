import { NextRequest, NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"

// Step 2 of withdraw: after the publisher's on-chain withdraw succeeds, zero
// out the off-chain earned balance for that key.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const apiKeyId = body ? String(body.apiKeyId ?? "").trim() : ""
  const wallet = body ? String(body.wallet ?? "").trim() : ""

  if (!apiKeyId || !wallet) {
    return NextResponse.json({ error: "apiKeyId and wallet are required" }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .update({ earned: 0 })
    .eq("id", apiKeyId)
    .eq("owner_wallet", wallet)
    .select("id")
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: "API key not found or not yours" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}

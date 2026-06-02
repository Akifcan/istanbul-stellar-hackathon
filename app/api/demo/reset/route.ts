import { NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"

// Resets the demo ledger so earnings can be shown from scratch:
// - clears all ZK nullifiers (so users count again)
// - zeroes publisher api_key earnings + impressions
// - zeroes campaign spend + impressions (budgets full again)
export async function POST() {
  const all = "00000000-0000-0000-0000-000000000000"

  const [{ error: nErr }, { error: kErr }, { error: cErr }] = await Promise.all([
    supabaseAdmin.from("nullifiers").delete().neq("nullifier", ""),
    supabaseAdmin.from("api_keys").update({ earned: 0, impressions: 0 }).neq("id", all),
    supabaseAdmin.from("campaigns").update({ spent: 0, impressions: 0 }).neq("id", all),
  ])

  const error = nErr || kErr || cErr
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

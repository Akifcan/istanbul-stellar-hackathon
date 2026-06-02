import { NextRequest, NextResponse } from "next/server"
import { execFile } from "node:child_process"
import { promisify } from "node:util"

import { supabaseAdmin } from "@/lib/supabase-admin"

const exec = promisify(execFile)

const STELLAR_BIN = process.env.STELLAR_BIN || "/opt/homebrew/bin/stellar"
const STROOPS_PER_UNIT = 10_000_000

// Step 1 of withdraw: the treasury (admin) releases the publisher's earned
// USDC into their vault contract. The publisher then withdraws from the vault
// to their wallet (signed by their own Freighter) on the client.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const apiKeyId = body ? String(body.apiKeyId ?? "").trim() : ""
  const wallet = body ? String(body.wallet ?? "").trim() : ""

  if (!apiKeyId || !wallet) {
    return NextResponse.json({ error: "apiKeyId and wallet are required" }, { status: 400 })
  }

  const { data: key } = await supabaseAdmin
    .from("api_keys")
    .select("earned, owner_wallet, vault_contract_id, name")
    .eq("id", apiKeyId)
    .maybeSingle()

  if (!key) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 })
  }
  if (key.owner_wallet !== wallet) {
    return NextResponse.json({ error: "not your API key" }, { status: 403 })
  }
  if (!key.vault_contract_id) {
    return NextResponse.json({ error: "this key has no vault contract" }, { status: 400 })
  }
  const earned = Number(key.earned)
  if (!(earned > 0)) {
    return NextResponse.json({ error: "nothing to withdraw" }, { status: 400 })
  }

  const stroops = String(Math.round(earned * STROOPS_PER_UNIT))

  // Admin funds the vault with the earned amount.
  try {
    await exec(STELLAR_BIN, [
      "contract",
      "invoke",
      "--id",
      key.vault_contract_id,
      "--source",
      "akif",
      "--network",
      "testnet",
      "--",
      "fund",
      "--amount",
      stroops,
    ])
  } catch (err) {
    const detail =
      err instanceof Error && "stderr" in err
        ? String((err as { stderr?: string }).stderr ?? err.message)
        : "fund failed"
    return NextResponse.json(
      { error: "Could not release earnings to the vault.", detail },
      { status: 500 }
    )
  }

  return NextResponse.json({
    vaultContractId: key.vault_contract_id,
    amount: earned,
  })
}

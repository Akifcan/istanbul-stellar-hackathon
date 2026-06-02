import { NextRequest, NextResponse } from "next/server"
import { execFile } from "node:child_process"
import { promisify } from "node:util"

const exec = promisify(execFile)

const STELLAR_BIN = process.env.STELLAR_BIN || "/opt/homebrew/bin/stellar"
const USDC_SAC_ID = process.env.NEXT_PUBLIC_USDC_SAC_ID as string
const FAUCET_USDC = 5000 // test USDC handed out per request
const STROOPS_PER_UNIT = 10_000_000 // classic assets use 7 decimals

// Mints mock USDC to a wallet, signed by the issuer (CLI identity `akif`).
// The wallet must already have a USDC trustline (established client-side).
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const wallet = body ? String(body.wallet ?? "").trim() : ""

  if (!wallet.startsWith("G") || wallet.length !== 56) {
    return NextResponse.json({ error: "valid wallet is required" }, { status: 400 })
  }

  const amount = String(FAUCET_USDC * STROOPS_PER_UNIT)

  try {
    await exec(STELLAR_BIN, [
      "contract",
      "invoke",
      "--id",
      USDC_SAC_ID,
      "--source",
      "akif",
      "--network",
      "testnet",
      "--",
      "mint",
      "--to",
      wallet,
      "--amount",
      amount,
    ])
  } catch (err) {
    const message =
      err instanceof Error && "stderr" in err
        ? String((err as { stderr?: string }).stderr ?? err.message)
        : "mint failed"
    return NextResponse.json(
      { error: "Could not mint test USDC. Make sure the trustline exists.", detail: message },
      { status: 500 }
    )
  }

  return NextResponse.json({ minted: FAUCET_USDC })
}

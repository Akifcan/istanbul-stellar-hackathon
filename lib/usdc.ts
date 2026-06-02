import * as StellarSdk from "@stellar/stellar-sdk"
import { signTransaction } from "@stellar/freighter-api"

import { ADMIN_ADDRESS, NETWORK_PASSPHRASE, horizon } from "@/lib/stellar"

export const USDC_CODE = "USDC"
export const USDC_ASSET = new StellarSdk.Asset(USDC_CODE, ADMIN_ADDRESS)

/** Reads the wallet's mock-USDC balance from Horizon. Returns 0 if no trustline. */
export async function getUsdcBalance(wallet: string): Promise<number> {
  try {
    const account = await horizon.loadAccount(wallet)
    const line = account.balances.find(
      (b) =>
        "asset_code" in b &&
        b.asset_code === USDC_CODE &&
        b.asset_issuer === ADMIN_ADDRESS
    )
    return line ? Number(line.balance) : 0
  } catch {
    return 0
  }
}

export async function hasTrustline(wallet: string): Promise<boolean> {
  try {
    const account = await horizon.loadAccount(wallet)
    return account.balances.some(
      (b) =>
        "asset_code" in b &&
        b.asset_code === USDC_CODE &&
        b.asset_issuer === ADMIN_ADDRESS
    )
  } catch {
    return false
  }
}

/** Establishes a trustline to mock USDC (signed by the user in Freighter). */
export async function establishTrustline(wallet: string): Promise<void> {
  if (await hasTrustline(wallet)) return

  const account = await horizon.loadAccount(wallet)
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(StellarSdk.Operation.changeTrust({ asset: USDC_ASSET }))
    .setTimeout(180)
    .build()

  const { signedTxXdr, error } = await signTransaction(tx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: wallet,
  })
  if (error) {
    throw new Error("Signing was rejected")
  }

  const signed = StellarSdk.TransactionBuilder.fromXDR(
    signedTxXdr,
    NETWORK_PASSPHRASE
  ) as StellarSdk.Transaction

  await horizon.submitTransaction(signed)
}

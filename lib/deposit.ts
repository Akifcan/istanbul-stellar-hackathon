import * as StellarSdk from "@stellar/stellar-sdk"
import { signTransaction } from "@stellar/freighter-api"

import { BASE_CONTRACT_ID, NETWORK_PASSPHRASE, rpc } from "@/lib/stellar"

const STROOPS_PER_UNIT = 10_000_000 // 7 decimals

/**
 * Advertiser deposits `amountUsdc` of mock USDC into the base (treasury)
 * contract, signed by their Freighter wallet. Returns the tx hash.
 */
export async function depositToBase(
  wallet: string,
  amountUsdc: number
): Promise<string> {
  const account = await rpc.getAccount(wallet)
  const stroops = BigInt(Math.round(amountUsdc * STROOPS_PER_UNIT))

  const base = new StellarSdk.Contract(BASE_CONTRACT_ID)

  let tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      base.call(
        "deposit",
        StellarSdk.Address.fromString(wallet).toScVal(),
        StellarSdk.nativeToScVal(stroops, { type: "i128" })
      )
    )
    .setTimeout(180)
    .build()

  const sim = await rpc.simulateTransaction(tx)
  if (StellarSdk.rpc.Api.isSimulationError(sim)) {
    throw new Error(sim.error)
  }
  tx = StellarSdk.rpc.assembleTransaction(tx, sim).build()

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

  const sent = await rpc.sendTransaction(signed)
  if (sent.status === "ERROR") {
    throw new Error("Transaction submission failed")
  }

  let result = await rpc.getTransaction(sent.hash)
  while (result.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    result = await rpc.getTransaction(sent.hash)
  }

  if (result.status !== "SUCCESS") {
    throw new Error("Deposit failed on-chain")
  }

  return sent.hash
}

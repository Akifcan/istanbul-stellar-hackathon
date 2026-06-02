import * as StellarSdk from "@stellar/stellar-sdk"
import { signTransaction } from "@stellar/freighter-api"

import {
  ADMIN_ADDRESS,
  NETWORK_PASSPHRASE,
  USDC_SAC_ID,
  VAULT_WASM_HASH,
  hexToBytes,
  rpc,
} from "@/lib/stellar"

/**
 * Deploys a per-API-key vault contract from the already-uploaded WASM hash,
 * signed and paid for by the publisher's own Freighter wallet.
 * Returns the new contract id (C...).
 */
export async function deployVault(owner: string): Promise<string> {
  const account = await rpc.getAccount(owner)
  const salt = crypto.getRandomValues(new Uint8Array(32))

  const op = StellarSdk.Operation.createCustomContract({
    address: StellarSdk.Address.fromString(owner),
    wasmHash: hexToBytes(VAULT_WASM_HASH),
    salt,
    constructorArgs: [
      StellarSdk.Address.fromString(owner).toScVal(),
      StellarSdk.Address.fromString(USDC_SAC_ID).toScVal(),
      StellarSdk.Address.fromString(ADMIN_ADDRESS).toScVal(),
    ],
  })

  let tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(op)
    .setTimeout(180)
    .build()

  const sim = await rpc.simulateTransaction(tx)
  if (StellarSdk.rpc.Api.isSimulationError(sim)) {
    throw new Error(sim.error)
  }
  tx = StellarSdk.rpc.assembleTransaction(tx, sim).build()

  const { signedTxXdr, error } = await signTransaction(tx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: owner,
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

  if (result.status !== "SUCCESS" || !result.returnValue) {
    throw new Error("Contract deployment failed on-chain")
  }

  return StellarSdk.scValToNative(result.returnValue) as string
}

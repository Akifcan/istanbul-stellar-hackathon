import * as StellarSdk from "@stellar/stellar-sdk"

// Testnet-only config for now (client-exposed values).
export const RPC_URL = "https://soroban-testnet.stellar.org"
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET

export const rpc = new StellarSdk.rpc.Server(RPC_URL)

export const USDC_SAC_ID = process.env.NEXT_PUBLIC_USDC_SAC_ID as string
export const VAULT_WASM_HASH = process.env.NEXT_PUBLIC_VAULT_WASM_HASH as string
export const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS as string

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16)
  }
  return bytes
}

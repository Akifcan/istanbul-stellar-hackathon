import { buildMembershipInput } from "@/lib/zk"

export type EligibilityProof = {
  interest: string
  // snarkjs Groth16 proof object
  proof: unknown
  // [nullifier, root, campaignId]
  publicSignals: string[]
}

/**
 * Generates a Groth16 proof (in the browser) that the profile belongs to one of
 * the campaign's target interest sets — without revealing identity or secret.
 */
export async function generateEligibilityProof(
  secret: string,
  profileInterests: string[],
  campaignInterests: string[],
  campaignId: string
): Promise<EligibilityProof | null> {
  const interest = campaignInterests.find((i) => profileInterests.includes(i))
  if (!interest) return null

  const input = await buildMembershipInput(secret, interest, campaignId)

  const snarkjs = await import("snarkjs")
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    "/zk/membership.wasm",
    "/zk/membership_final.zkey"
  )

  return { interest, proof, publicSignals }
}

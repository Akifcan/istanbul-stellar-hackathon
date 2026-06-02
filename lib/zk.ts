import { buildPoseidon } from "circomlibjs"

import { PROFILES } from "@/lib/profiles-data"
import { AD_INTERESTS } from "@/lib/targeting"

// Depth-2 Merkle tree => up to 4 leaves per interest set.
const TREE_DEPTH = 2
const LEAVES = 1 << TREE_DEPTH // 4

type Poseidon = Awaited<ReturnType<typeof buildPoseidon>>
let poseidonPromise: Promise<Poseidon> | null = null

async function getPoseidon(): Promise<Poseidon> {
  if (!poseidonPromise) poseidonPromise = buildPoseidon()
  return poseidonPromise
}

function toField(p: Poseidon, v: bigint): bigint {
  // poseidon output is a field element in Montgomery form; normalize to BigInt
  return BigInt(p.F.toString(v))
}

function hash(p: Poseidon, inputs: bigint[]): bigint {
  return toField(p, p(inputs))
}

/** Profiles eligible for an interest = those whose interests include it. */
function profilesForInterest(interest: string) {
  return PROFILES.filter((pr) => pr.interests.includes(interest))
}

/** Builds the padded leaf list (commitments) for an interest's tree. */
async function leavesForInterest(interest: string): Promise<bigint[]> {
  const p = await getPoseidon()
  const members = profilesForInterest(interest)
  const leaves = members.map((m) => hash(p, [BigInt(m.secret)]))
  // pad with Poseidon(0) to a fixed size
  const pad = hash(p, [0n])
  while (leaves.length < LEAVES) leaves.push(pad)
  return leaves.slice(0, LEAVES)
}

async function rootOf(p: Poseidon, leaves: bigint[]): Promise<bigint> {
  let level = leaves
  while (level.length > 1) {
    const next: bigint[] = []
    for (let i = 0; i < level.length; i += 2) {
      next.push(hash(p, [level[i], level[i + 1]]))
    }
    level = next
  }
  return level[0]
}

export async function interestRoot(interest: string): Promise<string> {
  const p = await getPoseidon()
  const leaves = await leavesForInterest(interest)
  return (await rootOf(p, leaves)).toString()
}

/** All interest roots (used by the server to validate a proof's root). */
export async function allInterestRoots(): Promise<Record<string, string>> {
  const out: Record<string, string> = {}
  for (const it of AD_INTERESTS) {
    out[it.id] = await interestRoot(it.id)
  }
  return out
}

/** Deterministically maps a campaign uuid to a field element (decimal string). */
export function campaignIdToField(campaignId: string): string {
  let acc = 0n
  for (const ch of campaignId) {
    acc = (acc * 131n + BigInt(ch.charCodeAt(0))) % (1n << 250n)
  }
  return acc.toString()
}

export type MembershipInput = {
  secret: string
  pathElements: string[]
  pathIndex: number[]
  root: string
  campaignId: string
}

/** Builds the Groth16 witness input for a profile proving membership in an interest set. */
export async function buildMembershipInput(
  secret: string,
  interest: string,
  campaignId: string
): Promise<MembershipInput> {
  const p = await getPoseidon()
  const leaves = await leavesForInterest(interest)
  const myLeaf = hash(p, [BigInt(secret)])

  const index = leaves.findIndex((l) => l === myLeaf)
  if (index < 0) throw new Error("profile not in interest set")

  const pathElements: string[] = []
  const pathIndex: number[] = []
  let level = leaves
  let idx = index
  while (level.length > 1) {
    const isRight = idx % 2 === 1
    const siblingIdx = isRight ? idx - 1 : idx + 1
    pathElements.push(level[siblingIdx].toString())
    pathIndex.push(isRight ? 1 : 0)
    const next: bigint[] = []
    for (let i = 0; i < level.length; i += 2) {
      next.push(hash(p, [level[i], level[i + 1]]))
    }
    level = next
    idx = Math.floor(idx / 2)
  }

  return {
    secret,
    pathElements,
    pathIndex,
    root: (await rootOf(p, leaves)).toString(),
    campaignId: campaignIdToField(campaignId),
  }
}

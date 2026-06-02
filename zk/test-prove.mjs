// End-to-end ZK sanity check: build input, prove, verify, print publicSignals.
// Run: node zk/test-prove.mjs
import { buildPoseidon } from "circomlibjs"
import * as snarkjs from "snarkjs"
import { readFileSync } from "node:fs"

const PROFILES = [
  { id: "p_tech", interests: ["technology", "gaming", "finance"], secret: "111111111111111111" },
  { id: "p_life", interests: ["food", "fitness", "sports"], secret: "222222222222222222" },
  { id: "p_style", interests: ["fashion", "travel", "music"], secret: "333333333333333333" },
  { id: "p_learn", interests: ["finance", "education", "technology"], secret: "444444444444444444" },
]
const LEAVES = 4

const poseidon = await buildPoseidon()
const F = poseidon.F
const h = (arr) => BigInt(F.toString(poseidon(arr)))

function leavesFor(interest) {
  const members = PROFILES.filter((p) => p.interests.includes(interest))
  const leaves = members.map((m) => h([BigInt(m.secret)]))
  const pad = h([0n])
  while (leaves.length < LEAVES) leaves.push(pad)
  return leaves.slice(0, LEAVES)
}
function root(leaves) {
  let lvl = leaves
  while (lvl.length > 1) {
    const nx = []
    for (let i = 0; i < lvl.length; i += 2) nx.push(h([lvl[i], lvl[i + 1]]))
    lvl = nx
  }
  return lvl[0]
}
function campaignField(id) {
  let acc = 0n
  for (const c of id) acc = (acc * 131n + BigInt(c.charCodeAt(0))) % (1n << 250n)
  return acc.toString()
}

const interest = "technology"
const secret = "111111111111111111" // p_tech
const leaves = leavesFor(interest)
const myLeaf = h([BigInt(secret)])
let idx = leaves.findIndex((l) => l === myLeaf)

const pathElements = []
const pathIndex = []
let lvl = leaves
let i = idx
while (lvl.length > 1) {
  const right = i % 2 === 1
  pathElements.push(lvl[right ? i - 1 : i + 1].toString())
  pathIndex.push(right ? 1 : 0)
  const nx = []
  for (let k = 0; k < lvl.length; k += 2) nx.push(h([lvl[k], lvl[k + 1]]))
  lvl = nx
  i = Math.floor(i / 2)
}

const input = {
  secret,
  pathElements,
  pathIndex,
  root: root(leaves).toString(),
  campaignId: campaignField("123d3c17-6d9c-4b19-b744-958af32a3d7e"),
}
console.log("input:", input)

const { proof, publicSignals } = await snarkjs.groth16.fullProve(
  input,
  "public/zk/membership.wasm",
  "public/zk/membership_final.zkey"
)
console.log("publicSignals:", publicSignals)
console.log("expected root:", input.root)
console.log("expected campaignId:", input.campaignId)

const vkey = JSON.parse(readFileSync("lib/zk/verification_key.json", "utf8"))
const ok = await snarkjs.groth16.verify(vkey, publicSignals, proof)
console.log("VERIFY:", ok)
process.exit(ok ? 0 : 1)

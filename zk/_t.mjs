// Simulates the browser flow against the live dev server:
// serve -> build proof -> POST impression -> replay. Run: node zk/test-impression.mjs
import { buildPoseidon } from "circomlibjs"
import * as snarkjs from "snarkjs"

const PROFILES = [
  { id: "p_tech", interests: ["technology", "gaming", "finance"], secret: "111111111111111111" },
  { id: "p_life", interests: ["food", "fitness", "sports"], secret: "222222222222222222" },
  { id: "p_style", interests: ["fashion", "travel", "music"], secret: "333333333333333333" },
  { id: "p_learn", interests: ["finance", "education", "technology"], secret: "444444444444444444" },
]
const LEAVES = 4
const poseidon = await buildPoseidon()
const F = poseidon.F
const h = (a) => BigInt(F.toString(poseidon(a)))
const leavesFor = (interest) => {
  const ls = PROFILES.filter((p) => p.interests.includes(interest)).map((m) => h([BigInt(m.secret)]))
  const pad = h([0n]); while (ls.length < LEAVES) ls.push(pad); return ls.slice(0, LEAVES)
}
const campaignField = (id) => { let a = 0n; for (const c of id) a = (a * 131n + BigInt(c.charCodeAt(0))) % (1n << 250n); return a.toString() }

const profile = PROFILES[0] // p_tech
const url = `http://localhost:3000/api/ads/serve?count=8&interests=${profile.interests.join(",")}`
const serve = await (await fetch(url)).json()
console.log("served ads:", serve.ads.length, "apiKeyId:", serve.apiKeyId?.slice(0, 8))
const ad = serve.ads.find((a) => a.interests.some((i) => profile.interests.includes(i)))
if (!ad) { console.log("no matching ad"); process.exit(1) }
const interest = ad.interests.find((i) => profile.interests.includes(i))
console.log("ad:", ad.name, "| interest:", interest)

const leaves = leavesFor(interest)
const myLeaf = h([BigInt(profile.secret)])
let idx = leaves.findIndex((l) => l === myLeaf)
const pathElements = [], pathIndex = []
let lvl = leaves, i = idx
while (lvl.length > 1) {
  const right = i % 2 === 1
  pathElements.push(lvl[right ? i - 1 : i + 1].toString()); pathIndex.push(right ? 1 : 0)
  const nx = []; for (let k = 0; k < lvl.length; k += 2) nx.push(h([lvl[k], lvl[k + 1]])); lvl = nx; i = Math.floor(i / 2)
}
let root = leaves; while (root.length > 1) { const nx = []; for (let k = 0; k < root.length; k += 2) nx.push(h([root[k], root[k + 1]])); root = nx }
const input = { secret: profile.secret, pathElements, pathIndex, root: root[0].toString(), campaignId: campaignField(ad.id) }

const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, "public/zk/membership.wasm", "public/zk/membership_final.zkey")
console.log("nullifier:", publicSignals[0].slice(0, 16) + "…")

const post = async () => {
  const r = await fetch("http://localhost:3000/api/ads/impression", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId: ad.id, apiKeyId: serve.apiKeyId, interest, proof, publicSignals }),
  })
  const text = await r.text()
  return `HTTP ${r.status} | ${text.slice(0, 200)}`
}

console.log("1st impression:", await post())
console.log("replay:", await post())

import { buildPoseidon } from "circomlibjs"
import * as snarkjs from "snarkjs"
import { writeFileSync } from "node:fs"
const PROFILES=[{interests:["technology","gaming","finance"],secret:"111111111111111111"}]
const LEAVES=4
const poseidon=await buildPoseidon(); const F=poseidon.F; const h=a=>BigInt(F.toString(poseidon(a)))
const leavesFor=i=>{const ls=PROFILES.filter(p=>p.interests.includes(i)).map(m=>h([BigInt(m.secret)]));const pad=h([0n]);while(ls.length<LEAVES)ls.push(pad);return ls.slice(0,LEAVES)}
const cf=id=>{let a=0n;for(const c of id)a=(a*131n+BigInt(c.charCodeAt(0)))%(1n<<250n);return a.toString()}
const serve=await (await fetch("http://localhost:3000/api/ads/serve?count=8&interests=technology,gaming,finance")).json()
const ad=serve.ads.find(a=>a.interests.some(i=>PROFILES[0].interests.includes(i)))
const interest=ad.interests.find(i=>PROFILES[0].interests.includes(i))
const leaves=leavesFor(interest); const my=h([BigInt(PROFILES[0].secret)]); let idx=leaves.findIndex(l=>l===my)
const pe=[],pi=[]; let lvl=leaves,i=idx
while(lvl.length>1){const r=i%2===1;pe.push(lvl[r?i-1:i+1].toString());pi.push(r?1:0);const nx=[];for(let k=0;k<lvl.length;k+=2)nx.push(h([lvl[k],lvl[k+1]]));lvl=nx;i=Math.floor(i/2)}
let rt=leaves;while(rt.length>1){const nx=[];for(let k=0;k<rt.length;k+=2)nx.push(h([rt[k],rt[k+1]]));rt=nx}
const input={secret:PROFILES[0].secret,pathElements:pe,pathIndex:pi,root:rt[0].toString(),campaignId:cf(ad.id)}
const {proof,publicSignals}=await snarkjs.groth16.fullProve(input,"public/zk/membership.wasm","public/zk/membership_final.zkey")
writeFileSync("/tmp/payload.json",JSON.stringify({campaignId:ad.id,apiKeyId:serve.apiKeyId,interest,proof,publicSignals}))
console.log("payload written for",ad.name)

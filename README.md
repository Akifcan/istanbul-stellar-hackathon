<div align="center">

<img src="public/logo.png" alt="AdProof" width="96" height="96" />

# AdProof

### Privacy-preserving advertising network, settled on Stellar

Reach qualified audiences **without collecting a single byte of personal data.**
Users prove they match a campaign with a **zero-knowledge proof** generated on
their own device payments settle instantly on Stellar.

<br />

[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar-000000?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-FDDA24?style=for-the-badge&logoColor=black)](https://developers.stellar.org/docs/build/smart-contracts)
[![Network](https://img.shields.io/badge/Network-Testnet-purple?style=for-the-badge)](https://developers.stellar.org/docs/networks)

[![Zero-Knowledge](https://img.shields.io/badge/Zero--Knowledge-Groth16-6E56CF?style=flat-square)](https://docs.circom.io)
[![Circom](https://img.shields.io/badge/Circom-2.2-blue?style=flat-square)](https://docs.circom.io)
[![snarkjs](https://img.shields.io/badge/snarkjs-0.7-green?style=flat-square)](https://github.com/iden3/snarkjs)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Rust](https://img.shields.io/badge/Rust-Soroban%20SDK-orange?style=flat-square&logo=rust)](https://www.rust-lang.org)

<br />

<img src="public/Stellar-Logo-Final-Black-RGB.png" alt="Stellar" width="160" />

</div>

---

## What is AdProof?

Modern ad platforms make money by **harvesting your personal data** to target the
right audience. That creates privacy violations *and* security risk — and it's
led to billion-dollar fines **(Meta €1.2B, Google $1.375B, Facebook $5B)**.

But advertisers don't actually need to know **who** you are. They only need to
know **whether** you meet a targeting condition.

**AdProof flips the model:**

- The user's profile (interests + a secret) stays **on their device** it never
  touches a server.
- To see an ad, the device produces a **zero-knowledge proof** that says *"I
  belong to this campaign's audience"* revealing nothing else.
- The server verifies the proof, counts the impression once (via a nullifier),
  and pays the publisher **without ever learning the user's identity.**

> **Attribute privacy, by architecture.** The advertiser learns *that* you
> qualify, never *who* you are.

---

## Data privacy with Zero-Knowledge (ZK) proofs

This is the heart of AdProof. We use **Groth16 zk-SNARKs** (Circom + snarkjs) so
a user can prove audience membership without disclosing identity, wallet, or the
data behind the condition.

### Visual walkthrough

```
   USER DEVICE  (browser)                         ADPROOF SERVER
 ───────────────────────────                  ──────────────────────
  ┌─────────────────────────┐
  │ Profile (localStorage)  │   never sent →   (server never sees it)
  │  interests + secret     │
  └─────────────────────────┘
            │
            │  1. ask for ads that match my interests
            ├───────────────  interests  ───────────────▶
            │                                     returns matching campaigns
            │
            │  2. build a zero-knowledge proof on-device
            │     "I'm in this campaign's audience set"
            │     🔒 Groth16 (Circom + snarkjs)
            │
            │  3. send proof + public signals (NO secret, NO identity)
            ├─────  proof · [nullifier, root, campaignId]  ─────▶
            │                                     4. verify proof   ✓
            │                                        root valid?    ✓
            │                                        nullifier new? ✓
            │                                     → count impression
            │                                     → credit publisher
            ◀───────────────  verified ✓  ──────────────┤
            │
            │  5. payout settles on Stellar  💰
```

| Concept | What it does |
|---|---|
| **Commitment** `Poseidon(secret)` | A one-way fingerprint of the user can't be reversed. |
| **Merkle membership** | Proves the user belongs to an interest's audience set, *without revealing which member.* |
| **Groth16 proof** | Verifies the statement is true while leaking **zero** information about the inputs. |
| **Nullifier** `Poseidon(secret, campaignId)` | A one-time, anonymous tag so each user counts **once per campaign** no double charging, no identity. |

> 📍 The interactive version of this diagram lives on the landing page
> (`components/landing-flow.tsx`) click through it step by step.

**What the server learns:** *"Someone in this campaign's audience saw the ad, and
hadn't been counted before."*
**What it never learns:** who they are, which profile, or their secret.

---

## ⚡ Payment advantages (Stellar)

Ad revenue is tracked off-chain (per impression), and **money moves on Stellar** —
deposits, escrow, and payouts.

- **Instant payouts** earnings settle in seconds, not 30–60 day net terms.
- **Fractions of a cent fees** makes per-impression micro-payments actually
  viable.
- **No middlemen** value goes straight from advertiser to publisher.
- **Transparent & verifiable** every deposit and payout is on-chain.
- **Soroban smart contracts** campaign budgets are escrowed and released by
  audited, on-chain contracts.

**Flow:** advertiser deposits a budget into the **base (treasury) contract** →
publishers earn off-chain as ads are served → publishers **withdraw** from their
own **vault contract** straight to their wallet.

---

## 📜 Deployed contracts (Stellar Testnet)

| Component | Address / Hash |
|---|---|
| **Base contract** (treasury / pool) | [`CAVFFVCX…HO5I`](https://stellar.expert/explorer/testnet/contract/CAVFFVCXBCCCRD7EBAUPQW44LLN2HJT6BR7GHV5QONUQR6P57QO2HO5I) |
| **Vault** (per-API-key, WASM hash) | `0c22737d55004a61e5800adc6e020cdf6f0640379c210046a0f410a565dae819` |
| **Mock USDC** (Stellar Asset Contract) | [`CCOPTAK6…J437I`](https://stellar.expert/explorer/testnet/contract/CCOPTAK634TSKU5IOUJM4FMALHEC6RPMSX7ADMENALPFH6S7VGOJ437I) |
| **Admin / treasury** | [`GAGM…CM4K`](https://stellar.expert/explorer/testnet/account/GAGM4Z3LK4MAV5AWQHSNJTEFE45DTHINGM7NPQSKSW2VU5B33HS2CM4K) |

- `contracts/base` holds the pool; advertisers `deposit`, admin `payout`.
- `contracts/vault` one per API key; admin `fund`s it, the owning publisher
  `withdraw`s to their wallet.

---

## 🧱 Tech stack

| Layer | Tech |
|---|---|
| **Smart contracts** | Soroban (Rust), deployed to Stellar Testnet |
| **Zero-knowledge** | Circom 2 circuit + Groth16, proven & verified with snarkjs |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui |
| **Wallet** | Freighter (`@stellar/freighter-api`) + `@stellar/stellar-sdk` |
| **Data** | Supabase (Postgres) for the off-chain ledger |

---

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You'll need:

- A **Freighter** wallet set to **Testnet** (fund it via friendbot).
- A `.env` with Supabase + the `NEXT_PUBLIC_*` Stellar values (network, USDC SAC,
  vault WASM hash, admin address, base contract id).

### Try the demo

1. **`/`** — landing page (interactive ZK flow, earnings calculator).
2. **`/demo/trendyol`** & **`/demo/news`** — real publisher sites serving real
   ads. Open the **proof console** to watch Groth16 proofs generated live.
3. **`/dashboard`** — Publisher (API keys, earnings, withdraw) and Advertiser
   (campaigns, budgets, ZK-targeted reach) views.

---

**Reach the right audience. Collect zero data.**

<img src="public/Stellar-Logo-Final-Black-RGB.png" alt="Stellar" width="120" />

<img src="public/logo.png" alt="AdProof" width="96" height="96" />



</div>

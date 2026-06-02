AdProof — Privacy-Preserving Advertising Network on Stellar

PROBLEM
Modern ad platforms collect and process users' personal data to target the
right audience. This creates both privacy violations and data-security risk.
Advertisers don't actually need to know WHO the user is — they only need to
know WHETHER the user meets a targeting condition.

SOLUTION
AdProof lets advertisers reach qualified audiences without ever collecting
personal data. Advertisers define campaigns with targeting CONDITIONS, e.g.:
  - owns more than N XLM
  - holds a specific NFT
  - over 18 / university student (issuer-attested)
Users prove they satisfy a condition using a Zero-Knowledge Proof generated
ON THEIR OWN DEVICE. The proof reveals only that the condition holds — never
the underlying value, wallet address, balance, age, or identity.

Example: a user proves "I hold more than 1000 XLM" without disclosing their
wallet address or actual balance. The advertiser verifies eligibility; they
learn nothing personal.

HOW IT WORKS
1. Advertiser creates a campaign and funds the budget via a Soroban smart
   contract (escrow).
2. User generates a Groth16 ZK proof locally proving condition membership
   (e.g. Merkle-set membership for ">N XLM"). The proof includes a NULLIFIER
   so each eligible user counts at most once per campaign.
3. A Soroban contract verifies the proof on-chain (BLS12-381 host functions),
   checks the nullifier, and releases payment to the publisher/user.
4. Settlement, budgets, and payouts all run on Stellar — transparent and
   verifiable for advertisers, publishers, and users.

KEY POSITIONING
- We provide ATTRIBUTE privacy (no personal data leaks), not session-level
  anonymity (IP, fingerprint). Don't overclaim.
- ZK is used at the PAYMENT/eligibility step to prove a committed condition;
  personalization privacy comes architecturally from keeping the user profile
  on-device, not from ZK.

STACK
- Smart contracts: Soroban (Rust), Groth16 verification over BLS12-381
- ZK tooling: Circom + snarkjs (browser-side proof generation)
- Frontend: React + Vite (proof generated in-browser for easy demo)

MVP SCOPE (build ONE end-to-end path, fully working)
- Single on-chain claim: ">N XLM" via Merkle-set membership + nullifier
- Soroban contract verifies the proof and releases payment
Out of scope for v1: issuer-based claims (mock in slides only), off-chain ad
serving / publisher SDK, network-level anonymity.

In short: AdProof enables advertisers to reach qualified audiences without
collecting personal data, using Zero-Knowledge Proofs and Stellar-powered
payments.
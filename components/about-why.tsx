import { Lock, Zap, ShieldCheck, Coins, EyeOff, BadgeCheck } from "lucide-react"

const REASONS = [
  {
    icon: Lock,
    title: "Zero-knowledge targeting",
    text: "Users prove they match an ad's audience without revealing who they are or the data behind it. Real Groth16 proofs, generated on-device.",
  },
  {
    icon: EyeOff,
    title: "No data to leak or sell",
    text: "We never collect personal data, so there's nothing to breach, sell, or be fined over. Privacy by architecture, not policy.",
  },
  {
    icon: Zap,
    title: "Instant payouts",
    text: "Earnings settle the moment an ad is verified — no 30–60 day net terms, no intermediaries skimming the spread.",
  },
  {
    icon: Coins,
    title: "Transparent on-chain settlement",
    text: "Budgets are escrowed in Soroban smart contracts on Stellar; every deposit and payout is publicly verifiable.",
  },
  {
    icon: BadgeCheck,
    title: "Fair, verifiable counting",
    text: "A cryptographic nullifier ensures each user counts once per campaign — no fake impressions, no double charging.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance-friendly by default",
    text: "Because personal data never leaves the device, GDPR/CCPA exposure is dramatically reduced for everyone in the chain.",
  },
]

export default function AboutWhy() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand">Why it matters</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy and performance, finally on the same side.
          </h2>
          <p className="mt-3 text-muted-foreground">
            The ad industry treats your data as the product. We removed the need
            for it entirely.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r) => (
            <article key={r.title} className="rounded-2xl border bg-card p-7">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                <r.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

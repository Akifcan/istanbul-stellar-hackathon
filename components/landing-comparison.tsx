import { Check, X, Wallet, Zap, ShieldOff } from "lucide-react"

const ROWS = [
  { label: "Revenue split", traditional: "Opaque intermediary cut", adproof: "Transparent on-chain split" },
  { label: "Payout time", traditional: "Net-30 to Net-60 days", adproof: "Instant, wallet-to-wallet" },
  { label: "Data liability", traditional: "You store user data — and the risk", adproof: "No personal data collected" },
  { label: "Targeting", traditional: "Tracks & profiles users", adproof: "Zero-knowledge proofs" },
  { label: "Settlement", traditional: "Bank rails, middlemen", adproof: "Direct on Stellar" },
]

const HIGHLIGHTS = [
  { icon: Wallet, title: "Keep more of the spend", text: "Value goes straight to the publisher — no chain of intermediaries skimming the top." },
  { icon: Zap, title: "Get paid instantly", text: "Earnings settle the moment an ad is served. No 30–60 day waiting period." },
  { icon: ShieldOff, title: "No data liability", text: "You never collect personal data, so there's nothing to leak, sell, or be fined over." },
]

export default function LandingComparison() {
  return (
    <section id="why" className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand">Why AdProof</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            More earnings, none of the liability.
          </h2>
          <p className="mt-3 text-muted-foreground">
            The same ad inventory, without the data risk or the middlemen.
          </p>
        </div>

        {/* Highlights */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="rounded-2xl border bg-card p-7">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <h.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{h.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-10 overflow-hidden rounded-2xl border bg-card">
          <div className="grid grid-cols-3 border-b bg-muted/40 px-6 py-4 text-sm font-semibold">
            <span className="text-muted-foreground">Compared to traditional ad networks</span>
            <span className="text-center text-muted-foreground">Traditional</span>
            <span className="text-center text-brand">AdProof</span>
          </div>
          {ROWS.map((row) => (
            <div key={row.label} className="grid grid-cols-3 items-center border-b px-6 py-4 text-sm last:border-b-0">
              <span className="font-medium">{row.label}</span>
              <span className="flex items-center justify-center gap-2 text-center text-muted-foreground">
                <X className="size-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                <span className="hidden sm:inline">{row.traditional}</span>
              </span>
              <span className="flex items-center justify-center gap-2 text-center font-medium">
                <Check className="size-4 shrink-0 text-brand-teal" aria-hidden="true" />
                <span className="hidden sm:inline">{row.adproof}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

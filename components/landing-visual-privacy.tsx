import { Lock, Check } from "lucide-react"

const CONDITIONS = [
  { label: "Over 18", proven: true },
  { label: "Interested in technology", proven: true },
  { label: "Frequent online shopper", proven: true },
]

const HIDDEN = ["Wallet address", "Exact age", "Account balance", "Identity"]

export default function LandingVisualPrivacy() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-xl shadow-brand/5">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Lock className="size-4" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium">Zero-knowledge proof</span>
      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Proven
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {CONDITIONS.map((c) => (
          <li key={c.label} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
            <span>{c.label}</span>
            <span className="inline-flex items-center gap-1 text-brand-teal">
              <Check className="size-3.5" aria-hidden="true" />
              <span className="text-xs font-medium">verified</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Never revealed
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {HIDDEN.map((h) => (
          <span key={h} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground line-through">
            {h}
          </span>
        ))}
      </div>
    </div>
  )
}

import { Smartphone, Lock, Ban, KeyRound } from "lucide-react"

const POINTS = [
  {
    icon: Smartphone,
    title: "Your profile lives on your device",
    text: "Interests and identity are stored locally — never uploaded to our servers.",
  },
  {
    icon: KeyRound,
    title: "You hold the key",
    text: "Only you can generate proofs from your data. No one can use it without you.",
  },
  {
    icon: Ban,
    title: "Nothing to sell or leak",
    text: "We never collect your data, so it can't be sold, breached, or subpoenaed.",
  },
]

export default function LandingOwnData() {
  return (
    <section id="own-data" className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand">Your data, your device</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            You own your data — not us, not advertisers.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Today, ad networks make money by harvesting your data. AdProof flips
            it: your data stays with you, and you prove eligibility without ever
            handing it over.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {POINTS.map((p) => (
            <article key={p.title} className="rounded-2xl border bg-card p-7">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <p.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-3 rounded-xl border border-brand-teal/20 bg-brand-teal/5 px-5 py-4 text-center">
          <Lock className="size-4 shrink-0 text-brand-teal" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            The advertiser learns <span className="font-medium text-foreground">that</span> you
            qualify — never <span className="font-medium text-foreground">who</span> you are.
          </p>
        </div>
      </div>
    </section>
  )
}

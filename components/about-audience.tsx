import { Store, Megaphone, UserRound } from "lucide-react"

const AUDIENCE = [
  {
    icon: Store,
    who: "Publishers",
    title: "Sites & apps that show ads",
    text: "News sites, blogs, shops, games — monetize your traffic and get paid the instant an ad is seen, without storing a single visitor's data.",
  },
  {
    icon: Megaphone,
    who: "Advertisers",
    title: "Brands reaching an audience",
    text: "Target qualified users by condition (interests, age range, activity) without tracking or profiling anyone. Pay only for verified impressions.",
  },
  {
    icon: UserRound,
    who: "People",
    title: "Everyday internet users",
    text: "Keep your profile on your device. Prove you match an ad's audience with a zero-knowledge proof — your identity is never revealed or sold.",
  },
]

export default function AboutAudience() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand">Who it&apos;s for</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            One network, three winners.
          </h2>
          <p className="mt-3 text-muted-foreground">
            AdProof aligns everyone&apos;s incentives — without the data broker in
            the middle.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {AUDIENCE.map((a) => (
            <article key={a.who} className="rounded-2xl border bg-card p-7">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <a.icon className="size-6" aria-hidden="true" />
              </span>
              <span className="mt-5 block text-xs font-semibold uppercase tracking-wide text-brand">
                {a.who}
              </span>
              <h3 className="mt-1 text-lg font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

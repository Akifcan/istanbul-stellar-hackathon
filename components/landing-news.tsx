import { ArrowUpRight } from "lucide-react"

const NEWS = [
  {
    source: "iapp.org",
    amount: "€1.2B",
    title: "Meta fined a record €1.2 billion under GDPR over data transfers",
    href: "https://iapp.org/news/a/meta-fined-gdpr-record-1-2-billion-euros-in-data-transfer-case",
  },
  {
    source: "Texas Attorney General",
    amount: "$1.375B",
    title: "Texas secures historic $1.375 billion settlement with Google over data practices",
    href: "https://www.texasattorneygeneral.gov/news/releases/attorney-general-ken-paxton-finalizes-historic-settlement-google-and-secures-1375-billion-big-tech",
  },
  {
    source: "FTC",
    amount: "$5B",
    title: "FTC imposes $5 billion penalty and new privacy restrictions on Facebook",
    href: "https://www.ftc.gov/news-events/news/press-releases/2019/07/ftc-imposes-5-billion-penalty-sweeping-new-privacy-restrictions-facebook",
  },
]

export default function LandingNews() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-destructive">The cost of collecting data</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Data is a liability, not an asset.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Regulators are handing out billion-dollar fines. AdProof removes the
            risk by never collecting personal data in the first place.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {NEWS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col rounded-2xl border bg-card p-7 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl font-semibold tracking-tight text-destructive tabular-nums">
                  {item.amount}
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
              <p className="mt-5 font-medium text-balance">{item.title}</p>
              <span className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {item.source}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

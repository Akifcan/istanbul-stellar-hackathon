import Image from "next/image"

const CASES = [
  {
    title: "News & media sites",
    text: "High-traffic publishers replace tracking-based ad networks with privacy-preserving demand — and keep more of the revenue.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "E-commerce & marketplaces",
    text: "Show relevant promotions among products without profiling shoppers, while staying clear of data-privacy liability.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Apps & rewarded ads",
    text: "Offer opt-in rewarded ads where users prove eligibility on-device — great for games and free-tier apps.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Privacy-sensitive sectors",
    text: "Health, finance, and education platforms can monetize without ever touching regulated personal data.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
  },
]

export default function AboutUsecases() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand">Where it fits</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for any site that runs ads.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Anywhere personal data is a liability, AdProof is a better fit.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {CASES.map((c) => (
            <article key={c.title} className="overflow-hidden rounded-2xl border bg-card">
              <div className="relative aspect-[16/9] w-full bg-muted">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  unoptimized
                  sizes="(max-width:640px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

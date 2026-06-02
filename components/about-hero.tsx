import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function AboutHero() {
  return (
    <section className="border-b">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Built on
            <Image src="/Stellar-Logo-Final-Black-RGB.png" alt="Stellar" width={60} height={15} />
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
            Advertising, rebuilt for a privacy-first world.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            AdProof connects advertisers, publishers, and people without
            collecting personal data. Targeting is done with zero-knowledge
            proofs; payments settle instantly on Stellar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-medium text-brand-foreground hover:opacity-90"
            >
              Get started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/demo/trendyol"
              className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-medium hover:bg-accent"
            >
              See a live demo
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
          <Image
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80"
            alt="Modern team working"
            fill
            unoptimized
            sizes="(max-width:1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Eye, Coins } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[40rem] rounded-full bg-brand/10 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        {/* Left: copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Built on
            <Image
              src="/Stellar-Logo-Final-Black-RGB.png"
              alt="Stellar"
              width={60}
              height={15}
              className="translate-y-px"
            />
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Reach the right audience, collect zero data.
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            AdProof targets users with zero-knowledge proofs. They prove they
            match a condition — never revealing who they are. Payments settle on
            Stellar.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-medium text-brand-foreground hover:opacity-90"
            >
              Launch app
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="#demos"
              className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-medium hover:bg-accent"
            >
              See live demos
            </Link>
          </div>
        </div>

        {/* Right: product mock */}
        <div className="relative">
          <Link
            href="/demo/trendyol"
            aria-label="View the live e-commerce demo"
            className="group block rounded-2xl border bg-card p-5 shadow-xl shadow-brand/5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Live ad
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-teal/15 px-2 py-0.5 text-[11px] font-medium text-brand-teal">
                <ShieldCheck className="size-3" aria-hidden="true" /> Proof
                verified
              </span>
            </div>
            <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
                alt="Summer sale shopping"
                fill
                unoptimized
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 font-semibold">Summer Sale — 50% off</p>
            <p className="text-sm text-muted-foreground">
              Shown to a qualified user. No identity revealed.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
              View live demo
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>

          <div className="absolute -bottom-13 -left-5 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Eye className="size-4" aria-hidden="true" />
            </span>
            <span className="text-xs leading-tight">
              <span className="block font-semibold">0 data points</span>
              <span className="text-muted-foreground">collected</span>
            </span>
          </div>

          <div className="absolute -right-4 -top-5 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
              <Coins className="size-4" aria-hidden="true" />
            </span>
            <span className="text-xs leading-tight">
              <span className="block font-semibold tabular-nums">
                +0.014 USDC
              </span>
              <span className="text-muted-foreground">publisher earned</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

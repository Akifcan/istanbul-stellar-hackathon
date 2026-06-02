import Link from "next/link";
import { ShoppingBag, Newspaper, ArrowUpRight } from "lucide-react";

const DEMOS = [
  {
    icon: ShoppingBag,
    title: "E-commerce storefront",
    description:
      "See AdProof ads served inside a shopping site, placed among products.",
    href: "/demo/trendyol",
  },
  {
    icon: Newspaper,
    title: "Markets news site",
    description:
      "AdProof banner and in-feed ads embedded across a news homepage.",
    href: "/demo/news",
  },
] as const;

export default function LandingDemos() {
  return (
    <section id="demos" className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Live demos
          </h2>
          <p className="mt-3 text-muted-foreground">
            Real publisher sites serving real campaigns — every impression
            updates the dashboard.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          {DEMOS.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group rounded-2xl border bg-card p-7 transition-colors hover:border-brand"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <demo.icon className="size-6" aria-hidden="true" />
                </span>
                <ArrowUpRight
                  className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{demo.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {demo.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

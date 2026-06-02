"use client"

import { useState } from "react"
import { Eye, Coins, Zap, ShieldCheck } from "lucide-react"

import { Slider } from "@/components/ui/slider"
import { PRICE_PER_IMPRESSION_USDC, PUBLISHER_SHARE } from "@/lib/serve"

const PER_IMPRESSION =
  Math.round(PRICE_PER_IMPRESSION_USDC * PUBLISHER_SHARE * 10000) / 10000

const MIN = 10_000
const MAX = 5_000_000
const STEP = 10_000
const DEFAULT = 500_000

function fmt(n: number) {
  return n.toLocaleString("en-US")
}

export default function AboutCalculator() {
  const [impressions, setImpressions] = useState(DEFAULT)

  const monthly = impressions * PER_IMPRESSION
  const yearly = monthly * 12

  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand">Earnings calculator</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            See what your traffic is worth.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Move the slider to estimate your monthly payout — paid instantly, with
            zero personal data collected.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border bg-card p-6 shadow-sm sm:p-10">
          {/* Slider */}
          <div className="flex items-baseline justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="size-4" aria-hidden="true" />
              Monthly ad views
            </span>
            <span className="text-2xl font-semibold tabular-nums">{fmt(impressions)}</span>
          </div>
          <Slider
            className="mt-4"
            min={MIN}
            max={MAX}
            step={STEP}
            value={[impressions]}
            onValueChange={(v) => setImpressions(v[0])}
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{fmt(MIN)}</span>
            <span>{fmt(MAX)}</span>
          </div>

          {/* Results */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-brand/5 p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Coins className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
                {monthly.toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
                <span className="text-base font-normal text-muted-foreground">USDC / mo</span>
              </p>
              <p className="text-sm text-muted-foreground">Estimated monthly earnings</p>
            </div>
            <div className="rounded-xl border bg-brand-teal/5 p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                <Zap className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
                {yearly.toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
                <span className="text-base font-normal text-muted-foreground">USDC / yr</span>
              </p>
              <p className="text-sm text-muted-foreground">Projected annual earnings</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-center sm:gap-6">
            <span className="flex items-center gap-2">
              <Zap className="size-4 text-brand-teal" aria-hidden="true" />
              Paid the moment an ad is seen
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand-teal" aria-hidden="true" />
              No personal data collected
            </span>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Estimates based on {PER_IMPRESSION} USDC per verified impression. Actual
            rates vary by campaign demand.
          </p>
        </div>
      </div>
    </section>
  )
}

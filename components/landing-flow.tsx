"use client"

import { useState } from "react"
import {
  Smartphone,
  Server,
  ArrowRight,
  ArrowLeft,
  Lock,
  Coins,
  RotateCcw,
} from "lucide-react"

import { cn } from "@/lib/utils"

const STEPS = [
  {
    title: "Profile stays on the device",
    text: "The user's interests and a private secret live in the browser (localStorage). This never touches our servers.",
    chip: "localStorage",
  },
  {
    title: "Fetch matching ads",
    text: "The browser tells the server its interests (e.g. technology, gaming). The server returns campaigns targeting those interests.",
    chip: "interests →",
  },
  {
    title: "Generate a proof on-device",
    text: "For each ad, the browser builds a zero-knowledge proof: “I belong to this ad's target group” — without revealing identity or the secret.",
    chip: "Groth16",
  },
  {
    title: "Attach a one-time nullifier",
    text: "A single-use tag derived from the secret ensures the same user counts once per campaign. No identity can be recovered from it.",
    chip: "nullifier",
  },
  {
    title: "Server verifies the proof",
    text: "The server checks the proof is valid and the nullifier is new. If so, the impression counts — it never learns who the user is.",
    chip: "verify ✓",
  },
  {
    title: "Settle the payment",
    text: "The advertiser pays a small amount, the publisher earns. Funds move on Stellar.",
    chip: "Stellar",
  },
] as const

function Device({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
        active ? "border-brand bg-brand/5" : "border-border bg-card"
      )}
    >
      <Smartphone className={cn("size-7", active ? "text-brand" : "text-muted-foreground")} aria-hidden="true" />
      <span className="text-xs font-semibold">User device</span>
      <span className="text-[10px] text-muted-foreground">interests + secret</span>
    </div>
  )
}

function ServerBox({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
        active ? "border-brand-teal bg-brand-teal/5" : "border-border bg-card"
      )}
    >
      <Server className={cn("size-7", active ? "text-brand-teal" : "text-muted-foreground")} aria-hidden="true" />
      <span className="text-xs font-semibold">AdProof server</span>
      <span className="text-[10px] text-muted-foreground">verifies proofs</span>
    </div>
  )
}

// What travels between device and server for the current step.
function Flow({ step }: { step: number }) {
  // step is 0-indexed
  if (step === 1) {
    return <Packet dir="right" label="interests" icon={ArrowRight} tone="brand" />
  }
  if (step === 2 || step === 3) {
    return (
      <div className="flex flex-col items-center gap-2 text-brand">
        <Lock className="size-6 animate-pulse" aria-hidden="true" />
        <span className="text-[10px] font-medium">building proof…</span>
      </div>
    )
  }
  if (step === 4) {
    return <Packet dir="right" label="proof + nullifier" icon={ArrowRight} tone="teal" />
  }
  if (step === 5) {
    return (
      <div className="flex flex-col items-center gap-2 text-brand-teal">
        <Coins className="size-6" aria-hidden="true" />
        <span className="text-[10px] font-medium">payout</span>
      </div>
    )
  }
  return <span className="text-[10px] text-muted-foreground">idle</span>
}

function Packet({
  dir,
  label,
  icon: Icon,
  tone,
}: {
  dir: "right" | "left"
  label: string
  icon: typeof ArrowRight
  tone: "brand" | "teal"
}) {
  return (
    <div className={cn("flex flex-col items-center gap-1", tone === "brand" ? "text-brand" : "text-brand-teal")}>
      <span className="rounded-full border bg-card px-2 py-0.5 text-[10px] font-medium">{label}</span>
      <Icon className={cn("size-6", dir === "left" && "rotate-180")} aria-hidden="true" />
    </div>
  )
}

export default function LandingFlow() {
  const [step, setStep] = useState(0)
  const isFirst = step === 0
  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  const deviceActive = step <= 3
  const serverActive = step >= 4

  return (
    <section id="how" className="border-b bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand">Step by step</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            How a private ad gets served
          </h2>
          <p className="mt-3 text-muted-foreground">
            Click through the flow — see exactly what leaves the device and what
            never does.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border bg-card shadow-sm">
          {/* Visual canvas */}
          <div className="flex items-stretch gap-3 border-b bg-muted/30 p-6 sm:gap-6 sm:p-10">
            <Device active={deviceActive} />
            <div className="flex w-24 shrink-0 items-center justify-center sm:w-32">
              <Flow step={step} />
            </div>
            <ServerBox active={serverActive} />
          </div>

          {/* Step copy */}
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
                {step + 1}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{current.title}</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {current.chip}
                  </span>
                </div>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">{current.text}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
              {isLast ? (
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium hover:bg-accent"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Replay
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-brand-foreground hover:opacity-90"
                >
                  Next
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 border-t px-6 py-4">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              disabled={isFirst}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              aria-label="Previous step"
            >
              <ArrowLeft className="size-4" />
            </button>
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === step ? "w-6 bg-brand" : "w-2 bg-border hover:bg-muted-foreground/40"
                )}
              />
            ))}
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}
              disabled={isLast}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              aria-label="Next step"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

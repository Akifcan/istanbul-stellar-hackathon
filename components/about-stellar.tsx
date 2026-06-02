import Image from "next/image"
import { Zap, ShieldCheck, Globe } from "lucide-react"

const POINTS = [
  {
    icon: Zap,
    title: "Seconds, not days",
    text: "Payouts settle almost instantly — no banking rails, no waiting periods.",
  },
  {
    icon: Globe,
    title: "Fractions of a cent",
    text: "Stellar's low fees make per-impression micro-payments actually viable.",
  },
  {
    icon: ShieldCheck,
    title: "Soroban smart contracts",
    text: "Budgets are escrowed and released by audited, on-chain contracts.",
  },
]

export default function AboutStellar() {
  return (
    <section className="border-b bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#FDDA24]">
            Settlement layer
          </span>
          <Image
            src="/Stellar-Logo-Final-White.png"
            alt="Stellar"
            width={240}
            height={60}
            className="h-12 w-auto"
          />
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Every payment runs on Stellar.
          </h2>
          <p className="max-w-xl text-white/70 text-balance">
            AdProof&apos;s treasury, campaign budgets, and publisher payouts all
            move on the Stellar network — fast, cheap, and fully transparent.
          </p>
        </div>

        <div className="mt-14 grid gap-0 overflow-hidden rounded-2xl border-2 border-[#FDDA24] md:grid-cols-3">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="border-[#FDDA24] p-7 not-last:border-b-2 md:not-last:border-b-0 md:not-last:border-r-2"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#FDDA24] text-black">
                <p.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-white/60">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

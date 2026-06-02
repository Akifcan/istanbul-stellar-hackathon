import Image from "next/image"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

const TXNS = [
  { kind: "Campaign deposit", amount: "+1,200.00", out: false },
  { kind: "Publisher payout", amount: "-84.00", out: true },
  { kind: "Campaign deposit", amount: "+500.00", out: false },
]

export default function LandingVisualStellar() {
  return (
    <div className="overflow-hidden rounded-2xl border shadow-xl shadow-brand/5">
      <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "#FDDA24" }}>
        <span className="text-sm font-semibold text-black">AdProof Pool</span>
        <Image src="/Stellar-Logo-Final-Black-RGB.png" alt="Stellar" width={64} height={16} />
      </div>
      <div className="bg-card p-5">
        <p className="text-xs text-muted-foreground">Pool balance</p>
        <p className="text-2xl font-semibold tabular-nums">12,480.00 USDC</p>

        <ul className="mt-4 flex flex-col divide-y">
          {TXNS.map((t, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <span className="flex items-center gap-3">
                <span className={`flex size-8 items-center justify-center rounded-lg ${t.out ? "bg-brand/10 text-brand" : "bg-brand-teal/10 text-brand-teal"}`}>
                  {t.out ? <ArrowUpRight className="size-4" /> : <ArrowDownLeft className="size-4" />}
                </span>
                <span className="text-sm">{t.kind}</span>
              </span>
              <span className="text-sm font-medium tabular-nums">{t.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

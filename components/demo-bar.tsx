"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Terminal, X, User, Trash2, Coins, ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  PROFILES,
  setSelectedProfileId,
  useSelectedProfile,
} from "@/lib/profiles"
import { clearDemoLog, demoLog, useDemoLog, type LogKind } from "@/lib/demo-console"
import { useEarnings } from "@/lib/demo-earnings"

const KIND_COLOR: Record<LogKind, string> = {
  info: "text-zinc-400",
  proof: "text-violet-300",
  success: "text-emerald-300",
  chain: "text-[#FDDA24]",
  error: "text-red-300",
}

export default function DemoBar() {
  const profile = useSelectedProfile()
  const log = useDemoLog()
  const earnings = useEarnings()
  const [open, setOpen] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the newest line.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log])

  const selectProfile = (id: string) => {
    if (id === profile.id) return
    const p = PROFILES.find((x) => x.id === id)
    setSelectedProfileId(id)
    if (p) {
      demoLog("info", `Switched profile → ${p.name} (${p.tagline})`)
      demoLog("info", `On-device interests: [${p.interests.join(", ")}]`)
    }
  }

  return (
    <>
      {/* Top demo bar */}
      <div className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
          <Link href="/" className="flex items-center gap-2" aria-label="AdProof home">
            <Image src="/logo.png" alt="AdProof" width={26} height={26} priority />
            <span className="text-sm font-semibold tracking-tight">AdProof</span>
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground sm:flex">
            Built on
            <Image src="/Stellar-Logo-Final-Black-RGB.png" alt="Stellar" width={48} height={12} />
          </span>

          {/* Live session earnings */}
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-brand-teal/10 px-2.5 py-1 text-xs font-medium text-brand-teal">
            <Coins className="size-3.5" aria-hidden="true" />
            <span className="tabular-nums">{earnings.total.toFixed(4)} USDC</span>
            <span className="text-brand-teal/60">· {earnings.count} ads</span>
          </span>

          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="size-3.5" aria-hidden="true" />
            Viewing as
          </span>

          {/* Profile switcher */}
          <div className="flex items-center gap-1 overflow-x-auto rounded-full border bg-muted/50 p-1">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectProfile(p.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  p.id === profile.id
                    ? "bg-brand text-brand-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p.name}
                <span className="ml-1 hidden font-normal opacity-70 sm:inline">
                  · {p.tagline}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium hover:bg-accent"
            aria-label="Toggle proof console"
          >
            <Terminal className="size-3.5" aria-hidden="true" />
            Console
            {log.length > 0 && (
              <span className="rounded-full bg-brand px-1.5 text-[10px] text-brand-foreground">
                {log.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Console panel */}
      {open && (
        <aside className="fixed bottom-4 right-4 z-50 flex h-[26rem] w-[min(94vw,520px)] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f1117] text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <span className="flex items-center gap-2 font-mono text-xs font-semibold">
              <Terminal className="size-3.5 text-[#FDDA24]" aria-hidden="true" />
              AdProof · zero-knowledge proof console
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearDemoLog}
                className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Clear console"
              >
                <Trash2 className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Close console"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Earnings summary */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[11px]">
            <span className="text-white/50">session earnings</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-300">
              <Coins className="size-3.5" aria-hidden="true" />
              {earnings.total.toFixed(4)} USDC
              <span className="font-normal text-white/40">· {earnings.count} proofs</span>
            </span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed">
            {log.length === 0 ? (
              <p className="text-white/30">
                Waiting for activity… switch a profile or scroll to load ads.
              </p>
            ) : (
              log.map((e) => (
                <div key={e.id}>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-white/30">{e.time}</span>
                    {e.detail ? (
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                        className={cn("flex items-start gap-1 text-left", KIND_COLOR[e.kind])}
                      >
                        {expanded === e.id ? (
                          <ChevronDown className="mt-0.5 size-3 shrink-0" />
                        ) : (
                          <ChevronRight className="mt-0.5 size-3 shrink-0" />
                        )}
                        {e.text}
                      </button>
                    ) : (
                      <span className={KIND_COLOR[e.kind]}>{e.text}</span>
                    )}
                  </div>
                  {e.detail && expanded === e.id && (
                    <pre className="mt-1 max-h-48 overflow-auto rounded bg-black/40 p-2 text-[10px] text-white/70">
                      {e.detail}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>
      )}
    </>
  )
}

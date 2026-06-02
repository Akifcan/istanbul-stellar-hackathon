"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { X, Play } from "lucide-react"

import { generateEligibilityProof } from "@/lib/prove"
import { demoLog } from "@/lib/demo-console"
import { addImpressionEarning } from "@/lib/demo-earnings"
import { interestLabel } from "@/lib/targeting"
import { PRICE_PER_IMPRESSION_USDC, PUBLISHER_SHARE } from "@/lib/serve"

const PUBLISHER_REVENUE =
  Math.round(PRICE_PER_IMPRESSION_USDC * PUBLISHER_SHARE * 10000) / 10000

type ServedAd = {
  id: string
  name: string
  description: string
  imageUrl: string
  format: string
  interests: string[]
}

export default function AdproofAd({
  ad,
  apiKeyId,
  profileSecret,
  profileInterests,
  variant = "card",
  accent = "#f27a1a",
  cta = "İncele",
}: {
  ad: ServedAd
  apiKeyId: string | null
  profileSecret: string
  profileInterests: string[]
  variant?: "card" | "banner"
  accent?: string
  cta?: string
}) {
  const fired = useRef("")
  const isPopup = ad.format === "popup"
  const isRewarded = ad.format === "rewarded"
  const [popupOpen, setPopupOpen] = useState(false)

  // Interstitial popups appear as a full-screen overlay shortly after load.
  useEffect(() => {
    if (!isPopup) return
    const t = setTimeout(() => setPopupOpen(true), 1500)
    return () => clearTimeout(t)
  }, [isPopup, ad.id])

  useEffect(() => {
    // Re-run when the profile (secret) changes — a new viewer, a new proof.
    const token = `${ad.id}:${profileSecret}`
    if (fired.current === token) return
    fired.current = token

    let cancelled = false
    ;(async () => {
      try {
        demoLog("info", `▶ Ad shown: "${ad.name}" [${ad.format}]`)
        demoLog("info", `  matching on-device interest against [${ad.interests.join(", ")}]`)

        const t0 = performance.now()
        const result = await generateEligibilityProof(
          profileSecret,
          profileInterests,
          ad.interests,
          ad.id
        )
        if (!result || cancelled) {
          if (!cancelled) demoLog("error", `  no matching interest — ad skipped`)
          return
        }
        const genMs = Math.round(performance.now() - t0)

        const [nullifier, root, campaignField] = result.publicSignals
        // The generated Groth16 proof — shown for the demo.
        const detail = JSON.stringify(
          { proof: result.proof, publicSignals: result.publicSignals },
          null,
          2
        )
        demoLog(
          "proof",
          `  🔒 Groth16 proof generated in ${genMs}ms · click to view full proof`,
          detail
        )
        demoLog("proof", `     proves: interest "${interestLabel(result.interest)}" ∈ campaign set`)
        demoLog("proof", `     public: root=${root.slice(0, 12)}…  campaign=${campaignField.slice(0, 10)}…`)
        demoLog("proof", `     nullifier=${nullifier.slice(0, 18)}…  (identity stays on device)`)

        const res = await fetch("/api/ads/impression", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: ad.id,
            apiKeyId,
            interest: result.interest,
            proof: result.proof,
            publicSignals: result.publicSignals,
          }),
          keepalive: true,
        })
        const data = await res.json().catch(() => ({}))
        if (cancelled) return

        if (!res.ok) {
          demoLog("error", `  ✗ Server rejected proof for "${ad.name}" (${data.error ?? res.status})`)
        } else if (data.counted) {
          // Billed only when the server actually counts this unique impression.
          const earned = Number(data.earned) || PUBLISHER_REVENUE
          addImpressionEarning(earned)
          demoLog(
            "chain",
            `  💰 Impression billed: advertiser −${PRICE_PER_IMPRESSION_USDC} → publisher +${earned} USDC`
          )
          demoLog("success", `  ✓ Verified on server · ledger updated`)
        } else {
          demoLog(
            "info",
            `  • Already counted this campaign for this user — no double charge`
          )
        }
      } catch {
        if (!cancelled) demoLog("error", `  Could not prove eligibility for "${ad.name}"`)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [ad, apiKeyId, profileSecret, profileInterests])

  const label = (
    <span className="absolute left-2 top-2 z-10 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
      Ad · AdProof · {ad.format}
    </span>
  )

  // POPUP / interstitial → full-screen overlay
  if (isPopup) {
    if (!popupOpen) return null
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
        <div
          className="relative w-full max-w-sm overflow-hidden rounded-xl border-2 bg-white shadow-2xl"
          style={{ borderColor: accent }}
        >
          {label}
          <button
            type="button"
            onClick={() => setPopupOpen(false)}
            aria-label="Close ad"
            className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75"
          >
            <X className="size-4" />
          </button>
          <div className="relative aspect-video w-full bg-gray-100">
            {ad.imageUrl && (
              <Image src={ad.imageUrl} alt="" fill unoptimized sizes="384px" className="object-cover" />
            )}
          </div>
          <div className="p-5">
            <p className="text-lg font-bold text-gray-900">{ad.name}</p>
            <p className="mt-1 text-sm text-gray-500">{ad.description}</p>
            <button
              type="button"
              onClick={() => setPopupOpen(false)}
              className="mt-4 w-full rounded-md py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: accent }}
            >
              {cta}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "banner") {
    return (
      <div
        className="relative flex items-stretch overflow-hidden rounded-lg border bg-white shadow-sm"
        style={{ borderColor: `${accent}66` }}
      >
        {label}
        <div className="relative w-40 shrink-0 bg-gray-100 sm:w-56">
          {ad.imageUrl && (
            <Image src={ad.imageUrl} alt="" fill unoptimized sizes="224px" className="object-cover" />
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1 p-4">
          <p className="text-sm font-semibold text-gray-900">{ad.name}</p>
          <p className="line-clamp-2 text-xs text-gray-500">{ad.description}</p>
          <span
            className="mt-2 w-fit rounded-md px-3 py-1.5 text-xs font-medium text-white"
            style={{ backgroundColor: accent }}
          >
            {cta}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg border bg-white shadow-sm"
      style={{ borderColor: `${accent}66` }}
    >
      {label}
      <div className="relative aspect-square w-full bg-gray-100">
        {ad.imageUrl && (
          <Image src={ad.imageUrl} alt="" fill unoptimized sizes="220px" className="object-cover" />
        )}
        {isRewarded && (
          <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/45 text-sm font-semibold text-white">
            <Play className="size-4 fill-current" aria-hidden="true" />
            Watch to earn
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="line-clamp-1 text-sm font-semibold text-gray-900">{ad.name}</p>
        <p className="line-clamp-2 text-xs text-gray-500">{ad.description}</p>
        <span
          className="mt-1 w-fit rounded-md px-3 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: accent }}
        >
          {cta}
        </span>
      </div>
    </div>
  )
}

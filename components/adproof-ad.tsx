"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

import { generateEligibilityProof } from "@/lib/prove"
import { demoLog } from "@/lib/demo-console"
import { interestLabel } from "@/lib/targeting"

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

  useEffect(() => {
    // Re-run when the profile (secret) changes — a new viewer, a new proof.
    const token = `${ad.id}:${profileSecret}`
    if (fired.current === token) return
    fired.current = token

    let cancelled = false
    ;(async () => {
      try {
        demoLog("info", `Ad "${ad.name}" → generating eligibility proof…`)
        const result = await generateEligibilityProof(
          profileSecret,
          profileInterests,
          ad.interests,
          ad.id
        )
        if (!result || cancelled) return

        const nullifier = result.publicSignals[0]
        demoLog(
          "proof",
          `ZK proof ready · interest=${interestLabel(result.interest)} · nullifier=${nullifier.slice(0, 10)}…`
        )

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
          demoLog("error", `Verification failed for "${ad.name}"`)
        } else if (data.counted) {
          demoLog(
            "success",
            `Proof verified ✓ "${ad.name}" — publisher +${data.earned} USDC`
          )
        } else {
          demoLog("chain", `Proof verified ✓ "${ad.name}" — ${data.reason}`)
        }
      } catch {
        if (!cancelled) demoLog("error", `Could not prove eligibility for "${ad.name}"`)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [ad, apiKeyId, profileSecret, profileInterests])

  const label = (
    <span className="absolute left-2 top-2 z-10 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
      Ad · AdProof
    </span>
  )

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

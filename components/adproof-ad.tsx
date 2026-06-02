"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

type ServedAd = {
  id: string
  name: string
  description: string
  imageUrl: string
  format: string
}

function reportImpression(campaignId: string, apiKeyId: string | null) {
  fetch("/api/ads/impression", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId, apiKeyId }),
    keepalive: true,
  }).catch(() => {})
}

export default function AdproofAd({
  ad,
  apiKeyId,
  variant = "card",
  accent = "#f27a1a",
  cta = "İncele",
}: {
  ad: ServedAd
  apiKeyId: string | null
  variant?: "card" | "banner"
  accent?: string
  cta?: string
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    reportImpression(ad.id, apiKeyId)
  }, [ad.id, apiKeyId])

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

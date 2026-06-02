"use client"

import { useMemo } from "react"
import Image from "next/image"
import useSWR from "swr"
import { Search, Heart, ShoppingCart, User } from "lucide-react"

import { fetcher } from "@/lib/fetcher"
import AdproofAd from "@/components/adproof-ad"

const ORANGE = "#f27a1a"

const CATEGORIES = [
  "Kadın", "Erkek", "Anne & Çocuk", "Ev & Yaşam", "Süpermarket",
  "Kozmetik", "Ayakkabı & Çanta", "Elektronik", "Spor & Outdoor",
]

const PRODUCTS = [
  { name: "Kablosuz Kulaklık", price: "1.299", brand: "SoundMax" },
  { name: "Pamuklu Oversize Tişört", price: "249", brand: "Basics" },
  { name: "Akıllı Saat Series 7", price: "3.499", brand: "TechWear" },
  { name: "Spor Ayakkabı", price: "899", brand: "RunFast" },
  { name: "Kahve Makinesi", price: "2.150", brand: "BrewHome" },
  { name: "Deri Cüzdan", price: "459", brand: "UrbanLeather" },
  { name: "Yoga Matı", price: "329", brand: "FlexFit" },
  { name: "Bluetooth Hoparlör", price: "799", brand: "SoundMax" },
  { name: "Güneş Gözlüğü", price: "549", brand: "SunStyle" },
  { name: "Sırt Çantası", price: "689", brand: "TrekGear" },
  { name: "Cilt Bakım Seti", price: "1.099", brand: "GlowLab" },
  { name: "Masaüstü Lamba", price: "379", brand: "LumenHome" },
  { name: "Mekanik Klavye", price: "1.749", brand: "KeyPro" },
  { name: "Termos Matara", price: "289", brand: "AquaKeep" },
  { name: "Koşu Tayt", price: "399", brand: "FlexFit" },
  { name: "El Blenderı", price: "959", brand: "BrewHome" },
]

type ServeResponse = {
  apiKeyId: string | null
  ads: {
    id: string
    name: string
    description: string
    imageUrl: string
    format: string
  }[]
}

export default function TrendyolDemo() {
  const { data } = useSWR<ServeResponse>("/api/ads/serve?count=5", fetcher, {
    revalidateOnFocus: false,
  })

  const ads = useMemo(() => data?.ads ?? [], [data])
  const apiKeyId = data?.apiKeyId ?? null
  const bannerAd = ads[0]

  // Insert remaining ads into pseudo-random grid positions, derived
  // deterministically from each ad's id (pure — stable across re-renders).
  const grid = useMemo(() => {
    const result: (
      | ({ type: "product" } & (typeof PRODUCTS)[number])
      | { type: "ad"; adIndex: number }
    )[] = PRODUCTS.map((p) => ({ type: "product" as const, ...p }))

    const gridAds = ads.slice(1)
    gridAds.forEach((ad, i) => {
      const hash = ad.id
        .split("")
        .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7)
      const pos = hash % (result.length + 1)
      result.splice(pos, 0, { type: "ad", adIndex: i + 1 })
    })
    return result
  }, [ads])

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Top bar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Image
            src="/trendyol-logo.svg"
            alt="Trendyol"
            width={130}
            height={30}
            className="shrink-0"
            priority
          />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün, kategori veya marka ara"
              className="w-full rounded-md border bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#f27a1a]"
            />
          </div>
          <nav className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1"><User className="size-4" /> Hesabım</span>
            <span className="flex items-center gap-1"><Heart className="size-4" /> Favorilerim</span>
            <span className="flex items-center gap-1"><ShoppingCart className="size-4" /> Sepetim</span>
          </nav>
        </div>
        {/* Category nav */}
        <div className="border-t">
          <div className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-4 py-2.5 text-sm font-medium text-gray-700">
            {CATEGORIES.map((c) => (
              <span key={c} className="whitespace-nowrap hover:text-[#f27a1a]">{c}</span>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Hero banner ad */}
        {bannerAd && (
          <div className="mb-6">
            <AdproofAd ad={bannerAd} apiKeyId={apiKeyId} variant="banner" />
          </div>
        )}

        <h1 className="mb-4 text-lg font-semibold text-gray-800">Sana Özel Ürünler</h1>

        {/* Product + ad grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {grid.map((item, idx) =>
            item.type === "ad" ? (
              <AdproofAd
                key={`ad-${idx}`}
                ad={ads[item.adIndex]}
                apiKeyId={apiKeyId}
                variant="card"
              />
            ) : (
              <article
                key={`p-${idx}`}
                className="overflow-hidden rounded-lg border bg-white shadow-sm"
              >
                <div className="relative aspect-square w-full bg-gray-100">
                  <Image
                    src={`https://picsum.photos/seed/ty${idx}/300/300`}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <span className="text-xs font-semibold text-gray-900">{item.brand}</span>
                  <span className="line-clamp-1 text-xs text-gray-500">{item.name}</span>
                  <span className="mt-1 text-sm font-bold" style={{ color: ORANGE }}>
                    {item.price} TL
                  </span>
                </div>
              </article>
            )
          )}
        </div>
      </main>
    </div>
  )
}

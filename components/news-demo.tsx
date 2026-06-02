"use client"

import { useMemo } from "react"
import Image from "next/image"
import useSWR from "swr"
import { Search, Bell, Menu } from "lucide-react"

import { fetcher } from "@/lib/fetcher"
import AdproofAd from "@/components/adproof-ad"
import DemoBar from "@/components/demo-bar"
import { useSelectedProfile } from "@/lib/profiles"

const NAVY = "#0a2540"
const BLUE = "#0076ff"

const NAV = ["MARKETS", "BUSINESS", "INVESTING", "TECH", "POLITICS", "VIDEO", "CRYPTO"]

const TICKERS = [
  { name: "STOXX600", value: "525.24", change: "+4.10", up: true },
  { name: "DAX", value: "25,124.17", change: "+121.13", up: true },
  { name: "FTSE", value: "10,773.51", change: "-34.56", up: false },
  { name: "CAC", value: "8,209.09", change: "+62.50", up: true },
  { name: "FTSE MIB", value: "50,578.54", change: "+803.38", up: true },
]

const FEATURED = [
  { title: "European stocks close higher as oil prices slip", tag: "MARKETS", big: true },
  { title: "How Jim Cramer would approach this tech stock heading into earnings", tag: "INVESTING" },
  { title: "Senate primary could shape the next policy cycle", tag: "POLITICS" },
  { title: "Chipmakers rally on strong demand outlook for data centers", tag: "TECH" },
  { title: "Central bank signals patience on rate cuts amid inflation", tag: "ECONOMY" },
  { title: "Retail sales beat expectations as consumers stay resilient", tag: "BUSINESS" },
]

const LATEST = [
  { time: "15 MIN AGO", title: "Markets wrap: where the major indexes settled today" },
  { time: "32 MIN AGO", title: "Energy sector leads gains as crude rebounds" },
  { time: "48 MIN AGO", title: "Earnings season: what to watch this week" },
  { time: "1 HOUR AGO", title: "Analysts weigh in on the latest jobs report" },
  { time: "2 HOURS AGO", title: "Dollar steadies after volatile trading session" },
]

type ServedAd = {
  id: string
  name: string
  description: string
  imageUrl: string
  format: string
  interests: string[]
}

type ServeResponse = {
  apiKeyId: string | null
  ads: ServedAd[]
}

export default function NewsDemo() {
  const profile = useSelectedProfile()
  const { data } = useSWR<ServeResponse>(
    `/api/ads/serve?count=4&interests=${profile.interests.join(",")}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  const ads = useMemo(() => data?.ads ?? [], [data])
  const apiKeyId = data?.apiKeyId ?? null
  const heroAd = ads[0]
  const sidebarAd = ads[1]

  // Insert remaining ads into the featured grid deterministically.
  const grid = useMemo(() => {
    const result: ({ type: "story"; story: (typeof FEATURED)[number] } | { type: "ad"; adIndex: number })[] =
      FEATURED.map((story) => ({ type: "story", story }))
    ads.slice(2).forEach((ad, i) => {
      const hash = ad.id.split("").reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7)
      result.splice(hash % (result.length + 1), 0, { type: "ad", adIndex: i + 2 })
    })
    return result
  }, [ads])

  return (
    <div className="min-h-dvh bg-gray-100">
      <DemoBar />
      {/* Breaking bar */}
      <div className="bg-[#cc0000] px-4 py-1.5 text-xs font-medium text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <span className="rounded bg-white/20 px-1.5 py-0.5 font-bold">BREAKING</span>
          <span className="line-clamp-1">
            Stocks making the biggest moves midday: Coherent, Victoria&apos;s Secret, Marvell and more
          </span>
        </div>
      </div>

      {/* Header */}
      <header style={{ backgroundColor: NAVY }} className="text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Menu className="size-5 shrink-0" />
          <Image src="/cnbc-logo.svg" alt="News" width={96} height={30} className="shrink-0" priority />
          <div className="relative ml-auto hidden w-72 sm:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Search quotes, news & videos"
              className="w-full rounded border border-white/20 bg-white/10 py-1.5 pl-9 pr-3 text-sm text-white placeholder:text-gray-300 outline-none"
            />
          </div>
          <Bell className="size-5 shrink-0" />
          <span className="rounded px-3 py-1.5 text-xs font-semibold" style={{ backgroundColor: BLUE }}>
            CREATE FREE ACCOUNT
          </span>
        </div>
        <nav className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-4 py-2 text-xs font-semibold tracking-wide">
            {NAV.map((n) => (
              <span key={n} className="whitespace-nowrap text-gray-200 hover:text-white">{n}</span>
            ))}
          </div>
        </nav>
      </header>

      {/* Tickers */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2">
          {TICKERS.map((t) => (
            <div
              key={t.name}
              className="flex min-w-[130px] flex-col rounded px-3 py-1.5 text-white"
              style={{ backgroundColor: t.up ? "#0b8043" : "#c5221f" }}
            >
              <span className="text-[10px] font-semibold opacity-90">{t.name}</span>
              <span className="text-sm font-bold tabular-nums">{t.value}</span>
              <span className="text-[10px] tabular-nums">{t.change}</span>
            </div>
          ))}
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          {/* Hero ad (the big banner slot) */}
          {heroAd && (
            <div className="mb-6">
              <AdproofAd ad={heroAd} apiKeyId={apiKeyId} profileSecret={profile.secret} profileInterests={profile.interests} variant="banner" accent={BLUE} cta="Learn more" />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {grid.map((item, idx) =>
              item.type === "ad" ? (
                <AdproofAd
                  key={`ad-${idx}`}
                  ad={ads[item.adIndex]}
                  apiKeyId={apiKeyId}
                  profileSecret={profile.secret}
                  profileInterests={profile.interests}
                  variant="card"
                  accent={BLUE}
                  cta="Learn more"
                />
              ) : (
                <article
                  key={`s-${idx}`}
                  className={`overflow-hidden rounded-lg border bg-white shadow-sm ${
                    item.story.big ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className={`relative w-full bg-gray-200 ${item.story.big ? "aspect-[16/7]" : "aspect-video"}`}>
                    <Image
                      src={`https://picsum.photos/seed/news${idx}/640/360`}
                      alt={item.story.title}
                      fill
                      unoptimized
                      sizes="(max-width:640px) 100vw, 320px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] font-bold tracking-wide" style={{ color: BLUE }}>
                      {item.story.tag}
                    </span>
                    <h2 className={`mt-1 font-semibold text-gray-900 ${item.story.big ? "text-lg" : "text-sm"}`}>
                      {item.story.title}
                    </h2>
                  </div>
                </article>
              )
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="mb-3 border-b pb-2 text-sm font-bold tracking-wide text-gray-800">
              LATEST NEWS
            </h3>
            <ul className="flex flex-col divide-y">
              {LATEST.map((n) => (
                <li key={n.title} className="flex gap-3 py-3">
                  <span className="text-[10px] font-semibold text-gray-400">{n.time}</span>
                  <span className="text-sm text-gray-800 hover:text-[#0076ff]">{n.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {sidebarAd && (
            <AdproofAd ad={sidebarAd} apiKeyId={apiKeyId} profileSecret={profile.secret} profileInterests={profile.interests} variant="card" accent={BLUE} cta="Learn more" />
          )}
        </aside>
      </main>
    </div>
  )
}

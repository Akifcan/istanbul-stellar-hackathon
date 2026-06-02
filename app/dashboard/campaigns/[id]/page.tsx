import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { supabaseAdmin } from "@/lib/supabase-admin"
import CampaignDetail from "@/components/campaign-detail"
import WalletMenu from "@/components/wallet-menu"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabaseAdmin
    .from("campaigns")
    .select("name")
    .eq("id", id)
    .maybeSingle()

  const title = data?.name ? `${data.name} | AdProof` : "Campaign | AdProof"
  return {
    title,
    description: "Manage and edit your AdProof campaign.",
    openGraph: { title, images: ["/logo.png"] },
  }
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="AdProof home">
            <Image src="/logo.png" alt="AdProof logo" width={32} height={32} priority />
            <span className="text-lg font-semibold tracking-tight">AdProof</span>
          </Link>
          <WalletMenu />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:py-12">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>

        <CampaignDetail id={id} />
      </main>
    </div>
  )
}

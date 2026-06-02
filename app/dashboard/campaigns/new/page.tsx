import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CreateCampaignForm from "@/components/create-campaign-form"

export const metadata: Metadata = {
  title: "Create campaign | AdProof",
  description:
    "Create an AdProof campaign — set your ad name, type, description, and creative. Reach qualified audiences without collecting personal data.",
  openGraph: {
    title: "Create campaign | AdProof",
    description:
      "Create an AdProof campaign — set your ad name, type, description, and creative.",
    images: ["/logo.png"],
    url: "https://adproof.com/dashboard/campaigns/new",
  },
}

export default function NewCampaignPage() {
  return (
    <div className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="AdProof home">
            <Image src="/logo.png" alt="AdProof logo" width={32} height={32} priority />
            <span className="text-lg font-semibold tracking-tight">AdProof</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:py-12">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create campaign</CardTitle>
            <CardDescription>
              Define your ad. Targeting conditions are proven with zero-knowledge —
              you never see who your audience is.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCampaignForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

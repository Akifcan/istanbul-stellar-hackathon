import type { Metadata } from "next"

import LandingNavbar from "@/components/landing-navbar"
import LandingFooter from "@/components/landing-footer"
import DocsContent from "@/components/docs-content"

export const metadata: Metadata = {
  title: "Docs | AdProof",
  description:
    "Integrate AdProof in minutes. Ad formats, pricing, the React SDK, and how zero-knowledge verification works — with links to Stellar developer resources.",
  openGraph: {
    title: "Docs | AdProof",
    description:
      "Integration guide, ad formats, pricing, and zero-knowledge verification — plus Stellar developer resources.",
    images: ["/logo.png"],
    url: "https://adproof.com/docs",
  },
}

export default function DocsPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Documentation
            </span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Developer docs
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Everything you need to serve privacy-preserving ads and start
              earning on Stellar.
            </p>
          </div>
        </div>
        <DocsContent />
      </main>
      <LandingFooter />
    </>
  )
}

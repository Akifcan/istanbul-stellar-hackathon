import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

import CodeBlock from "@/components/code-block"
import {
  AD_FORMATS,
  AD_FORMAT_CPM,
  AD_INSTALL_SNIPPET,
  AD_PROVIDER_SNIPPET,
} from "@/lib/ad-formats"

const NAV = [
  { id: "introduction", label: "Introduction" },
  { id: "quickstart", label: "Quickstart" },
  { id: "ad-formats", label: "Ad formats" },
  { id: "pricing", label: "Pricing" },
  { id: "verification", label: "How verification works" },
  { id: "resources", label: "Resources" },
]

const RESOURCES = [
  { label: "Stellar Developers", href: "https://developers.stellar.org", note: "Docs, guides, and APIs" },
  { label: "Soroban Smart Contracts", href: "https://developers.stellar.org/docs/build/smart-contracts", note: "Rust contracts on Stellar" },
  { label: "Freighter Wallet", href: "https://www.freighter.app", note: "Connect & sign transactions" },
  { label: "Stellar Lab", href: "https://lab.stellar.org", note: "Build & inspect transactions" },
  { label: "Circom", href: "https://docs.circom.io", note: "ZK circuit language" },
  { label: "snarkjs", href: "https://github.com/iden3/snarkjs", note: "Groth16 proving & verification" },
]

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

export default function DocsContent() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[200px_1fr]">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <nav className="sticky top-24 flex flex-col gap-1 text-sm" aria-label="Docs">
          <span className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground/60">
            Documentation
          </span>
          {NAV.map((n) => (
            <Link
              key={n.id}
              href={`#${n.id}`}
              className="rounded-md px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex flex-col gap-16">
        <Section id="introduction" title="Introduction">
          <p>
            <strong className="text-foreground">AdProof</strong> is a
            privacy-preserving ad network. Publishers add ad units to their site;
            visitors prove they match a campaign&apos;s audience with a
            zero-knowledge proof generated on their own device. No personal data
            is collected, and payouts settle on Stellar.
          </p>
          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-xs">
            Built on
            <Image src="/Stellar-Logo-Final-Black-RGB.png" alt="Stellar" width={64} height={16} />
          </div>
        </Section>

        <Section id="quickstart" title="Quickstart">
          <p>Integrate in three steps. You&apos;ll need an API key from your dashboard.</p>
          <div>
            <p className="mb-2 font-medium text-foreground">1. Install the package</p>
            <CodeBlock code={AD_INSTALL_SNIPPET} />
          </div>
          <div>
            <p className="mb-2 font-medium text-foreground">2. Wrap your app with the provider</p>
            <CodeBlock code={AD_PROVIDER_SNIPPET} />
          </div>
          <div>
            <p className="mb-2 font-medium text-foreground">3. Drop in an ad unit</p>
            <CodeBlock code={`import { AdSlot } from "@adproof/react"\n\n<AdSlot format="rectangle" />`} />
          </div>
        </Section>

        <Section id="ad-formats" title="Ad formats">
          <p>Five formats cover every common placement. Each is a one-line component or hook.</p>
          <div className="flex flex-col gap-6">
            {AD_FORMATS.map((f) => (
              <div key={f.id} className="rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{f.label}</h3>
                  <span className="rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal">
                    {f.size}
                  </span>
                </div>
                <p className="mt-1 text-xs">{f.description}</p>
                <div className="mt-3">
                  <CodeBlock code={f.snippet} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="pricing" title="Pricing">
          <p>
            Publishers earn per verified impression. Indicative payouts (CPM —
            per 1,000 impressions) by format:
          </p>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-foreground">Format</th>
                  <th className="px-4 py-3 font-medium text-foreground">Size</th>
                  <th className="px-4 py-3 text-right font-medium text-foreground">Payout / 1,000 views</th>
                </tr>
              </thead>
              <tbody>
                {AD_FORMATS.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-foreground">{f.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.size}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      {(AD_FORMAT_CPM[f.id] ?? 0).toFixed(2)} USDC
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs">
            Rates are indicative and vary by campaign demand and audience match.
            Earnings are paid out instantly to your wallet — no net terms, no
            intermediaries.
          </p>
        </Section>

        <Section id="verification" title="How verification works">
          <p>
            When an ad is shown, the visitor&apos;s device builds a Groth16
            zero-knowledge proof that they belong to the campaign&apos;s target
            interest set — without revealing identity or the underlying data. The
            proof carries a <strong className="text-foreground">nullifier</strong>{" "}
            so each user counts at most once per campaign.
          </p>
          <CodeBlock
            code={`// public signals returned with every proof
[
  nullifier,   // one-time tag, no identity
  root,        // the audience set's Merkle root
  campaignId   // binds the proof to one campaign
]`}
          />
          <p>
            The server verifies the proof with snarkjs, checks the nullifier is
            new, and credits the publisher — all without learning who the user is.
          </p>
        </Section>

        <Section id="resources" title="Resources">
          <p>Useful links for building on AdProof and Stellar.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {RESOURCES.map((r) => (
              <a
                key={r.href}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-brand"
              >
                <span>
                  <span className="block font-medium text-foreground">{r.label}</span>
                  <span className="block text-xs">{r.note}</span>
                </span>
                <ExternalLink className="size-4 shrink-0 text-muted-foreground group-hover:text-brand" aria-hidden="true" />
              </a>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}

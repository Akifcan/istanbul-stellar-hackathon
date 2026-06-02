import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { EyeOff, ShieldCheck, Zap } from "lucide-react"

import WalletConnect from "@/components/wallet-connect"

export const metadata: Metadata = {
  title: "Sign in | AdProof",
  description:
    "Connect your Stellar wallet to join AdProof — the proof-based ad network where you prove eligibility without sharing personal data.",
  openGraph: {
    title: "Sign in | AdProof",
    description:
      "Connect your Stellar wallet to join AdProof — the proof-based ad network where you prove eligibility without sharing personal data.",
    images: ["/logo.png"],
    url: "https://adproof.com/login",
  },
}

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Zero data shared",
    description: "Your wallet address and balance never leave your device.",
  },
  {
    icon: EyeOff,
    title: "Prove, don't reveal",
    description: "Show you qualify with a zero-knowledge proof — nothing else.",
  },
  {
    icon: Zap,
    title: "Settled on Stellar",
    description: "Transparent, verifiable payouts secured on-chain.",
  },
] as const

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-white lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-brand-teal/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-white/5 blur-3xl"
        />

        <Link href="/" className="relative flex w-fit items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white">
            <Image src="/logo.png" alt="AdProof logo" width={32} height={32} />
          </span>
          <span className="text-lg font-semibold tracking-tight">AdProof</span>
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Reach the right audience without collecting anyone&apos;s data.
          </h2>
          <ul className="mt-8 flex flex-col gap-5">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <feature.icon className="size-4 text-brand-teal" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="font-medium">{feature.title}</span>
                  <span className="text-sm text-white/70">{feature.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/50">Powered by Stellar</p>
      </section>

      {/* Auth panel */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <header className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Image
              src="/logo.png"
              alt="AdProof logo"
              width={56}
              height={56}
              priority
              className="mb-6 lg:hidden"
            />
            <h1 className="text-2xl font-semibold tracking-tight">
              Connect your wallet
            </h1>
            <p className="text-muted-foreground mt-2 text-sm text-balance">
              Sign in with Freighter to continue. No email, no password — your
              wallet is your identity.
            </p>
          </header>

          <div className="mt-8">
            <WalletConnect />
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-brand-teal/20 bg-brand-teal/5 p-3">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-brand-teal"
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-xs">
              AdProof never sees your address or balance — eligibility is proven
              locally on your device.
            </p>
          </div>

          <p className="text-muted-foreground mt-8 text-center text-xs lg:text-left">
            By continuing you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  )
}

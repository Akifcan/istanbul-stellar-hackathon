import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function AboutCta() {
  return (
    <section style={{ backgroundColor: "#FDDA24" }} className="text-black">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <Image
          src="/Stellar-Logo-Final-Black-RGB.png"
          alt="Stellar"
          width={150}
          height={38}
          className="mx-auto h-8 w-auto"
        />
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Reach the right audience. Collect zero data.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-black/70">
          Join the proof-based ad network. Connect your wallet and start in
          minutes — no sign-up forms, no personal data.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-7 text-sm font-medium text-white hover:opacity-90"
          >
            Get started
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full border border-black/20 px-7 text-sm font-medium hover:bg-black/5"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}

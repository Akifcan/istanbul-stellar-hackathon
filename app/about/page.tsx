import type { Metadata } from "next"

import LandingNavbar from "@/components/landing-navbar"
import LandingFooter from "@/components/landing-footer"
import AboutHero from "@/components/about-hero"
import AboutAudience from "@/components/about-audience"
import AboutWhy from "@/components/about-why"
import AboutStellar from "@/components/about-stellar"
import AboutUsecases from "@/components/about-usecases"
import AboutCalculator from "@/components/about-calculator"
import AboutCta from "@/components/about-cta"
import AboutPromoBar from "@/components/about-promo-bar"

export const metadata: Metadata = {
  title: "About | AdProof — Privacy-Preserving Advertising on Stellar",
  description:
    "Who AdProof is for, why it matters, and where it fits. A proof-based ad network that reaches qualified audiences without collecting personal data, settled on Stellar.",
  openGraph: {
    title: "About | AdProof",
    description:
      "Who it's for, why it matters, and where it fits — privacy-preserving advertising with zero-knowledge proofs and Stellar payments.",
    images: ["/logo.png"],
    url: "https://adproof.com/about",
  },
}

export default function AboutPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <AboutHero />
        <AboutAudience />
        <AboutWhy />
        <AboutStellar />
        <AboutUsecases />
        <AboutCalculator />
        <AboutCta />
      </main>
      <LandingFooter />
      <AboutPromoBar />
    </>
  )
}

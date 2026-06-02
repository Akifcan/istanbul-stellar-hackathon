import type { Metadata } from "next";

import LandingNavbar from "@/components/landing-navbar";
import LandingHero from "@/components/landing-hero";
import LandingComparison from "@/components/landing-comparison";
import LandingNews from "@/components/landing-news";
import LandingOwnData from "@/components/landing-own-data";
import LandingFlow from "@/components/landing-flow";
import LandingFeatureRow from "@/components/landing-feature-row";
import LandingVisualPrivacy from "@/components/landing-visual-privacy";
import LandingVisualStellar from "@/components/landing-visual-stellar";
import LandingVisualSdk from "@/components/landing-visual-sdk";
import LandingDemos from "@/components/landing-demos";
import LandingFooter from "@/components/landing-footer";
import LandingPromoBar from "@/components/landing-promo-bar";

export const metadata: Metadata = {
  title: "AdProof — Privacy-Preserving Advertising on Stellar",
  description:
    "Reach qualified audiences without collecting personal data. AdProof uses zero-knowledge proofs for targeting and settles payments on Stellar.",
  openGraph: {
    title: "AdProof — Privacy-Preserving Advertising on Stellar",
    description:
      "Reach qualified audiences without collecting personal data, using zero-knowledge proofs and Stellar-powered payments.",
    images: ["/logo.png"],
    url: "https://adproof.com",
  },
};

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingNews />
        <LandingComparison />
        <LandingOwnData />
        <LandingFlow />

        <LandingFeatureRow
          eyebrow="Zero-knowledge targeting"
          title="Prove the condition. Hide everything else."
          description="Users prove they match a campaign's targeting condition without disclosing the value behind it — or who they are."
          bullets={[
            "Eligibility proven on the user's own device",
            "Advertiser learns only that the condition holds",
            "A nullifier counts each user once per campaign",
          ]}
          visual={<LandingVisualPrivacy />}
        />

        <LandingFeatureRow
          eyebrow="Settlement on Stellar"
          title="Budgets and payouts move on-chain."
          description="Campaign budgets are escrowed in a Soroban smart contract. Publisher earnings are paid out transparently — fast and cheap."
          bullets={[
            "Treasury and vaults run on Soroban contracts",
            "Every deposit and payout is publicly verifiable",
            "Low-cost settlement in seconds",
          ]}
          visual={<LandingVisualStellar />}
          reverse
          muted
        />

        <LandingFeatureRow
          eyebrow="Integration"
          title="Two lines to start earning."
          description="Wrap your app in the provider, drop in an ad unit, and you're live. That's the whole integration."
          bullets={[
            "Square, rectangle, banner, popup, rewarded",
            "Impressions and USDC tracked in real time",
            "No personal data ever leaves the visitor",
          ]}
          visual={<LandingVisualSdk />}
        />

        <LandingDemos />
      </main>
      <LandingFooter />
      <LandingPromoBar />
    </>
  );
}

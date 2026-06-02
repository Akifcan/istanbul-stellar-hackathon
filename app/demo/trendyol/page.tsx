import type { Metadata } from "next"

import TrendyolDemo from "@/components/trendyol-demo"

export const metadata: Metadata = {
  title: "Trendyol — AdProof Demo",
  description:
    "A demo storefront showing AdProof ads served from real campaigns, with privacy-preserving targeting.",
}

export default function TrendyolDemoPage() {
  return <TrendyolDemo />
}

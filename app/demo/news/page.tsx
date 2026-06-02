import type { Metadata } from "next"

import NewsDemo from "@/components/news-demo"

export const metadata: Metadata = {
  title: "Markets News — AdProof Demo",
  description:
    "A demo news site showing AdProof ads served from real campaigns with privacy-preserving targeting.",
}

export default function NewsDemoPage() {
  return <NewsDemo />
}

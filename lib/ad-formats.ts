export const AD_INSTALL_SNIPPET = `npm install @adproof/react`

// Indicative payout per 1,000 verified impressions (CPM), in USDC, by format.
// Higher-engagement formats earn more.
export const AD_FORMAT_CPM: Record<string, number> = {
  square: 8,
  rectangle: 12,
  banner: 10,
  popup: 18,
  rewarded: 35,
}

export const AD_PROVIDER_SNIPPET = `import { AdProofProvider } from "@adproof/react"

export default function App({ children }) {
  return (
    <AdProofProvider apiKey="YOUR_API_KEY">
      {children}
    </AdProofProvider>
  )
}`

export const AD_FORMATS = [
  {
    id: "square",
    label: "Square",
    size: "250 × 250",
    description: "Compact square unit for sidebars and in-feed slots.",
    snippet: `import { AdSlot } from "@adproof/react"

<AdSlot format="square" />`,
  },
  {
    id: "rectangle",
    label: "Rectangle",
    size: "300 × 250",
    description: "Medium rectangle — the most common in-content unit.",
    snippet: `import { AdSlot } from "@adproof/react"

<AdSlot format="rectangle" />`,
  },
  {
    id: "banner",
    label: "Banner",
    size: "728 × 90",
    description: "Leaderboard banner for headers and footers.",
    snippet: `import { AdSlot } from "@adproof/react"

<AdSlot format="banner" />`,
  },
  {
    id: "popup",
    label: "Popup",
    size: "Overlay",
    description: "Full-screen interstitial shown on a trigger you control.",
    snippet: `import { usePopupAd } from "@adproof/react"

const popup = usePopupAd()

<button onClick={() => popup.show()}>
  Show offer
</button>`,
  },
  {
    id: "rewarded",
    label: "Rewarded",
    size: "Opt-in",
    description: "User opts in to watch and receives a reward on completion.",
    snippet: `import { useRewardedAd } from "@adproof/react"

const rewarded = useRewardedAd()

<button onClick={() => rewarded.show({ onReward: grantReward })}>
  Watch & earn
</button>`,
  },
] as const

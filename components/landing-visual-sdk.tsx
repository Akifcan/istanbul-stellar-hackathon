const CODE = `import { AdProofProvider, AdSlot } from "@adproof/react"

export default function App() {
  return (
    <AdProofProvider apiKey="pk_live_…">
      <AdSlot format="banner" />
      <AdSlot format="rectangle" />
    </AdProofProvider>
  )
}`

export default function LandingVisualSdk() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-[#0f1117] shadow-xl shadow-brand/5">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="size-3 rounded-full bg-red-400/80" />
        <span className="size-3 rounded-full bg-yellow-400/80" />
        <span className="size-3 rounded-full bg-green-400/80" />
        <span className="ml-3 font-mono text-xs text-white/40">App.tsx</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-white/90">
        <code>{CODE}</code>
      </pre>
    </div>
  )
}

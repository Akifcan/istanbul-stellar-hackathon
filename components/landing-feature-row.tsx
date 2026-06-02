import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export default function LandingFeatureRow({
  eyebrow,
  title,
  description,
  bullets,
  visual,
  reverse = false,
  muted = false,
}: {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  visual: React.ReactNode
  reverse?: boolean
  muted?: boolean
}) {
  return (
    <section className={cn("border-b", muted && "bg-muted/30")}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className={cn(reverse && "lg:order-2")}>
          <span className="text-sm font-semibold text-brand">{eyebrow}</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">{description}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={cn(reverse && "lg:order-1")}>{visual}</div>
      </div>
    </section>
  )
}

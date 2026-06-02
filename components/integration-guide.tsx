"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  AD_FORMATS,
  AD_INSTALL_SNIPPET,
  AD_PROVIDER_SNIPPET,
} from "@/lib/ad-formats"
import CodeBlock from "@/components/code-block"

export default function IntegrationGuide() {
  const [selectedId, setSelectedId] = useState<string>(AD_FORMATS[0].id)
  const selected =
    AD_FORMATS.find((format) => format.id === selectedId) ?? AD_FORMATS[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration</CardTitle>
        <CardDescription>
          Add AdProof ads to your React app in three steps. No personal data is
          ever collected from your visitors.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">1. Install the package</h3>
          <CodeBlock code={AD_INSTALL_SNIPPET} />
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">2. Wrap your app with the provider</h3>
          <p className="text-muted-foreground text-sm">
            Replace <code className="text-xs">YOUR_API_KEY</code> with a key from
            the table above.
          </p>
          <CodeBlock code={AD_PROVIDER_SNIPPET} />
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">3. Drop in an ad component</h3>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Ad formats">
            {AD_FORMATS.map((format) => (
              <Button
                key={format.id}
                type="button"
                role="tab"
                aria-selected={format.id === selectedId}
                variant={format.id === selectedId ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedId(format.id)}
              >
                {format.label}
              </Button>
            ))}
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <p className="text-muted-foreground text-sm">{selected.description}</p>
            <span
              className={cn(
                "shrink-0 rounded-full bg-brand-teal/15 px-2 py-0.5 text-xs font-medium text-brand-teal"
              )}
            >
              {selected.size}
            </span>
          </div>

          <CodeBlock code={selected.snippet} />
        </section>
      </CardContent>
    </Card>
  )
}

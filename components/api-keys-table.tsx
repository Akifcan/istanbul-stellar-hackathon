"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { KEY_STATUS } from "@/lib/publisher"

function maskKey(key: string): string {
  return `${key.slice(0, 8)}…${key.slice(-4)}`
}

export default function ApiKeysTable({ keys }: { keys: PublisherApiKey[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (apiKey: PublisherApiKey) => {
    await navigator.clipboard.writeText(apiKey.key)
    setCopiedId(apiKey.id)
    toast.success("API key copied")
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API keys</CardTitle>
        <CardDescription>
          Keys you&apos;ve created for your websites.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {keys.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No API keys yet. Create one above to get started.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>API key</TableHead>
                <TableHead className="text-right">Ads shown</TableHead>
                <TableHead className="text-right">USDC</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <a
                      href={apiKey.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                    >
                      {apiKey.websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                        {maskKey(apiKey.key)}
                      </code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => handleCopy(apiKey)}
                        aria-label={`Copy API key for ${apiKey.name}`}
                      >
                        {copiedId === apiKey.id ? (
                          <Check className="size-3.5 text-brand-teal" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {apiKey.impressions.toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {apiKey.earned.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        apiKey.status === KEY_STATUS.ACTIVE ? "default" : "secondary"
                      }
                    >
                      {apiKey.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

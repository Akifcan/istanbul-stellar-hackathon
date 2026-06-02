"use client"

import { useState } from "react"
import useSWR from "swr"
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
import { fetcher } from "@/lib/fetcher"
import { useWallet } from "@/lib/wallet"

function maskKey(key: string): string {
  return `${key.slice(0, 8)}…${key.slice(-4)}`
}

export default function ApiKeysTable() {
  const wallet = useWallet()
  const { data: keys, error, isLoading } = useSWR<PublisherApiKey[]>(
    wallet ? `/api/api-keys?wallet=${encodeURIComponent(wallet)}` : null,
    fetcher
  )
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (token: string, text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(token)
    toast.success(`${label} copied`)
    setTimeout(() => setCopied(null), 1500)
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
        {error ? (
          <p className="text-destructive py-8 text-center text-sm">
            Could not load API keys. Please refresh.
          </p>
        ) : isLoading ? (
          <div className="flex flex-col gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="bg-muted h-12 animate-pulse rounded" />
            ))}
          </div>
        ) : !keys || keys.length === 0 ? (
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
                <TableHead>Vault</TableHead>
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
                        onClick={() =>
                          handleCopy(`${apiKey.id}:key`, apiKey.key, "API key")
                        }
                        aria-label={`Copy API key for ${apiKey.name}`}
                      >
                        {copied === `${apiKey.id}:key` ? (
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
                    {apiKey.vaultContractId ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://stellar.expert/explorer/testnet/contract/${apiKey.vaultContractId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand hover:text-foreground font-mono text-xs underline-offset-2 hover:underline"
                        >
                          {apiKey.vaultContractId.slice(0, 4)}…
                          {apiKey.vaultContractId.slice(-4)}
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() =>
                            handleCopy(
                              `${apiKey.id}:vault`,
                              apiKey.vaultContractId!,
                              "Contract ID"
                            )
                          }
                          aria-label={`Copy vault contract id for ${apiKey.name}`}
                        >
                          {copied === `${apiKey.id}:vault` ? (
                            <Check className="size-3.5 text-brand-teal" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
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

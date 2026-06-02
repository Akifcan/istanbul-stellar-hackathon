"use client"

import { useEffect } from "react"
import useSWR from "swr"
import { useForm, useWatch } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import AdPreview from "@/components/ad-preview"
import { fetcher } from "@/lib/fetcher"
import { useWallet } from "@/lib/wallet"
import { CAMPAIGN_STATUS } from "@/lib/campaigns"
import { audienceLabel, interestLabel } from "@/lib/targeting"
import { AD_FORMATS } from "@/lib/ad-formats"
import {
  campaignEditSchema,
  type CampaignEditFormValues as FormValues,
} from "@/schemas/campaign-edit-schema"

function formatLabel(id: string): string {
  return AD_FORMATS.find((f) => f.id === id)?.label ?? id
}

function usd(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function CampaignDetail({ id }: { id: string }) {
  const wallet = useWallet()
  const { data: campaign, error, isLoading, mutate } = useSWR<AdCampaign>(
    `/api/campaigns/${id}`,
    fetcher
  )

  const form = useForm<FormValues, unknown, FormValues>({
    resolver: yupResolver(campaignEditSchema),
    defaultValues: { name: "", description: "", imageUrl: "", status: "active" },
  })

  useEffect(() => {
    if (campaign) {
      form.reset({
        name: campaign.name,
        description: campaign.description,
        imageUrl: campaign.imageUrl,
        status: campaign.status,
      })
    }
  }, [campaign, form])

  const name = useWatch({ control: form.control, name: "name" }) ?? ""
  const description = useWatch({ control: form.control, name: "description" }) ?? ""
  const imageUrl = useWatch({ control: form.control, name: "imageUrl" }) ?? ""

  if (error) {
    return (
      <p className="text-destructive py-12 text-center text-sm">
        Could not load this campaign.
      </p>
    )
  }
  if (isLoading || !campaign) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-muted h-9 w-64 animate-pulse rounded" />
        <div className="bg-muted h-64 animate-pulse rounded-xl" />
      </div>
    )
  }

  const onSubmit = async (values: FormValues) => {
    if (!wallet) {
      toast.error("Connect your wallet first")
      return
    }
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, ...values }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      toast.error("Could not save changes", {
        description: body.error ?? "Please try again.",
      })
      return
    }
    const updated = (await res.json()) as AdCampaign
    await mutate(updated, { revalidate: false })
    toast.success("Campaign updated")
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Edit form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={CAMPAIGN_STATUS.ACTIVE}>Active</SelectItem>
                        <SelectItem value={CAMPAIGN_STATUS.PAUSED}>Paused</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview + read-only details */}
      <div className="flex flex-col gap-6">
        <AdPreview
          data={{ format: campaign.format, name, description, imageUrl }}
        />

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <Row label="Type" value={formatLabel(campaign.format)} />
            <Row label="Budget" value={`${usd(campaign.budget)} USDC`} />
            <Row label="USDC spent" value={usd(campaign.spent)} />
            <Row
              label="People reached"
              value={campaign.impressions.toLocaleString("en-US")}
            />
            <Row
              label="Estimated reach"
              value={`≈ ${campaign.estimatedReach.toLocaleString("en-US")}`}
            />
            <Row label="Created" value={campaign.createdAt} />
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">Audiences</span>
              <div className="flex flex-wrap justify-end gap-1">
                {campaign.audiences.map((a) => (
                  <Badge key={a} variant="secondary">
                    {audienceLabel(a)}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">Interests</span>
              <div className="flex flex-wrap justify-end gap-1">
                {campaign.interests.map((i) => (
                  <Badge key={i} variant="outline">
                    {interestLabel(i)}
                  </Badge>
                ))}
              </div>
            </div>
            {campaign.txHash && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Deposit tx</span>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${campaign.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand font-mono text-xs underline-offset-2 hover:underline"
                >
                  {campaign.txHash.slice(0, 6)}…{campaign.txHash.slice(-6)}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

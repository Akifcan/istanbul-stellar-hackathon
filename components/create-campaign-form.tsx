"use client"

import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Fuel, Users } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import MultiSelect from "@/components/multi-select"
import AdPreview from "@/components/ad-preview"
import { AD_FORMATS } from "@/lib/ad-formats"
import { useWallet } from "@/lib/wallet"
import {
  AD_AUDIENCES,
  AD_INTERESTS,
  AUDIENCE_IDS,
  BUDGET_DEFAULT,
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  ESTIMATED_GAS_XLM,
  INTEREST_IDS,
  estimateReach,
} from "@/lib/targeting"

const FORMAT_IDS = AD_FORMATS.map((format) => format.id)

const schema = yup.object({
  name: yup.string().trim().required("Ad name is required"),
  format: yup
    .string()
    .oneOf(FORMAT_IDS, "Choose an ad type")
    .required("Ad type is required"),
  description: yup
    .string()
    .trim()
    .min(10, "Add at least 10 characters")
    .required("Description is required"),
  imageUrl: yup
    .string()
    .trim()
    .url("Enter a valid image URL (https://…)")
    .required("Image URL is required"),
  budget: yup
    .number()
    .typeError("Set a budget")
    .min(BUDGET_MIN)
    .max(BUDGET_MAX)
    .required(),
  audiences: yup
    .array()
    .of(yup.string().oneOf(AUDIENCE_IDS).required())
    .min(1, "Select at least one target audience")
    .required(),
  interests: yup
    .array()
    .of(yup.string().oneOf(INTEREST_IDS).required())
    .min(1, "Select at least one interest")
    .required(),
})

type FormValues = yup.InferType<typeof schema>

export default function CreateCampaignForm() {
  const router = useRouter()
  const wallet = useWallet()

  const form = useForm<FormValues, unknown, FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      budget: BUDGET_DEFAULT,
      audiences: [],
      interests: [],
    },
  })

  const budget = useWatch({ control: form.control, name: "budget" }) ?? 0
  const audiences = useWatch({ control: form.control, name: "audiences" }) ?? []
  const interests = useWatch({ control: form.control, name: "interests" }) ?? []
  const imageUrl = useWatch({ control: form.control, name: "imageUrl" }) ?? ""
  const name = useWatch({ control: form.control, name: "name" }) ?? ""
  const format = useWatch({ control: form.control, name: "format" }) ?? ""
  const description = useWatch({ control: form.control, name: "description" }) ?? ""
  const reach = estimateReach(budget, audiences, interests)

  const onSubmit = async (values: FormValues) => {
    if (!wallet) {
      toast.error("Connect your wallet first")
      return
    }

    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, ...values }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      toast.error("Could not create campaign", {
        description: body.error ?? "Please try again.",
      })
      return
    }

    toast.success("Campaign created", {
      description: `“${values.name}” is now live.`,
    })
    router.push("/dashboard")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: creative */}
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summer Sale 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an ad type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AD_FORMATS.map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          {format.label} · {format.size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Textarea
                      rows={4}
                      placeholder="What is this campaign about?"
                      {...field}
                    />
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
                    <Input
                      type="url"
                      placeholder="https://example.com/banner.png"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Paste a link to your ad image.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AdPreview data={{ format, name, description, imageUrl }} />
          </div>

          {/* Right: budget + targeting */}
          <div className="flex flex-col gap-6 rounded-xl border bg-muted/30 p-5">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-baseline justify-between">
                    <FormLabel>Budget</FormLabel>
                    <span className="text-lg font-semibold tabular-nums">
                      {budget.toLocaleString("en-US")}{" "}
                      <span className="text-muted-foreground text-sm font-normal">
                        USDC
                      </span>
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={BUDGET_MIN}
                      max={BUDGET_MAX}
                      step={BUDGET_STEP}
                      value={[field.value ?? BUDGET_MIN]}
                      onValueChange={(v) => field.onChange(v[0])}
                    />
                  </FormControl>
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>{BUDGET_MIN} USDC</span>
                    <span>{BUDGET_MAX.toLocaleString("en-US")} USDC</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-muted-foreground flex items-center justify-between border-y py-3 text-sm">
              <span className="flex items-center gap-2">
                <Fuel className="size-4" aria-hidden="true" />
                Estimated network fee
              </span>
              <span className="text-foreground font-medium tabular-nums">
                ≈ {ESTIMATED_GAS_XLM} XLM
              </span>
            </div>

            <FormField
              control={form.control}
              name="audiences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target audience</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={AD_AUDIENCES}
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="Select target audiences"
                      noun="condition"
                    />
                  </FormControl>
                  <FormDescription>
                    Conditions are proven with zero-knowledge — you never see who
                    qualifies.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={AD_INTERESTS}
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="Select interests"
                      noun="interest"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-brand/5 flex items-center gap-4 rounded-lg p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Users className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-2xl font-semibold tracking-tight tabular-nums">
                  ≈ {reach.toLocaleString("en-US")}
                </span>
                <span className="text-muted-foreground text-sm">
                  Estimated people reached
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating…" : "Create campaign"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

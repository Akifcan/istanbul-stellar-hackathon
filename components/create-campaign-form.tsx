"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { AD_FORMATS } from "@/lib/ad-formats"
import { addCampaign, CAMPAIGN_STATUS } from "@/lib/campaigns"

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
  image: yup
    .mixed<File>()
    .required("An ad image is required")
    .test(
      "is-image",
      "File must be an image",
      (value) => value instanceof File && value.type.startsWith("image/")
    ),
})

type FormValues = yup.InferType<typeof schema>

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export default function CreateCampaignForm() {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(null)

  const form = useForm<FormValues, unknown, FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", description: "" },
  })

  const onSubmit = async (values: FormValues) => {
    const imageUrl = await readAsDataUrl(values.image)

    addCampaign({
      id: crypto.randomUUID(),
      name: values.name,
      format: values.format,
      description: values.description,
      imageUrl,
      createdAt: new Date().toISOString().slice(0, 10),
      status: CAMPAIGN_STATUS.ACTIVE,
      spent: 0,
      impressions: 0,
    })

    toast.success("Campaign created", {
      description: `“${values.name}” is now live.`,
    })
    router.push("/dashboard")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad name</FormLabel>
              <FormControl>
                <Input placeholder="Summer XLM Drop" {...field} />
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
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null
                    field.onChange(file)
                    setPreview(file ? URL.createObjectURL(file) : null)
                  }}
                />
              </FormControl>
              <FormDescription>PNG, JPG or GIF.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {preview && (
          <Image
            src={preview}
            alt="Ad image preview"
            width={320}
            height={180}
            unoptimized
            className="h-auto w-full max-w-xs rounded-lg border object-cover"
          />
        )}

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

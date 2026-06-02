"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { generateApiKey, KEY_STATUS } from "@/lib/publisher"

const schema = yup.object({
  name: yup.string().trim().required("Key name is required"),
  websiteUrl: yup
    .string()
    .trim()
    .url("Enter a valid URL (https://…)")
    .required("Website URL is required"),
})

type FormValues = yup.InferType<typeof schema>

export default function CreateApiKeyForm({
  onCreate,
}: {
  onCreate: (key: PublisherApiKey) => void
}) {
  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", websiteUrl: "" },
  })

  const onSubmit = (values: FormValues) => {
    onCreate({
      id: crypto.randomUUID(),
      name: values.name,
      websiteUrl: values.websiteUrl,
      key: generateApiKey(),
      createdAt: new Date().toISOString().slice(0, 10),
      impressions: 0,
      earned: 0,
      status: KEY_STATUS.ACTIVE,
    })
    toast.success("API key created", {
      description: `“${values.name}” is ready to use.`,
    })
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create API key</CardTitle>
        <CardDescription>
          Generate a key to serve AdProof ads on your website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 sm:flex-row sm:items-start"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Key name</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Blog" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="gap-2 sm:mt-[1.625rem]">
              <Plus className="size-4" aria-hidden="true" />
              Create key
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useSWRConfig } from "swr"
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
import { useWallet } from "@/lib/wallet"
import { deployVault } from "@/lib/deploy-vault"

const schema = yup.object({
  name: yup.string().trim().required("Key name is required"),
  websiteUrl: yup
    .string()
    .trim()
    .url("Enter a valid URL (https://…)")
    .required("Website URL is required"),
})

type FormValues = yup.InferType<typeof schema>

export default function CreateApiKeyForm() {
  const wallet = useWallet()
  const { mutate } = useSWRConfig()

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", websiteUrl: "" },
  })

  const onSubmit = async (values: FormValues) => {
    if (!wallet) {
      toast.error("Connect your wallet first")
      return
    }

    // 1. Publisher deploys their own vault contract (signs in Freighter).
    let vaultContractId: string
    try {
      toast.loading("Deploying your vault contract — approve in Freighter…", {
        id: "deploy",
      })
      vaultContractId = await deployVault(wallet)
      toast.success("Vault contract deployed", {
        id: "deploy",
        description: `${vaultContractId.slice(0, 6)}…${vaultContractId.slice(-6)}`,
      })
    } catch (err) {
      toast.error("Contract deployment failed", {
        id: "deploy",
        description: err instanceof Error ? err.message : "Please try again.",
      })
      return
    }

    // 2. Save the API key + its vault address.
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, ...values, vaultContractId }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      toast.error("Could not save API key", {
        description: body.error ?? "Please try again.",
      })
      return
    }

    await mutate(`/api/api-keys?wallet=${encodeURIComponent(wallet)}`)
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
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="gap-2 sm:mt-[1.625rem]"
            >
              <Plus className="size-4" aria-hidden="true" />
              {form.formState.isSubmitting ? "Creating…" : "Create key"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

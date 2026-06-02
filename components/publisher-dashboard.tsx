"use client"

import { useState } from "react"

import { SEED_KEYS } from "@/lib/publisher"
import PublisherStats from "@/components/publisher-stats"
import CreateApiKeyForm from "@/components/create-api-key-form"
import ApiKeysTable from "@/components/api-keys-table"
import IntegrationGuide from "@/components/integration-guide"

export default function PublisherDashboard() {
  const [keys, setKeys] = useState<PublisherApiKey[]>(SEED_KEYS)

  const handleCreate = (key: PublisherApiKey) => {
    setKeys((prev) => [key, ...prev])
  }

  return (
    <div className="flex flex-col gap-8">
      <PublisherStats keys={keys} />
      <CreateApiKeyForm onCreate={handleCreate} />
      <ApiKeysTable keys={keys} />
      <IntegrationGuide />
    </div>
  )
}

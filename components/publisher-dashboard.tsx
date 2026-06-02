import PublisherStats from "@/components/publisher-stats"
import CreateApiKeyForm from "@/components/create-api-key-form"
import ApiKeysTable from "@/components/api-keys-table"
import IntegrationGuide from "@/components/integration-guide"

export default function PublisherDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <PublisherStats />
      <CreateApiKeyForm />
      <ApiKeysTable />
      <IntegrationGuide />
    </div>
  )
}

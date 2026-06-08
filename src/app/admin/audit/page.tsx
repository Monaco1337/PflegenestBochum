import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { AuditExportButton } from '@/modules/audit/export-button'
import { AuditTable } from './audit-table'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Audit-Logs' }

export default async function AuditPage() {
  const data = (await repos.auditLogs.list({ limit: 500, sortBy: 'createdAt', sortDir: 'desc' })).data
  return (
    <>
      <PageHeader title="Audit-Logs" description="Nachvollziehbarkeit für alle sensiblen Änderungen." actions={<AuditExportButton data={data} />} />
      <AuditTable data={data} />
    </>
  )
}

import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { LeadsTable } from './leads-table'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Leads · CRM' }

export default async function LeadsPage() {
  const data = await repos.leads.all()
  return (
    <>
      <PageHeader title="Leads" description="Alle Anfragen aus Website, Pflegegrad-Center und Anamnese." />
      <LeadsTable data={data} />
    </>
  )
}

import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { InsurancesTable } from './insurances-table'
import { InsuranceFormDialog } from '@/modules/crm/insurance-form-dialog'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Pflegekassen · CRM' }

export default async function InsurancesPage() {
  const data = await repos.insurances.all()
  return (
    <>
      <PageHeader title="Pflegekassen" description="Versicherer und Pflegekassen." actions={<InsuranceFormDialog />} />
      <InsurancesTable data={data} />
    </>
  )
}

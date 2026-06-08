import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { HospitalsTable } from './hospitals-table'
import { HospitalFormDialog } from '@/modules/crm/hospital-form-dialog'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Krankenhäuser · CRM' }

export default async function HospitalsPage() {
  const data = await repos.hospitals.all()
  return (
    <>
      <PageHeader title="Krankenhäuser" description="Kliniken im Netzwerk." actions={<HospitalFormDialog />} />
      <HospitalsTable data={data} />
    </>
  )
}

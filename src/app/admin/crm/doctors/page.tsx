import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { DoctorsTable } from './doctors-table'
import { DoctorFormDialog } from '@/modules/crm/doctor-form-dialog'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Ärzte · CRM' }

export default async function DoctorsPage() {
  const doctors = await repos.doctors.all()
  return (
    <>
      <PageHeader title="Ärzte" description="Hausärzte und Fachärzte unserer Patient:innen." actions={<DoctorFormDialog />} />
      <DoctorsTable data={doctors} />
    </>
  )
}

import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { PatientsTable } from './patients-table'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Patienten' }

export default async function PatientsPage() {
  const data = await repos.patients.all()
  return (
    <>
      <PageHeader title="Patienten" description="Aktive und potenzielle Patient:innen." />
      <PatientsTable data={data} />
    </>
  )
}

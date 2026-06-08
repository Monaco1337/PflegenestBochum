import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { RelativesTable } from './relatives-table'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Angehörige · CRM' }

export default async function RelativesPage() {
  const [relatives, patients] = await Promise.all([repos.relatives.all(), repos.patients.all()])
  return (
    <>
      <PageHeader title="Angehörige" description="Kontaktpersonen und Bezugspersonen unserer Patient:innen." />
      <RelativesTable data={relatives} patients={patients} />
    </>
  )
}

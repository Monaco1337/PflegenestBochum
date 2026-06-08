import { repos } from '@/core/repositories'
import { ApplicantPipeline } from '@/modules/applicants/pipeline'
import { PageHeader } from '@/components/feedback/states'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Bewerber' }

export default async function ApplicantsPage() {
  const applicants = await repos.applicants.all()
  return (
    <>
      <PageHeader title="Bewerber" description="Recruiting-Pipeline mit Drag & Drop. Score, Notizen und Audit-Trail je Bewerbung." />
      <ApplicantPipeline applicants={applicants} />
    </>
  )
}

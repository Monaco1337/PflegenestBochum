import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { DocumentUpload } from '@/modules/documents/upload'
import { DocumentsTable } from './documents-table'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dokumente' }

export default async function DocumentsPage() {
  const docs = await repos.documents.all()
  return (
    <>
      <PageHeader title="Dokumentencenter" description="Pflegegutachten, Berichte, Medikationspläne, Mitarbeiterdokumente." actions={<DocumentUpload />} />
      <DocumentsTable data={docs} />
    </>
  )
}

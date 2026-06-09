import { NextResponse } from 'next/server'
import { repos } from '@/core/repositories'
import { bootstrap } from '@/core/bootstrap'

export const dynamic = 'force-dynamic'

// TEMPORARY diagnostic — verifies the generic Postgres persistence end-to-end.
export async function GET() {
  await bootstrap()
  const out: Record<string, unknown> = {}
  try {
    // create → read back → delete a throwaway lead through the normal repo path
    const created = await repos.leads.create({
      firstName: 'Diag',
      lastName: 'Test',
      email: 'diag@example.com',
      phone: '0000',
      source: 'website_contact',
      status: 'new',
      priority: 'low',
      consentGiven: true,
      message: 'diag roundtrip',
    } as never)
    const readBack = await repos.leads.findById(created.id)
    const deleted = await repos.leads.delete(created.id)
    out.roundtrip_ok = Boolean(readBack && readBack.id === created.id && deleted)

    out.counts = {
      leads: await repos.leads.count(),
      applicants: await repos.applicants.count(),
      patients: await repos.patients.count(),
      anamneses: await repos.anamneses.count(),
      pflegegradAssessments: await repos.pflegegradAssessments.count(),
      consentRecords: await repos.consentRecords.count(),
      tasks: await repos.tasks.count(),
      users: await repos.users.count(),
    }
    out.ok = true
  } catch (e) {
    out.ok = false
    out.error = (e as Error).message
  }
  return NextResponse.json(out)
}

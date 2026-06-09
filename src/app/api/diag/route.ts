import { NextResponse } from 'next/server'
import { repos } from '@/core/repositories'
import { bootstrap } from '@/core/bootstrap'
import { submitContactForm } from '@/app/actions/leads'

export const dynamic = 'force-dynamic'

// TEMPORARY diagnostic — verifies the generic Postgres persistence end-to-end.
export async function GET() {
  await bootstrap()
  const out: Record<string, unknown> = {}
  try {
    // Exercise the REAL website contact-form action and confirm it lands in the
    // store the admin panel reads from, then clean the throwaway record up.
    const marker = `diag+${Date.now()}@example.com`
    const res = await submitContactForm({
      firstName: 'Diag',
      lastName: 'Webform',
      email: marker,
      phone: '0234123456',
      zip: '44789',
      city: 'Bochum',
      message: 'Automatischer Diagnose-Test der Kontaktformular-Persistenz.',
      consent: true,
    })
    const found = (await repos.leads.findMany(l => l.email === marker))[0]
    out.contact_form_action_ok = Boolean(res.ok && found)
    out.contact_form_visible_in_store = Boolean(found)
    if (found) {
      await repos.leads.delete(found.id)
      const consents = await repos.consentRecords.findMany(c => c.subjectId === found.id)
      for (const c of consents) await repos.consentRecords.delete(c.id)
    }

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

'use server'

import { revalidatePath } from 'next/cache'
import { applicationFormSchema } from '@/core/validation/schemas'
import { createApplicant, moveApplicantStage } from '@/core/services/applicants'
import { repos } from '@/core/repositories'
import { track } from '@/core/services/analytics'
import type { ActionResult } from './leads'
import type { ApplicantStage } from '@/core/types'

export async function submitApplicationForm(input: unknown): Promise<ActionResult<{ applicantId: string }>> {
  const parsed = applicationFormSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe.' }
  }
  const v = parsed.data
  const applicant = await createApplicant({
    firstName: v.firstName,
    lastName: v.lastName,
    email: v.email,
    phone: v.phone || undefined,
    city: v.city,
    position: v.position,
    motivation: v.motivation,
    qualifications: v.qualification ? [v.qualification] : [],
    consentGiven: true,
  })
  await repos.consentRecords.create({
    subject: 'applicant',
    subjectId: applicant.id,
    scope: 'application',
    granted: true,
    text:
      'Mit Einreichen der Online-Bewerbung habe ich der Verarbeitung meiner Bewerbungsdaten für die Dauer des Bewerbungsverfahrens zugestimmt.',
  })
  await track({ name: 'application_submit', props: { position: v.position } })
  revalidatePath('/admin/applicants')
  revalidatePath('/admin/ops')
  return { ok: true, data: { applicantId: applicant.id } }
}

export async function moveApplicantAction(id: string, stage: ApplicantStage, reason?: string): Promise<ActionResult> {
  await moveApplicantStage(id, stage, undefined, reason)
  revalidatePath('/admin/applicants')
  revalidatePath('/admin/ops')
  return { ok: true }
}

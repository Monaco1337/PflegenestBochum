'use server'

import { revalidatePath } from 'next/cache'
import { submitPflegegrad } from '@/core/services/pflegegrad'
import type { PflegegradAnswers } from '@/core/types'
import type { ActionResult } from './leads'
import { track } from '@/core/services/analytics'

export async function submitPflegegradAction(input: {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  zip?: string
  consent: boolean
  answers: PflegegradAnswers
  notes?: string
}): Promise<ActionResult<{ leadId: string; assessmentId: string }>> {
  try {
    const { assessment, lead } = await submitPflegegrad({
      contact: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        zip: input.zip,
        consentGiven: input.consent,
      },
      answers: input.answers,
      notes: input.notes,
    })
    await track({ name: 'pflegegrad_submit', props: { level: assessment.estimatedLevel, score: assessment.totalScore } })
    revalidatePath('/admin/ops')
    revalidatePath('/admin/crm/leads')
    return { ok: true, data: { leadId: lead.id, assessmentId: assessment.id } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

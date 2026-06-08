'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { contactFormSchema, callbackFormSchema } from '@/core/validation/schemas'
import { createLead, updateLeadStatus } from '@/core/services/leads'
import { repos } from '@/core/repositories'
import { track } from '@/core/services/analytics'
import type { LeadStatus } from '@/core/types'

export interface ActionResult<T = void> {
  ok: boolean
  error?: string
  data?: T
}

function ipFromHeaders(): string | undefined {
  const h = headers()
  const fwd = h.get('x-forwarded-for')
  return fwd ? fwd.split(',')[0].trim() : undefined
}

export async function submitContactForm(input: unknown): Promise<ActionResult<{ leadId: string }>> {
  const parsed = contactFormSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe.' }
  }
  const v = parsed.data
  const lead = await createLead({
    firstName: v.firstName,
    lastName: v.lastName,
    email: v.email,
    phone: v.phone || undefined,
    zip: v.zip,
    city: v.city,
    message: v.message,
    source: 'website_contact',
    consentGiven: true,
  })
  await repos.consentRecords.create({
    subject: 'lead',
    subjectId: lead.id,
    scope: 'contact_form',
    granted: true,
    text: 'Mit Einreichen des Kontaktformulars habe ich der Verarbeitung meiner personenbezogenen Daten zur Kontaktaufnahme gemäß DSGVO zugestimmt.',
    ip: ipFromHeaders(),
  })
  await track({ name: 'lead_form_submit', props: { source: 'contact' } })
  revalidatePath('/admin/ops')
  revalidatePath('/admin/crm/leads')
  return { ok: true, data: { leadId: lead.id } }
}

export async function submitCallbackForm(input: unknown): Promise<ActionResult<{ leadId: string }>> {
  const parsed = callbackFormSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe.' }
  }
  const v = parsed.data
  const lead = await createLead({
    firstName: v.firstName,
    lastName: v.lastName,
    phone: v.phone,
    message: v.preferredTime ? `Rückrufwunsch: ${v.preferredTime}` : 'Rückrufwunsch',
    source: 'website_callback',
    priority: 'high',
    consentGiven: true,
  })
  await repos.consentRecords.create({
    subject: 'lead',
    subjectId: lead.id,
    scope: 'callback',
    granted: true,
    text: 'Mit Einreichen des Rückrufwunschs habe ich der Verarbeitung meiner personenbezogenen Daten zur telefonischen Kontaktaufnahme zugestimmt.',
    ip: ipFromHeaders(),
  })
  await track({ name: 'lead_form_submit', props: { source: 'callback' } })
  revalidatePath('/admin/ops')
  return { ok: true, data: { leadId: lead.id } }
}

export async function updateLeadStatusAction(id: string, status: LeadStatus): Promise<ActionResult> {
  await updateLeadStatus(id, status)
  revalidatePath('/admin/crm/leads')
  revalidatePath('/admin/ops')
  return { ok: true }
}

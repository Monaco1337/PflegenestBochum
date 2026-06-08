'use server'

import { revalidatePath } from 'next/cache'
import { repos } from '@/core/repositories'
import { updatePatient } from '@/core/services/patients'
import { patientFormSchema } from '@/core/validation/schemas'
import type { ActionResult } from './leads'

export async function updatePatientAction(id: string, input: unknown): Promise<ActionResult> {
  const parsed = patientFormSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe.' }
  }
  await updatePatient(id, parsed.data as never)
  revalidatePath(`/admin/patients/${id}`)
  revalidatePath('/admin/patients')
  return { ok: true }
}

export async function addPatientNoteAction(patientId: string, body: string): Promise<ActionResult> {
  if (!body.trim()) return { ok: false, error: 'Notiz darf nicht leer sein.' }
  await repos.notes.create({ patientId, body, pinned: false })
  revalidatePath(`/admin/patients/${patientId}`)
  return { ok: true }
}

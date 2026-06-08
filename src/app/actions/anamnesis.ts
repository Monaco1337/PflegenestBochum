'use server'

import { revalidatePath } from 'next/cache'
import { submitAnamnesis } from '@/core/services/anamnesis'
import { storage } from '@/core/storage'
import type { AnamnesisData } from '@/core/types'
import type { ActionResult } from './leads'
import { track } from '@/core/services/analytics'

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.doc', '.docx', '.txt'])

const MIME_BY_EXT: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain',
}

export async function uploadAnamnesisDocumentAction(
  formData: FormData
): Promise<ActionResult<{ name: string; url: string; size: number }>> {
  try {
    const file = formData.get('file') as File | null
    if (!file) return { ok: false, error: 'Keine Datei ausgewählt.' }
    if (file.size > MAX_BYTES) return { ok: false, error: 'Datei ist zu groß (max. 10 MB).' }

    const ext = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return { ok: false, error: 'Dateityp nicht erlaubt. Erlaubt: PDF, JPG, PNG, DOC, DOCX, TXT.' }
    }

    const mimeType = file.type || MIME_BY_EXT[ext] || 'application/octet-stream'
    const arrayBuffer = await file.arrayBuffer()
    const stored = await storage.put({ name: file.name, data: arrayBuffer, mimeType })

    return { ok: true, data: { name: stored.name, url: stored.url, size: stored.size } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function submitAnamnesisAction(data: AnamnesisData): Promise<ActionResult<{ patientId: string; leadId: string }>> {
  try {
    const { lead, patient } = await submitAnamnesis({ data })
    await track({ name: 'anamnesis_submit' })
    revalidatePath('/admin/ops')
    revalidatePath('/admin/patients')
    revalidatePath('/admin/crm/leads')
    return { ok: true, data: { patientId: patient.id, leadId: lead.id } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

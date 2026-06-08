'use server'

import { revalidatePath } from 'next/cache'
import { repos } from '@/core/repositories'
import { storage } from '@/core/storage'
import { eventBus } from '@/core/events/bus'
import type { ActionResult } from './leads'
import type { DocumentCategory } from '@/core/types'

export async function uploadDocumentAction(formData: FormData): Promise<ActionResult<{ id: string; url: string }>> {
  try {
    const file = formData.get('file') as File | null
    const category = (formData.get('category') as DocumentCategory) ?? 'other'
    const patientId = (formData.get('patientId') as string) || undefined
    const applicantId = (formData.get('applicantId') as string) || undefined
    const employeeId = (formData.get('employeeId') as string) || undefined

    if (!file) return { ok: false, error: 'Keine Datei ausgewählt.' }
    const arrayBuffer = await file.arrayBuffer()
    const stored = await storage.put({ name: file.name, data: arrayBuffer, mimeType: file.type })
    const doc = await repos.documents.create({
      name: stored.name,
      category,
      url: stored.url,
      size: stored.size,
      mimeType: stored.mimeType,
      patientId,
      applicantId,
      employeeId,
    })
    await eventBus.emit('document.uploaded', { document: doc })
    revalidatePath('/admin/documents')
    if (patientId) revalidatePath(`/admin/patients/${patientId}`)
    if (applicantId) revalidatePath('/admin/applicants')
    return { ok: true, data: { id: doc.id, url: stored.url } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function assignDocumentAction(documentId: string, patientId?: string, applicantId?: string, employeeId?: string): Promise<ActionResult> {
  await repos.documents.update(documentId, {
    patientId: patientId ?? null,
    applicantId: applicantId ?? null,
    employeeId: employeeId ?? null,
  } as never)
  revalidatePath('/admin/documents')
  return { ok: true }
}

export async function archiveDocumentAction(id: string): Promise<ActionResult> {
  await repos.documents.update(id, { archivedAt: new Date().toISOString() })
  revalidatePath('/admin/documents')
  return { ok: true }
}

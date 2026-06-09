'use server'

import { revalidatePath } from 'next/cache'
import { repos, type Repositories } from '@/core/repositories'
import { requirePermission } from '@/core/auth/session'
import type { Permission } from '@/core/types'
import type { ActionResult } from './leads'

/**
 * Generic, permission-gated delete for admin list/board views. A single action
 * keeps every "Löschen" button consistent and lets operators clean up demo data
 * themselves. Only whitelisted collections are deletable.
 */
type DeletableCollection = keyof Pick<
  Repositories,
  | 'leads'
  | 'applicants'
  | 'patients'
  | 'relatives'
  | 'employees'
  | 'documents'
  | 'tasks'
  | 'pflegegradAssessments'
  | 'anamneses'
>

interface DeleteConfig {
  permission: Permission
  label: string
  revalidate: string[]
}

const DELETABLE: Record<DeletableCollection, DeleteConfig> = {
  leads: { permission: 'manage_patients', label: 'Lead', revalidate: ['/admin/crm/leads', '/admin/ops'] },
  applicants: { permission: 'manage_applicants', label: 'Bewerber', revalidate: ['/admin/applicants', '/admin/ops'] },
  patients: { permission: 'manage_patients', label: 'Patient', revalidate: ['/admin/patients', '/admin/ops'] },
  relatives: { permission: 'manage_patients', label: 'Angehörige:r', revalidate: ['/admin/crm/relatives'] },
  employees: { permission: 'manage_employees', label: 'Mitarbeiter:in', revalidate: ['/admin/employees', '/admin/ops'] },
  documents: { permission: 'manage_documents', label: 'Dokument', revalidate: ['/admin/documents'] },
  tasks: { permission: 'manage_tasks', label: 'Aufgabe', revalidate: ['/admin/tasks', '/admin/ops'] },
  pflegegradAssessments: { permission: 'manage_patients', label: 'Pflegegrad-Einschätzung', revalidate: ['/admin/crm/leads'] },
  anamneses: { permission: 'manage_patients', label: 'Anamnese', revalidate: ['/admin/patients'] },
}

export async function deleteEntityAction(
  collection: DeletableCollection,
  id: string
): Promise<ActionResult> {
  const config = DELETABLE[collection]
  if (!config) return { ok: false, error: 'Diese Daten können nicht gelöscht werden.' }

  try {
    await requirePermission(config.permission)
    await repos[collection].delete(id)
    for (const path of config.revalidate) revalidatePath(path)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export type { DeletableCollection }

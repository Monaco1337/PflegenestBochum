'use server'

import { revalidatePath } from 'next/cache'
import { repos } from '@/core/repositories'
import { requirePermission } from '@/core/auth/session'
import type { ActionResult } from './leads'
import type { User, UserRole } from '@/core/types'

export interface UserFormInput {
  name: string
  email: string
  role: UserRole
  active: boolean
}

const ASSIGNABLE_ROLES: UserRole[] = [
  'super_admin',
  'geschaeftsfuehrung',
  'pflegedienstleitung',
  'verwaltung',
  'recruiting',
  'mitarbeiter',
]

function validate(input: UserFormInput): string | null {
  if (!input.name.trim()) return 'Bitte einen Namen angeben.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) return 'Bitte eine gültige E-Mail angeben.'
  if (!ASSIGNABLE_ROLES.includes(input.role)) return 'Ungültige Rolle.'
  return null
}

export async function createUserAction(input: UserFormInput): Promise<ActionResult<{ id: string }>> {
  await requirePermission('manage_settings')
  const error = validate(input)
  if (error) return { ok: false, error }
  try {
    const email = input.email.trim().toLowerCase()
    const existing = (await repos.users.findMany(u => u.email.toLowerCase() === email))[0]
    if (existing) return { ok: false, error: 'Ein Account mit dieser E-Mail existiert bereits.' }

    const user = await repos.users.create({
      name: input.name.trim(),
      email,
      role: input.role,
      permissions: [],
      active: input.active,
    } as Omit<User, 'id' | 'createdAt' | 'updatedAt'>)

    revalidatePath('/admin/settings')
    revalidatePath('/login')
    return { ok: true, data: { id: user.id } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updateUserAction(id: string, input: UserFormInput): Promise<ActionResult> {
  await requirePermission('manage_settings')
  const error = validate(input)
  if (error) return { ok: false, error }
  try {
    const email = input.email.trim().toLowerCase()
    const clash = (await repos.users.findMany(u => u.email.toLowerCase() === email && u.id !== id))[0]
    if (clash) return { ok: false, error: 'Ein anderer Account nutzt diese E-Mail bereits.' }

    await repos.users.update(id, {
      name: input.name.trim(),
      email,
      role: input.role,
      active: input.active,
    })
    revalidatePath('/admin/settings')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  const session = await requirePermission('manage_settings')
  if (session.user.id === id) {
    return { ok: false, error: 'Sie können Ihren eigenen Account nicht löschen.' }
  }
  try {
    await repos.users.delete(id)
    revalidatePath('/admin/settings')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

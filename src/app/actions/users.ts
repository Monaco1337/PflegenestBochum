'use server'

import { revalidatePath } from 'next/cache'
import { repos } from '@/core/repositories'
import { requirePermission } from '@/core/auth/session'
import { hashPassword, validatePasswordStrength } from '@/core/auth/passwords'
import type { ActionResult } from './leads'
import type { User, UserRole } from '@/core/types'

export interface UserFormInput {
  name: string
  username: string
  email: string
  role: UserRole
  active: boolean
  /** Required on create; on update leave empty to keep the current password. */
  password?: string
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
  if (!/^[a-z0-9._-]{3,}$/i.test(input.username.trim())) {
    return 'Benutzername: mindestens 3 Zeichen, nur Buchstaben, Zahlen, . _ -'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) return 'Bitte eine gültige E-Mail angeben.'
  if (!ASSIGNABLE_ROLES.includes(input.role)) return 'Ungültige Rolle.'
  return null
}

export async function createUserAction(input: UserFormInput): Promise<ActionResult<{ id: string }>> {
  await requirePermission('manage_settings')
  const error = validate(input)
  if (error) return { ok: false, error }

  const password = input.password ?? ''
  const policy = validatePasswordStrength(password)
  if (policy) return { ok: false, error: policy }

  try {
    const email = input.email.trim().toLowerCase()
    const username = input.username.trim().toLowerCase()
    const clash = await repos.users.findMany(
      u => u.email.toLowerCase() === email || (u.username ?? '').toLowerCase() === username
    )
    if (clash.length > 0) {
      return { ok: false, error: 'Benutzername oder E-Mail wird bereits verwendet.' }
    }

    const user = await repos.users.create({
      name: input.name.trim(),
      username,
      email,
      passwordHash: await hashPassword(password),
      role: input.role,
      permissions: [],
      active: input.active,
    } as Omit<User, 'id' | 'createdAt' | 'updatedAt'>)

    revalidatePath('/admin/settings')
    return { ok: true, data: { id: user.id } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updateUserAction(id: string, input: UserFormInput): Promise<ActionResult> {
  await requirePermission('manage_settings')
  const error = validate(input)
  if (error) return { ok: false, error }

  // Password is optional on update — only validate/apply if one was provided.
  let passwordHash: string | undefined
  if (input.password && input.password.length > 0) {
    const policy = validatePasswordStrength(input.password)
    if (policy) return { ok: false, error: policy }
    passwordHash = await hashPassword(input.password)
  }

  try {
    const email = input.email.trim().toLowerCase()
    const username = input.username.trim().toLowerCase()
    const clash = await repos.users.findMany(
      u => u.id !== id && (u.email.toLowerCase() === email || (u.username ?? '').toLowerCase() === username)
    )
    if (clash.length > 0) {
      return { ok: false, error: 'Benutzername oder E-Mail wird bereits von einem anderen Account verwendet.' }
    }

    await repos.users.update(id, {
      name: input.name.trim(),
      username,
      email,
      role: input.role,
      active: input.active,
      ...(passwordHash ? { passwordHash } : {}),
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

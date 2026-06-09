'use server'

import { revalidatePath } from 'next/cache'
import { requireSession } from '@/core/auth/session'
import { repos } from '@/core/repositories'
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/core/auth/passwords'

export interface ChangePasswordResult {
  ok: boolean
  error?: string
}

/** Self-service password change for the logged-in user. */
export async function changeOwnPasswordAction(
  _prev: ChangePasswordResult | null,
  formData: FormData
): Promise<ChangePasswordResult> {
  const { user } = await requireSession()
  const current = String(formData.get('current') ?? '')
  const next = String(formData.get('next') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  const full = await repos.users.findById(user.id)
  if (!full) return { ok: false, error: 'Account nicht gefunden.' }

  if (full.passwordHash) {
    const valid = await verifyPassword(current, full.passwordHash)
    if (!valid) return { ok: false, error: 'Das aktuelle Passwort ist falsch.' }
  }

  if (next !== confirm) return { ok: false, error: 'Die neuen Passwörter stimmen nicht überein.' }
  const policy = validatePasswordStrength(next)
  if (policy) return { ok: false, error: policy }

  await repos.users.update(user.id, { passwordHash: await hashPassword(next) })
  revalidatePath('/admin/settings/profile')
  return { ok: true }
}

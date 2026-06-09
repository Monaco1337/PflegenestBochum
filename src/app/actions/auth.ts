'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { repos } from '@/core/repositories'
import { setSessionCookie, clearSessionCookie } from '@/core/auth/session'
import { verifyPassword } from '@/core/auth/passwords'
import { eventBus } from '@/core/events/bus'
import { bootstrap } from '@/core/bootstrap'

export interface LoginResult {
  ok: boolean
  error?: string
}

/**
 * Credential login by username (or e-mail) + password. On success the session
 * cookie is set and the user is redirected to the admin area; on failure a
 * generic error is returned (no account enumeration).
 */
export async function loginAction(_prev: LoginResult | null, formData: FormData): Promise<LoginResult> {
  await bootstrap()

  const identifier = String(formData.get('username') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  if (!identifier || !password) {
    return { ok: false, error: 'Bitte Benutzername und Passwort eingeben.' }
  }

  const match = (
    await repos.users.findMany(
      u => (u.username ?? '').toLowerCase() === identifier || u.email.toLowerCase() === identifier
    )
  )[0]

  const valid = match ? await verifyPassword(password, match.passwordHash) : false
  if (!match || !valid) {
    return { ok: false, error: 'Benutzername oder Passwort ist falsch.' }
  }
  if (!match.active) {
    return { ok: false, error: 'Dieser Account ist deaktiviert.' }
  }

  await setSessionCookie(match.id)
  await repos.users.update(match.id, { lastLoginAt: new Date().toISOString() })
  await eventBus.emit('user.logged_in', { user: match }, { actorId: match.id, source: 'login' })
  revalidatePath('/admin')
  redirect('/admin/ops')
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie()
  redirect('/login')
}

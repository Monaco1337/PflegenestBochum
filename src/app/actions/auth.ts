'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { repos } from '@/core/repositories'
import { setSessionCookie, clearSessionCookie } from '@/core/auth/session'
import { eventBus } from '@/core/events/bus'

/**
 * Demo-friendly login: lets users pick a role-bound demo user without password.
 * In production, replace with credential check + bcrypt + NextAuth/SSO.
 */
export async function demoLoginAction(userId: string): Promise<void> {
  const user = await repos.users.findById(userId)
  if (!user) throw new Error('Benutzer nicht gefunden')
  await setSessionCookie(user.id)
  await repos.users.update(user.id, { lastLoginAt: new Date().toISOString() })
  await eventBus.emit('user.logged_in', { user }, { actorId: user.id, source: 'login' })
  revalidatePath('/admin')
  redirect('/admin/ops')
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie()
  redirect('/login')
}

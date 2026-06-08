'use server'

import { revalidatePath } from 'next/cache'
import { repos } from '@/core/repositories'
import { requireSession } from '@/core/auth/session'
import type { ActionResult } from './leads'

export async function markNotificationReadAction(id: string): Promise<ActionResult> {
  const session = await requireSession()
  try {
    const notification = await repos.notifications.findById(id)
    if (!notification || notification.userId !== session.user.id) {
      return { ok: false, error: 'Benachrichtigung nicht gefunden.' }
    }
    if (!notification.readAt) {
      await repos.notifications.update(id, { readAt: new Date().toISOString() })
    }
    revalidatePath('/admin/notifications')
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function markAllNotificationsReadAction(): Promise<ActionResult<{ count: number }>> {
  const session = await requireSession()
  try {
    const unread = await repos.notifications.findMany(n => n.userId === session.user.id && !n.readAt)
    const now = new Date().toISOString()
    for (const n of unread) {
      await repos.notifications.update(n.id, { readAt: now })
    }
    revalidatePath('/admin/notifications')
    revalidatePath('/admin')
    return { ok: true, data: { count: unread.length } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

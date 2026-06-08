import { repos } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import type { Notification } from '@/core/types'

export async function notify(input: {
  userId: string
  title: string
  body?: string
  type: string
  href?: string
}): Promise<Notification> {
  return repos.notifications.create(input) as Promise<Notification>
}

export async function markRead(id: string): Promise<Notification> {
  return repos.notifications.update(id, { readAt: new Date().toISOString() }) as Promise<Notification>
}

export function installNotificationSubscribers() {
  eventBus.on('shift.conflict_detected', async event => {
    const operators = await repos.users.findMany(u => u.role === 'pflegedienstleitung' || u.role === 'super_admin')
    for (const op of operators) {
      await notify({
        userId: op.id,
        title: 'Schichtkonflikt erkannt',
        body: event.payload.conflicts.join('; '),
        type: 'shift_conflict',
        href: '/admin/shifts',
      })
    }
  })

  eventBus.on('lead.created', async event => {
    const recipients = await repos.users.findMany(
      u => u.role === 'verwaltung' || u.role === 'recruiting' || u.role === 'pflegedienstleitung' || u.role === 'super_admin'
    )
    for (const r of recipients) {
      await notify({
        userId: r.id,
        title: `Neuer Lead: ${event.payload.lead.firstName} ${event.payload.lead.lastName}`,
        body: `Quelle: ${event.payload.lead.source}`,
        type: 'lead_new',
        href: `/admin/crm/leads/${event.payload.lead.id}`,
      })
    }
  })

  eventBus.on('applicant.created', async event => {
    const recruiters = await repos.users.findMany(u => u.role === 'recruiting' || u.role === 'super_admin')
    for (const r of recruiters) {
      await notify({
        userId: r.id,
        title: `Neue Bewerbung: ${event.payload.applicant.firstName} ${event.payload.applicant.lastName}`,
        body: `Position: ${event.payload.applicant.position}`,
        type: 'applicant_new',
        href: `/admin/applicants`,
      })
    }
  })
}

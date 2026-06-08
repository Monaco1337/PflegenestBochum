'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { AlertTriangle, Bell, BellOff, Briefcase, Check, CheckCheck, UserPlus, type LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { RelativeTime } from '@/components/relative-time'
import { cn } from '@/lib/utils'
import { markAllNotificationsReadAction, markNotificationReadAction } from '@/app/actions/notifications'
import type { Notification } from '@/core/types'

const typeIcon: Record<string, LucideIcon> = {
  shift_conflict: AlertTriangle,
  lead_new: UserPlus,
  applicant_new: Briefcase,
}

export function NotificationsList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const unreadCount = notifications.filter(n => !n.readAt).length

  function markOne(id: string) {
    start(async () => {
      const res = await markNotificationReadAction(id)
      if (!res.ok) toast.error(res.error ?? 'Fehler')
      else router.refresh()
    })
  }

  function markAll() {
    start(async () => {
      const res = await markAllNotificationsReadAction()
      if (!res.ok) toast.error(res.error ?? 'Fehler')
      else {
        toast.success(res.data?.count ? `${res.data.count} als gelesen markiert` : 'Bereits alles gelesen')
        router.refresh()
      }
    })
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <BellOff className="h-6 w-6" aria-hidden />
        </span>
        <p className="mt-4 text-sm font-semibold text-foreground">Keine Benachrichtigungen</p>
        <p className="mt-1 text-sm text-muted-foreground">Sie sind auf dem neuesten Stand.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0 ? (
            <><span className="font-semibold text-foreground">{unreadCount}</span> ungelesen</>
          ) : (
            'Alle gelesen'
          )}
        </p>
        <Button size="sm" variant="outline" disabled={pending || unreadCount === 0} onClick={markAll}>
          <CheckCheck className="h-4 w-4" />
          Alle als gelesen markieren
        </Button>
      </div>

      <ul className="overflow-hidden rounded-2xl border border-border bg-card">
        {notifications.map((n, idx) => {
          const Icon = typeIcon[n.type] ?? Bell
          const unread = !n.readAt
          return (
            <li
              key={n.id}
              className={cn(
                'group relative flex items-start gap-3 px-4 py-3.5 transition-colors',
                idx > 0 && 'border-t border-border',
                unread ? 'bg-primary/[0.03]' : 'hover:bg-muted/40'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                  unread ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>

              <Link
                href={n.href ?? '#'}
                onClick={() => unread && markOne(n.id)}
                className="min-w-0 flex-1"
              >
                <div className="flex items-center gap-2">
                  {unread ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden /> : null}
                  <span className={cn('truncate text-sm', unread ? 'font-semibold text-foreground' : 'font-medium text-foreground/90')}>
                    {n.title}
                  </span>
                </div>
                {n.body ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.body}</p> : null}
                <RelativeTime date={n.createdAt} className="mt-1 block text-xs tabular-nums text-muted-foreground" />
              </Link>

              {unread ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 shrink-0 px-2 text-xs text-muted-foreground hover:text-primary"
                  disabled={pending}
                  onClick={() => markOne(n.id)}
                  aria-label="Als gelesen markieren"
                >
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Gelesen</span>
                </Button>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

import { repos } from '@/core/repositories'
import { getSession } from '@/core/auth/session'
import { PageHeader } from '@/components/feedback/states'
import { NotificationsList } from './notifications-list'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Benachrichtigungen' }

export default async function NotificationsPage() {
  const session = await getSession()
  if (!session) return null
  const notifications = await repos.notifications.findMany(n => n.userId === session.user.id)
  notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return (
    <>
      <PageHeader title="Benachrichtigungen" description="Alle Events, die für Sie relevant sind." />
      <NotificationsList notifications={notifications} />
    </>
  )
}

import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/layout/admin-shell'
import { bootstrap } from '@/core/bootstrap'
import { getSession } from '@/core/auth/session'
import { repos } from '@/core/repositories'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await bootstrap()
  const session = await getSession()
  if (!session) redirect('/login')
  const notifications = await repos.notifications.findMany(n => n.userId === session.user.id && !n.readAt)
  return <AdminShell notificationCount={notifications.length}>{children}</AdminShell>
}

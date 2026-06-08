import Link from 'next/link'
import { repos } from '@/core/repositories'
import { getSession } from '@/core/auth/session'
import { can, ROLE_PERMISSIONS } from '@/core/permissions/matrix'
import { PageHeader } from '@/components/feedback/states'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { permissionLabel, userRoleLabel } from '@/core/domain/labels'
import type { UserRole } from '@/core/types'
import { UsersTable } from './users-table'
import { UserFormDialog } from '@/modules/users/user-form-dialog'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Einstellungen' }

export default async function SettingsPage() {
  const [users, session] = await Promise.all([repos.users.all(), getSession()])
  const canManage = session ? can(session.user, 'manage_settings') : false

  return (
    <>
      <PageHeader title="Einstellungen" description="Benutzer, Rollen, Rechte und Workflows." />

      <div className="space-y-8">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Benutzer</h2>
              <p className="text-sm text-muted-foreground">Accounts für Mitarbeiter anlegen, bearbeiten und Rollen vergeben.</p>
            </div>
            {canManage ? <UserFormDialog /> : null}
          </div>
          <UsersTable data={users} currentUserId={session?.user.id} canManage={canManage} />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Rollen & Rechte</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(ROLE_PERMISSIONS) as UserRole[]).map(role => (
              <Card key={role}>
                <CardHeader>
                  <CardTitle className="text-base">{userRoleLabel[role]}</CardTitle>
                  <CardDescription>{ROLE_PERMISSIONS[role].length} Rechte</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {ROLE_PERMISSIONS[role].map(p => <li key={p}>· {permissionLabel[p]}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Workflows</h2>
          <Link href="/admin/settings/workflows" className="text-sm font-medium text-primary">Workflow-Übersicht öffnen →</Link>
        </section>
      </div>
    </>
  )
}

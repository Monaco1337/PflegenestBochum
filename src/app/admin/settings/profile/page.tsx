import Link from 'next/link'
import { ArrowRight, UserPlus } from 'lucide-react'
import { getSession } from '@/core/auth/session'
import { can } from '@/core/permissions/matrix'
import { PageHeader } from '@/components/feedback/states'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { userRoleLabel } from '@/core/domain/labels'
import { UserFormDialog } from '@/modules/users/user-form-dialog'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Profil' }

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) return null
  const canManage = can(session.user, 'manage_settings')

  return (
    <>
      <PageHeader title="Profil" description="Ihre Stammdaten und Berechtigungen." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{session.user.name}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">E-Mail:</span> {session.user.email}</div>
            <div><span className="text-muted-foreground">Rolle:</span> {userRoleLabel[session.user.role]}</div>
            <div><span className="text-muted-foreground">Aktive Rechte:</span> {session.user.effectivePermissions.length}</div>
          </CardContent>
        </Card>

        {canManage ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserPlus className="h-4 w-4 text-primary" aria-hidden />
                Benutzerverwaltung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                Legen Sie neue Zugänge für Mitarbeiter an und vergeben Sie passende Rollen und Berechtigungen.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <UserFormDialog />
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Alle Benutzer verwalten
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </>
  )
}

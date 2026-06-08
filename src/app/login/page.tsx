import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from 'lucide-react'
import { repos } from '@/core/repositories'
import { userRoleLabel } from '@/core/domain/labels'
import { bootstrap } from '@/core/bootstrap'
import { getSession } from '@/core/auth/session'
import { demoLoginAction } from '@/app/actions/auth'
import { Logo } from '@/components/brand/logo'

export const metadata = { title: 'Anmelden' }

export default async function LoginPage() {
  await bootstrap()
  const session = await getSession()
  if (session) redirect('/admin/ops')

  const users = await repos.users.all()
  return (
    <div className="min-h-dvh grid place-items-center bg-mesh-light dark:bg-mesh-dark p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Logo size="xl" priority />
          </div>
          <CardTitle>Anmeldung</CardTitle>
          <CardDescription>
            Demo-Modus: Wählen Sie eine Rolle, um sich anzumelden. In Produktion wird dieser Schritt durch SSO/Passwort ersetzt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Demo-Benutzer vorhanden. Starten Sie die Anwendung neu, damit der Seed läuft.</p>
          ) : null}
          {users.map(u => (
            <form key={u.id} action={async () => { 'use server'; await demoLoginAction(u.id) }}>
              <button className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left hover:bg-muted/40 transition-colors">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {u.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
                <Badge variant="muted">{userRoleLabel[u.role]}</Badge>
              </button>
            </form>
          ))}

          <div className="pt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Daten lokal in DEMO_MODE, kein Versand nach außen.
          </div>
        </CardContent>
      </Card>
      <Link href="/" className="mt-4 text-xs text-muted-foreground hover:text-foreground">← zur Startseite</Link>
    </div>
  )
}

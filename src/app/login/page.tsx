import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'
import { bootstrap } from '@/core/bootstrap'
import { getSession } from '@/core/auth/session'
import { LoginForm } from '@/modules/auth/login-form'
import { Logo } from '@/components/brand/logo'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Anmelden' }

export default async function LoginPage() {
  await bootstrap()
  const session = await getSession()
  if (session) redirect('/admin/ops')

  return (
    <div className="min-h-dvh grid place-items-center bg-mesh-light dark:bg-mesh-dark p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Logo size="xl" priority />
          </div>
          <CardTitle>Anmeldung</CardTitle>
          <CardDescription>
            Melden Sie sich mit Ihrem Benutzernamen und Passwort an.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Verschlüsselte Anmeldung. Zugriff nur für berechtigte Mitarbeiter.
          </div>
        </CardContent>
      </Card>
      <Link href="/" className="mt-4 text-xs text-muted-foreground hover:text-foreground">← zur Startseite</Link>
    </div>
  )
}

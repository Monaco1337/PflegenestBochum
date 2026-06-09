'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Lock, LogIn, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction, type LoginResult } from '@/app/actions/auth'

const initialState: LoginResult = { ok: false }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="h-11 w-full rounded-lg text-[0.9375rem] font-semibold">
      <LogIn className="h-4 w-4" />
      {pending ? 'Anmeldung…' : 'Anmelden'}
    </Button>
  )
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username">Benutzername</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="username"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="z. B. admin"
            className="pl-9"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Passwort</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="pl-9"
            required
          />
        </div>
      </div>

      {state?.error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  )
}

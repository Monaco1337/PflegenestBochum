'use client'

import { useEffect, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { changeOwnPasswordAction, type ChangePasswordResult } from '@/app/actions/account'

const initialState: ChangePasswordResult = { ok: false }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} size="sm">
      <KeyRound className="h-4 w-4" />
      {pending ? 'Speichert…' : 'Passwort ändern'}
    </Button>
  )
}

export function ChangePasswordForm() {
  const [state, formAction] = useFormState(changeOwnPasswordAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const lastOk = useRef(false)

  useEffect(() => {
    if (state.ok && !lastOk.current) {
      toast.success('Passwort aktualisiert.')
      formRef.current?.reset()
    }
    lastOk.current = state.ok
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="current">Aktuelles Passwort</Label>
        <Input id="current" name="current" type="password" autoComplete="current-password" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="next">Neues Passwort</Label>
          <Input id="next" name="next" type="password" autoComplete="new-password" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Wiederholen</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
        </div>
      </div>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">{state.error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">Mindestens 8 Zeichen, Buchstaben und Zahlen.</p>
      )}
      <SubmitButton />
    </form>
  )
}

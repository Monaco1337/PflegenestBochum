'use client'

import { useState, useTransition } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { userRoleLabel } from '@/core/domain/labels'
import { createUserAction, updateUserAction, type UserFormInput } from '@/app/actions/users'
import type { User, UserRole } from '@/core/types'

const ASSIGNABLE_ROLES: UserRole[] = [
  'super_admin',
  'geschaeftsfuehrung',
  'pflegedienstleitung',
  'verwaltung',
  'recruiting',
  'mitarbeiter',
]

function initialForm(user?: User): UserFormInput {
  return {
    name: user?.name ?? '',
    username: user?.username ?? '',
    email: user?.email ?? '',
    role: user?.role ?? 'mitarbeiter',
    active: user?.active ?? true,
    password: '',
  }
}

export function UserFormDialog({ user }: { user?: User }) {
  const isEdit = Boolean(user)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<UserFormInput>(() => initialForm(user))
  const [pending, start] = useTransition()

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (next) setForm(initialForm(user))
  }

  function submit() {
    start(async () => {
      const res = isEdit ? await updateUserAction(user!.id, form) : await createUserAction(form)
      if (!res.ok) {
        toast.error(res.error ?? 'Speichern fehlgeschlagen')
        return
      }
      toast.success(isEdit ? 'Account aktualisiert' : 'Account angelegt')
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={e => e.stopPropagation()}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Bearbeiten</span>
          </Button>
        ) : (
          <Button size="sm"><Plus className="h-4 w-4" /> Neuer Account</Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Account bearbeiten' : 'Neuer Account'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Stammdaten und Rolle anpassen.'
              : 'Neuen Mitarbeiter-Zugang anlegen. Die Rolle bestimmt die Berechtigungen.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Name *</Label>
            <Input value={form.name} placeholder="Vor- und Nachname" onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Benutzername *</Label>
              <Input
                value={form.username}
                autoCapitalize="none"
                spellCheck={false}
                placeholder="z. B. m.mustermann"
                onChange={e => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>E-Mail *</Label>
              <Input type="email" value={form.email} placeholder="name@pflegenest-bochum.de" onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>{isEdit ? 'Neues Passwort' : 'Passwort *'}</Label>
            <Input
              type="password"
              value={form.password ?? ''}
              autoComplete="new-password"
              placeholder={isEdit ? 'Leer lassen = unverändert' : 'Mind. 8 Zeichen, Buchstaben & Zahlen'}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Rolle</Label>
              <Select value={form.role} onValueChange={(v: UserRole) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.map(r => <SelectItem key={r} value={r}>{userRoleLabel[r]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.active ? 'active' : 'inactive'} onValueChange={v => setForm({ ...form, active: v === 'active' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button
            disabled={
              pending ||
              !form.name.trim() ||
              !form.username.trim() ||
              !form.email.trim() ||
              (!isEdit && !(form.password ?? '').trim())
            }
            onClick={submit}
          >
            {pending ? 'Speichert…' : isEdit ? 'Speichern' : 'Anlegen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createInsuranceAction, updateInsuranceAction, type InsuranceFormInput } from '@/app/actions/crm'
import type { InsuranceProvider } from '@/core/types'

function initialForm(insurance?: InsuranceProvider): InsuranceFormInput {
  return {
    name: insurance?.name ?? '',
    code: insurance?.code ?? '',
    phone: insurance?.phone ?? '',
    email: insurance?.email ?? '',
    address: insurance?.address ?? '',
  }
}

export function InsuranceFormDialog({ insurance }: { insurance?: InsuranceProvider }) {
  const isEdit = Boolean(insurance)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<InsuranceFormInput>(() => initialForm(insurance))
  const [pending, start] = useTransition()

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (next) setForm(initialForm(insurance))
  }

  function submit() {
    start(async () => {
      const res = isEdit ? await updateInsuranceAction(insurance!.id, form) : await createInsuranceAction(form)
      if (!res.ok) {
        toast.error(res.error ?? 'Speichern fehlgeschlagen')
        return
      }
      toast.success(isEdit ? 'Pflegekasse aktualisiert' : 'Pflegekasse angelegt')
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
          <Button size="sm"><Plus className="h-4 w-4" /> Neue Pflegekasse</Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Pflegekasse bearbeiten' : 'Neue Pflegekasse'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Stammdaten anpassen und speichern.' : 'Versicherer oder Pflegekasse mit den wichtigsten Daten anlegen.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input value={form.name} placeholder="z. B. AOK NordWest" onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Code / IK</Label>
              <Input value={form.code ?? ''} onChange={e => setForm({ ...form, code: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Telefon</Label>
              <Input value={form.phone ?? ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>E-Mail</Label>
              <Input type="email" value={form.email ?? ''} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Adresse</Label>
            <Input value={form.address ?? ''} placeholder="Straße, PLZ Ort" onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button disabled={pending || !form.name.trim()} onClick={submit}>
            {pending ? 'Speichert…' : isEdit ? 'Speichern' : 'Anlegen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

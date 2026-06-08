'use client'

import { useState, useTransition } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createDoctorAction, updateDoctorAction, type DoctorFormInput } from '@/app/actions/crm'
import type { Doctor } from '@/core/types'

function initialForm(doctor?: Doctor): DoctorFormInput {
  return {
    firstName: doctor?.firstName ?? '',
    lastName: doctor?.lastName ?? '',
    specialty: doctor?.specialty ?? '',
    phone: doctor?.phone ?? '',
    email: doctor?.email ?? '',
    address: doctor?.address ?? '',
  }
}

export function DoctorFormDialog({ doctor }: { doctor?: Doctor }) {
  const isEdit = Boolean(doctor)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<DoctorFormInput>(() => initialForm(doctor))
  const [pending, start] = useTransition()

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (next) setForm(initialForm(doctor))
  }

  function submit() {
    start(async () => {
      const res = isEdit ? await updateDoctorAction(doctor!.id, form) : await createDoctorAction(form)
      if (!res.ok) {
        toast.error(res.error ?? 'Speichern fehlgeschlagen')
        return
      }
      toast.success(isEdit ? 'Arzt aktualisiert' : 'Arzt angelegt')
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
          <Button size="sm"><Plus className="h-4 w-4" /> Neuer Arzt</Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Arzt bearbeiten' : 'Neuer Arzt'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Stammdaten anpassen und speichern.' : 'Haus- oder Facharzt mit den wichtigsten Daten anlegen.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Vorname *</Label>
              <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Nachname *</Label>
              <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Fachgebiet</Label>
            <Input value={form.specialty ?? ''} placeholder="z. B. Allgemeinmedizin" onChange={e => setForm({ ...form, specialty: e.target.value })} />
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
          <Button disabled={pending || !form.firstName.trim() || !form.lastName.trim()} onClick={submit}>
            {pending ? 'Speichert…' : isEdit ? 'Speichern' : 'Anlegen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createHospitalAction, updateHospitalAction, type HospitalFormInput } from '@/app/actions/crm'
import type { Hospital } from '@/core/types'

function initialForm(hospital?: Hospital): HospitalFormInput {
  return {
    name: hospital?.name ?? '',
    phone: hospital?.phone ?? '',
    email: hospital?.email ?? '',
    address: hospital?.address ?? '',
  }
}

export function HospitalFormDialog({ hospital }: { hospital?: Hospital }) {
  const isEdit = Boolean(hospital)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<HospitalFormInput>(() => initialForm(hospital))
  const [pending, start] = useTransition()

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (next) setForm(initialForm(hospital))
  }

  function submit() {
    start(async () => {
      const res = isEdit ? await updateHospitalAction(hospital!.id, form) : await createHospitalAction(form)
      if (!res.ok) {
        toast.error(res.error ?? 'Speichern fehlgeschlagen')
        return
      }
      toast.success(isEdit ? 'Krankenhaus aktualisiert' : 'Krankenhaus angelegt')
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
          <Button size="sm"><Plus className="h-4 w-4" /> Neues Krankenhaus</Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Krankenhaus bearbeiten' : 'Neues Krankenhaus'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Stammdaten anpassen und speichern.' : 'Klinik mit den wichtigsten Daten anlegen.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Name *</Label>
            <Input value={form.name} placeholder="z. B. Klinikum Bochum" onChange={e => setForm({ ...form, name: e.target.value })} />
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

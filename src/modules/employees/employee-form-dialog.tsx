'use client'

import { useState, useTransition } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { employmentStatusLabel, employmentTypeLabel } from '@/core/domain/labels'
import { createEmployeeAction, updateEmployeeAction, type EmployeeFormInput } from '@/app/actions/employees'
import type { Employee, EmploymentStatus, EmploymentType } from '@/core/types'

function initialForm(employee?: Employee): EmployeeFormInput {
  return {
    firstName: employee?.firstName ?? '',
    lastName: employee?.lastName ?? '',
    email: employee?.email ?? '',
    phone: employee?.phone ?? '',
    position: employee?.position ?? '',
    qualification: employee?.qualification ?? '',
    employmentType: employee?.employmentType ?? 'full_time',
    status: employee?.status ?? 'active',
    weeklyHours: employee?.weeklyHours ?? 39,
  }
}

export function EmployeeFormDialog({ employee }: { employee?: Employee }) {
  const isEdit = Boolean(employee)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<EmployeeFormInput>(() => initialForm(employee))
  const [pending, start] = useTransition()

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (next) setForm(initialForm(employee))
  }

  function submit() {
    start(async () => {
      const res = isEdit
        ? await updateEmployeeAction(employee!.id, form)
        : await createEmployeeAction(form)
      if (!res.ok) {
        toast.error(res.error ?? 'Speichern fehlgeschlagen')
        return
      }
      toast.success(isEdit ? 'Mitarbeiter aktualisiert' : 'Mitarbeiter angelegt')
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
          <Button size="sm"><Plus className="h-4 w-4" /> Neuer Mitarbeiter</Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Stammdaten anpassen und speichern.' : 'Neuen Mitarbeiter mit den wichtigsten Daten anlegen.'}
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

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>E-Mail</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Telefon</Label>
              <Input value={form.phone ?? ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Position *</Label>
              <Input value={form.position} placeholder="z. B. Pflegefachkraft" onChange={e => setForm({ ...form, position: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Qualifikation</Label>
              <Input value={form.qualification ?? ''} placeholder="z. B. Examiniert" onChange={e => setForm({ ...form, qualification: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label>Beschäftigung</Label>
              <Select value={form.employmentType} onValueChange={(v: EmploymentType) => setForm({ ...form, employmentType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(employmentTypeLabel) as EmploymentType[]).map(k => (
                    <SelectItem key={k} value={k}>{employmentTypeLabel[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: EmploymentStatus) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(employmentStatusLabel) as EmploymentStatus[]).map(k => (
                    <SelectItem key={k} value={k}>{employmentStatusLabel[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Wochenstunden</Label>
              <Input
                type="number"
                min={0}
                max={60}
                value={form.weeklyHours}
                onChange={e => setForm({ ...form, weeklyHours: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button disabled={pending || !form.firstName.trim() || !form.lastName.trim() || !form.position.trim()} onClick={submit}>
            {pending ? 'Speichert…' : isEdit ? 'Speichern' : 'Anlegen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

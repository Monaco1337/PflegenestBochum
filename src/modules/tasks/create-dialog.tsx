'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { priorityLabel, taskKindLabel } from '@/core/domain/labels'
import { createTaskAction } from '@/app/actions/tasks'
import type { Priority, TaskKind } from '@/core/types'

export function TaskCreateDialog() {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    kind: 'task' as TaskKind,
    dueDate: '',
  })

  function reset() {
    setForm({ title: '', description: '', priority: 'medium', kind: 'task', dueDate: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4" /> Neue Aufgabe</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Aufgabe</DialogTitle>
          <DialogDescription>Schnell anlegen — Verknüpfungen können später ergänzt werden.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Titel *</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Beschreibung</Label>
            <Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label>Art</Label>
              <Select value={form.kind} onValueChange={(v: TaskKind) => setForm({ ...form, kind: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(taskKindLabel) as TaskKind[]).map(k => <SelectItem key={k} value={k}>{taskKindLabel[k]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Priorität</Label>
              <Select value={form.priority} onValueChange={(v: Priority) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(priorityLabel) as Priority[]).map(p => <SelectItem key={p} value={p}>{priorityLabel[p]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Fällig</Label>
              <Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button
            disabled={pending || !form.title.trim()}
            onClick={() => {
              start(async () => {
                const res = await createTaskAction(form)
                if (!res.ok) toast.error(res.error ?? 'Fehler')
                else {
                  toast.success('Aufgabe erstellt')
                  reset()
                  setOpen(false)
                }
              })
            }}
          >
            {pending ? 'Speichert…' : 'Erstellen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

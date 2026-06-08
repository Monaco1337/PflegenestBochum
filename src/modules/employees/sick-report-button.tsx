'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { reportSickAction } from '@/app/actions/scheduling'

export function SickReportButton({ employeeId, disabled }: { employeeId: string; disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState('')
  const [note, setNote] = useState('')
  const [pending, start] = useTransition()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={disabled} onClick={e => e.stopPropagation()}>Krankmeldung</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Krankmeldung erfassen</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1"><Label>Von</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
          <div className="space-y-1"><Label>Bis (optional)</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
          <div className="space-y-1"><Label>Notiz</Label><Textarea rows={2} value={note} onChange={e => setNote(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button
            disabled={pending}
            onClick={() => start(async () => {
              const res = await reportSickAction(employeeId, new Date(startDate).toISOString(), endDate ? new Date(endDate).toISOString() : undefined, note)
              if (!res.ok) toast.error(res.error ?? 'Fehler')
              else { toast.success('Krankmeldung erfasst — Schichten geprüft'); setOpen(false); setNote(''); setEndDate('') }
            })}
          >
            {pending ? 'Speichert…' : 'Speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

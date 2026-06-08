'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addPatientNoteAction } from '@/app/actions/patients'

export function PatientNoteForm({ patientId }: { patientId: string }) {
  const [body, setBody] = useState('')
  const [pending, start] = useTransition()
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (!body.trim()) return
        start(async () => {
          const res = await addPatientNoteAction(patientId, body.trim())
          if (!res.ok) toast.error(res.error ?? 'Fehler')
          else {
            toast.success('Notiz gespeichert')
            setBody('')
          }
        })
      }}
      className="flex gap-2 items-start"
    >
      <Textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Neue Notiz…"
        rows={2}
        className="flex-1"
      />
      <Button type="submit" disabled={pending || !body.trim()}>Speichern</Button>
    </form>
  )
}

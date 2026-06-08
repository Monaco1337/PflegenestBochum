'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateLeadStatusAction } from '@/app/actions/leads'
import { leadStatusLabel } from '@/core/domain/labels'
import type { LeadStatus } from '@/core/types'

export function LeadStatusSwitcher({ id, current }: { id: string; current: LeadStatus }) {
  const [value, setValue] = useState<LeadStatus>(current)
  const [pending, start] = useTransition()
  return (
    <Select
      value={value}
      onValueChange={(v: LeadStatus) => {
        setValue(v)
        start(async () => {
          const res = await updateLeadStatusAction(id, v)
          if (!res.ok) toast.error(res.error ?? 'Aktualisierung fehlgeschlagen')
          else toast.success('Status aktualisiert')
        })
      }}
      disabled={pending}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(leadStatusLabel) as LeadStatus[]).map(s => (
          <SelectItem key={s} value={s}>{leadStatusLabel[s]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

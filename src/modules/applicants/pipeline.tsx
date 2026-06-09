'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KanbanBoard, type KanbanColumn } from '@/components/kanban/kanban-board'
import { applicantStageLabel, applicantStageOrder } from '@/core/domain/labels'
import type { Applicant, ApplicantStage } from '@/core/types'
import { moveApplicantAction } from '@/app/actions/applicants'
import { DeleteButton } from '@/components/admin/delete-button'

const stageColor: Record<ApplicantStage, string> = {
  new: 'bg-primary',
  phone_interview: 'bg-blue-500',
  onsite_interview: 'bg-indigo-500',
  trial_day: 'bg-purple-500',
  hired: 'bg-emerald-500',
  talent_pool: 'bg-slate-400',
  rejected: 'bg-rose-500',
}

export function ApplicantPipeline({ applicants }: { applicants: Applicant[] }) {
  const [list] = useState(applicants)

  const columns: KanbanColumn<Applicant>[] = applicantStageOrder.map(stage => ({
    id: stage,
    title: applicantStageLabel[stage],
    accent: stageColor[stage],
    items: list.filter(a => a.stage === stage),
  }))

  async function onMove(itemId: string, fromId: string, toId: string) {
    const res = await moveApplicantAction(itemId, toId as ApplicantStage)
    if (!res.ok) {
      toast.error(res.error ?? 'Stagewechsel fehlgeschlagen')
      throw new Error('move failed')
    }
    toast.success(`Verschoben nach „${applicantStageLabel[toId as ApplicantStage]}"`)
  }

  return (
    <KanbanBoard
      columns={columns}
      onMove={onMove}
      renderItem={a => <ApplicantCard a={a} />}
      emptyHint="Hierher ziehen"
    />
  )
}

function ApplicantCard({ a }: { a: Applicant }) {
  return (
    <Card className="border-0 shadow-none bg-transparent group/appl">
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{a.firstName} {a.lastName}</CardTitle>
          <Badge variant="info" className="tabular-nums">{a.score}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{a.position}</p>
      </CardHeader>
      <CardContent className="pb-3 pt-1">
        <div className="flex flex-wrap gap-1">
          {a.qualifications.slice(0, 2).map(q => (
            <Badge key={q} variant="muted" className="text-[10px] leading-4 py-0">{q}</Badge>
          ))}
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground truncate">{a.email}</p>
          <span className="opacity-0 transition-opacity group-hover/appl:opacity-100">
            <DeleteButton collection="applicants" id={a.id} name={`${a.firstName} ${a.lastName}`} entityLabel="Bewerber" />
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

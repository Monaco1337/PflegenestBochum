'use client'

import { DataTable, type DataTableColumn } from '@/components/tables/data-table'
import { Badge } from '@/components/ui/badge'
import { leadStatusLabel, leadSourceLabel, priorityLabel } from '@/core/domain/labels'
import { RelativeTime } from '@/components/relative-time'
import type { Lead, LeadStatus } from '@/core/types'

const statusVariant: Record<LeadStatus, 'info' | 'success' | 'destructive' | 'warning' | 'muted'> = {
  new: 'info',
  contacted: 'muted',
  qualified: 'success',
  anamnesis_scheduled: 'warning',
  anamnesis_done: 'success',
  won: 'success',
  lost: 'destructive',
}

export function LeadsTable({ data }: { data: Lead[] }) {
  const columns: DataTableColumn<Lead>[] = [
    { id: 'name', header: 'Name', sortKey: 'lastName', cell: l => <span className="font-medium">{l.firstName} {l.lastName}</span> },
    { id: 'source', header: 'Quelle', sortKey: 'source', cell: l => <Badge variant="muted">{leadSourceLabel[l.source]}</Badge> },
    { id: 'status', header: 'Status', sortKey: 'status', cell: l => <Badge variant={statusVariant[l.status]}>{leadStatusLabel[l.status]}</Badge> },
    { id: 'priority', header: 'Priorität', sortKey: 'priority', cell: l => priorityLabel[l.priority] },
    { id: 'contact', header: 'Kontakt', cell: l => <span className="text-xs text-muted-foreground">{l.email ?? '—'} · {l.phone ?? '—'}</span> },
    { id: 'created', header: 'Erstellt', sortKey: 'createdAt', cell: l => <RelativeTime date={l.createdAt} className="text-xs text-muted-foreground tabular-nums" /> },
  ]
  return (
    <DataTable
      data={data}
      columns={columns}
      searchableFields={['firstName', 'lastName', 'email', 'phone', 'message']}
      rowHref={l => `/admin/crm/leads/${l.id}`}
      emptyTitle="Noch keine Leads"
      emptyDescription="Sobald Anfragen über die Website eingehen, erscheinen sie hier."
    />
  )
}

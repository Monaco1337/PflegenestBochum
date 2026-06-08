'use client'

import { DataTable, type DataTableColumn } from '@/components/tables/data-table'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import type { AuditLog } from '@/core/types'

export function AuditTable({ data }: { data: AuditLog[] }) {
  const cols: DataTableColumn<AuditLog>[] = [
    { id: 'when', header: 'Zeitpunkt', sortKey: 'createdAt', cell: a => <span className="text-xs tabular-nums">{formatDateTime(a.createdAt)}</span> },
    { id: 'action', header: 'Aktion', sortKey: 'action', cell: a => <Badge variant="muted">{a.action}</Badge> },
    { id: 'entity', header: 'Entität', sortKey: 'entity', cell: a => `${a.entity}${a.entityId ? ' / ' + a.entityId.slice(0, 6) : ''}` },
    { id: 'actor', header: 'Akteur', cell: a => a.actorId ?? 'system' },
    { id: 'src', header: 'Quelle', cell: a => a.source ?? '—' },
  ]
  return <DataTable data={data} columns={cols} searchableFields={['action', 'entity', 'entityId', 'source']} emptyTitle="Noch keine Einträge" />
}

'use client'

import { DataTable, type DataTableColumn } from '@/components/tables/data-table'
import { Badge } from '@/components/ui/badge'
import { documentCategoryLabel } from '@/core/domain/labels'
import { DeleteButton } from '@/components/admin/delete-button'
import type { Document } from '@/core/types'
import { formatDate } from '@/lib/utils'

export function DocumentsTable({ data }: { data: Document[] }) {
  const cols: DataTableColumn<Document>[] = [
    { id: 'name', header: 'Name', sortKey: 'name', cell: d => <span className="font-medium truncate inline-block max-w-xs">{d.name}</span> },
    { id: 'cat', header: 'Kategorie', sortKey: 'category', cell: d => <Badge variant="muted">{documentCategoryLabel[d.category]}</Badge> },
    { id: 'size', header: 'Größe', cell: d => `${Math.max(1, Math.round(d.size / 1024))} kB` },
    {
      id: 'exp', header: 'Ablauf', cell: d => {
        if (!d.expiresAt) return <span className="text-muted-foreground">—</span>
        const expired = d.expiresAt < new Date().toISOString()
        const soon = d.expiresAt < new Date(Date.now() + 30 * 86400_000).toISOString()
        return <Badge variant={expired ? 'destructive' : soon ? 'warning' : 'muted'}>{formatDate(d.expiresAt)}</Badge>
      },
    },
    { id: 'archived', header: 'Archiv', cell: d => d.archivedAt ? <Badge variant="muted">archiviert</Badge> : <Badge variant="info">aktiv</Badge> },
    {
      id: 'actions', header: '', className: 'w-px text-right', cell: d => (
        <div className="flex items-center justify-end" onClick={ev => ev.stopPropagation()}>
          <DeleteButton collection="documents" id={d.id} name={d.name} entityLabel="Dokument" />
        </div>
      ),
    },
  ]
  return <DataTable data={data} columns={cols} searchableFields={['name']} emptyTitle="Noch keine Dokumente" />
}

'use client'

import { DataTable, type DataTableColumn } from '@/components/tables/data-table'
import { Badge } from '@/components/ui/badge'
import { relationKindLabel } from '@/core/domain/labels'
import type { Patient, Relative } from '@/core/types'

export function RelativesTable({ data, patients }: { data: Relative[]; patients: Patient[] }) {
  const patientMap = new Map(patients.map(p => [p.id, p]))
  const cols: DataTableColumn<Relative>[] = [
    { id: 'name', header: 'Name', sortKey: 'lastName', cell: r => <span className="font-medium">{r.firstName} {r.lastName}</span> },
    { id: 'relation', header: 'Beziehung', sortKey: 'relation', cell: r => relationKindLabel[r.relation] },
    { id: 'patient', header: 'Patient', cell: r => {
      const p = patientMap.get(r.patientId)
      return p ? `${p.firstName} ${p.lastName}` : '—'
    }},
    { id: 'contact', header: 'Kontakt', cell: r => <span className="text-xs text-muted-foreground">{r.email ?? '—'} · {r.phone ?? '—'}</span> },
    { id: 'primary', header: 'Hauptansprechpartner', cell: r => r.isPrimary ? <Badge variant="success">Ja</Badge> : <Badge variant="muted">Nein</Badge> },
  ]
  return (
    <DataTable
      data={data}
      columns={cols}
      searchableFields={['firstName', 'lastName', 'email', 'phone']}
      emptyTitle="Noch keine Angehörige"
    />
  )
}

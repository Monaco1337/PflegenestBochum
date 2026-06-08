'use client'

import { DataTable, type DataTableColumn } from '@/components/tables/data-table'
import { Badge } from '@/components/ui/badge'
import { careLevelLabel, patientStatusLabel } from '@/core/domain/labels'
import type { Patient } from '@/core/types'

export function PatientsTable({ data }: { data: Patient[] }) {
  const cols: DataTableColumn<Patient>[] = [
    { id: 'name', header: 'Name', sortKey: 'lastName', cell: p => <span className="font-medium">{p.firstName} {p.lastName}</span> },
    { id: 'status', header: 'Status', sortKey: 'status', cell: p => <Badge variant={p.status === 'active' ? 'success' : p.status === 'prospect' ? 'info' : 'muted'}>{patientStatusLabel[p.status]}</Badge> },
    { id: 'careLevel', header: 'Pflegegrad', sortKey: 'careLevel', cell: p => careLevelLabel[p.careLevel] },
    { id: 'risk', header: 'Risiko', cell: p => p.riskFlags.length > 0 ? <Badge variant="warning">{p.riskFlags.length}</Badge> : <Badge variant="muted">—</Badge> },
    { id: 'city', header: 'Ort', cell: p => p.city ?? '—' },
  ]
  return (
    <DataTable
      data={data}
      columns={cols}
      searchableFields={['firstName', 'lastName', 'phone', 'email', 'city']}
      rowHref={p => `/admin/patients/${p.id}`}
      emptyTitle="Noch keine Patienten"
      emptyDescription="Über die Anamnese und CRM-Workflows entstehen Patientenakten."
    />
  )
}

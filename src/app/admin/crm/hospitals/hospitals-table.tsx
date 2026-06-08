'use client'

import { DataTable, type DataTableColumn } from '@/components/tables/data-table'
import type { Hospital } from '@/core/types'
import { HospitalFormDialog } from '@/modules/crm/hospital-form-dialog'
import { CrmDeleteButton } from '@/modules/crm/crm-delete-button'

export function HospitalsTable({ data }: { data: Hospital[] }) {
  const cols: DataTableColumn<Hospital>[] = [
    { id: 'name', header: 'Name', sortKey: 'name', cell: h => <span className="font-medium">{h.name}</span> },
    { id: 'contact', header: 'Kontakt', cell: h => <span className="text-xs text-muted-foreground">{h.email ?? '—'} · {h.phone ?? '—'}</span> },
    { id: 'addr', header: 'Adresse', cell: h => h.address ?? '—' },
    {
      id: 'actions', header: 'Aktionen', cell: h => (
        <div className="flex items-center gap-1" onClick={ev => ev.stopPropagation()}>
          <HospitalFormDialog hospital={h} />
          <CrmDeleteButton kind="hospital" id={h.id} name={h.name} />
        </div>
      ),
    },
  ]
  return <DataTable data={data} columns={cols} searchableFields={['name']} emptyTitle="Noch keine Krankenhäuser erfasst" />
}

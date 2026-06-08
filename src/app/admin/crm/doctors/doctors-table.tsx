'use client'

import { DataTable, type DataTableColumn } from '@/components/tables/data-table'
import type { Doctor } from '@/core/types'
import { DoctorFormDialog } from '@/modules/crm/doctor-form-dialog'
import { CrmDeleteButton } from '@/modules/crm/crm-delete-button'

export function DoctorsTable({ data }: { data: Doctor[] }) {
  const cols: DataTableColumn<Doctor>[] = [
    { id: 'name', header: 'Name', sortKey: 'lastName', cell: d => <span className="font-medium">Dr. {d.firstName} {d.lastName}</span> },
    { id: 'spec', header: 'Fachgebiet', sortKey: 'specialty', cell: d => d.specialty ?? '—' },
    { id: 'contact', header: 'Kontakt', cell: d => <span className="text-xs text-muted-foreground">{d.email ?? '—'} · {d.phone ?? '—'}</span> },
    { id: 'addr', header: 'Adresse', cell: d => d.address ?? '—' },
    {
      id: 'actions', header: 'Aktionen', cell: d => (
        <div className="flex items-center gap-1" onClick={ev => ev.stopPropagation()}>
          <DoctorFormDialog doctor={d} />
          <CrmDeleteButton kind="doctor" id={d.id} name={`Dr. ${d.firstName} ${d.lastName}`} />
        </div>
      ),
    },
  ]
  return <DataTable data={data} columns={cols} searchableFields={['firstName', 'lastName', 'specialty']} emptyTitle="Noch keine Ärzte erfasst" />
}

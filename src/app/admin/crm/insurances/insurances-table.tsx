'use client'

import { DataTable, type DataTableColumn } from '@/components/tables/data-table'
import type { InsuranceProvider } from '@/core/types'
import { InsuranceFormDialog } from '@/modules/crm/insurance-form-dialog'
import { CrmDeleteButton } from '@/modules/crm/crm-delete-button'

export function InsurancesTable({ data }: { data: InsuranceProvider[] }) {
  const cols: DataTableColumn<InsuranceProvider>[] = [
    { id: 'name', header: 'Name', sortKey: 'name', cell: i => <span className="font-medium">{i.name}</span> },
    { id: 'code', header: 'Code', cell: i => i.code ?? '—' },
    { id: 'contact', header: 'Kontakt', cell: i => <span className="text-xs text-muted-foreground">{i.email ?? '—'} · {i.phone ?? '—'}</span> },
    {
      id: 'actions', header: 'Aktionen', cell: i => (
        <div className="flex items-center gap-1" onClick={ev => ev.stopPropagation()}>
          <InsuranceFormDialog insurance={i} />
          <CrmDeleteButton kind="insurance" id={i.id} name={i.name} />
        </div>
      ),
    },
  ]
  return <DataTable data={data} columns={cols} searchableFields={['name', 'code']} emptyTitle="Noch keine Pflegekassen erfasst" />
}

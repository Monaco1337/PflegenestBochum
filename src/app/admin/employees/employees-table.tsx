'use client'

import { DataTable, type DataTableColumn } from '@/components/tables/data-table'
import { Badge } from '@/components/ui/badge'
import { employmentStatusLabel, employmentTypeLabel } from '@/core/domain/labels'
import type { Employee } from '@/core/types'
import { SickReportButton } from '@/modules/employees/sick-report-button'
import { EmployeeFormDialog } from '@/modules/employees/employee-form-dialog'
import { EmployeeDeleteButton } from '@/modules/employees/employee-delete-button'

export function EmployeesTable({ data }: { data: Employee[] }) {
  const cols: DataTableColumn<Employee>[] = [
    { id: 'name', header: 'Name', sortKey: 'lastName', cell: e => <span className="font-medium">{e.firstName} {e.lastName}</span> },
    { id: 'position', header: 'Position', sortKey: 'position', cell: e => e.position },
    { id: 'qual', header: 'Qualifikation', cell: e => e.qualification ?? '—' },
    { id: 'type', header: 'Beschäftigung', cell: e => employmentTypeLabel[e.employmentType] },
    {
      id: 'status', header: 'Status', sortKey: 'status', cell: e => (
        <Badge variant={e.status === 'active' ? 'success' : e.status === 'sick' ? 'destructive' : 'warning'}>
          {employmentStatusLabel[e.status]}
        </Badge>
      ),
    },
    {
      id: 'actions', header: 'Aktionen', cell: e => (
        <div className="flex items-center gap-1" onClick={ev => ev.stopPropagation()}>
          <SickReportButton employeeId={e.id} disabled={e.status === 'sick'} />
          <EmployeeFormDialog employee={e} />
          <EmployeeDeleteButton employeeId={e.id} name={`${e.firstName} ${e.lastName}`} />
        </div>
      ),
    },
  ]
  return <DataTable data={data} columns={cols} searchableFields={['firstName', 'lastName', 'position', 'email']} emptyTitle="Noch keine Mitarbeiter" />
}

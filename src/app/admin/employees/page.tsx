import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { EmployeesTable } from './employees-table'
import { EmployeeFormDialog } from '@/modules/employees/employee-form-dialog'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Mitarbeiter' }

export default async function EmployeesPage() {
  const employees = await repos.employees.all()
  return (
    <>
      <PageHeader
        title="Mitarbeiter"
        description="Personalstamm, Status, Krankmeldungen & Touren."
        actions={<EmployeeFormDialog />}
      />
      <EmployeesTable data={employees} />
    </>
  )
}

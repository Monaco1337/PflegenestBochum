import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { ShiftsWeekView } from '@/modules/shifts/week-view'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Schichtplanung' }

export default async function ShiftsPage() {
  const [employees, shifts] = await Promise.all([repos.employees.all(), repos.shifts.all()])
  return (
    <>
      <PageHeader title="Schichtplanung" description="Wochenansicht mit Konflikt-Erkennung. Krankmeldungen und Urlaube werden berücksichtigt." />
      <ShiftsWeekView employees={employees} shifts={shifts} />
    </>
  )
}

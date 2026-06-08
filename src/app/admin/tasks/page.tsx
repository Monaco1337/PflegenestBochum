import { repos } from '@/core/repositories'
import { TasksBoard } from '@/modules/tasks/board'
import { PageHeader } from '@/components/feedback/states'
import { Button } from '@/components/ui/button'
import { TaskCreateDialog } from '@/modules/tasks/create-dialog'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Aufgaben' }

export default async function TasksPage() {
  const tasks = await repos.tasks.all()
  return (
    <>
      <PageHeader
        title="Aufgaben & Tickets"
        description="Kanban-Board mit Status, Priorität und Wiedervorlage."
        actions={<TaskCreateDialog />}
      />
      <TasksBoard tasks={tasks} />
    </>
  )
}

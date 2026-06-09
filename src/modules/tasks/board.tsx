'use client'

import { toast } from 'sonner'
import { KanbanBoard, type KanbanColumn } from '@/components/kanban/kanban-board'
import { taskStatusLabel, taskStatusOrder, priorityLabel } from '@/core/domain/labels'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Task, TaskStatus } from '@/core/types'
import { updateTaskStatusAction } from '@/app/actions/tasks'
import { DeleteButton } from '@/components/admin/delete-button'
import { formatDate } from '@/lib/utils'

const accent: Record<TaskStatus, string> = {
  open: 'bg-primary',
  in_progress: 'bg-blue-500',
  waiting: 'bg-amber-500',
  done: 'bg-emerald-500',
  escalated: 'bg-rose-500',
}

const priorityBadge = {
  low: 'muted' as const,
  medium: 'info' as const,
  high: 'warning' as const,
  urgent: 'destructive' as const,
}

export function TasksBoard({ tasks }: { tasks: Task[] }) {
  const columns: KanbanColumn<Task>[] = taskStatusOrder.map(status => ({
    id: status,
    title: taskStatusLabel[status],
    accent: accent[status],
    items: tasks.filter(t => t.status === status),
  }))

  async function onMove(itemId: string, _fromId: string, toId: string) {
    const res = await updateTaskStatusAction(itemId, toId as TaskStatus)
    if (!res.ok) {
      toast.error(res.error ?? 'Statuswechsel fehlgeschlagen')
      throw new Error('failed')
    }
    toast.success(`Verschoben nach „${taskStatusLabel[toId as TaskStatus]}"`)
  }

  return (
    <KanbanBoard
      columns={columns}
      onMove={onMove}
      renderItem={t => (
        <Card className="border-0 shadow-none bg-transparent group/task">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm">{t.title}</CardTitle>
              <Badge variant={priorityBadge[t.priority]}>{priorityLabel[t.priority]}</Badge>
            </div>
            {t.description ? <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p> : null}
          </CardHeader>
          <CardContent className="pb-3 pt-1 flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">{t.dueDate ? `Fällig ${formatDate(t.dueDate)}` : 'Ohne Frist'}</span>
            <div className="flex items-center gap-2">
              {t.tags.length > 0 ? <span className="text-[11px] text-muted-foreground truncate">#{t.tags[0]}</span> : null}
              <span className="opacity-0 transition-opacity group-hover/task:opacity-100">
                <DeleteButton collection="tasks" id={t.id} name={t.title} entityLabel="Aufgabe" />
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      emptyHint="Aufgabe hier hineinziehen"
    />
  )
}

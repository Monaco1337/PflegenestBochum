import { repos } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import type { Priority, Task, TaskKind, TaskStatus } from '@/core/types'

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  kind?: TaskKind
  priority?: Priority
  dueDate?: string
  followUpAt?: string
  assigneeId?: string
  createdById?: string
  patientId?: string
  applicantId?: string
  employeeId?: string
  leadId?: string
  tags?: string[]
}

export async function createTask(input: CreateTaskInput, actorId?: string): Promise<Task> {
  const created = (await repos.tasks.create({
    title: input.title,
    description: input.description,
    status: input.status ?? 'open',
    kind: input.kind ?? 'task',
    priority: input.priority ?? 'medium',
    dueDate: input.dueDate,
    followUpAt: input.followUpAt,
    assigneeId: input.assigneeId,
    createdById: input.createdById ?? actorId,
    patientId: input.patientId,
    applicantId: input.applicantId,
    employeeId: input.employeeId,
    leadId: input.leadId,
    tags: input.tags ?? [],
  })) as Task
  await eventBus.emit('task.created', { task: created }, { actorId })
  return created
}

export async function updateTaskStatus(id: string, next: TaskStatus, actorId?: string): Promise<Task> {
  const before = await repos.tasks.findById(id)
  if (!before) throw new Error('Aufgabe nicht gefunden')
  const updated = (await repos.tasks.update(id, {
    status: next,
    completedAt: next === 'done' ? new Date().toISOString() : undefined,
  })) as Task
  if (before.status !== next) {
    await eventBus.emit('task.status_changed', { task: updated, previous: before.status, next }, { actorId })
  }
  return updated
}

export async function deleteTask(id: string): Promise<boolean> {
  return repos.tasks.delete(id)
}

export async function listOverdueTasks(): Promise<Task[]> {
  const now = new Date().toISOString()
  return repos.tasks.findMany(t => t.status !== 'done' && Boolean(t.dueDate) && (t.dueDate as string) < now)
}

'use server'

import { revalidatePath } from 'next/cache'
import { taskFormSchema } from '@/core/validation/schemas'
import { createTask, deleteTask, updateTaskStatus } from '@/core/services/tasks'
import type { TaskStatus } from '@/core/types'
import type { ActionResult } from './leads'
import { repos } from '@/core/repositories'

export async function createTaskAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = taskFormSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe.' }
  }
  const t = await createTask({
    ...parsed.data,
    dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate).toISOString() : undefined,
  })
  revalidatePath('/admin/tasks')
  revalidatePath('/admin/ops')
  return { ok: true, data: { id: t.id } }
}

export async function updateTaskStatusAction(id: string, status: TaskStatus): Promise<ActionResult> {
  await updateTaskStatus(id, status)
  revalidatePath('/admin/tasks')
  revalidatePath('/admin/ops')
  return { ok: true }
}

export async function updateTaskAction(id: string, patch: Record<string, unknown>): Promise<ActionResult> {
  await repos.tasks.update(id, patch as never)
  revalidatePath('/admin/tasks')
  revalidatePath('/admin/ops')
  return { ok: true }
}

export async function deleteTaskAction(id: string): Promise<ActionResult> {
  await deleteTask(id)
  revalidatePath('/admin/tasks')
  revalidatePath('/admin/ops')
  return { ok: true }
}

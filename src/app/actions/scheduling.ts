'use server'

import { revalidatePath } from 'next/cache'
import { createShift, createTour, moveShift, updateTourStatus } from '@/core/services/scheduling'
import { repos } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import type { ActionResult } from './leads'
import type { Shift, TourStatus } from '@/core/types'

export async function createShiftAction(input: Parameters<typeof createShift>[0]): Promise<ActionResult> {
  await createShift(input)
  revalidatePath('/admin/shifts')
  revalidatePath('/admin/ops')
  return { ok: true }
}

export async function moveShiftAction(id: string, patch: Partial<Pick<Shift, 'date' | 'startTime' | 'endTime' | 'employeeId' | 'status' | 'tourId'>>): Promise<ActionResult> {
  await moveShift(id, patch)
  revalidatePath('/admin/shifts')
  return { ok: true }
}

export async function createTourAction(input: Parameters<typeof createTour>[0]): Promise<ActionResult> {
  await createTour(input)
  revalidatePath('/admin/tours')
  revalidatePath('/admin/ops')
  return { ok: true }
}

export async function updateTourStatusAction(id: string, status: TourStatus): Promise<ActionResult> {
  await updateTourStatus(id, status)
  revalidatePath('/admin/tours')
  return { ok: true }
}

export async function reportSickAction(employeeId: string, startDate: string, endDate?: string, note?: string): Promise<ActionResult> {
  await repos.sickReports.create({ employeeId, startDate, endDate, note })
  await repos.employees.update(employeeId, { status: 'sick' })
  const employee = await repos.employees.findById(employeeId)
  if (employee) {
    await eventBus.emit('employee.sick_reported', { employee, startDate, endDate })
  }
  revalidatePath('/admin/employees')
  revalidatePath('/admin/shifts')
  revalidatePath('/admin/ops')
  return { ok: true }
}

'use server'

import { revalidatePath } from 'next/cache'
import { repos } from '@/core/repositories'
import type { ActionResult } from './leads'
import type { Employee, EmploymentStatus, EmploymentType } from '@/core/types'

export interface EmployeeFormInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  position: string
  qualification?: string
  employmentType: EmploymentType
  status: EmploymentStatus
  weeklyHours: number
}

function validate(input: EmployeeFormInput): string | null {
  if (!input.firstName.trim()) return 'Bitte Vornamen angeben.'
  if (!input.lastName.trim()) return 'Bitte Nachnamen angeben.'
  if (!input.position.trim()) return 'Bitte Position angeben.'
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return 'Bitte eine gültige E-Mail angeben.'
  if (Number.isNaN(input.weeklyHours) || input.weeklyHours < 0 || input.weeklyHours > 60) {
    return 'Wochenstunden müssen zwischen 0 und 60 liegen.'
  }
  return null
}

export async function createEmployeeAction(input: EmployeeFormInput): Promise<ActionResult<{ id: string }>> {
  const error = validate(input)
  if (error) return { ok: false, error }
  try {
    const employee = await repos.employees.create({
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      position: input.position.trim(),
      qualification: input.qualification?.trim() || undefined,
      employmentType: input.employmentType,
      status: input.status,
      weeklyHours: input.weeklyHours,
      hireDate: new Date().toISOString().slice(0, 10),
      driverLicense: false,
      vehicle: false,
      skills: [],
      certifications: [],
      vacationDays: 30,
      vacationTakenDays: 0,
      overtimeHours: 0,
      active: input.status !== 'terminated',
    } as Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>)
    revalidatePath('/admin/employees')
    revalidatePath('/admin/ops')
    return { ok: true, data: { id: employee.id } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updateEmployeeAction(id: string, input: EmployeeFormInput): Promise<ActionResult> {
  const error = validate(input)
  if (error) return { ok: false, error }
  try {
    await repos.employees.update(id, {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      position: input.position.trim(),
      qualification: input.qualification?.trim() || undefined,
      employmentType: input.employmentType,
      status: input.status,
      weeklyHours: input.weeklyHours,
      active: input.status !== 'terminated',
    })
    revalidatePath('/admin/employees')
    revalidatePath('/admin/ops')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function deleteEmployeeAction(id: string): Promise<ActionResult> {
  try {
    await repos.employees.delete(id)
    revalidatePath('/admin/employees')
    revalidatePath('/admin/ops')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

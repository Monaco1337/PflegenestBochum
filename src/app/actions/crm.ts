'use server'

import { revalidatePath } from 'next/cache'
import { repos } from '@/core/repositories'
import type { ActionResult } from './leads'
import type { Doctor, Hospital, InsuranceProvider } from '@/core/types'

function isValidEmail(email?: string): boolean {
  if (!email) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ---------------------------------------------------------------------------
// Ärzte
// ---------------------------------------------------------------------------

export interface DoctorFormInput {
  firstName: string
  lastName: string
  specialty?: string
  phone?: string
  email?: string
  address?: string
}

function validateDoctor(input: DoctorFormInput): string | null {
  if (!input.firstName.trim()) return 'Bitte Vornamen angeben.'
  if (!input.lastName.trim()) return 'Bitte Nachnamen angeben.'
  if (!isValidEmail(input.email?.trim())) return 'Bitte eine gültige E-Mail angeben.'
  return null
}

function cleanDoctor(input: DoctorFormInput) {
  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    specialty: input.specialty?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    email: input.email?.trim() || undefined,
    address: input.address?.trim() || undefined,
  }
}

export async function createDoctorAction(input: DoctorFormInput): Promise<ActionResult<{ id: string }>> {
  const error = validateDoctor(input)
  if (error) return { ok: false, error }
  try {
    const doc = await repos.doctors.create(cleanDoctor(input) as Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>)
    revalidatePath('/admin/crm/doctors')
    return { ok: true, data: { id: doc.id } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updateDoctorAction(id: string, input: DoctorFormInput): Promise<ActionResult> {
  const error = validateDoctor(input)
  if (error) return { ok: false, error }
  try {
    await repos.doctors.update(id, cleanDoctor(input))
    revalidatePath('/admin/crm/doctors')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function deleteDoctorAction(id: string): Promise<ActionResult> {
  try {
    await repos.doctors.delete(id)
    revalidatePath('/admin/crm/doctors')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

// ---------------------------------------------------------------------------
// Pflegekassen
// ---------------------------------------------------------------------------

export interface InsuranceFormInput {
  name: string
  code?: string
  phone?: string
  email?: string
  address?: string
}

function validateInsurance(input: InsuranceFormInput): string | null {
  if (!input.name.trim()) return 'Bitte den Namen der Pflegekasse angeben.'
  if (!isValidEmail(input.email?.trim())) return 'Bitte eine gültige E-Mail angeben.'
  return null
}

function cleanInsurance(input: InsuranceFormInput) {
  return {
    name: input.name.trim(),
    code: input.code?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    email: input.email?.trim() || undefined,
    address: input.address?.trim() || undefined,
  }
}

export async function createInsuranceAction(input: InsuranceFormInput): Promise<ActionResult<{ id: string }>> {
  const error = validateInsurance(input)
  if (error) return { ok: false, error }
  try {
    const ins = await repos.insurances.create(cleanInsurance(input) as Omit<InsuranceProvider, 'id' | 'createdAt' | 'updatedAt'>)
    revalidatePath('/admin/crm/insurances')
    return { ok: true, data: { id: ins.id } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updateInsuranceAction(id: string, input: InsuranceFormInput): Promise<ActionResult> {
  const error = validateInsurance(input)
  if (error) return { ok: false, error }
  try {
    await repos.insurances.update(id, cleanInsurance(input))
    revalidatePath('/admin/crm/insurances')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function deleteInsuranceAction(id: string): Promise<ActionResult> {
  try {
    await repos.insurances.delete(id)
    revalidatePath('/admin/crm/insurances')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

// ---------------------------------------------------------------------------
// Krankenhäuser
// ---------------------------------------------------------------------------

export interface HospitalFormInput {
  name: string
  phone?: string
  email?: string
  address?: string
}

function validateHospital(input: HospitalFormInput): string | null {
  if (!input.name.trim()) return 'Bitte den Namen des Krankenhauses angeben.'
  if (!isValidEmail(input.email?.trim())) return 'Bitte eine gültige E-Mail angeben.'
  return null
}

function cleanHospital(input: HospitalFormInput) {
  return {
    name: input.name.trim(),
    phone: input.phone?.trim() || undefined,
    email: input.email?.trim() || undefined,
    address: input.address?.trim() || undefined,
  }
}

export async function createHospitalAction(input: HospitalFormInput): Promise<ActionResult<{ id: string }>> {
  const error = validateHospital(input)
  if (error) return { ok: false, error }
  try {
    const h = await repos.hospitals.create(cleanHospital(input) as Omit<Hospital, 'id' | 'createdAt' | 'updatedAt'>)
    revalidatePath('/admin/crm/hospitals')
    return { ok: true, data: { id: h.id } }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updateHospitalAction(id: string, input: HospitalFormInput): Promise<ActionResult> {
  const error = validateHospital(input)
  if (error) return { ok: false, error }
  try {
    await repos.hospitals.update(id, cleanHospital(input))
    revalidatePath('/admin/crm/hospitals')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function deleteHospitalAction(id: string): Promise<ActionResult> {
  try {
    await repos.hospitals.delete(id)
    revalidatePath('/admin/crm/hospitals')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

import { repos } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import type { CareLevel, Patient, PatientStatus } from '@/core/types'

export interface CreatePatientInput {
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: string
  street?: string
  zip?: string
  city?: string
  phone?: string
  email?: string
  status?: PatientStatus
  careLevel?: CareLevel
  riskFlags?: string[]
}

export async function createPatient(input: CreatePatientInput, actorId?: string): Promise<Patient> {
  const created = (await repos.patients.create({
    firstName: input.firstName,
    lastName: input.lastName,
    dateOfBirth: input.dateOfBirth,
    gender: input.gender,
    street: input.street,
    zip: input.zip,
    city: input.city,
    phone: input.phone,
    email: input.email,
    status: input.status ?? 'prospect',
    careLevel: input.careLevel ?? 'none',
    riskFlags: input.riskFlags ?? [],
  })) as Patient

  await eventBus.emit('patient.created', { patient: created }, { actorId })
  return created
}

export async function updatePatient(
  id: string,
  patch: Partial<Omit<Patient, 'id' | 'createdAt'>>,
  actorId?: string
): Promise<Patient> {
  const before = await repos.patients.findById(id)
  if (!before) throw new Error('Patient nicht gefunden')
  const updated = (await repos.patients.update(id, patch)) as Patient
  await eventBus.emit('patient.updated', { patient: updated }, { actorId })
  return updated
}

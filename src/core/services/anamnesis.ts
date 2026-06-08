import { repos } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import type { Anamnesis, AnamnesisData, Lead, Patient, Priority } from '@/core/types'
import { createLead } from './leads'
import { createPatient } from './patients'
import { createTask } from './tasks'

export interface SubmitAnamnesisInput {
  data: AnamnesisData
  documents?: Array<{ id: string }>
  actorId?: string
}

function computeUrgencyPriority(data: AnamnesisData): Priority {
  const factors: number[] = []
  factors.push(data.startPreference.urgency === 'urgent' ? 4 : data.startPreference.urgency === 'high' ? 3 : data.startPreference.urgency === 'medium' ? 2 : 1)
  factors.push(data.risks.suicidal ? 4 : 0)
  factors.push(data.risks.fallHistory ? 2 : 0)
  factors.push(data.wounds.hasWounds ? 2 : 0)
  factors.push(data.cognition.dementia ? 2 : 0)
  factors.push(data.mobility.bedridden ? 3 : 0)
  const sum = factors.reduce((a, b) => a + b, 0)
  if (sum >= 8) return 'urgent'
  if (sum >= 5) return 'high'
  if (sum >= 2) return 'medium'
  return 'low'
}

export async function submitAnamnesis(input: SubmitAnamnesisInput): Promise<{ anamnesis: Anamnesis; lead: Lead; patient: Patient }> {
  const { data, actorId } = input
  if (!data.consent.given) {
    throw new Error('Einwilligung erforderlich, um die Anamnese zu speichern.')
  }

  const priority = computeUrgencyPriority(data)

  const lead = await createLead({
    firstName: data.patient.firstName,
    lastName: data.patient.lastName,
    email: data.patient.email,
    phone: data.patient.phone,
    zip: data.patient.zip,
    city: data.patient.city,
    message: 'Digitale Anamnese eingegangen.',
    source: 'anamnesis_wizard',
    priority,
    consentGiven: true,
  }, actorId)

  const patient = await createPatient({
    firstName: data.patient.firstName,
    lastName: data.patient.lastName,
    dateOfBirth: data.patient.dateOfBirth,
    gender: data.patient.gender,
    street: data.patient.street,
    zip: data.patient.zip,
    city: data.patient.city,
    phone: data.patient.phone,
    email: data.patient.email,
    status: 'prospect',
    careLevel: data.insurance.careLevel,
    riskFlags: [
      data.risks.suicidal ? 'suicidal' : null,
      data.risks.aggression ? 'aggression' : null,
      data.risks.fallHistory ? 'fall_risk' : null,
      data.cognition.dementia ? 'dementia' : null,
      data.wounds.hasWounds ? 'wounds' : null,
      data.mobility.bedridden ? 'bedridden' : null,
    ].filter(Boolean) as string[],
  }, actorId)

  await repos.leads.update(lead.id, { patientId: patient.id })

  for (const rel of data.relatives) {
    await repos.relatives.create({
      firstName: rel.firstName,
      lastName: rel.lastName,
      relation: rel.relation,
      phone: rel.phone,
      email: rel.email,
      isPrimary: rel.isPrimary,
      hasPortalAccess: false,
      patientId: patient.id,
    })
  }

  if (data.insurance.name) {
    const existing = (await repos.insurances.findMany(i => i.name.toLowerCase() === data.insurance.name.toLowerCase()))[0]
    const ins = existing ?? (await repos.insurances.create({ name: data.insurance.name }))
    await repos.patients.update(patient.id, { insuranceId: ins.id })
  }

  if (data.doctor.firstName || data.doctor.lastName) {
    const doc = await repos.doctors.create({
      firstName: data.doctor.firstName,
      lastName: data.doctor.lastName,
      phone: data.doctor.phone,
      address: data.doctor.practice,
    })
    await repos.patients.update(patient.id, { primaryDoctorId: doc.id })
  }

  const docIds: string[] = []
  for (const file of data.documents ?? []) {
    const d = await repos.documents.create({
      name: file.name,
      category: 'patient_record',
      url: file.url,
      size: file.size,
      patientId: patient.id,
    })
    docIds.push(d.id)
    await eventBus.emit('document.uploaded', { document: d }, { actorId })
  }

  const anamnesis = (await repos.anamneses.create({
    leadId: lead.id,
    patientId: patient.id,
    data,
    consentGiven: true,
    signature: data.consent.signedName,
    submittedAt: new Date().toISOString(),
  })) as Anamnesis

  await repos.consentRecords.create({
    subject: 'anamnesis',
    subjectId: anamnesis.id,
    scope: 'data_processing',
    granted: true,
    text:
      'Hinweis: Mit Übermittlung der digitalen Anamnese habe ich der Verarbeitung meiner personenbezogenen Daten zur Vorbereitung der Pflegeleistungen gemäß DSGVO zugestimmt.',
  })

  await createTask({
    title: `Rückruf: ${patient.firstName} ${patient.lastName} (Anamnese)`,
    description: 'Rückruf nach digitaler Anamnese vereinbaren und nächste Schritte besprechen.',
    kind: 'callback',
    priority,
    leadId: lead.id,
    patientId: patient.id,
    tags: ['anamnese', 'rückruf'],
  }, actorId)

  await eventBus.emit('anamnesis.submitted', { anamnesis, lead, patient }, { actorId })

  return { anamnesis, lead, patient }
}

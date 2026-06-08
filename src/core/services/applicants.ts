import { repos } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import type { Applicant, ApplicantStage } from '@/core/types'

export interface CreateApplicantInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  city?: string
  position: string
  source?: string
  motivation?: string
  qualifications?: string[]
  cvUrl?: string
  consentGiven?: boolean
}

export function scoreApplicant(input: Pick<CreateApplicantInput, 'qualifications' | 'motivation'>): number {
  let score = 40
  score += Math.min(40, (input.qualifications?.length ?? 0) * 8)
  if (input.motivation && input.motivation.length > 200) score += 10
  if (input.motivation && input.motivation.length > 600) score += 5
  return Math.min(100, score)
}

export async function createApplicant(input: CreateApplicantInput, actorId?: string): Promise<Applicant> {
  const created = (await repos.applicants.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    city: input.city,
    position: input.position,
    source: input.source ?? 'career_page',
    motivation: input.motivation,
    qualifications: input.qualifications ?? [],
    cvUrl: input.cvUrl,
    consentGiven: Boolean(input.consentGiven),
    stage: 'new',
    score: scoreApplicant(input),
  })) as Applicant

  await eventBus.emit('applicant.created', { applicant: created }, { actorId })
  return created
}

export async function moveApplicantStage(
  id: string,
  next: ApplicantStage,
  actorId?: string,
  reason?: string
): Promise<Applicant> {
  const before = await repos.applicants.findById(id)
  if (!before) throw new Error('Bewerber nicht gefunden')
  const updated = (await repos.applicants.update(id, {
    stage: next,
    rejectedReason: next === 'rejected' ? (reason ?? before.rejectedReason) : undefined,
  })) as Applicant
  if (before.stage !== next) {
    await eventBus.emit(
      'applicant.stage_changed',
      { applicant: updated, previous: before.stage, next },
      { actorId }
    )
  }
  return updated
}

/**
 * Pflegegrad pre-assessment — server-side persistence and orchestration.
 *
 * NOTE: This is an orientation aid, not a legal/medical determination.
 * The result must be presented as "Einschätzung" only — the UI enforces this.
 *
 * Scoring is loosely aligned with the NBA (Neues Begutachtungsassessment)
 * weighting across six modules. Real determinations are made by MDK.
 */
import 'server-only'
import { repos } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import { createLead } from './leads'
import { createTask } from './tasks'
import type { Lead, PflegegradAnswers, PflegegradAssessment } from '@/core/types'
import { computeTotalScore, estimateCareLevel } from './pflegegrad-shared'

export { computeTotalScore, estimateCareLevel, moduleWeights, computeModuleScore } from './pflegegrad-shared'

export interface SubmitPflegegradInput {
  contact: {
    firstName: string
    lastName: string
    email?: string
    phone?: string
    zip?: string
    consentGiven: boolean
  }
  answers: PflegegradAnswers
  notes?: string
  actorId?: string
}

export async function submitPflegegrad(input: SubmitPflegegradInput): Promise<{
  assessment: PflegegradAssessment
  lead: Lead
}> {
  if (!input.contact.consentGiven) {
    throw new Error('Einwilligung erforderlich.')
  }
  const totalScore = computeTotalScore(input.answers)
  const estimatedLevel = estimateCareLevel(totalScore)

  const lead = await createLead({
    firstName: input.contact.firstName,
    lastName: input.contact.lastName,
    email: input.contact.email,
    phone: input.contact.phone,
    zip: input.contact.zip,
    message: `Pflegegrad-Voreinschätzung abgeschlossen. Hinweis: ${estimatedLevel.toUpperCase()} (Score ${totalScore}).`,
    source: 'pflegegrad_wizard',
    priority: estimatedLevel === 'pg4' || estimatedLevel === 'pg5' ? 'high' : 'medium',
    consentGiven: true,
  }, input.actorId)

  const assessment = (await repos.pflegegradAssessments.create({
    leadId: lead.id,
    answers: input.answers,
    totalScore,
    estimatedLevel,
    notes: input.notes,
  })) as PflegegradAssessment

  await repos.consentRecords.create({
    subject: 'pflegegrad',
    subjectId: assessment.id,
    scope: 'beratungsempfehlung',
    granted: true,
    text:
      'Hinweis: Die Pflegegrad-Voreinschätzung dient ausschließlich der Orientierung und stellt keine medizinische oder rechtsverbindliche Einstufung dar.',
  })

  await createTask({
    title: `Beratungsrückruf: ${input.contact.firstName} ${input.contact.lastName}`,
    description: `Pflegegrad-Voreinschätzung ${estimatedLevel.toUpperCase()} (Score ${totalScore}). Beratungsgespräch vereinbaren.`,
    kind: 'callback',
    priority: estimatedLevel === 'pg4' || estimatedLevel === 'pg5' ? 'high' : 'medium',
    leadId: lead.id,
    tags: ['pflegegrad', 'beratung'],
  }, input.actorId)

  await eventBus.emit('pflegegrad.completed', { assessment, lead }, { actorId: input.actorId })

  return { assessment, lead }
}

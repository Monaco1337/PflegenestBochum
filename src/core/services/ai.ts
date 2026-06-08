/**
 * AI Command Center.
 *
 * Iteration 1 ships rule-based heuristics that produce real, useful
 * recommendations from current data. When OPENAI_API_KEY or
 * ANTHROPIC_API_KEY is set, callers can swap in an LLM-backed implementation
 * — interface stays the same.
 *
 * Every recommendation is explicitly an "Assistenzhinweis": UI must label it.
 */

import { repos } from '@/core/repositories'
import type { AIRecommendation, RecommendationSeverity } from '@/core/types'

export interface IAIService {
  generateRecommendations(): Promise<AIRecommendation[]>
}

export class HeuristicAIService implements IAIService {
  async generateRecommendations(): Promise<AIRecommendation[]> {
    const [patients, employees, applicants, shifts, tours, tasks, leads, documents] = await Promise.all([
      repos.patients.all(),
      repos.employees.all(),
      repos.applicants.all(),
      repos.shifts.all(),
      repos.tours.all(),
      repos.tasks.all(),
      repos.leads.all(),
      repos.documents.all(),
    ])

    const recs: Omit<AIRecommendation, 'id' | 'createdAt'>[] = []

    const sickCount = employees.filter(e => e.status === 'sick').length
    if (sickCount >= Math.max(2, employees.length * 0.15)) {
      recs.push({
        entity: 'employee',
        title: `Erhöhte Krankheitsquote (${sickCount})`,
        body: 'Personalengpass möglich. Schicht- und Tourenplanung prüfen, ggf. Vertretungen aktivieren.',
        severity: 'attention',
        acted: false,
        source: 'heuristic',
      })
    }

    const newLeads = leads.filter(l => l.status === 'new')
    if (newLeads.length >= 3) {
      recs.push({
        entity: 'lead',
        title: `${newLeads.length} unbearbeitete Leads`,
        body: 'Neue Leads stapeln sich. Rückrufe zeitnah einplanen, um Conversion zu sichern.',
        severity: 'attention',
        acted: false,
        source: 'heuristic',
      })
    }

    const conflictedShifts = shifts.filter(s => s.conflicts.length > 0)
    if (conflictedShifts.length) {
      recs.push({
        entity: 'shift',
        title: `${conflictedShifts.length} Schicht-Konflikte`,
        body: 'Konfliktbehaftete Schichten lösen oder Vertretung einsetzen.',
        severity: 'risk',
        acted: false,
        source: 'heuristic',
      })
    }

    const conflictedTours = tours.filter(t => t.conflicts.length > 0)
    if (conflictedTours.length) {
      recs.push({
        entity: 'tour',
        title: `${conflictedTours.length} Touren mit Konflikten`,
        body: 'Touren mit Überlappung oder fehlender Qualifikation neu planen.',
        severity: 'risk',
        acted: false,
        source: 'heuristic',
      })
    }

    const overdue = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < new Date().toISOString())
    if (overdue.length >= 3) {
      recs.push({
        entity: 'task',
        title: `${overdue.length} überfällige Aufgaben`,
        body: 'Überfällige Aufgaben priorisieren oder neu zuweisen.',
        severity: 'attention',
        acted: false,
        source: 'heuristic',
      })
    }

    const newApplicants = applicants.filter(a => a.stage === 'new')
    if (newApplicants.length >= 3) {
      recs.push({
        entity: 'applicant',
        title: `${newApplicants.length} neue Bewerbungen`,
        body: 'Bewerbungen sichten und in das Telefoninterview aufnehmen, bevor Kandidat:innen abkühlen.',
        severity: 'info',
        acted: false,
        source: 'heuristic',
      })
    }

    const riskPatients = patients.filter(p => p.riskFlags.length >= 2)
    for (const p of riskPatients.slice(0, 3)) {
      recs.push({
        entity: 'patient',
        entityId: p.id,
        title: `Risikoprofil: ${p.firstName} ${p.lastName}`,
        body: `Mehrere Risiken (${p.riskFlags.join(', ')}). Begleitende Maßnahmen prüfen.`,
        severity: 'risk',
        acted: false,
        source: 'heuristic',
      })
    }

    const in30 = new Date(Date.now() + 30 * 86400_000).toISOString()
    const expiring = documents.filter(d => d.expiresAt && d.expiresAt < in30)
    if (expiring.length) {
      recs.push({
        entity: 'document',
        title: `${expiring.length} Dokumente laufen bald ab`,
        body: 'Ablaufende Dokumente erneuern lassen.',
        severity: 'attention',
        acted: false,
        source: 'heuristic',
      })
    }

    const persisted: AIRecommendation[] = []
    for (const rec of recs) {
      const existing = await repos.aiRecommendations.findMany(r => r.title === rec.title && !r.acted)
      if (existing.length) continue
      persisted.push((await repos.aiRecommendations.create(rec as never)) as AIRecommendation)
    }
    return persisted
  }
}

let activeService: IAIService = new HeuristicAIService()
export function setAIService(svc: IAIService) {
  activeService = svc
}
export function aiService(): IAIService {
  return activeService
}

export const severityRank: Record<RecommendationSeverity, number> = {
  info: 1,
  attention: 2,
  risk: 3,
  critical: 4,
}

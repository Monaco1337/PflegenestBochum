/**
 * Digital Twin — aggregates live state into the 10 perspectives required by the spec.
 * Snapshotted on demand and exposed to the dashboard.
 */
import { repos } from '@/core/repositories'
import type { DigitalTwinState } from '@/core/types'

export async function computeTwinState(): Promise<DigitalTwinState> {
  const [patients, employees, applicants, tours, shifts, documents, tasks, leads, risks] = await Promise.all([
    repos.patients.all(),
    repos.employees.all(),
    repos.applicants.all(),
    repos.tours.all(),
    repos.shifts.all(),
    repos.documents.all(),
    repos.tasks.all(),
    repos.leads.all(),
    repos.riskSignals.all(),
  ])

  const today = new Date()
  const in30Days = new Date(Date.now() + 30 * 86400_000).toISOString()

  const activeEmployees = employees.filter(e => e.status === 'active' && e.active).length
  const sickEmployees = employees.filter(e => e.status === 'sick').length
  const onLeaveEmployees = employees.filter(e => e.status === 'on_leave').length

  const totalCapacityHours = employees.reduce((acc, e) => acc + (e.active ? e.weeklyHours : 0), 0) / 7
  const todayShifts = shifts.filter(s => s.date.slice(0, 10) === today.toISOString().slice(0, 10))
  const usedHours = todayShifts.reduce((acc, s) => {
    const [h1, m1] = s.startTime.split(':').map(Number)
    const [h2, m2] = s.endTime.split(':').map(Number)
    return acc + Math.max(0, h2 + m2 / 60 - (h1 + m1 / 60))
  }, 0)
  const utilization = totalCapacityHours > 0 ? Math.min(100, Math.round((usedHours / totalCapacityHours) * 100)) : 0

  const conversion = leads.length > 0 ? Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100) : 0

  return {
    patients: {
      total: patients.length,
      active: patients.filter(p => p.status === 'active').length,
      prospects: patients.filter(p => p.status === 'prospect').length,
      risks: patients.filter(p => p.riskFlags.length > 0).length,
    },
    employees: {
      total: employees.length,
      active: activeEmployees,
      sick: sickEmployees,
      onLeave: onLeaveEmployees,
      utilization,
    },
    applicants: {
      total: applicants.length,
      new: applicants.filter(a => a.stage === 'new').length,
      inPipeline: applicants.filter(a => !['rejected', 'hired', 'talent_pool'].includes(a.stage)).length,
      hired: applicants.filter(a => a.stage === 'hired').length,
    },
    tours: {
      total: tours.length,
      planned: tours.filter(t => t.status === 'planned').length,
      conflicts: tours.filter(t => t.conflicts.length > 0).length,
    },
    shifts: {
      total: shifts.length,
      planned: shifts.filter(s => s.status === 'planned').length,
      conflicts: shifts.filter(s => s.conflicts.length > 0).length,
      substituteNeeded: shifts.filter(s => s.status === 'substitute_needed').length,
    },
    documents: {
      total: documents.length,
      expiring: documents.filter(d => d.expiresAt && d.expiresAt < in30Days).length,
      missing: 0,
    },
    tasks: {
      total: tasks.length,
      open: tasks.filter(t => t.status !== 'done').length,
      overdue: tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < new Date().toISOString()).length,
      escalated: tasks.filter(t => t.status === 'escalated').length,
    },
    leads: {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      conversion,
    },
    capacity: {
      used: Math.round(usedHours),
      available: Math.max(0, Math.round(totalCapacityHours - usedHours)),
    },
    risks: {
      total: risks.length,
      critical: risks.filter(r => r.severity === 'critical').length,
    },
  }
}

export function computeHealthScore(state: DigitalTwinState): number {
  let score = 100
  score -= state.shifts.conflicts * 3
  score -= state.tours.conflicts * 3
  score -= state.tasks.overdue * 2
  score -= state.tasks.escalated * 4
  score -= state.risks.critical * 5
  score -= state.documents.expiring
  if (state.employees.utilization > 95) score -= 5
  if (state.employees.utilization < 30 && state.employees.total > 0) score -= 5
  if (state.employees.sick > Math.max(1, state.employees.active * 0.2)) score -= 5
  return Math.max(0, Math.min(100, score))
}

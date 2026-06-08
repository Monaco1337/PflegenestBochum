/**
 * Typed event definitions for the internal event bus.
 *
 * Adding a new event:
 *   1. Add discriminated union entry below
 *   2. Optionally register a workflow trigger for it
 *   3. Optionally subscribe an audit/notification handler
 */

import type {
  Applicant,
  ApplicantStage,
  Document,
  Employee,
  Lead,
  LeadStatus,
  Patient,
  ShiftStatus,
  Task,
  TaskStatus,
  Tour,
  User,
  ID,
  AIRecommendation,
  RiskSignal,
  Anamnesis,
  PflegegradAssessment,
} from '@/core/types'

export interface BaseEvent<TName extends string, TPayload> {
  name: TName
  payload: TPayload
  actorId?: ID
  source?: string
  occurredAt: string
}

export type DomainEvent =
  | BaseEvent<'lead.created', { lead: Lead }>
  | BaseEvent<'lead.status_changed', { lead: Lead; previous: LeadStatus; next: LeadStatus }>
  | BaseEvent<'lead.assigned', { lead: Lead; assigneeId: ID }>
  | BaseEvent<'pflegegrad.completed', { assessment: PflegegradAssessment; lead: Lead }>
  | BaseEvent<'anamnesis.submitted', { anamnesis: Anamnesis; lead: Lead; patient: Patient }>
  | BaseEvent<'patient.created', { patient: Patient }>
  | BaseEvent<'patient.updated', { patient: Patient }>
  | BaseEvent<'document.uploaded', { document: Document }>
  | BaseEvent<'document.expiring', { document: Document; daysUntilExpiry: number }>
  | BaseEvent<'applicant.created', { applicant: Applicant }>
  | BaseEvent<'applicant.stage_changed', { applicant: Applicant; previous: ApplicantStage; next: ApplicantStage }>
  | BaseEvent<'employee.sick_reported', { employee: Employee; startDate: string; endDate?: string }>
  | BaseEvent<'shift.created', { shiftId: ID; status: ShiftStatus }>
  | BaseEvent<'shift.conflict_detected', { shiftId: ID; conflicts: string[] }>
  | BaseEvent<'tour.created', { tour: Tour }>
  | BaseEvent<'tour.optimization_needed', { tour: Tour; reason: string }>
  | BaseEvent<'task.created', { task: Task }>
  | BaseEvent<'task.status_changed', { task: Task; previous: TaskStatus; next: TaskStatus }>
  | BaseEvent<'task.overdue', { task: Task }>
  | BaseEvent<'ai.recommendation_created', { recommendation: AIRecommendation }>
  | BaseEvent<'risk.signal_created', { signal: RiskSignal }>
  | BaseEvent<'user.logged_in', { user: User }>
  | BaseEvent<'user.updated_record', { entity: string; entityId: ID }>

export type EventName = DomainEvent['name']
export type EventByName<N extends EventName> = Extract<DomainEvent, { name: N }>

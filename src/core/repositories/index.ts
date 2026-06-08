/**
 * Repository registry — single source of truth for all data access.
 *
 * Selects backend per env:
 *   - DATABASE_URL set  → Prisma (not implemented in iteration 1; throws clear error)
 *   - else             → In-memory + JSON persistence (DEMO_MODE)
 *
 * UI/services import `repos.<entity>` and never branch on the backend.
 */

import type {
  AIRecommendation,
  Anamnesis,
  Applicant,
  Appointment,
  AuditLog,
  AnalyticsEvent,
  ConsentRecord,
  DigitalTwinSnapshot,
  Doctor,
  Document,
  Employee,
  Hospital,
  InsuranceProvider,
  Lead,
  Message,
  Note,
  Notification,
  Patient,
  PflegegradAssessment,
  Relative,
  RiskSignal,
  Shift,
  SickReport,
  Task,
  TaskComment,
  Tour,
  TourStop,
  User,
  VacationRequest,
  Workflow,
  WorkflowRun,
} from '@/core/types'
import { MemoryRepository } from './memory/repository'
import type { IRepository } from './base'

const usePrisma = Boolean(process.env.DATABASE_URL) && process.env.DEMO_MODE !== 'true'

function makeMemory<T extends { id: string }>(
  collection: string,
  searchableFields: (keyof T)[] = [],
  defaultSortField: keyof T = 'createdAt' as keyof T
): IRepository<T> {
  return new MemoryRepository<T>({ collection, searchableFields, defaultSortField })
}

function notImplemented(name: string): IRepository<never> {
  throw new Error(
    `[repositories] Prisma backend for '${name}' is not implemented yet in this iteration. ` +
      'Unset DATABASE_URL or set DEMO_MODE=true to use the in-memory backend.'
  )
}

export interface Repositories {
  users: IRepository<User>
  leads: IRepository<Lead>
  patients: IRepository<Patient>
  relatives: IRepository<Relative>
  doctors: IRepository<Doctor>
  insurances: IRepository<InsuranceProvider>
  hospitals: IRepository<Hospital>
  applicants: IRepository<Applicant>
  employees: IRepository<Employee>
  documents: IRepository<Document>
  tasks: IRepository<Task>
  taskComments: IRepository<TaskComment>
  shifts: IRepository<Shift>
  tours: IRepository<Tour>
  tourStops: IRepository<TourStop>
  appointments: IRepository<Appointment>
  notes: IRepository<Note>
  messages: IRepository<Message>
  notifications: IRepository<Notification>
  workflows: IRepository<Workflow>
  workflowRuns: IRepository<WorkflowRun>
  anamneses: IRepository<Anamnesis>
  pflegegradAssessments: IRepository<PflegegradAssessment>
  auditLogs: IRepository<AuditLog>
  analyticsEvents: IRepository<AnalyticsEvent>
  consentRecords: IRepository<ConsentRecord>
  aiRecommendations: IRepository<AIRecommendation>
  riskSignals: IRepository<RiskSignal>
  sickReports: IRepository<SickReport>
  vacationRequests: IRepository<VacationRequest>
  twinSnapshots: IRepository<DigitalTwinSnapshot>
}

function createRepositories(): Repositories {
  if (usePrisma) {
    return notImplemented('all') as unknown as Repositories
  }

  return {
    users: makeMemory<User>('users', ['email', 'name']),
    leads: makeMemory<Lead>('leads', ['firstName', 'lastName', 'email', 'phone', 'message']),
    patients: makeMemory<Patient>('patients', ['firstName', 'lastName', 'email', 'phone', 'city']),
    relatives: makeMemory<Relative>('relatives', ['firstName', 'lastName', 'email', 'phone']),
    doctors: makeMemory<Doctor>('doctors', ['firstName', 'lastName', 'specialty']),
    insurances: makeMemory<InsuranceProvider>('insurances', ['name', 'code']),
    hospitals: makeMemory<Hospital>('hospitals', ['name']),
    applicants: makeMemory<Applicant>('applicants', ['firstName', 'lastName', 'email', 'position']),
    employees: makeMemory<Employee>('employees', ['firstName', 'lastName', 'email', 'position']),
    documents: makeMemory<Document>('documents', ['name']),
    tasks: makeMemory<Task>('tasks', ['title', 'description']),
    taskComments: makeMemory<TaskComment>('taskComments'),
    shifts: makeMemory<Shift>('shifts'),
    tours: makeMemory<Tour>('tours', ['name', 'notes']),
    tourStops: makeMemory<TourStop>('tourStops'),
    appointments: makeMemory<Appointment>('appointments', ['type', 'notes']),
    notes: makeMemory<Note>('notes', ['body']),
    messages: makeMemory<Message>('messages', ['subject', 'body']),
    notifications: makeMemory<Notification>('notifications', ['title', 'body']),
    workflows: makeMemory<Workflow>('workflows', ['name', 'triggerKey']),
    workflowRuns: makeMemory<WorkflowRun>('workflowRuns'),
    anamneses: makeMemory<Anamnesis>('anamneses'),
    pflegegradAssessments: makeMemory<PflegegradAssessment>('pflegegradAssessments'),
    auditLogs: makeMemory<AuditLog>('auditLogs', ['action', 'entity']),
    analyticsEvents: makeMemory<AnalyticsEvent>('analyticsEvents', ['name', 'path']),
    consentRecords: makeMemory<ConsentRecord>('consentRecords', ['subject', 'scope']),
    aiRecommendations: makeMemory<AIRecommendation>('aiRecommendations', ['title', 'body', 'entity']),
    riskSignals: makeMemory<RiskSignal>('riskSignals', ['body', 'type']),
    sickReports: makeMemory<SickReport>('sickReports'),
    vacationRequests: makeMemory<VacationRequest>('vacationRequests'),
    twinSnapshots: makeMemory<DigitalTwinSnapshot>('twinSnapshots'),
  }
}

declare global {
  var __pflegenest_repos__: Repositories | undefined
}

export const repos: Repositories = globalThis.__pflegenest_repos__ ?? createRepositories()
if (!globalThis.__pflegenest_repos__) globalThis.__pflegenest_repos__ = repos

export { MemoryRepository } from './memory/repository'
export type { IRepository } from './base'

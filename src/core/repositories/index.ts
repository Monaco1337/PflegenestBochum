/**
 * Repository registry — single source of truth for all data access.
 *
 * Selects backend per env:
 *   - POSTGRES_URL / DATABASE_URL set → Postgres (durable, cross-instance)
 *   - else                            → In-memory + JSON persistence (local dev)
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
import { PostgresUserRepository } from './postgres/user-repository'
import { PostgresRepository, ensureEntitySchema, claimSeedOnce } from './postgres/entity-repository'
import type { IRepository } from './base'

/**
 * On serverless the in-memory store is ephemeral and not shared across
 * instances, so anything submitted on the website would vanish. When a Postgres
 * connection is available (POSTGRES_URL / DATABASE_URL — injected automatically
 * when a database is linked) every collection is SQL-backed, so website forms
 * and the admin panel stay durably in sync. Locally (no DB) the in-memory store
 * with JSON persistence remains the fallback.
 */
export const hasPostgres = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL)

/** Build a repository for a collection, choosing the backend based on env. */
function makeRepo<T extends { id: string }>(
  collection: string,
  searchableFields: (keyof T)[] = [],
  defaultSortField: keyof T = 'createdAt' as keyof T
): IRepository<T> {
  return hasPostgres
    ? new PostgresRepository<T>({ collection, searchableFields, defaultSortField })
    : new MemoryRepository<T>({ collection, searchableFields, defaultSortField })
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
  return {
    users: hasPostgres ? new PostgresUserRepository() : makeRepo<User>('users', ['email', 'name']),
    leads: makeRepo<Lead>('leads', ['firstName', 'lastName', 'email', 'phone', 'message']),
    patients: makeRepo<Patient>('patients', ['firstName', 'lastName', 'email', 'phone', 'city']),
    relatives: makeRepo<Relative>('relatives', ['firstName', 'lastName', 'email', 'phone']),
    doctors: makeRepo<Doctor>('doctors', ['firstName', 'lastName', 'specialty']),
    insurances: makeRepo<InsuranceProvider>('insurances', ['name', 'code']),
    hospitals: makeRepo<Hospital>('hospitals', ['name']),
    applicants: makeRepo<Applicant>('applicants', ['firstName', 'lastName', 'email', 'position']),
    employees: makeRepo<Employee>('employees', ['firstName', 'lastName', 'email', 'position']),
    documents: makeRepo<Document>('documents', ['name']),
    tasks: makeRepo<Task>('tasks', ['title', 'description']),
    taskComments: makeRepo<TaskComment>('taskComments'),
    shifts: makeRepo<Shift>('shifts'),
    tours: makeRepo<Tour>('tours', ['name', 'notes']),
    tourStops: makeRepo<TourStop>('tourStops'),
    appointments: makeRepo<Appointment>('appointments', ['type', 'notes']),
    notes: makeRepo<Note>('notes', ['body']),
    messages: makeRepo<Message>('messages', ['subject', 'body']),
    notifications: makeRepo<Notification>('notifications', ['title', 'body']),
    workflows: makeRepo<Workflow>('workflows', ['name', 'triggerKey']),
    workflowRuns: makeRepo<WorkflowRun>('workflowRuns'),
    anamneses: makeRepo<Anamnesis>('anamneses'),
    pflegegradAssessments: makeRepo<PflegegradAssessment>('pflegegradAssessments'),
    auditLogs: makeRepo<AuditLog>('auditLogs', ['action', 'entity']),
    analyticsEvents: makeRepo<AnalyticsEvent>('analyticsEvents', ['name', 'path']),
    consentRecords: makeRepo<ConsentRecord>('consentRecords', ['subject', 'scope']),
    aiRecommendations: makeRepo<AIRecommendation>('aiRecommendations', ['title', 'body', 'entity']),
    riskSignals: makeRepo<RiskSignal>('riskSignals', ['body', 'type']),
    sickReports: makeRepo<SickReport>('sickReports'),
    vacationRequests: makeRepo<VacationRequest>('vacationRequests'),
    twinSnapshots: makeRepo<DigitalTwinSnapshot>('twinSnapshots'),
  }
}

declare global {
  var __pflegenest_repos__: Repositories | undefined
}

export const repos: Repositories = globalThis.__pflegenest_repos__ ?? createRepositories()
if (!globalThis.__pflegenest_repos__) globalThis.__pflegenest_repos__ = repos

/** Idempotently prepare the persistence backend (creates SQL tables in Postgres mode). */
export async function ensureStoreReady(): Promise<void> {
  const users = repos.users as { ensureSchema?: () => Promise<void> }
  if (typeof users.ensureSchema === 'function') {
    await users.ensureSchema()
  }
  if (hasPostgres) {
    await ensureEntitySchema()
  }
}

/**
 * Run a one-time action exactly once across instances. In Postgres mode this is
 * an atomic claim; in the single-process in-memory mode it is always granted.
 */
export async function claimOnce(key: string): Promise<boolean> {
  return hasPostgres ? claimSeedOnce(key) : true
}

export { MemoryRepository } from './memory/repository'
export type { IRepository } from './base'

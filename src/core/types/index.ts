/**
 * PflegeNest OS - Central Domain Types
 *
 * Canonical TypeScript types for all domain entities. Mirrors prisma/schema.prisma
 * but is independent of the persistence layer. UI and services depend on these
 * types — never on Prisma types directly — so swapping persistence is invisible.
 */

// -----------------------------------------------------------------------------
// Primitives
// -----------------------------------------------------------------------------

export type ID = string
export type ISODateTime = string
export type ISODate = string
export type Email = string
export type Phone = string

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

// -----------------------------------------------------------------------------
// Identity & Access
// -----------------------------------------------------------------------------

export type UserRole =
  | 'super_admin'
  | 'geschaeftsfuehrung'
  | 'pflegedienstleitung'
  | 'verwaltung'
  | 'recruiting'
  | 'mitarbeiter'
  | 'angehoerige'
  | 'patient'

export type Permission =
  | 'view_dashboard'
  | 'manage_patients'
  | 'view_patients'
  | 'manage_applicants'
  | 'manage_employees'
  | 'manage_documents'
  | 'manage_shifts'
  | 'manage_tours'
  | 'manage_tasks'
  | 'view_analytics'
  | 'manage_settings'
  | 'export_data'
  | 'delete_data'
  | 'view_audit_logs'

export interface User {
  id: ID
  /** Login handle (e.g. "admin"). Unique, case-insensitive. */
  username?: string
  email: Email
  name: string
  /** bcrypt hash — never exposed to the client. */
  passwordHash?: string
  role: UserRole
  permissions: Permission[]
  avatarUrl?: string
  active: boolean
  lastLoginAt?: ISODateTime
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface SessionUser extends User {
  effectivePermissions: Permission[]
}

// -----------------------------------------------------------------------------
// CRM Core
// -----------------------------------------------------------------------------

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'anamnesis_scheduled'
  | 'anamnesis_done'
  | 'won'
  | 'lost'

export type LeadSource =
  | 'website_contact'
  | 'website_callback'
  | 'pflegegrad_wizard'
  | 'anamnesis_wizard'
  | 'career'
  | 'phone'
  | 'referral'
  | 'other'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Lead {
  id: ID
  firstName: string
  lastName: string
  email?: Email
  phone?: Phone
  zip?: string
  city?: string
  status: LeadStatus
  source: LeadSource
  priority: Priority
  message?: string
  consentGiven: boolean
  patientId?: ID
  assigneeId?: ID
  metadata?: JsonValue
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

// -----------------------------------------------------------------------------
// Patients & Relatives
// -----------------------------------------------------------------------------

export type CareLevel = 'none' | 'pg1' | 'pg2' | 'pg3' | 'pg4' | 'pg5'

export type PatientStatus =
  | 'prospect'
  | 'active'
  | 'paused'
  | 'discharged'
  | 'deceased'

export interface Patient {
  id: ID
  firstName: string
  lastName: string
  dateOfBirth?: ISODate
  gender?: string
  street?: string
  zip?: string
  city?: string
  phone?: Phone
  email?: Email
  status: PatientStatus
  careLevel: CareLevel
  insuranceId?: ID
  primaryDoctorId?: ID
  hospitalId?: ID
  diagnoses?: string[]
  medications?: Medication[]
  notes?: string
  riskFlags: string[]
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface Medication {
  id: ID
  name: string
  dosage: string
  schedule: string
  notes?: string
}

export type RelationKind =
  | 'child'
  | 'spouse'
  | 'parent'
  | 'sibling'
  | 'guardian'
  | 'contact'
  | 'other'

export interface Relative {
  id: ID
  firstName: string
  lastName: string
  relation: RelationKind
  phone?: Phone
  email?: Email
  isPrimary: boolean
  hasPortalAccess: boolean
  patientId: ID
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface InsuranceProvider {
  id: ID
  name: string
  code?: string
  phone?: Phone
  email?: Email
  address?: string
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface Doctor {
  id: ID
  firstName: string
  lastName: string
  specialty?: string
  phone?: Phone
  email?: Email
  address?: string
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface Hospital {
  id: ID
  name: string
  phone?: Phone
  email?: Email
  address?: string
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

// -----------------------------------------------------------------------------
// Applicants & Employees
// -----------------------------------------------------------------------------

export type ApplicantStage =
  | 'new'
  | 'phone_interview'
  | 'onsite_interview'
  | 'trial_day'
  | 'hired'
  | 'talent_pool'
  | 'rejected'

export interface Applicant {
  id: ID
  firstName: string
  lastName: string
  email: Email
  phone?: Phone
  city?: string
  position: string
  stage: ApplicantStage
  score: number
  source?: string
  cvUrl?: string
  coverLetter?: string
  motivation?: string
  qualifications: string[]
  consentGiven: boolean
  rejectedReason?: string
  hiredEmployeeId?: ID
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export type EmploymentStatus =
  | 'active'
  | 'onboarding'
  | 'on_leave'
  | 'sick'
  | 'terminated'

export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'minijob'
  | 'trainee'
  | 'contractor'

export interface Employee {
  id: ID
  firstName: string
  lastName: string
  email: Email
  phone?: Phone
  position: string
  qualification?: string
  employmentType: EmploymentType
  status: EmploymentStatus
  weeklyHours: number
  hireDate?: ISODate
  driverLicense: boolean
  vehicle: boolean
  skills: string[]
  certifications: string[]
  vacationDays: number
  vacationTakenDays: number
  overtimeHours: number
  active: boolean
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface SickReport {
  id: ID
  employeeId: ID
  startDate: ISODate
  endDate?: ISODate
  note?: string
  createdAt: ISODateTime
}

export type VacationStatus = 'pending' | 'approved' | 'declined'

export interface VacationRequest {
  id: ID
  employeeId: ID
  startDate: ISODate
  endDate: ISODate
  status: VacationStatus
  note?: string
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

// -----------------------------------------------------------------------------
// Documents
// -----------------------------------------------------------------------------

export type DocumentCategory =
  | 'patient_record'
  | 'medication_plan'
  | 'doctor_report'
  | 'hospital_report'
  | 'pflegegutachten'
  | 'application'
  | 'employee_contract'
  | 'qualification'
  | 'internal'
  | 'consent'
  | 'other'

export interface Document {
  id: ID
  name: string
  category: DocumentCategory
  url: string
  size: number
  mimeType?: string
  uploadedBy?: ID
  patientId?: ID
  applicantId?: ID
  employeeId?: ID
  expiresAt?: ISODateTime
  archivedAt?: ISODateTime
  metadata?: JsonValue
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface DocumentVersion {
  id: ID
  documentId: ID
  version: number
  url: string
  uploadedBy?: ID
  createdAt: ISODateTime
}

// -----------------------------------------------------------------------------
// Tasks & Tickets
// -----------------------------------------------------------------------------

export type TaskStatus =
  | 'open'
  | 'in_progress'
  | 'waiting'
  | 'done'
  | 'escalated'

export type TaskKind = 'task' | 'ticket' | 'callback' | 'reminder'

export interface Task {
  id: ID
  title: string
  description?: string
  status: TaskStatus
  kind: TaskKind
  priority: Priority
  dueDate?: ISODateTime
  followUpAt?: ISODateTime
  assigneeId?: ID
  createdById?: ID
  patientId?: ID
  applicantId?: ID
  employeeId?: ID
  leadId?: ID
  tags: string[]
  metadata?: JsonValue
  completedAt?: ISODateTime
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface TaskComment {
  id: ID
  taskId: ID
  authorId?: ID
  body: string
  createdAt: ISODateTime
}

// -----------------------------------------------------------------------------
// Scheduling
// -----------------------------------------------------------------------------

export type ShiftType = 'early' | 'late' | 'night' | 'day' | 'on_call'

export type ShiftStatus =
  | 'planned'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'absent'
  | 'substitute_needed'

export interface Shift {
  id: ID
  employeeId: ID
  date: ISODate
  startTime: string
  endTime: string
  type: ShiftType
  status: ShiftStatus
  tourId?: ID
  note?: string
  conflicts: string[]
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export type TourStatus =
  | 'draft'
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export interface Tour {
  id: ID
  name: string
  date: ISODate
  employeeId?: ID
  startTime: string
  endTime?: string
  status: TourStatus
  conflicts: string[]
  notes?: string
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface TourStop {
  id: ID
  tourId: ID
  patientId: ID
  order: number
  plannedAt: string
  durationMinutes: number
  serviceType?: string
  notes?: string
  completedAt?: ISODateTime
}

export interface Appointment {
  id: ID
  patientId: ID
  type: string
  startAt: ISODateTime
  endAt: ISODateTime
  notes?: string
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

// -----------------------------------------------------------------------------
// Communications
// -----------------------------------------------------------------------------

export type MessageChannel = 'email' | 'sms' | 'phone' | 'portal' | 'internal'

export interface Message {
  id: ID
  channel: MessageChannel
  fromUserId?: ID
  toType: string
  toId?: ID
  subject?: string
  body: string
  meta?: JsonValue
  createdAt: ISODateTime
}

export interface Notification {
  id: ID
  userId: ID
  title: string
  body?: string
  type: string
  href?: string
  readAt?: ISODateTime
  createdAt: ISODateTime
}

export interface Note {
  id: ID
  body: string
  authorId?: ID
  patientId?: ID
  leadId?: ID
  applicantId?: ID
  pinned: boolean
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

// -----------------------------------------------------------------------------
// Anamnesis & Pflegegrad
// -----------------------------------------------------------------------------

export interface AnamnesisData {
  patient: {
    firstName: string
    lastName: string
    dateOfBirth?: string
    gender?: string
    street?: string
    zip?: string
    city?: string
    phone?: string
    email?: string
  }
  relatives: Array<{
    firstName: string
    lastName: string
    relation: RelationKind
    phone?: string
    email?: string
    isPrimary: boolean
  }>
  legalGuardian?: {
    firstName: string
    lastName: string
    phone?: string
  }
  insurance: {
    name: string
    memberNumber?: string
    careLevel: CareLevel
  }
  doctor: {
    firstName: string
    lastName: string
    practice?: string
    phone?: string
  }
  hospital?: {
    name: string
    dischargeDate?: string
    note?: string
  }
  diagnoses: string[]
  medications: Array<{ name: string; dosage: string; schedule: string }>
  mobility: {
    walkingAid: boolean
    wheelchair: boolean
    bedridden: boolean
    fallRisk: boolean
    notes?: string
  }
  careNeeds: {
    bodyCare: boolean
    nutritionHelp: boolean
    woundCare: boolean
    injections: boolean
    medicationGiving: boolean
    notes?: string
  }
  household: {
    livesAlone: boolean
    householdHelp: boolean
    cleaning: boolean
    cooking: boolean
    shopping: boolean
    laundry: boolean
  }
  cognition: {
    dementia: boolean
    confusion: boolean
    orientationIssues: boolean
    notes?: string
  }
  wounds: {
    hasWounds: boolean
    description?: string
  }
  risks: {
    aggression: boolean
    suicidal: boolean
    fallHistory: boolean
    infection: boolean
    notes?: string
  }
  startPreference: {
    desiredStart?: string
    urgency: Priority
  }
  documents: Array<{ name: string; url: string; size: number }>
  consent: {
    given: boolean
    signedName?: string
  }
}

export interface Anamnesis {
  id: ID
  leadId?: ID
  patientId?: ID
  data: AnamnesisData
  consentGiven: boolean
  signature?: string
  submittedAt: ISODateTime
  reviewedAt?: ISODateTime
  reviewedById?: ID
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface PflegegradAnswers {
  mobility: Record<string, number>
  cognition: Record<string, number>
  behaviour: Record<string, number>
  selfCare: Record<string, number>
  copingHealth: Record<string, number>
  dailyLife: Record<string, number>
}

export interface PflegegradAssessment {
  id: ID
  leadId?: ID
  answers: PflegegradAnswers
  totalScore: number
  estimatedLevel: CareLevel
  notes?: string
  pdfUrl?: string
  createdAt: ISODateTime
}

// -----------------------------------------------------------------------------
// Workflow Engine
// -----------------------------------------------------------------------------

export type WorkflowTriggerType = 'event' | 'schedule' | 'manual'

export type WorkflowStepKind =
  | 'create_lead'
  | 'update_lead'
  | 'create_patient'
  | 'update_patient'
  | 'create_applicant'
  | 'update_applicant'
  | 'create_task'
  | 'link_documents'
  | 'compute_priority'
  | 'flag_conflict'
  | 'send_notification'
  | 'emit_event'
  | 'compute_score'
  | 'update_pipeline'
  | 'create_risk_signal'

export interface WorkflowStep {
  id: ID
  kind: WorkflowStepKind
  condition?: string
  params?: Record<string, JsonValue>
}

export interface Workflow {
  id: ID
  name: string
  description?: string
  triggerType: WorkflowTriggerType
  triggerKey: string
  steps: WorkflowStep[]
  enabled: boolean
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export type WorkflowRunStatus = 'running' | 'succeeded' | 'failed' | 'partial'

export interface WorkflowRun {
  id: ID
  workflowId: ID
  status: WorkflowRunStatus
  trigger: JsonValue
  output?: JsonValue
  error?: string
  startedAt: ISODateTime
  finishedAt?: ISODateTime
}

// -----------------------------------------------------------------------------
// Audit, Events, Analytics, AI, Twin, Consent
// -----------------------------------------------------------------------------

export interface AuditLog {
  id: ID
  actorId?: ID
  action: string
  entity: string
  entityId?: ID
  before?: JsonValue
  after?: JsonValue
  source?: string
  ip?: string
  userAgent?: string
  createdAt: ISODateTime
}

export interface AnalyticsEvent {
  id: ID
  name: string
  sessionId?: string
  userId?: ID
  path?: string
  referrer?: string
  utm?: JsonValue
  device?: string
  props?: JsonValue
  createdAt: ISODateTime
}

export interface ConsentRecord {
  id: ID
  subject: string
  subjectId?: ID
  scope: string
  granted: boolean
  text: string
  ip?: string
  userAgent?: string
  createdAt: ISODateTime
}

export type RecommendationSeverity = 'info' | 'attention' | 'risk' | 'critical'

export interface AIRecommendation {
  id: ID
  entity: string
  entityId?: ID
  title: string
  body: string
  severity: RecommendationSeverity
  acted: boolean
  source: string
  createdAt: ISODateTime
}

export interface RiskSignal {
  id: ID
  patientId?: ID
  type: string
  severity: RecommendationSeverity
  body: string
  resolved: boolean
  createdAt: ISODateTime
}

export interface DigitalTwinSnapshot {
  id: ID
  capturedAt: ISODateTime
  state: DigitalTwinState
  health: number
}

export interface DigitalTwinState {
  patients: { total: number; active: number; prospects: number; risks: number }
  employees: { total: number; active: number; sick: number; onLeave: number; utilization: number }
  applicants: { total: number; new: number; inPipeline: number; hired: number }
  tours: { total: number; planned: number; conflicts: number }
  shifts: { total: number; planned: number; conflicts: number; substituteNeeded: number }
  documents: { total: number; expiring: number; missing: number }
  tasks: { total: number; open: number; overdue: number; escalated: number }
  leads: { total: number; new: number; conversion: number }
  capacity: { used: number; available: number }
  risks: { total: number; critical: number }
}

// -----------------------------------------------------------------------------
// Repository support types
// -----------------------------------------------------------------------------

export interface ListQuery<TSortKey extends string = string> {
  search?: string
  filters?: Record<string, JsonValue>
  sortBy?: TSortKey
  sortDir?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface Paginated<T> {
  data: T[]
  total: number
  offset: number
  limit: number
}

export type Entity =
  | 'user'
  | 'lead'
  | 'patient'
  | 'relative'
  | 'applicant'
  | 'employee'
  | 'doctor'
  | 'insurance'
  | 'hospital'
  | 'document'
  | 'task'
  | 'shift'
  | 'tour'
  | 'tourStop'
  | 'appointment'
  | 'note'
  | 'message'
  | 'notification'
  | 'workflow'
  | 'workflowRun'
  | 'anamnesis'
  | 'pflegegrad'
  | 'audit'
  | 'analytics'
  | 'consent'
  | 'aiRecommendation'
  | 'riskSignal'
  | 'sickReport'
  | 'vacationRequest'
  | 'twin'

/**
 * Human-readable labels for enums. Used by UI to display German text consistently.
 */
import type {
  ApplicantStage,
  CareLevel,
  DocumentCategory,
  EmploymentStatus,
  EmploymentType,
  LeadSource,
  LeadStatus,
  PatientStatus,
  Permission,
  Priority,
  RelationKind,
  ShiftStatus,
  ShiftType,
  TaskKind,
  TaskStatus,
  TourStatus,
  UserRole,
} from '@/core/types'

export const leadStatusLabel: Record<LeadStatus, string> = {
  new: 'Neu',
  contacted: 'Kontaktiert',
  qualified: 'Qualifiziert',
  anamnesis_scheduled: 'Anamnese geplant',
  anamnesis_done: 'Anamnese abgeschlossen',
  won: 'Gewonnen',
  lost: 'Verloren',
}

export const leadSourceLabel: Record<LeadSource, string> = {
  website_contact: 'Kontaktformular',
  website_callback: 'Rückrufanfrage',
  pflegegrad_wizard: 'Pflegegrad-Rechner',
  anamnesis_wizard: 'Digitale Anamnese',
  career: 'Karriere',
  phone: 'Telefon',
  referral: 'Empfehlung',
  other: 'Sonstige',
}

export const priorityLabel: Record<Priority, string> = {
  low: 'Niedrig',
  medium: 'Mittel',
  high: 'Hoch',
  urgent: 'Dringend',
}

export const careLevelLabel: Record<CareLevel, string> = {
  none: 'Kein Pflegegrad',
  pg1: 'Pflegegrad 1',
  pg2: 'Pflegegrad 2',
  pg3: 'Pflegegrad 3',
  pg4: 'Pflegegrad 4',
  pg5: 'Pflegegrad 5',
}

export const patientStatusLabel: Record<PatientStatus, string> = {
  prospect: 'Interessent',
  active: 'Aktiv',
  paused: 'Pausiert',
  discharged: 'Entlassen',
  deceased: 'Verstorben',
}

export const applicantStageLabel: Record<ApplicantStage, string> = {
  new: 'Neu',
  phone_interview: 'Telefoninterview',
  onsite_interview: 'Vorstellungsgespräch',
  trial_day: 'Probearbeiten',
  hired: 'Einstellung',
  talent_pool: 'Talentpool',
  rejected: 'Abgelehnt',
}

export const applicantStageOrder: ApplicantStage[] = [
  'new',
  'phone_interview',
  'onsite_interview',
  'trial_day',
  'hired',
  'talent_pool',
  'rejected',
]

export const employmentStatusLabel: Record<EmploymentStatus, string> = {
  active: 'Aktiv',
  onboarding: 'Onboarding',
  on_leave: 'Im Urlaub',
  sick: 'Krank',
  terminated: 'Ausgeschieden',
}

export const employmentTypeLabel: Record<EmploymentType, string> = {
  full_time: 'Vollzeit',
  part_time: 'Teilzeit',
  minijob: 'Minijob',
  trainee: 'Auszubildende:r',
  contractor: 'Freelance',
}

export const documentCategoryLabel: Record<DocumentCategory, string> = {
  patient_record: 'Patientenunterlagen',
  medication_plan: 'Medikationsplan',
  doctor_report: 'Arztbericht',
  hospital_report: 'Krankenhausbericht',
  pflegegutachten: 'Pflegegutachten',
  application: 'Bewerbung',
  employee_contract: 'Mitarbeitervertrag',
  qualification: 'Qualifikation',
  internal: 'Internes Dokument',
  consent: 'Einwilligung',
  other: 'Sonstiges',
}

export const relationKindLabel: Record<RelationKind, string> = {
  child: 'Kind',
  spouse: 'Ehepartner:in',
  parent: 'Elternteil',
  sibling: 'Geschwister',
  guardian: 'Betreuer:in',
  contact: 'Kontaktperson',
  other: 'Sonstige',
}

export const taskStatusLabel: Record<TaskStatus, string> = {
  open: 'Offen',
  in_progress: 'In Bearbeitung',
  waiting: 'Wartet',
  done: 'Erledigt',
  escalated: 'Eskaliert',
}

export const taskStatusOrder: TaskStatus[] = [
  'open',
  'in_progress',
  'waiting',
  'done',
  'escalated',
]

export const taskKindLabel: Record<TaskKind, string> = {
  task: 'Aufgabe',
  ticket: 'Ticket',
  callback: 'Rückruf',
  reminder: 'Wiedervorlage',
}

export const shiftTypeLabel: Record<ShiftType, string> = {
  early: 'Frühdienst',
  late: 'Spätdienst',
  night: 'Nachtdienst',
  day: 'Tagdienst',
  on_call: 'Bereitschaft',
}

export const shiftStatusLabel: Record<ShiftStatus, string> = {
  planned: 'Geplant',
  confirmed: 'Bestätigt',
  in_progress: 'Läuft',
  completed: 'Abgeschlossen',
  absent: 'Ausgefallen',
  substitute_needed: 'Vertretung gesucht',
}

export const tourStatusLabel: Record<TourStatus, string> = {
  draft: 'Entwurf',
  planned: 'Geplant',
  in_progress: 'Läuft',
  completed: 'Abgeschlossen',
  cancelled: 'Abgesagt',
}

export const userRoleLabel: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  geschaeftsfuehrung: 'Geschäftsführung',
  pflegedienstleitung: 'Pflegedienstleitung',
  verwaltung: 'Verwaltung',
  recruiting: 'Recruiting',
  mitarbeiter: 'Mitarbeiter:in',
  angehoerige: 'Angehörige',
  patient: 'Patient:in',
}

export const permissionLabel: Record<Permission, string> = {
  view_dashboard: 'Dashboard anzeigen',
  manage_patients: 'Patienten verwalten',
  view_patients: 'Patienten ansehen',
  manage_applicants: 'Bewerber verwalten',
  manage_employees: 'Mitarbeiter verwalten',
  manage_documents: 'Dokumente verwalten',
  manage_shifts: 'Schichten verwalten',
  manage_tours: 'Touren verwalten',
  manage_tasks: 'Aufgaben verwalten',
  view_analytics: 'Analytics ansehen',
  manage_settings: 'Einstellungen verwalten',
  export_data: 'Daten exportieren',
  delete_data: 'Daten löschen',
  view_audit_logs: 'Audit-Logs ansehen',
}

export const priorityWeight: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
}

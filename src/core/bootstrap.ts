/**
 * Bootstrap: install event subscribers, default workflows, seed demo data.
 * Must be idempotent. Called once per process from the root layout.
 */
import 'server-only'
import { repos, ensureUserStoreReady } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import { installDefaultAuditSubscribers } from '@/core/audit'
import { installWorkflowEngine } from '@/core/workflows/engine'
import { installNotificationSubscribers } from '@/core/services/notifications'
import { ensureAuthAccounts } from '@/core/auth/seed-accounts'
import { seedDemoData } from '@/core/seed'

let booted = false

export async function bootstrap() {
  if (booted) return
  booted = true

  // Reset first: the event bus is a persistent global singleton, so without
  // this a hot-reload would register a second (third, …) copy of every
  // subscriber and fire duplicate notifications/workflows for a single event.
  eventBus.clearAllHandlers()
  installDefaultAuditSubscribers()
  await installWorkflowEngine()
  installNotificationSubscribers()

  // Prepare the user backend (creates the SQL table in Postgres mode) and make
  // sure the three fixed operator logins always exist — local and online.
  await ensureUserStoreReady()
  await ensureAuthAccounts()

  // Demo content for the rest of the admin panel (decoupled from the user seed
  // so the login list stays limited to the real accounts).
  if (process.env.DEMO_MODE !== 'false') {
    const existingPatients = await repos.patients.all()
    if (existingPatients.length === 0) {
      await seedDemoData()
    }
  }

  await ensureDefaultWorkflows()
}

async function ensureDefaultWorkflows() {
  const existing = await repos.workflows.all()
  if (existing.length > 0) return

  await repos.workflows.create({
    name: 'Anamnese → Folgeaufgaben',
    description: 'Aktualisiert Operations-Wall, erzeugt Risikosignal bei hoher Pflegestufe.',
    triggerType: 'event',
    triggerKey: 'anamnesis.submitted',
    enabled: true,
    steps: [
      {
        id: 'pri',
        kind: 'compute_priority',
        params: { factors: { base: 3 } },
      },
    ],
  })

  await repos.workflows.create({
    name: 'Bewerbung → Recruiting-Pipeline',
    description: 'Berechnet Score und erstellt Erstkontakt-Aufgabe.',
    triggerType: 'event',
    triggerKey: 'applicant.created',
    enabled: true,
    steps: [
      { id: 'score', kind: 'compute_score', params: { base: 50 } },
      {
        id: 'task',
        kind: 'create_task',
        params: {
          title: 'Bewerber:in kontaktieren',
          description: 'Erstkontakt aufnehmen, Telefoninterview anbieten.',
          kind: 'callback',
          priority: 'high',
          tags: ['bewerbung', 'recruiting'],
        },
      },
      { id: 'pipeline', kind: 'update_pipeline' },
    ],
  })

  await repos.workflows.create({
    name: 'Krankmeldung → Schicht-/Touren-Konflikte markieren',
    description: 'Markiert konfliktäre Schichten/Touren und erzeugt Vertretungsaufgabe.',
    triggerType: 'event',
    triggerKey: 'employee.sick_reported',
    enabled: true,
    steps: [
      {
        id: 'task',
        kind: 'create_task',
        params: {
          title: 'Vertretung organisieren',
          description: 'Krankmeldung eingegangen. Schichten/Touren prüfen und Vertretung einsetzen.',
          kind: 'task',
          priority: 'urgent',
          tags: ['vertretung', 'schicht'],
        },
      },
      { id: 'flag', kind: 'flag_conflict' },
    ],
  })
}

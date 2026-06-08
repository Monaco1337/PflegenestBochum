/**
 * Workflow Engine — executes step definitions in response to events.
 *
 * Step kinds are intentionally narrow and explicit; UI workflow editor
 * works against this enum, so no eval/dynamic-code surface area.
 *
 * Runs are persisted to `workflowRuns` for traceability.
 */

import type {
  Workflow,
  WorkflowStep,
  WorkflowRun,
  WorkflowStepKind,
  JsonValue,
} from '@/core/types'
import { repos } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import type { DomainEvent } from '@/core/events/types'

export type StepContext = {
  event: DomainEvent
  payload: Record<string, unknown>
  log: string[]
}

type StepRunner = (ctx: StepContext, params?: Record<string, JsonValue>) => Promise<Record<string, unknown>>

const stepRunners: Record<WorkflowStepKind, StepRunner> = {
  create_lead: async ctx => {
    const fromPayload = ctx.event.payload as Record<string, unknown>
    const seedLead = (fromPayload.lead as Record<string, unknown>) ?? {}
    const created = await repos.leads.create({
      firstName: (seedLead.firstName as string) ?? 'Unbekannt',
      lastName: (seedLead.lastName as string) ?? '—',
      email: seedLead.email as string | undefined,
      phone: seedLead.phone as string | undefined,
      status: 'new',
      source: (seedLead.source as never) ?? 'other',
      priority: 'medium',
      consentGiven: Boolean(seedLead.consentGiven),
    })
    ctx.log.push(`create_lead → ${created.id}`)
    return { leadId: created.id }
  },
  update_lead: async (ctx, params) => {
    const id = (params?.leadId as string) ?? (ctx.payload.leadId as string)
    if (!id) return {}
    const updated = await repos.leads.update(id, (params?.patch as Record<string, never>) ?? {})
    ctx.log.push(`update_lead → ${id}`)
    return { leadId: updated.id }
  },
  create_patient: async (ctx, params) => {
    const fromPayload = (params?.data as Record<string, unknown>) ?? (ctx.payload.patient as Record<string, unknown>) ?? {}
    const created = await repos.patients.create({
      firstName: (fromPayload.firstName as string) ?? 'Unbekannt',
      lastName: (fromPayload.lastName as string) ?? '—',
      status: 'prospect',
      careLevel: (fromPayload.careLevel as never) ?? 'none',
      riskFlags: [],
    })
    ctx.log.push(`create_patient → ${created.id}`)
    return { patientId: created.id }
  },
  update_patient: async (ctx, params) => {
    const id = (params?.patientId as string) ?? (ctx.payload.patientId as string)
    if (!id) return {}
    await repos.patients.update(id, (params?.patch as Record<string, never>) ?? {})
    ctx.log.push(`update_patient → ${id}`)
    return { patientId: id }
  },
  create_applicant: async ctx => {
    return ctx.payload
  },
  update_applicant: async (ctx, params) => {
    const id = (params?.applicantId as string) ?? (ctx.payload.applicantId as string)
    if (!id) return {}
    await repos.applicants.update(id, (params?.patch as Record<string, never>) ?? {})
    ctx.log.push(`update_applicant → ${id}`)
    return { applicantId: id }
  },
  create_task: async (ctx, params) => {
    const title = (params?.title as string) ?? 'Aufgabe'
    const description = params?.description as string | undefined
    const created = await repos.tasks.create({
      title,
      description,
      status: 'open',
      kind: (params?.kind as never) ?? 'task',
      priority: (params?.priority as never) ?? 'medium',
      dueDate: params?.dueDate as string | undefined,
      patientId: (params?.patientId as string) ?? (ctx.payload.patientId as string | undefined),
      applicantId: (params?.applicantId as string) ?? (ctx.payload.applicantId as string | undefined),
      employeeId: (params?.employeeId as string) ?? (ctx.payload.employeeId as string | undefined),
      leadId: (params?.leadId as string) ?? (ctx.payload.leadId as string | undefined),
      tags: (params?.tags as string[]) ?? [],
    })
    await eventBus.emit('task.created', { task: created })
    ctx.log.push(`create_task → ${created.id} (${created.title})`)
    return { taskId: created.id }
  },
  link_documents: async (ctx, params) => {
    const docIds = (params?.documentIds as string[]) ?? ((ctx.payload.documentIds as string[]) ?? [])
    const patientId = (params?.patientId as string) ?? (ctx.payload.patientId as string | undefined)
    for (const id of docIds) {
      if (patientId) await repos.documents.update(id, { patientId })
    }
    ctx.log.push(`link_documents → ${docIds.length}`)
    return { documentIds: docIds }
  },
  compute_priority: async (ctx, params) => {
    const factors = (params?.factors as Record<string, number>) ?? {}
    const sum = Object.values(factors).reduce((a, b) => a + b, 0)
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
    if (sum >= 8) priority = 'urgent'
    else if (sum >= 5) priority = 'high'
    else if (sum >= 2) priority = 'medium'
    else priority = 'low'
    ctx.log.push(`compute_priority → ${priority} (score ${sum})`)
    return { priority }
  },
  flag_conflict: async ctx => {
    ctx.log.push(`flag_conflict`)
    return {}
  },
  send_notification: async (ctx, params) => {
    const userId = params?.userId as string | undefined
    if (!userId) return {}
    const title = (params?.title as string) ?? 'Benachrichtigung'
    const body = params?.body as string | undefined
    const href = params?.href as string | undefined
    await repos.notifications.create({
      userId,
      title,
      body,
      type: 'workflow',
      href,
    })
    ctx.log.push(`send_notification → ${userId}`)
    return {}
  },
  emit_event: async (ctx, params) => {
    ctx.log.push(`emit_event → ${params?.name as string}`)
    return {}
  },
  compute_score: async (ctx, params) => {
    const base = (params?.base as number) ?? 50
    const qualifications = ((ctx.event.payload as { applicant?: { qualifications?: string[] } }).applicant?.qualifications) ?? []
    const score = Math.min(100, base + qualifications.length * 10)
    ctx.log.push(`compute_score → ${score}`)
    return { score }
  },
  update_pipeline: async ctx => {
    ctx.log.push('update_pipeline')
    return {}
  },
  create_risk_signal: async (ctx, params) => {
    const created = await repos.riskSignals.create({
      patientId: params?.patientId as string | undefined,
      type: (params?.type as string) ?? 'generic',
      severity: (params?.severity as never) ?? 'attention',
      body: (params?.body as string) ?? 'Risiko erkannt',
      resolved: false,
    })
    await eventBus.emit('risk.signal_created', { signal: created })
    ctx.log.push(`create_risk_signal → ${created.id}`)
    return { signalId: created.id }
  },
}

async function runWorkflow(workflow: Workflow, event: DomainEvent): Promise<WorkflowRun> {
  const run = (await repos.workflowRuns.create({
    workflowId: workflow.id,
    status: 'running',
    trigger: { name: event.name, occurredAt: event.occurredAt } as JsonValue,
    startedAt: new Date().toISOString(),
  })) as WorkflowRun

  const ctx: StepContext = {
    event,
    payload: { ...(event.payload as Record<string, unknown>) },
    log: [],
  }

  let failed = false
  for (const step of workflow.steps) {
    try {
      const runner = stepRunners[step.kind]
      if (!runner) {
        ctx.log.push(`SKIP unknown step kind ${step.kind}`)
        continue
      }
      const result = await runner(ctx, step.params)
      Object.assign(ctx.payload, result)
    } catch (err) {
      failed = true
      ctx.log.push(`FAIL ${step.kind} → ${(err as Error).message}`)
      break
    }
  }

  const status = failed ? 'failed' : 'succeeded'
  return repos.workflowRuns.update(run.id, {
    status,
    finishedAt: new Date().toISOString(),
    output: { log: ctx.log, payload: ctx.payload } as JsonValue,
  }) as Promise<WorkflowRun>
}

export async function installWorkflowEngine() {
  eventBus.onAny(async event => {
    const matching = await repos.workflows.findMany(w => w.enabled && w.triggerKey === event.name)
    for (const workflow of matching) {
      runWorkflow(workflow, event).catch(err =>
        console.warn(`[workflow] ${workflow.name} failed`, err)
      )
    }
  })
}

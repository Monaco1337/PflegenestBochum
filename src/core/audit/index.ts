/**
 * Audit log service. Records before/after state for all mutations the platform
 * considers sensitive (patient data, documents, applicant stage, employees,
 * shifts, tours, permissions, exports, deletions, sign-ins).
 *
 * Critical actions go through `audit()` rather than logging from the UI.
 */

import { repos } from '@/core/repositories'
import type { ID, JsonValue, AuditLog, Entity } from '@/core/types'
import { eventBus } from '@/core/events/bus'

export interface AuditInput {
  actorId?: ID
  action: string
  entity: Entity | string
  entityId?: ID
  before?: JsonValue
  after?: JsonValue
  source?: string
  ip?: string
  userAgent?: string
}

export async function audit(input: AuditInput): Promise<AuditLog> {
  return repos.auditLogs.create({
    actorId: input.actorId,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    before: input.before,
    after: input.after,
    source: input.source ?? 'system',
    ip: input.ip,
    userAgent: input.userAgent,
  }) as Promise<AuditLog>
}

/**
 * Subscribe a default audit handler that captures common mutation events.
 * Activated once on server start.
 */
export function installDefaultAuditSubscribers() {
  eventBus.onAny(async event => {
    const recordable: Record<string, { entity: Entity; action: string; idFromPayload: (p: unknown) => string | undefined }> = {
      'lead.created': {
        entity: 'lead',
        action: 'create',
        idFromPayload: p => (p as { lead?: { id: string } }).lead?.id,
      },
      'lead.status_changed': {
        entity: 'lead',
        action: 'status_change',
        idFromPayload: p => (p as { lead?: { id: string } }).lead?.id,
      },
      'patient.created': {
        entity: 'patient',
        action: 'create',
        idFromPayload: p => (p as { patient?: { id: string } }).patient?.id,
      },
      'patient.updated': {
        entity: 'patient',
        action: 'update',
        idFromPayload: p => (p as { patient?: { id: string } }).patient?.id,
      },
      'applicant.created': {
        entity: 'applicant',
        action: 'create',
        idFromPayload: p => (p as { applicant?: { id: string } }).applicant?.id,
      },
      'applicant.stage_changed': {
        entity: 'applicant',
        action: 'stage_change',
        idFromPayload: p => (p as { applicant?: { id: string } }).applicant?.id,
      },
      'document.uploaded': {
        entity: 'document',
        action: 'upload',
        idFromPayload: p => (p as { document?: { id: string } }).document?.id,
      },
      'task.status_changed': {
        entity: 'task',
        action: 'status_change',
        idFromPayload: p => (p as { task?: { id: string } }).task?.id,
      },
      'task.created': {
        entity: 'task',
        action: 'create',
        idFromPayload: p => (p as { task?: { id: string } }).task?.id,
      },
      'tour.created': {
        entity: 'tour',
        action: 'create',
        idFromPayload: p => (p as { tour?: { id: string } }).tour?.id,
      },
      'shift.conflict_detected': {
        entity: 'shift',
        action: 'conflict_detected',
        idFromPayload: p => (p as { shiftId?: string }).shiftId,
      },
      'user.logged_in': {
        entity: 'user',
        action: 'login',
        idFromPayload: p => (p as { user?: { id: string } }).user?.id,
      },
    }

    const def = recordable[event.name]
    if (!def) return

    await audit({
      actorId: event.actorId,
      action: def.action,
      entity: def.entity,
      entityId: def.idFromPayload(event.payload),
      after: event.payload as JsonValue,
      source: event.source ?? 'event_bus',
    }).catch(err => console.warn('[audit] failed to persist', err))
  })
}

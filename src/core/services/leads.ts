/**
 * LeadService — single source of truth for lead lifecycle.
 */
import { repos } from '@/core/repositories'
import { eventBus } from '@/core/events/bus'
import type { Lead, LeadSource, LeadStatus, Priority } from '@/core/types'

export interface CreateLeadInput {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  zip?: string
  city?: string
  message?: string
  source: LeadSource
  priority?: Priority
  consentGiven?: boolean
  metadata?: Record<string, unknown>
}

export async function createLead(input: CreateLeadInput, actorId?: string): Promise<Lead> {
  const created = (await repos.leads.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    zip: input.zip,
    city: input.city,
    message: input.message,
    status: 'new',
    source: input.source,
    priority: input.priority ?? 'medium',
    consentGiven: Boolean(input.consentGiven),
    metadata: input.metadata as never,
  })) as Lead

  await eventBus.emit('lead.created', { lead: created }, { actorId, source: input.source })
  return created
}

export async function updateLeadStatus(id: string, next: LeadStatus, actorId?: string): Promise<Lead> {
  const previous = await repos.leads.findById(id)
  if (!previous) throw new Error('Lead nicht gefunden')
  const updated = (await repos.leads.update(id, { status: next })) as Lead
  if (previous.status !== next) {
    await eventBus.emit('lead.status_changed', { lead: updated, previous: previous.status, next }, { actorId })
  }
  return updated
}

export async function assignLead(id: string, assigneeId: string, actorId?: string): Promise<Lead> {
  const updated = (await repos.leads.update(id, { assigneeId })) as Lead
  await eventBus.emit('lead.assigned', { lead: updated, assigneeId }, { actorId })
  return updated
}

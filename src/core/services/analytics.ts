/**
 * Internal analytics. No third-party trackers — DSGVO-friendly by default.
 */
import { repos } from '@/core/repositories'
import type { AnalyticsEvent } from '@/core/types'

export interface TrackInput {
  name: string
  sessionId?: string
  userId?: string
  path?: string
  referrer?: string
  utm?: Record<string, string>
  device?: string
  props?: Record<string, unknown>
}

export async function track(input: TrackInput): Promise<AnalyticsEvent> {
  return repos.analyticsEvents.create({
    name: input.name,
    sessionId: input.sessionId,
    userId: input.userId,
    path: input.path,
    referrer: input.referrer,
    utm: input.utm as never,
    device: input.device,
    props: input.props as never,
  }) as Promise<AnalyticsEvent>
}

export async function getFunnel() {
  const events = await repos.analyticsEvents.all()
  const leads = await repos.leads.all()
  const applicants = await repos.applicants.all()
  const pflegegrad = await repos.pflegegradAssessments.all()
  const anamneses = await repos.anamneses.all()

  return {
    visits: events.filter(e => e.name === 'page_view').length,
    leads: leads.length,
    applicants: applicants.length,
    pflegegradStarts: events.filter(e => e.name === 'pflegegrad_start').length,
    pflegegradCompletions: pflegegrad.length,
    anamnesisStarts: events.filter(e => e.name === 'anamnesis_start').length,
    anamnesisCompletions: anamneses.length,
    ctaClicks: events.filter(e => e.name === 'cta_click').length,
    callbackRequests: leads.filter(l => l.source === 'website_callback').length,
    conversionRate: events.length > 0 ? Math.round((leads.length / Math.max(1, events.filter(e => e.name === 'page_view').length)) * 1000) / 10 : 0,
  }
}

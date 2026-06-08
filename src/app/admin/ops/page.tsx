import Link from 'next/link'
import { repos } from '@/core/repositories'
import { computeTwinState, computeHealthScore } from '@/core/services/twin'
import { aiService } from '@/core/services/ai'
import { PageHeader } from '@/components/feedback/states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertTriangle, ArrowRight, Activity, BellRing, Briefcase, Calendar, CheckCircle2, ClipboardList,
  FileText, Heart, ListTodo, Map, Phone, ShieldAlert, Sparkles, TrendingUp, Users,
} from 'lucide-react'
import { formatRelative } from '@/lib/utils'
import { applicantStageLabel, leadSourceLabel, priorityLabel, taskStatusLabel } from '@/core/domain/labels'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Operations Wall' }

export default async function OpsPage() {
  const [twin, recs, leads, anamneses, applicants, tasks, documents, shifts, tours, sickReports, riskSignals, recentEvents] = await Promise.all([
    computeTwinState(),
    aiService().generateRecommendations(),
    repos.leads.all(),
    repos.anamneses.all(),
    repos.applicants.all(),
    repos.tasks.all(),
    repos.documents.all(),
    repos.shifts.all(),
    repos.tours.all(),
    repos.sickReports.all(),
    repos.riskSignals.findMany(r => !r.resolved),
    repos.auditLogs.list({ limit: 6, sortBy: 'createdAt', sortDir: 'desc' }),
  ])
  const health = computeHealthScore(twin)
  const now = new Date().toISOString()
  const todayStr = now.slice(0, 10)

  const newLeads = leads.filter(l => l.status === 'new')
  const todayAnamneses = anamneses.filter(a => a.submittedAt.slice(0, 10) === todayStr)
  const newApplicants = applicants.filter(a => a.stage === 'new')
  const callbacks = tasks.filter(t => t.kind === 'callback' && t.status !== 'done')
  const overdue = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < now)
  const expiringDocs = documents.filter(d => d.expiresAt && d.expiresAt < new Date(Date.now() + 30 * 86400_000).toISOString())
  const shiftConflicts = shifts.filter(s => s.conflicts.length > 0 || s.status === 'substitute_needed')
  const tourConflicts = tours.filter(t => t.conflicts.length > 0)
  const activeSick = sickReports.filter(s => !s.endDate || s.endDate > now)
  const todaysPriorities = tasks
    .filter(t => t.priority === 'urgent' || t.priority === 'high')
    .filter(t => t.status !== 'done')
    .sort((a, b) => (a.dueDate ?? '9').localeCompare(b.dueDate ?? '9'))
    .slice(0, 6)

  return (
    <>
      <PageHeader
        title="Operations Wall"
        description="Der zentrale Leitstand. Echtzeit-Lage des Unternehmens."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={health > 80 ? 'success' : health > 60 ? 'warning' : 'destructive'}>
              System Health {health}
            </Badge>
            <Button asChild variant="outline" size="sm"><Link href="/admin/twin">Digital Twin <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="Conversion" value={`${twin.leads.conversion}%`} hint={`${twin.leads.total} Leads`} />
        <KpiCard icon={<Activity className="h-4 w-4" />} label="Auslastung" value={`${twin.employees.utilization}%`} hint={`${twin.employees.active} aktive Mitarbeiter`} />
        <KpiCard icon={<Heart className="h-4 w-4" />} label="Patienten aktiv" value={String(twin.patients.active)} hint={`${twin.patients.risks} mit Risiken`} />
        <KpiCard icon={<Users className="h-4 w-4" />} label="Bewerber-Pipeline" value={String(twin.applicants.inPipeline)} hint={`${twin.applicants.new} neu`} />
      </div>

      {/* Cells */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Tile
          icon={<Phone className="h-5 w-5" />}
          title="Neue Leads"
          count={newLeads.length}
          tone={newLeads.length > 5 ? 'attention' : 'info'}
          href="/admin/crm/leads"
          items={newLeads.slice(0, 4).map(l => ({
            id: l.id,
            label: `${l.firstName} ${l.lastName}`,
            sub: `${leadSourceLabel[l.source]} · ${formatRelative(l.createdAt)}`,
            href: `/admin/crm/leads/${l.id}`,
          }))}
        />

        <Tile
          icon={<ClipboardList className="h-5 w-5" />}
          title="Neue Anamnesen (heute)"
          count={todayAnamneses.length}
          tone={todayAnamneses.length > 0 ? 'success' : 'muted'}
          href="/admin/patients"
          items={todayAnamneses.slice(0, 4).map(a => ({
            id: a.id,
            label: `Anamnese #${a.id.slice(0, 6)}`,
            sub: `${formatRelative(a.submittedAt)}`,
            href: `/admin/patients/${a.patientId ?? ''}`,
          }))}
        />

        <Tile
          icon={<Users className="h-5 w-5" />}
          title="Neue Bewerbungen"
          count={newApplicants.length}
          tone={newApplicants.length > 3 ? 'attention' : 'info'}
          href="/admin/applicants"
          items={newApplicants.slice(0, 4).map(a => ({
            id: a.id,
            label: `${a.firstName} ${a.lastName}`,
            sub: `${a.position} · ${applicantStageLabel[a.stage]}`,
            href: `/admin/applicants?focus=${a.id}`,
          }))}
        />

        <Tile
          icon={<Phone className="h-5 w-5" />}
          title="Offene Rückrufe"
          count={callbacks.length}
          tone={callbacks.length > 4 ? 'attention' : 'info'}
          href="/admin/tasks?kind=callback"
          items={callbacks.slice(0, 4).map(t => ({
            id: t.id,
            label: t.title,
            sub: `${priorityLabel[t.priority]} · fällig ${t.dueDate ? formatRelative(t.dueDate) : 'offen'}`,
            href: `/admin/tasks?focus=${t.id}`,
          }))}
        />

        <Tile
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Überfällige Aufgaben"
          count={overdue.length}
          tone={overdue.length > 0 ? 'destructive' : 'success'}
          href="/admin/tasks"
          items={overdue.slice(0, 4).map(t => ({
            id: t.id,
            label: t.title,
            sub: `${taskStatusLabel[t.status]} · ${formatRelative(t.dueDate)}`,
            href: `/admin/tasks?focus=${t.id}`,
          }))}
        />

        <Tile
          icon={<FileText className="h-5 w-5" />}
          title="Kritische Dokumente"
          count={expiringDocs.length}
          tone={expiringDocs.length > 0 ? 'attention' : 'muted'}
          href="/admin/documents"
          items={expiringDocs.slice(0, 4).map(d => ({
            id: d.id,
            label: d.name,
            sub: `läuft ab ${formatRelative(d.expiresAt)}`,
            href: `/admin/documents?focus=${d.id}`,
          }))}
        />

        <Tile
          icon={<BellRing className="h-5 w-5" />}
          title="Krankmeldungen"
          count={activeSick.length}
          tone={activeSick.length > 0 ? 'attention' : 'success'}
          href="/admin/employees"
          items={activeSick.slice(0, 4).map(s => ({
            id: s.id,
            label: `Mitarbeiter krank`,
            sub: `seit ${formatRelative(s.startDate)}`,
            href: `/admin/employees`,
          }))}
        />

        <Tile
          icon={<Calendar className="h-5 w-5" />}
          title="Schichtkonflikte"
          count={shiftConflicts.length}
          tone={shiftConflicts.length > 0 ? 'destructive' : 'success'}
          href="/admin/shifts"
          items={shiftConflicts.slice(0, 4).map(s => ({
            id: s.id,
            label: `${s.startTime}–${s.endTime} (${s.date.slice(0,10)})`,
            sub: s.conflicts.join(', ') || 'Vertretung gesucht',
            href: `/admin/shifts`,
          }))}
        />

        <Tile
          icon={<Map className="h-5 w-5" />}
          title="Tourenkonflikte"
          count={tourConflicts.length}
          tone={tourConflicts.length > 0 ? 'destructive' : 'success'}
          href="/admin/tours"
          items={tourConflicts.slice(0, 4).map(t => ({
            id: t.id,
            label: t.name,
            sub: t.conflicts[0] ?? '—',
            href: `/admin/tours`,
          }))}
        />

        <Tile
          icon={<ShieldAlert className="h-5 w-5" />}
          title="Offene Risiken"
          count={riskSignals.length}
          tone={riskSignals.some(r => r.severity === 'critical') ? 'destructive' : riskSignals.length > 0 ? 'attention' : 'success'}
          href="/admin/patients"
          items={riskSignals.slice(0, 4).map(r => ({
            id: r.id,
            label: r.type,
            sub: r.body.slice(0, 64),
            href: `/admin/patients/${r.patientId ?? ''}`,
          }))}
        />

        <Tile
          icon={<ListTodo className="h-5 w-5" />}
          title="Heutige Prioritäten"
          count={todaysPriorities.length}
          tone="info"
          href="/admin/tasks"
          items={todaysPriorities.map(t => ({
            id: t.id,
            label: t.title,
            sub: `${priorityLabel[t.priority]} · ${taskStatusLabel[t.status]}`,
            href: `/admin/tasks?focus=${t.id}`,
          }))}
        />

        <Tile
          icon={<Briefcase className="h-5 w-5" />}
          title="Recruiting-Status"
          count={twin.applicants.inPipeline}
          tone="info"
          href="/admin/applicants"
          items={[
            { id: 'n', label: 'Neu', sub: `${twin.applicants.new}`, href: '/admin/applicants' },
            { id: 'h', label: 'Eingestellt', sub: `${twin.applicants.hired}`, href: '/admin/applicants' },
          ]}
        />
      </div>

      {/* KI Empfehlungen + Recent Events */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> KI-Assistenzhinweise</CardTitle>
            <CardDescription>Hinweise, keine Diagnosen. Stets menschliche Freigabe nötig.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aktuell keine Hinweise.</p>
            ) : recs.slice(0, 5).map(r => (
              <div key={r.id} className="rounded-md border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={r.severity === 'critical' ? 'destructive' : r.severity === 'risk' ? 'warning' : 'muted'}>
                    {r.severity}
                  </Badge>
                  <span className="text-sm font-medium">{r.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{r.body}</p>
              </div>
            ))}
            <div className="pt-1">
              <Button asChild variant="outline" size="sm"><Link href="/admin/ai">Alle Hinweise <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Letzte Ereignisse</CardTitle>
            <CardDescription>Audit-Log der letzten Aktionen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {recentEvents.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">Noch keine Ereignisse.</p>
            ) : recentEvents.data.map(e => (
              <div key={e.id} className="flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <span className="font-medium">{e.action}</span>
                  <span className="text-muted-foreground"> · {e.entity}</span>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">{formatRelative(e.createdAt)}</span>
              </div>
            ))}
            <div className="pt-2">
              <Button asChild variant="outline" size="sm"><Link href="/admin/audit">Audit-Log <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function KpiCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs uppercase tracking-wide">{label}</span>
          {icon}
        </div>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  )
}

interface TileItem { id: string; label: string; sub?: string; href: string }

function Tile({
  icon,
  title,
  count,
  tone,
  href,
  items,
}: {
  icon: React.ReactNode
  title: string
  count: number
  tone: 'success' | 'attention' | 'destructive' | 'info' | 'muted'
  href: string
  items: TileItem[]
}) {
  const toneBadge: Record<typeof tone, 'success' | 'warning' | 'destructive' | 'info' | 'muted'> = {
    success: 'success',
    attention: 'warning',
    destructive: 'destructive',
    info: 'info',
    muted: 'muted',
  }
  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          <Badge variant={toneBadge[tone]} className="tabular-nums">{count}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {items.length === 0 ? (
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Alles ruhig.</div>
        ) : (
          items.map(i => (
            <Link key={i.id} href={i.href} className="flex items-center justify-between gap-2 rounded-md p-1.5 -mx-1.5 text-sm hover:bg-muted/60">
              <div className="min-w-0">
                <div className="truncate">{i.label}</div>
                {i.sub ? <div className="text-xs text-muted-foreground truncate">{i.sub}</div> : null}
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          ))
        )}
        <div className="pt-1">
          <Link href={href} className="text-xs font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Alle ansehen <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

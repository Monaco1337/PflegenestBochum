import Link from 'next/link'
import { notFound } from 'next/navigation'
import { repos } from '@/core/repositories'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/feedback/states'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { leadSourceLabel, leadStatusLabel, priorityLabel } from '@/core/domain/labels'
import { formatDateTime, formatRelative } from '@/lib/utils'
import { ChevronLeft, Mail, Phone, User } from 'lucide-react'
import { LeadStatusSwitcher } from '@/modules/crm/lead-status-switcher'

export const dynamic = 'force-dynamic'

export default async function LeadDetail({ params }: { params: { id: string } }) {
  const lead = await repos.leads.findById(params.id)
  if (!lead) notFound()
  const [tasks, notes, audit, anamnesis, pflegegrad] = await Promise.all([
    repos.tasks.findMany(t => t.leadId === lead.id),
    repos.notes.findMany(n => n.leadId === lead.id),
    repos.auditLogs.findMany(a => a.entity === 'lead' && a.entityId === lead.id),
    lead.id ? repos.anamneses.findMany(a => a.leadId === lead.id) : Promise.resolve([]),
    lead.id ? repos.pflegegradAssessments.findMany(a => a.leadId === lead.id) : Promise.resolve([]),
  ])

  return (
    <>
      <Link href="/admin/crm/leads" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
        <ChevronLeft className="h-4 w-4" /> Alle Leads
      </Link>
      <PageHeader
        title={`${lead.firstName} ${lead.lastName}`}
        description={`${leadSourceLabel[lead.source]} · ${formatRelative(lead.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="muted">{priorityLabel[lead.priority]}</Badge>
            <LeadStatusSwitcher id={lead.id} current={lead.status} />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr,2fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Kontakt</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {lead.firstName} {lead.lastName}</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {lead.email ?? '—'}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {lead.phone ?? '—'}</div>
              <div className="text-xs text-muted-foreground">{lead.zip ?? ''} {lead.city ?? ''}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stammdaten</CardTitle>
              <CardDescription>Quelle und Eingang</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div><span className="text-muted-foreground">Quelle:</span> {leadSourceLabel[lead.source]}</div>
              <div><span className="text-muted-foreground">Status:</span> {leadStatusLabel[lead.status]}</div>
              <div><span className="text-muted-foreground">Erstellt:</span> {formatDateTime(lead.createdAt)}</div>
              <div><span className="text-muted-foreground">Einwilligung:</span> {lead.consentGiven ? 'erteilt' : 'fehlt'}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Tabs defaultValue="message">
            <TabsList>
              <TabsTrigger value="message">Nachricht</TabsTrigger>
              <TabsTrigger value="tasks">Aufgaben ({tasks.length})</TabsTrigger>
              <TabsTrigger value="notes">Notizen ({notes.length})</TabsTrigger>
              <TabsTrigger value="related">Verknüpfungen</TabsTrigger>
              <TabsTrigger value="audit">Historie</TabsTrigger>
            </TabsList>
            <TabsContent value="message">
              <Card>
                <CardContent className="p-4 text-sm whitespace-pre-wrap">{lead.message || 'Keine Nachricht hinterlegt.'}</CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tasks">
              <Card>
                <CardContent className="p-4 space-y-2 text-sm">
                  {tasks.length === 0 ? <p className="text-muted-foreground">Keine Aufgaben verknüpft.</p> :
                    tasks.map(t => (
                      <Link key={t.id} href={`/admin/tasks?focus=${t.id}`} className="flex items-center justify-between rounded-md border px-3 py-2 hover:bg-muted/40">
                        <span>{t.title}</span>
                        <span className="text-xs text-muted-foreground">{t.status}</span>
                      </Link>
                    ))
                  }
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes">
              <Card>
                <CardContent className="p-4 text-sm">
                  {notes.length === 0 ? <p className="text-muted-foreground">Keine Notizen.</p> : notes.map(n => (
                    <div key={n.id} className="rounded-md border p-3 mb-2 text-sm">{n.body}</div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="related">
              <Card>
                <CardContent className="p-4 space-y-2 text-sm">
                  {lead.patientId ? (
                    <Link href={`/admin/patients/${lead.patientId}`} className="block rounded-md border p-3 hover:bg-muted/40">Verknüpfter Patient öffnen →</Link>
                  ) : <p className="text-muted-foreground">Kein Patient verknüpft.</p>}
                  {anamnesis.length > 0 ? (
                    <div className="rounded-md border p-3">{anamnesis.length} Anamnese(n) eingegangen.</div>
                  ) : null}
                  {pflegegrad.length > 0 ? (
                    <div className="rounded-md border p-3">Pflegegrad-Voreinschätzung: <strong>{pflegegrad[0].estimatedLevel.toUpperCase()}</strong> (Score {pflegegrad[0].totalScore}).</div>
                  ) : null}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="audit">
              <Card>
                <CardContent className="p-4 text-sm space-y-1.5">
                  {audit.length === 0 ? <p className="text-muted-foreground">Keine Ereignisse.</p> : audit.map(a => (
                    <div key={a.id} className="flex justify-between border-b py-1.5">
                      <span><strong>{a.action}</strong> · {a.entity}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{formatRelative(a.createdAt)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

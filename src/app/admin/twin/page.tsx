import { computeHealthScore, computeTwinState } from '@/core/services/twin'
import { PageHeader } from '@/components/feedback/states'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Digital Twin' }

export default async function TwinPage() {
  const state = await computeTwinState()
  const health = computeHealthScore(state)
  const sections = [
    { title: 'Patienten', body: `${state.patients.active} aktiv · ${state.patients.prospects} Interessenten · ${state.patients.risks} mit Risiken` },
    { title: 'Mitarbeiter', body: `${state.employees.active} aktiv · ${state.employees.sick} krank · ${state.employees.onLeave} im Urlaub · ${state.employees.utilization}% Auslastung` },
    { title: 'Bewerber', body: `${state.applicants.inPipeline} in Pipeline · ${state.applicants.new} neu · ${state.applicants.hired} eingestellt` },
    { title: 'Touren', body: `${state.tours.planned} geplant · ${state.tours.conflicts} Konflikte` },
    { title: 'Schichten', body: `${state.shifts.planned} geplant · ${state.shifts.conflicts} Konflikte · ${state.shifts.substituteNeeded} suchen Vertretung` },
    { title: 'Dokumente', body: `${state.documents.total} gesamt · ${state.documents.expiring} laufen demnächst ab` },
    { title: 'Aufgaben', body: `${state.tasks.open} offen · ${state.tasks.overdue} überfällig · ${state.tasks.escalated} eskaliert` },
    { title: 'Leads', body: `${state.leads.new} neu · ${state.leads.conversion}% Conversion` },
    { title: 'Kapazität', body: `${state.capacity.used} h genutzt · ${state.capacity.available} h verfügbar (heute)` },
    { title: 'Risiken', body: `${state.risks.total} Signale · ${state.risks.critical} kritisch` },
  ]

  return (
    <>
      <PageHeader
        title="Digital Twin"
        description="Echtzeit-Abbild des Unternehmens in 10 Perspektiven, kombiniert zu einem System-Health-Score."
        actions={<Badge variant={health > 80 ? 'success' : health > 60 ? 'warning' : 'destructive'}>System Health {health}</Badge>}
      />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">System Health</CardTitle>
          <CardDescription>Synthetischer Score aus Konflikten, Überfälligkeiten, Risiken und Auslastung.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={health} className="h-3" />
          <p className="mt-2 text-sm text-muted-foreground tabular-nums">{health} von 100</p>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(s => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="text-base">{s.title}</CardTitle>
              <CardDescription>{s.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  )
}

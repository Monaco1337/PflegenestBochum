import { repos } from '@/core/repositories'
import { PageHeader } from '@/components/feedback/states'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, MapPin, User } from 'lucide-react'
import { tourStatusLabel } from '@/core/domain/labels'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tourenplanung' }

export default async function ToursPage() {
  const [tours, stops, patients, employees] = await Promise.all([
    repos.tours.all(),
    repos.tourStops.all(),
    repos.patients.all(),
    repos.employees.all(),
  ])
  const stopsByTour = new Map<string, typeof stops>()
  for (const s of stops) {
    const arr = stopsByTour.get(s.tourId) ?? []
    arr.push(s)
    stopsByTour.set(s.tourId, arr)
  }
  const patientById = new Map(patients.map(p => [p.id, p]))
  const employeeById = new Map(employees.map(e => [e.id, e]))

  return (
    <>
      <PageHeader title="Tourenplanung" description="Touren, Stopps und Mitarbeiterzuweisung. Konfliktwarnung bei Krankmeldung, Überlappung und Zeitüberschreitung." />
      {tours.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Keine Touren geplant.</CardContent></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {tours.map(t => {
            const tourStops = (stopsByTour.get(t.id) ?? []).sort((a, b) => a.order - b.order)
            const assignee = t.employeeId ? employeeById.get(t.employeeId) : null
            return (
              <Card key={t.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <Badge variant={t.status === 'planned' ? 'success' : t.status === 'draft' ? 'muted' : 'info'}>{tourStatusLabel[t.status]}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(t.date)} · {t.startTime}–{t.endTime ?? '—'}</span>
                    <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {assignee ? `${assignee.firstName} ${assignee.lastName}` : 'unbesetzt'}</span>
                  </div>
                  {t.conflicts.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>{t.conflicts.join(', ')}</span>
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                  {tourStops.length === 0 ? (
                    <p className="text-muted-foreground">Keine Stopps.</p>
                  ) : tourStops.map(s => {
                    const p = patientById.get(s.patientId)
                    return (
                      <div key={s.id} className="flex items-center gap-2 rounded-md border px-2 py-1.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium tabular-nums">{s.order}</span>
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{p ? `${p.firstName} ${p.lastName}` : 'Patient'}</div>
                          <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {p?.city ?? '—'}</div>
                        </div>
                        <div className="text-xs tabular-nums text-muted-foreground">{s.plannedAt}</div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}

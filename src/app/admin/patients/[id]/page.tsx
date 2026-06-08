import Link from 'next/link'
import { notFound } from 'next/navigation'
import { repos } from '@/core/repositories'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/feedback/states'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { careLevelLabel, patientStatusLabel, documentCategoryLabel } from '@/core/domain/labels'
import { formatDate, formatDateTime, formatRelative } from '@/lib/utils'
import { ChevronLeft, AlertTriangle, Heart, Phone, Pill, ShieldAlert, Stethoscope, User, Activity } from 'lucide-react'
import { PatientEditForm } from '@/modules/patients/patient-edit-form'
import { PatientNoteForm } from '@/modules/patients/patient-note-form'

export const dynamic = 'force-dynamic'

const riskLabel: Record<string, string> = {
  fall_risk: 'Sturzrisiko',
  dementia: 'Demenz',
  bedridden: 'Bettlägerig',
  wounds: 'Wunden',
  suicidal: 'Selbstgefährdung',
  aggression: 'Aggression',
}

export default async function PatientDetail({ params }: { params: { id: string } }) {
  const patient = await repos.patients.findById(params.id)
  if (!patient) notFound()

  const [
    relatives, documents, tasks, notes, audits, anamneses, insurance, doctor, appointments, riskSignals, tourStops, tours,
  ] = await Promise.all([
    repos.relatives.findMany(r => r.patientId === patient.id),
    repos.documents.findMany(d => d.patientId === patient.id),
    repos.tasks.findMany(t => t.patientId === patient.id),
    repos.notes.findMany(n => n.patientId === patient.id),
    repos.auditLogs.findMany(a => a.entity === 'patient' && a.entityId === patient.id),
    repos.anamneses.findMany(a => a.patientId === patient.id),
    patient.insuranceId ? repos.insurances.findById(patient.insuranceId) : null,
    patient.primaryDoctorId ? repos.doctors.findById(patient.primaryDoctorId) : null,
    repos.appointments.findMany(a => a.patientId === patient.id),
    repos.riskSignals.findMany(r => r.patientId === patient.id),
    repos.tourStops.findMany(s => s.patientId === patient.id),
    repos.tours.all(),
  ])

  const tourById = new Map(tours.map(t => [t.id, t]))

  return (
    <>
      <Link href="/admin/patients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
        <ChevronLeft className="h-4 w-4" /> Alle Patienten
      </Link>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        description={`${patientStatusLabel[patient.status]} · ${careLevelLabel[patient.careLevel]}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {patient.riskFlags.map(flag => (
              <Badge key={flag} variant="warning"><ShieldAlert className="h-3.5 w-3.5" /> {riskLabel[flag] ?? flag}</Badge>
            ))}
          </div>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="master">Stammdaten</TabsTrigger>
          <TabsTrigger value="pflegegrad">Pflegegrad</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnosen</TabsTrigger>
          <TabsTrigger value="medications">Medikamente</TabsTrigger>
          <TabsTrigger value="relatives">Angehörige</TabsTrigger>
          <TabsTrigger value="documents">Dokumente</TabsTrigger>
          <TabsTrigger value="visits">Einsätze</TabsTrigger>
          <TabsTrigger value="risks">Risiken</TabsTrigger>
          <TabsTrigger value="comms">Kommunikation</TabsTrigger>
          <TabsTrigger value="tasks">Aufgaben</TabsTrigger>
          <TabsTrigger value="history">Historie</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Stammdaten</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1.5">
                <Row label="Geburtsdatum" value={formatDate(patient.dateOfBirth)} />
                <Row label="Geschlecht" value={patient.gender} />
                <Row label="Telefon" value={patient.phone} />
                <Row label="E-Mail" value={patient.email} />
                <Row label="Adresse" value={`${patient.street ?? ''} · ${patient.zip ?? ''} ${patient.city ?? ''}`} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Heart className="h-4 w-4" /> Versorgung</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1.5">
                <Row label="Status" value={patientStatusLabel[patient.status]} />
                <Row label="Pflegegrad" value={careLevelLabel[patient.careLevel]} />
                <Row label="Pflegekasse" value={insurance?.name} />
                <Row label="Hausarzt" value={doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : undefined} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" /> Lage</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1.5">
                <Row label="Risiken" value={patient.riskFlags.length > 0 ? patient.riskFlags.length + ' Flags' : 'Keine'} />
                <Row label="Offene Aufgaben" value={tasks.filter(t => t.status !== 'done').length.toString()} />
                <Row label="Dokumente" value={documents.length.toString()} />
                <Row label="Einsätze (geplant)" value={tourStops.length.toString()} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 mt-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Offene Aufgaben</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1.5">
                {tasks.filter(t => t.status !== 'done').slice(0, 6).map(t => (
                  <div key={t.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span>{t.title}</span>
                    <Badge variant="muted">{t.priority}</Badge>
                  </div>
                ))}
                {tasks.filter(t => t.status !== 'done').length === 0 ? <p className="text-muted-foreground">Keine offenen Aufgaben.</p> : null}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Notiz hinzufügen</CardTitle></CardHeader>
              <CardContent>
                <PatientNoteForm patientId={patient.id} />
                <div className="mt-3 space-y-2 text-sm">
                  {notes.slice(0, 4).map(n => (
                    <div key={n.id} className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground">{formatRelative(n.createdAt)}</div>
                      <p className="mt-1">{n.body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="master">
          <Card>
            <CardHeader><CardTitle className="text-base">Stammdaten bearbeiten</CardTitle></CardHeader>
            <CardContent>
              <PatientEditForm patient={patient} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pflegegrad">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pflegegrad-Historie</CardTitle>
              <CardDescription>Voreinschätzungen und Status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="rounded-md border p-3">Aktueller Pflegegrad: <strong>{careLevelLabel[patient.careLevel]}</strong></div>
              {anamneses.map(a => (
                <div key={a.id} className="rounded-md border p-3">
                  Anamnese eingegangen am {formatDate(a.submittedAt)} · Pflegekasse {a.data.insurance.name}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnoses">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Stethoscope className="h-4 w-4" /> Diagnosen</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {(patient.diagnoses ?? []).length === 0 ? <p className="text-muted-foreground">Keine Diagnosen erfasst.</p> : (
                <ul className="space-y-1.5">
                  {(patient.diagnoses ?? []).map((d, i) => (
                    <li key={i} className="rounded-md border px-3 py-2">{d}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Pill className="h-4 w-4" /> Medikamente</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {(patient.medications ?? []).length === 0 ? <p className="text-muted-foreground">Keine Medikamente erfasst.</p> : (
                <ul className="space-y-1.5">
                  {(patient.medications ?? []).map(m => (
                    <li key={m.id} className="rounded-md border px-3 py-2 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.dosage}</div>
                      </div>
                      <Badge variant="muted">{m.schedule}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatives">
          <Card>
            <CardHeader><CardTitle className="text-base">Angehörige</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {relatives.length === 0 ? <p className="text-muted-foreground">Keine Angehörige erfasst.</p> : relatives.map(r => (
                <div key={r.id} className="rounded-md border p-3">
                  <div className="font-medium">{r.firstName} {r.lastName} {r.isPrimary ? <Badge variant="info" className="ml-2">Primär</Badge> : null}</div>
                  <div className="text-xs text-muted-foreground">{r.phone ?? '—'} · {r.email ?? '—'}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader><CardTitle className="text-base">Dokumente</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {documents.length === 0 ? <p className="text-muted-foreground">Keine Dokumente.</p> : documents.map(d => (
                <div key={d.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{documentCategoryLabel[d.category]} · {Math.round(d.size / 1024)} kB</div>
                  </div>
                  {d.expiresAt ? <Badge variant={d.expiresAt < new Date().toISOString() ? 'destructive' : 'warning'}>Ablauf: {formatDate(d.expiresAt)}</Badge> : null}
                </div>
              ))}
              <Button asChild variant="outline" size="sm"><Link href="/admin/documents">Dokumentencenter öffnen</Link></Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits">
          <Card>
            <CardHeader><CardTitle className="text-base">Einsätze</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {tourStops.length === 0 && appointments.length === 0 ? (
                <p className="text-muted-foreground">Keine geplanten Einsätze.</p>
              ) : (
                <>
                  {tourStops.map(s => (
                    <div key={s.id} className="rounded-md border px-3 py-2 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{tourById.get(s.tourId)?.name ?? 'Tour'} · #{s.order}</div>
                        <div className="text-xs text-muted-foreground">{s.plannedAt} · {s.durationMinutes} min · {s.serviceType ?? '—'}</div>
                      </div>
                      <Badge variant="muted">{tourById.get(s.tourId)?.status ?? '—'}</Badge>
                    </div>
                  ))}
                  {appointments.map(a => (
                    <div key={a.id} className="rounded-md border px-3 py-2">
                      <div className="font-medium">{a.type}</div>
                      <div className="text-xs text-muted-foreground">{formatDateTime(a.startAt)} — {formatDateTime(a.endAt)}</div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Risiken</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {riskSignals.length === 0 ? <p className="text-muted-foreground">Keine Risikosignale.</p> : riskSignals.map(r => (
                <div key={r.id} className="rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={r.severity === 'critical' ? 'destructive' : r.severity === 'risk' ? 'warning' : 'muted'}>{r.severity}</Badge>
                    <span className="font-medium">{r.type}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{r.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comms">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Phone className="h-4 w-4" /> Kommunikation</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p className="text-muted-foreground">Kommunikationshistorie folgt mit Anbindung der E-Mail/SMS-Provider.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader><CardTitle className="text-base">Aufgaben</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {tasks.length === 0 ? <p className="text-muted-foreground">Keine Aufgaben verknüpft.</p> : tasks.map(t => (
                <Link key={t.id} href={`/admin/tasks?focus=${t.id}`} className="block rounded-md border px-3 py-2 hover:bg-muted/40">
                  <div className="flex items-center justify-between">
                    <span>{t.title}</span>
                    <Badge variant="muted">{t.status}</Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle className="text-base">Historie</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1.5">
              {audits.length === 0 ? <p className="text-muted-foreground">Keine Einträge.</p> : audits.map(a => (
                <div key={a.id} className="flex justify-between border-b py-1.5">
                  <span><strong>{a.action}</strong></span>
                  <span className="text-xs text-muted-foreground tabular-nums">{formatRelative(a.createdAt)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-right">{value || '—'}</span>
    </div>
  )
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { AnamnesisData, CareLevel, RelationKind, Priority } from '@/core/types'
import { careLevelLabel, relationKindLabel, priorityLabel } from '@/core/domain/labels'
import { submitAnamnesisAction } from '@/app/actions/anamnesis'
import { AnamnesisDocumentUpload } from '@/modules/anamnesis/document-upload'
import { cn } from '@/lib/utils'

const emptyData: AnamnesisData = {
  patient: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    street: '',
    zip: '',
    city: '',
    phone: '',
    email: '',
  },
  relatives: [],
  insurance: { name: '', memberNumber: '', careLevel: 'none' },
  doctor: { firstName: '', lastName: '', practice: '', phone: '' },
  diagnoses: [],
  medications: [],
  mobility: { walkingAid: false, wheelchair: false, bedridden: false, fallRisk: false, notes: '' },
  careNeeds: { bodyCare: false, nutritionHelp: false, woundCare: false, injections: false, medicationGiving: false, notes: '' },
  household: { livesAlone: false, householdHelp: false, cleaning: false, cooking: false, shopping: false, laundry: false },
  cognition: { dementia: false, confusion: false, orientationIssues: false, notes: '' },
  wounds: { hasWounds: false, description: '' },
  risks: { aggression: false, suicidal: false, fallHistory: false, infection: false, notes: '' },
  startPreference: { desiredStart: '', urgency: 'medium' },
  documents: [],
  consent: { given: false, signedName: '' },
}

const sectionTitles = [
  'Patient',
  'Angehörige',
  'Pflegekasse',
  'Hausarzt',
  'Krankenhaus',
  'Diagnosen',
  'Medikamente',
  'Mobilität',
  'Pflegebedarf',
  'Haushalt',
  'Kognition/Demenz',
  'Wundversorgung',
  'Risiken',
  'Pflegestart',
  'Dokumente',
  'Einwilligung',
  'Bestätigung',
] as const

export function AnamnesisWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<AnamnesisData>(emptyData)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<{ patientId: string } | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const total = sectionTitles.length

  useEffect(() => {
    if (typeof window === 'undefined' || !cardRef.current) return
    const top = cardRef.current.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
  }, [step])

  function update<K extends keyof AnamnesisData>(key: K, patch: Partial<AnamnesisData[K]>) {
    setData(prev => ({ ...prev, [key]: { ...(prev[key] as object), ...(patch as object) } as AnamnesisData[K] }))
  }

  function next() {
    setStep(s => Math.min(s + 1, total - 1))
  }
  function prev() {
    setStep(s => Math.max(s - 1, 0))
  }

  const ready = useMemo(() => {
    return (
      data.patient.firstName.trim() &&
      data.patient.lastName.trim() &&
      data.consent.given
    )
  }, [data])

  async function submit() {
    if (!data.consent.given) {
      toast.error('Bitte Einwilligung erteilen.')
      return
    }
    setSubmitting(true)
    try {
      const res = await submitAnamnesisAction(data)
      if (!res.ok || !res.data) {
        toast.error(res.error ?? 'Konnte nicht senden.')
        return
      }
      setDone({ patientId: res.data.patientId })
      toast.success('Anamnese erfolgreich übermittelt.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white px-6 py-12 text-center shadow-[0_18px_50px_-24px_rgba(27,63,95,0.25)]">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-9 w-9 text-emerald-500" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-[#1B3F5F]">Anamnese empfangen.</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Wir haben Ihre Angaben sicher übernommen. Unser Pflegeteam meldet sich zeitnah zur Abstimmung der nächsten
          Schritte.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="h-11 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
          >
            <a href="/kontakt">Beratung vereinbaren</a>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="h-11 rounded-lg border-slate-300 bg-white px-6 text-[0.9375rem] font-semibold text-[#1B3F5F] hover:bg-slate-50"
          >
            Zur Startseite
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_18px_50px_-24px_rgba(27,63,95,0.25)]"
    >
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-5 sm:px-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#1B3F5F]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.08] text-[#2563eb]">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm font-bold">Digitale Anamnese</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-[#1B3F5F]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2563eb]" aria-hidden /> DSGVO-konform
          </span>
        </div>

        {/* Stepper segments */}
        <div className="mt-4 flex items-center gap-1">
          {sectionTitles.map((title, i) => (
            <span
              key={title}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                i <= step ? 'bg-[#1B3F5F]' : 'bg-slate-200'
              )}
            />
          ))}
        </div>
        <p className="mt-2.5 text-xs font-medium text-slate-500">
          Schritt {step + 1} von {total} · {sectionTitles[step]}
        </p>
      </div>

      {/* Body */}
      <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
        <div>
          <h2 className="text-xl font-bold text-[#1B3F5F]">{sectionTitles[step]}</h2>
        </div>
        {step === 0 && <PatientSection data={data} update={update} />}
        {step === 1 && <RelativesSection data={data} setData={setData} />}
        {step === 2 && <InsuranceSection data={data} update={update} />}
        {step === 3 && <DoctorSection data={data} update={update} />}
        {step === 4 && <HospitalSection data={data} setData={setData} />}
        {step === 5 && <DiagnosesSection data={data} setData={setData} />}
        {step === 6 && <MedicationsSection data={data} setData={setData} />}
        {step === 7 && <MobilitySection data={data} update={update} />}
        {step === 8 && <CareNeedsSection data={data} update={update} />}
        {step === 9 && <HouseholdSection data={data} update={update} />}
        {step === 10 && <CognitionSection data={data} update={update} />}
        {step === 11 && <WoundsSection data={data} update={update} />}
        {step === 12 && <RisksSection data={data} update={update} />}
        {step === 13 && <StartSection data={data} update={update} />}
        {step === 14 && <DocumentsSection data={data} setData={setData} />}
        {step === 15 && <ConsentSection data={data} update={update} />}
        {step === 16 && <ReviewSection data={data} />}
      </div>

      {/* Footer nav */}
      <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-4 sm:px-7">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={step === 0}
          className="text-slate-600 hover:text-[#1B3F5F] disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Button>
        {step < total - 1 ? (
          <Button
            onClick={next}
            className="h-11 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
          >
            Weiter <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={submit}
            disabled={submitting || !ready}
            className="h-11 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
          >
            {submitting ? 'Wird gesendet…' : 'Anamnese absenden'} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </footer>
    </div>
  )
}

function PatientSection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Vorname *"><Input value={data.patient.firstName} onChange={e => update('patient', { firstName: e.target.value })} /></Field>
      <Field label="Nachname *"><Input value={data.patient.lastName} onChange={e => update('patient', { lastName: e.target.value })} /></Field>
      <Field label="Geburtsdatum"><Input type="date" value={data.patient.dateOfBirth ?? ''} onChange={e => update('patient', { dateOfBirth: e.target.value })} /></Field>
      <Field label="Geschlecht">
        <Select value={data.patient.gender ?? ''} onValueChange={v => update('patient', { gender: v })}>
          <SelectTrigger><SelectValue placeholder="bitte wählen" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="w">weiblich</SelectItem>
            <SelectItem value="m">männlich</SelectItem>
            <SelectItem value="d">divers</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Straße & Hausnr."><Input value={data.patient.street ?? ''} onChange={e => update('patient', { street: e.target.value })} /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="PLZ"><Input value={data.patient.zip ?? ''} onChange={e => update('patient', { zip: e.target.value })} /></Field>
        <div className="col-span-2">
          <Field label="Ort"><Input value={data.patient.city ?? ''} onChange={e => update('patient', { city: e.target.value })} /></Field>
        </div>
      </div>
      <Field label="Telefon"><Input type="tel" value={data.patient.phone ?? ''} onChange={e => update('patient', { phone: e.target.value })} /></Field>
      <Field label="E-Mail"><Input type="email" value={data.patient.email ?? ''} onChange={e => update('patient', { email: e.target.value })} /></Field>
    </div>
  )
}

function RelativesSection({ data, setData }: { data: AnamnesisData; setData: (d: AnamnesisData) => void }) {
  const add = () =>
    setData({
      ...data,
      relatives: [...data.relatives, { firstName: '', lastName: '', relation: 'contact' as RelationKind, phone: '', email: '', isPrimary: data.relatives.length === 0 }],
    })
  return (
    <div className="space-y-3">
      {data.relatives.length === 0 ? <p className="text-sm text-muted-foreground">Noch keine Angehörige hinzugefügt.</p> : null}
      {data.relatives.map((r, idx) => (
        <div key={idx} className="space-y-3 rounded-xl border border-slate-200/70 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Vorname"><Input value={r.firstName} onChange={e => setData({ ...data, relatives: data.relatives.map((x, i) => i === idx ? { ...x, firstName: e.target.value } : x) })} /></Field>
            <Field label="Nachname"><Input value={r.lastName} onChange={e => setData({ ...data, relatives: data.relatives.map((x, i) => i === idx ? { ...x, lastName: e.target.value } : x) })} /></Field>
            <Field label="Beziehung">
              <Select value={r.relation} onValueChange={(v: RelationKind) => setData({ ...data, relatives: data.relatives.map((x, i) => i === idx ? { ...x, relation: v } : x) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(relationKindLabel) as RelationKind[]).map(rk => (
                    <SelectItem key={rk} value={rk}>{relationKindLabel[rk]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Telefon"><Input value={r.phone ?? ''} onChange={e => setData({ ...data, relatives: data.relatives.map((x, i) => i === idx ? { ...x, phone: e.target.value } : x) })} /></Field>
            <Field label="E-Mail"><Input type="email" value={r.email ?? ''} onChange={e => setData({ ...data, relatives: data.relatives.map((x, i) => i === idx ? { ...x, email: e.target.value } : x) })} /></Field>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <Checkbox checked={r.isPrimary} onCheckedChange={v => setData({ ...data, relatives: data.relatives.map((x, i) => i === idx ? { ...x, isPrimary: v === true } : { ...x, isPrimary: v === true ? false : x.isPrimary }) })} />
            Hauptansprechpartner:in
          </label>
          <div className="flex justify-end">
            <Button size="sm" variant="ghost" onClick={() => setData({ ...data, relatives: data.relatives.filter((_, i) => i !== idx) })}>Entfernen</Button>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={add}>+ Angehörige hinzufügen</Button>
    </div>
  )
}

function InsuranceSection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Pflegekasse"><Input value={data.insurance.name} onChange={e => update('insurance', { name: e.target.value })} placeholder="z.B. AOK Westfalen-Lippe" /></Field>
      <Field label="Mitgliedsnummer"><Input value={data.insurance.memberNumber ?? ''} onChange={e => update('insurance', { memberNumber: e.target.value })} /></Field>
      <Field label="Bestehender Pflegegrad">
        <Select value={data.insurance.careLevel} onValueChange={(v: CareLevel) => update('insurance', { careLevel: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(careLevelLabel) as CareLevel[]).map(cl => (
              <SelectItem key={cl} value={cl}>{careLevelLabel[cl]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}

function DoctorSection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Vorname"><Input value={data.doctor.firstName} onChange={e => update('doctor', { firstName: e.target.value })} /></Field>
      <Field label="Nachname"><Input value={data.doctor.lastName} onChange={e => update('doctor', { lastName: e.target.value })} /></Field>
      <Field label="Praxis"><Input value={data.doctor.practice ?? ''} onChange={e => update('doctor', { practice: e.target.value })} /></Field>
      <Field label="Telefon"><Input value={data.doctor.phone ?? ''} onChange={e => update('doctor', { phone: e.target.value })} /></Field>
    </div>
  )
}

function HospitalSection({ data, setData }: { data: AnamnesisData; setData: (d: AnamnesisData) => void }) {
  const has = Boolean(data.hospital)
  return (
    <div className="space-y-3">
      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox checked={has} onCheckedChange={v => setData({ ...data, hospital: v === true ? { name: '' } : undefined })} />
        Aktueller oder kürzlicher Krankenhausaufenthalt
      </label>
      {has ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Krankenhaus"><Input value={data.hospital?.name ?? ''} onChange={e => setData({ ...data, hospital: { ...(data.hospital as object), name: e.target.value } })} /></Field>
          <Field label="Entlassdatum"><Input type="date" value={data.hospital?.dischargeDate ?? ''} onChange={e => setData({ ...data, hospital: { ...(data.hospital as object), name: data.hospital?.name ?? '', dischargeDate: e.target.value } })} /></Field>
          <div className="sm:col-span-2"><Field label="Notiz"><Textarea value={data.hospital?.note ?? ''} onChange={e => setData({ ...data, hospital: { ...(data.hospital as object), name: data.hospital?.name ?? '', note: e.target.value } })} /></Field></div>
        </div>
      ) : null}
    </div>
  )
}

function DiagnosesSection({ data, setData }: { data: AnamnesisData; setData: (d: AnamnesisData) => void }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    if (!draft.trim()) return
    setData({ ...data, diagnoses: [...data.diagnoses, draft.trim()] })
    setDraft('')
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Bitte alle bekannten Diagnosen erfassen.</p>
      <div className="flex gap-2">
        <Input placeholder="z.B. Diabetes mellitus Typ II" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
        <Button onClick={add}>Hinzufügen</Button>
      </div>
      <ul className="space-y-2">
        {data.diagnoses.map((d, i) => (
          <li key={i} className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white px-3.5 py-2.5 text-sm text-[#1B3F5F]">
            <span>{d}</span>
            <Button size="sm" variant="ghost" onClick={() => setData({ ...data, diagnoses: data.diagnoses.filter((_, idx) => idx !== i) })}>Entfernen</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MedicationsSection({ data, setData }: { data: AnamnesisData; setData: (d: AnamnesisData) => void }) {
  const add = () => setData({ ...data, medications: [...data.medications, { name: '', dosage: '', schedule: '' }] })
  return (
    <div className="space-y-3">
      {data.medications.map((m, idx) => (
        <div key={idx} className="grid grid-cols-1 items-end gap-2 rounded-xl border border-slate-200/70 bg-white p-3 sm:grid-cols-7">
          <div className="sm:col-span-3"><Field label="Medikament"><Input value={m.name} onChange={e => setData({ ...data, medications: data.medications.map((x, i) => i === idx ? { ...x, name: e.target.value } : x) })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Dosis"><Input value={m.dosage} onChange={e => setData({ ...data, medications: data.medications.map((x, i) => i === idx ? { ...x, dosage: e.target.value } : x) })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Einnahme (M-M-A-N)"><Input placeholder="1-0-1-0" value={m.schedule} onChange={e => setData({ ...data, medications: data.medications.map((x, i) => i === idx ? { ...x, schedule: e.target.value } : x) })} /></Field></div>
          <Button size="sm" variant="ghost" onClick={() => setData({ ...data, medications: data.medications.filter((_, i) => i !== idx) })}>Entfernen</Button>
        </div>
      ))}
      <Button variant="outline" onClick={add}>+ Medikament hinzufügen</Button>
    </div>
  )
}

function MobilitySection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="space-y-3">
      <CheckRow label="Gehhilfe (z.B. Rollator)" checked={data.mobility.walkingAid} onChange={v => update('mobility', { walkingAid: v })} />
      <CheckRow label="Rollstuhl notwendig" checked={data.mobility.wheelchair} onChange={v => update('mobility', { wheelchair: v })} />
      <CheckRow label="Bettlägerig" checked={data.mobility.bedridden} onChange={v => update('mobility', { bedridden: v })} />
      <CheckRow label="Sturzgefährdet" checked={data.mobility.fallRisk} onChange={v => update('mobility', { fallRisk: v })} />
      <Field label="Notizen"><Textarea value={data.mobility.notes ?? ''} onChange={e => update('mobility', { notes: e.target.value })} /></Field>
    </div>
  )
}

function CareNeedsSection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="space-y-3">
      <CheckRow label="Körperpflege" checked={data.careNeeds.bodyCare} onChange={v => update('careNeeds', { bodyCare: v })} />
      <CheckRow label="Hilfe bei Ernährung" checked={data.careNeeds.nutritionHelp} onChange={v => update('careNeeds', { nutritionHelp: v })} />
      <CheckRow label="Wundversorgung" checked={data.careNeeds.woundCare} onChange={v => update('careNeeds', { woundCare: v })} />
      <CheckRow label="Injektionen" checked={data.careNeeds.injections} onChange={v => update('careNeeds', { injections: v })} />
      <CheckRow label="Medikamentengabe" checked={data.careNeeds.medicationGiving} onChange={v => update('careNeeds', { medicationGiving: v })} />
      <Field label="Notizen"><Textarea value={data.careNeeds.notes ?? ''} onChange={e => update('careNeeds', { notes: e.target.value })} /></Field>
    </div>
  )
}

function HouseholdSection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="space-y-3">
      <CheckRow label="Lebt allein" checked={data.household.livesAlone} onChange={v => update('household', { livesAlone: v })} />
      <CheckRow label="Haushaltshilfe gewünscht" checked={data.household.householdHelp} onChange={v => update('household', { householdHelp: v })} />
      <CheckRow label="Reinigung" checked={data.household.cleaning} onChange={v => update('household', { cleaning: v })} />
      <CheckRow label="Kochen" checked={data.household.cooking} onChange={v => update('household', { cooking: v })} />
      <CheckRow label="Einkaufen" checked={data.household.shopping} onChange={v => update('household', { shopping: v })} />
      <CheckRow label="Wäsche" checked={data.household.laundry} onChange={v => update('household', { laundry: v })} />
    </div>
  )
}

function CognitionSection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="space-y-3">
      <CheckRow label="Demenz diagnostiziert" checked={data.cognition.dementia} onChange={v => update('cognition', { dementia: v })} />
      <CheckRow label="Phasen von Verwirrtheit" checked={data.cognition.confusion} onChange={v => update('cognition', { confusion: v })} />
      <CheckRow label="Orientierungsstörungen" checked={data.cognition.orientationIssues} onChange={v => update('cognition', { orientationIssues: v })} />
      {(data.cognition.dementia || data.cognition.confusion || data.cognition.orientationIssues) ? (
        <Field label="Beschreibung"><Textarea value={data.cognition.notes ?? ''} onChange={e => update('cognition', { notes: e.target.value })} /></Field>
      ) : null}
    </div>
  )
}

function WoundsSection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="space-y-3">
      <CheckRow label="Aktuell vorhandene Wunden" checked={data.wounds.hasWounds} onChange={v => update('wounds', { hasWounds: v })} />
      {data.wounds.hasWounds ? (
        <Field label="Beschreibung (Lage, Größe, Versorgungsart)"><Textarea value={data.wounds.description ?? ''} onChange={e => update('wounds', { description: e.target.value })} /></Field>
      ) : null}
    </div>
  )
}

function RisksSection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="space-y-3">
      <CheckRow label="Aggressives Verhalten" checked={data.risks.aggression} onChange={v => update('risks', { aggression: v })} />
      <CheckRow label="Suizidalität / akute Selbstgefährdung" checked={data.risks.suicidal} onChange={v => update('risks', { suicidal: v })} />
      <CheckRow label="Stürze in der Vergangenheit" checked={data.risks.fallHistory} onChange={v => update('risks', { fallHistory: v })} />
      <CheckRow label="Bekannte Infektion (z.B. MRSA)" checked={data.risks.infection} onChange={v => update('risks', { infection: v })} />
      <Field label="Weitere Hinweise"><Textarea value={data.risks.notes ?? ''} onChange={e => update('risks', { notes: e.target.value })} /></Field>
    </div>
  )
}

function StartSection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Gewünschter Start"><Input type="date" value={data.startPreference.desiredStart ?? ''} onChange={e => update('startPreference', { desiredStart: e.target.value })} /></Field>
      <Field label="Dringlichkeit">
        <Select value={data.startPreference.urgency} onValueChange={(v: Priority) => update('startPreference', { urgency: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(['low', 'medium', 'high', 'urgent'] as Priority[]).map(p => (
              <SelectItem key={p} value={p}>{priorityLabel[p]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}

function DocumentsSection({ data, setData }: { data: AnamnesisData; setData: (d: AnamnesisData) => void }) {
  return (
    <AnamnesisDocumentUpload
      documents={data.documents}
      onChange={documents =>
        setData({
          ...data,
          documents: typeof documents === 'function' ? documents(data.documents) : documents,
        })
      }
    />
  )
}

function ConsentSection({ data, update }: { data: AnamnesisData; update: <K extends keyof AnamnesisData>(k: K, p: Partial<AnamnesisData[K]>) => void }) {
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-600">
        Mit Einreichen der digitalen Anamnese willige ich der Verarbeitung meiner personenbezogenen Daten (inklusive Gesundheitsdaten) zur Vorbereitung pflegerischer Leistungen gemäß DSGVO zu. Die Speicherung erfolgt verschlüsselt und ausschließlich für den genannten Zweck. Die Einwilligung kann jederzeit widerrufen werden.
      </p>
      <label className="flex items-start gap-2.5 rounded-xl border border-[#2563eb]/15 bg-[#2563eb]/[0.04] p-3.5">
        <Checkbox className="mt-0.5" checked={data.consent.given} onCheckedChange={v => update('consent', { given: v === true })} />
        <span className="text-sm font-medium text-[#1B3F5F]">Ich willige ein.</span>
      </label>
      <Field label="Unterschrift (Name in Druckbuchstaben)">
        <Input value={data.consent.signedName ?? ''} onChange={e => update('consent', { signedName: e.target.value })} placeholder="Vor- und Nachname" />
      </Field>
    </div>
  )
}

function ReviewSection({ data }: { data: AnamnesisData }) {
  const rows: Array<[string, string]> = [
    ['Patient', `${data.patient.firstName} ${data.patient.lastName}`.trim() || '—'],
    ['Angehörige', String(data.relatives.length)],
    ['Pflegekasse', `${data.insurance.name || '—'} (${careLevelLabel[data.insurance.careLevel]})`],
    ['Diagnosen', String(data.diagnoses.length)],
    ['Medikamente', String(data.medications.length)],
    ['Dringlichkeit', priorityLabel[data.startPreference.urgency]],
    ['Dokumente', data.documents.length ? `${data.documents.length} hochgeladen` : 'keine'],
    ['Einwilligung', data.consent.given ? 'ja' : 'nein'],
  ]
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-600">
        Bitte prüfen Sie Ihre Angaben. Mit „Anamnese absenden“ wird der Vorgang verschlüsselt an PflegeNest Bochum
        übermittelt.
      </p>
      <dl className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200/70 bg-white">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-medium text-[#1B3F5F]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</Label>
      {children}
    </div>
  )
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition-colors',
        checked
          ? 'border-[#1B3F5F]/20 bg-[#1B3F5F]/[0.04] font-medium text-[#1B3F5F]'
          : 'border-slate-200/70 bg-white text-slate-700 hover:border-[#1B3F5F]/20 hover:bg-slate-50'
      )}
    >
      <Checkbox checked={checked} onCheckedChange={v => onChange(v === true)} />
      <span>{label}</span>
    </label>
  )
}

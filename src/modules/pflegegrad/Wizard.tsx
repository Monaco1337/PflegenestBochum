'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, FileText, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { computeTotalScore, estimateCareLevel, moduleWeights } from '@/core/services/pflegegrad-shared'
import { submitPflegegradAction } from '@/app/actions/pflegegrad'
import { careLevelLabel } from '@/core/domain/labels'
import type { PflegegradAnswers } from '@/core/types'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  text: string
}

interface Module {
  key: keyof PflegegradAnswers
  title: string
  shortTitle: string
  description: string
  questions: Question[]
}

const modules: Module[] = [
  {
    key: 'mobility',
    title: 'Mobilität',
    shortTitle: 'Mobilität',
    description: 'Wie selbstständig kann sich die Person fortbewegen und Positionen wechseln?',
    questions: [
      { id: 'm1', text: 'Positionswechsel im Bett' },
      { id: 'm2', text: 'Stabile Sitzposition halten' },
      { id: 'm3', text: 'Aufstehen aus dem Sitzen' },
      { id: 'm4', text: 'Treppensteigen' },
      { id: 'm5', text: 'Fortbewegen im Wohnbereich' },
    ],
  },
  {
    key: 'cognition',
    title: 'Kognitive Fähigkeiten',
    shortTitle: 'Kognition',
    description: 'Orientierung, Gedächtnis, Erkennen vertrauter Personen.',
    questions: [
      { id: 'c1', text: 'Erkennen von Personen im näheren Umfeld' },
      { id: 'c2', text: 'Örtliche Orientierung' },
      { id: 'c3', text: 'Zeitliche Orientierung' },
      { id: 'c4', text: 'Erinnern an wesentliche Ereignisse' },
      { id: 'c5', text: 'Mehrere Schritte einer Handlung steuern' },
    ],
  },
  {
    key: 'behaviour',
    title: 'Verhaltensweisen',
    shortTitle: 'Verhalten',
    description: 'Psychische Problemlagen, nächtliche Unruhe, herausforderndes Verhalten.',
    questions: [
      { id: 'b1', text: 'Nächtliche Unruhe' },
      { id: 'b2', text: 'Aggressives Verhalten' },
      { id: 'b3', text: 'Ängste / Niedergeschlagenheit' },
      { id: 'b4', text: 'Wahnvorstellungen' },
      { id: 'b5', text: 'Antriebslosigkeit' },
    ],
  },
  {
    key: 'selfCare',
    title: 'Selbstversorgung',
    shortTitle: 'Selbstversorgung',
    description: 'Körperpflege, An-/Auskleiden, Essen und Trinken.',
    questions: [
      { id: 's1', text: 'Vorderen Oberkörper waschen' },
      { id: 's2', text: 'Duschen / Baden' },
      { id: 's3', text: 'An- und Auskleiden Oberkörper' },
      { id: 's4', text: 'Mundgerechte Zubereitung der Nahrung' },
      { id: 's5', text: 'Essen' },
      { id: 's6', text: 'Trinken' },
      { id: 's7', text: 'Toilettengang' },
    ],
  },
  {
    key: 'copingHealth',
    title: 'Krankheitsbewältigung',
    shortTitle: 'Krankheit',
    description: 'Umgang mit therapeutischen Anforderungen und Hilfsmitteln.',
    questions: [
      { id: 'h1', text: 'Medikamente selbstständig einnehmen' },
      { id: 'h2', text: 'Injektionen / Infusionen' },
      { id: 'h3', text: 'Verbandwechsel / Wundversorgung' },
      { id: 'h4', text: 'Arzttermine wahrnehmen' },
      { id: 'h5', text: 'Umgang mit Hilfsmitteln' },
    ],
  },
  {
    key: 'dailyLife',
    title: 'Alltag & soziale Kontakte',
    shortTitle: 'Alltag',
    description: 'Tagesstruktur, Beschäftigung und soziale Kontakte.',
    questions: [
      { id: 'd1', text: 'Tagesablauf gestalten' },
      { id: 'd2', text: 'Aktivitäten / Beschäftigung' },
      { id: 'd3', text: 'Kontakte pflegen' },
      { id: 'd4', text: 'Außerhäusliche Aktivitäten' },
      { id: 'd5', text: 'Planen und Entscheiden' },
    ],
  },
]

const scaleLabels: Array<{ value: number; label: string; description: string; tone: string }> = [
  { value: 0, label: 'Selbstständig', description: 'Ohne Hilfe', tone: '#10b981' },
  { value: 1, label: 'Überwiegend selbst.', description: 'Geringe Hilfe', tone: '#3b82f6' },
  { value: 2, label: 'Überwiegend unselbst.', description: 'Häufige Hilfe', tone: '#f59e0b' },
  { value: 3, label: 'Unselbstständig', description: 'Vollständige Hilfe', tone: '#ef4444' },
]

interface ContactState {
  firstName: string
  lastName: string
  email: string
  phone: string
  zip: string
  consent: boolean
}

const emptyContact: ContactState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  zip: '',
  consent: false,
}

export function PflegegradWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<PflegegradAnswers>({
    mobility: {},
    cognition: {},
    behaviour: {},
    selfCare: {},
    copingHealth: {},
    dailyLife: {},
  })
  const [contact, setContact] = useState<ContactState>(emptyContact)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; level: ReturnType<typeof estimateCareLevel> } | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const total = modules.length + 2 // + contact + result
  const progress = ((step + 1) / total) * 100

  const stepLabels = useMemo(() => [...modules.map(m => m.shortTitle), 'Kontakt', 'Fertig'], [])

  const setValue = (modKey: keyof PflegegradAnswers, qId: string, val: number) => {
    setAnswers(prev => ({ ...prev, [modKey]: { ...prev[modKey], [qId]: val } }))
  }

  const moduleComplete = (m: Module) => m.questions.every(q => typeof answers[m.key][q.id] === 'number')
  const currentModule = modules[step]
  const isContactStep = step === modules.length
  const isResultStep = step === modules.length + 1

  const contactValid = Boolean(
    contact.firstName.trim() && contact.lastName.trim() && (contact.email.trim() || contact.phone.trim()) && contact.consent
  )

  const totalScore = useMemo(() => computeTotalScore(answers), [answers])
  const estimatedLevel = useMemo(() => estimateCareLevel(totalScore), [totalScore])

  useEffect(() => {
    if (typeof window === 'undefined' || !cardRef.current) return
    const top = cardRef.current.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
  }, [step])

  function next() {
    if (currentModule && !moduleComplete(currentModule)) {
      toast.error('Bitte alle Fragen dieses Bereichs beantworten.')
      return
    }
    setStep(s => Math.min(s + 1, total - 1))
  }
  function prev() {
    setStep(s => Math.max(s - 1, 0))
  }

  async function submit() {
    if (!contactValid) {
      toast.error('Bitte Kontaktangaben & Einwilligung ausfüllen.')
      return
    }
    setSubmitting(true)
    try {
      const res = await submitPflegegradAction({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email || undefined,
        phone: contact.phone || undefined,
        zip: contact.zip || undefined,
        consent: contact.consent,
        answers,
      })
      if (!res.ok) {
        toast.error(res.error ?? 'Konnte nicht senden.')
        return
      }
      setResult({ score: totalScore, level: estimatedLevel })
      setStep(total - 1)
    } finally {
      setSubmitting(false)
    }
  }

  const answeredInModule = currentModule
    ? currentModule.questions.filter(q => typeof answers[currentModule.key][q.id] === 'number').length
    : 0

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
            <span className="text-sm font-bold">Pflegegrad-Voreinschätzung</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-[#1B3F5F]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2563eb]" aria-hidden /> DSGVO-konform
          </span>
        </div>

        {/* Stepper dots */}
        <div className="mt-4 flex items-center gap-1.5">
          {stepLabels.map((label, i) => {
            const state = i < step ? 'done' : i === step ? 'current' : 'todo'
            return (
              <div key={label} className="flex flex-1 items-center gap-1.5">
                <span
                  className={cn(
                    'h-1.5 flex-1 rounded-full transition-colors duration-300',
                    state === 'todo' ? 'bg-slate-200' : 'bg-[#1B3F5F]'
                  )}
                />
              </div>
            )
          })}
        </div>
        <p className="mt-2.5 text-xs font-medium text-slate-500">
          Schritt {Math.min(step + 1, total)} von {total}
          {currentModule ? ` · ${currentModule.shortTitle}` : isContactStep ? ' · Kontakt' : ' · Fertig'} — dauert etwa 5
          Minuten.
        </p>
      </div>

      {/* Body */}
      <div className="px-5 py-6 sm:px-7 sm:py-7">
        {!isContactStep && !isResultStep && currentModule ? (
          <ModuleStep
            module={currentModule}
            answers={answers[currentModule.key]}
            answeredCount={answeredInModule}
            onChange={(qId, val) => setValue(currentModule.key, qId, val)}
          />
        ) : null}

        {isContactStep ? (
          <ContactStep contact={contact} setContact={setContact} score={totalScore} level={estimatedLevel} />
        ) : null}

        {isResultStep && result ? (
          <ResultStep result={result} onBookConsultation={() => router.push('/kontakt')} />
        ) : null}
      </div>

      {/* Footer nav */}
      {!isResultStep ? (
        <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-4 sm:px-7">
          <Button
            variant="ghost"
            onClick={prev}
            disabled={step === 0}
            className="text-slate-600 hover:text-[#1B3F5F] disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Button>
          {isContactStep ? (
            <Button
              onClick={submit}
              disabled={submitting || !contactValid}
              className="h-11 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
            >
              {submitting ? 'Wird gesendet…' : 'Anfrage abschicken'} <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={next}
              className="h-11 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
            >
              Weiter <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </footer>
      ) : null}
    </div>
  )
}

function ModuleStep({
  module: m,
  answers,
  answeredCount,
  onChange,
}: {
  module: Module
  answers: Record<string, number>
  answeredCount: number
  onChange: (qId: string, value: number) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-[#1B3F5F]">{m.title}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1B3F5F]/[0.06] px-2.5 py-1 text-xs font-medium text-[#1B3F5F]">
            {answeredCount}/{m.questions.length} beantwortet
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{m.description}</p>
        <p className="mt-1 text-xs text-slate-400">Gewichtung im Gesamtergebnis: {Math.round(moduleWeights[m.key] * 100)}%</p>
      </div>

      <div className="space-y-3">
        {m.questions.map((q, idx) => {
          const answered = typeof answers[q.id] === 'number'
          return (
            <fieldset
              key={q.id}
              className={cn(
                'rounded-xl border p-4 transition-colors',
                answered ? 'border-[#1B3F5F]/15 bg-slate-50/40' : 'border-slate-200/70 bg-white'
              )}
            >
              <legend className="flex items-center gap-2 px-1 text-sm font-semibold text-[#1B3F5F]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1B3F5F]/[0.08] text-[11px] font-bold text-[#2563eb]">
                  {idx + 1}
                </span>
                {q.text}
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {scaleLabels.map(opt => {
                  const selected = answers[q.id] === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChange(q.id, opt.value)}
                      aria-pressed={selected}
                      className={cn(
                        'group relative rounded-lg border px-3 py-2.5 text-left transition-all',
                        selected
                          ? 'border-[#1B3F5F] bg-[#1B3F5F] text-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-[#1B3F5F]/30 hover:bg-slate-50'
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: selected ? '#ffffff' : opt.tone }}
                          aria-hidden
                        />
                        <span className="text-[13px] font-semibold leading-tight">{opt.label}</span>
                      </span>
                      <span className={cn('mt-0.5 block text-[11px]', selected ? 'text-white/75' : 'text-slate-500')}>
                        {opt.description}
                      </span>
                      {selected ? <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-white/90" aria-hidden /> : null}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )
        })}
      </div>
    </div>
  )
}

function ContactStep({
  contact,
  setContact,
  score,
  level,
}: {
  contact: ContactState
  setContact: (next: ContactState) => void
  score: number
  level: ReturnType<typeof estimateCareLevel>
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1B3F5F]">Ihre Einschätzung</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          Anhand Ihrer Angaben ergibt sich folgende Orientierung. Eine rechtsverbindliche Einstufung erfolgt
          ausschließlich durch den Medizinischen Dienst.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Orientierungs-Score</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[#1B3F5F]">{score}</p>
          </div>
          <div className="rounded-xl border border-[#2563eb]/15 bg-[#2563eb]/[0.04] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Mögliche Einstufung</p>
            <p className="mt-1 text-2xl font-bold text-[#1B3F5F]">{careLevelLabel[level]}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-[#1B3F5F]">Wie können wir Sie erreichen?</h3>
        <p className="mt-1 text-sm text-slate-600">Wir melden uns innerhalb von 24 Stunden mit einem Beratungsangebot.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Vorname *">
            <Input value={contact.firstName} onChange={e => setContact({ ...contact, firstName: e.target.value })} placeholder="Ihr Vorname" />
          </Field>
          <Field label="Nachname *">
            <Input value={contact.lastName} onChange={e => setContact({ ...contact, lastName: e.target.value })} placeholder="Ihr Nachname" />
          </Field>
          <Field label="E-Mail">
            <Input type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} placeholder="Ihre E-Mail-Adresse" />
          </Field>
          <Field label="Telefon">
            <Input type="tel" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} placeholder="Ihre Telefonnummer" />
          </Field>
          <Field label="PLZ (Bochum-Umkreis)">
            <Input value={contact.zip} onChange={e => setContact({ ...contact, zip: e.target.value })} placeholder="z.B. 44869" />
          </Field>
        </div>
        <p className="mt-3 text-xs text-slate-400">* Mindestens E-Mail oder Telefon angeben.</p>
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5">
          <Checkbox checked={contact.consent} onCheckedChange={v => setContact({ ...contact, consent: v === true })} id="pg-consent" className="mt-0.5" />
          <Label htmlFor="pg-consent" className="text-xs leading-relaxed text-slate-500">
            Ich stimme der Verarbeitung meiner Daten zur Beratungs-Vorbereitung zu (
            <a href="/datenschutz" className="text-[#2563eb] underline">Datenschutz</a>). Diese Einschätzung ersetzt
            keine medizinische oder rechtsverbindliche Begutachtung.
          </Label>
        </div>
      </div>
    </div>
  )
}

function ResultStep({
  result,
  onBookConsultation,
}: {
  result: { score: number; level: ReturnType<typeof estimateCareLevel> }
  onBookConsultation: () => void
}) {
  return (
    <div className="space-y-5 py-2 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-9 w-9 text-emerald-500" aria-hidden />
      </span>
      <h2 className="text-2xl font-bold text-[#1B3F5F]">Anfrage erfolgreich übermittelt.</h2>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
        Ihre Voreinschätzung liegt bei{' '}
        <strong className="text-[#1B3F5F]">{careLevelLabel[result.level]}</strong> mit einem Orientierungs-Score von{' '}
        <strong className="text-[#1B3F5F]">{result.score}</strong>. Wir melden uns mit einem persönlichen
        Beratungsangebot.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button
          onClick={onBookConsultation}
          className="h-11 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
        >
          <Phone className="h-4 w-4" /> Beratungstermin anfragen
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-lg border-slate-300 bg-white px-6 text-[0.9375rem] font-semibold text-[#1B3F5F] hover:bg-slate-50"
        >
          <a href="/anamnese">Digitale Anamnese starten</a>
        </Button>
      </div>
      <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-400">
        <FileText className="mr-1 inline h-3.5 w-3.5" /> Sie erhalten Ihre Zusammenfassung im Rahmen der Beratung.
        Speicherung erfolgt DSGVO-konform.
      </p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[#1B3F5F]">{label}</Label>
      {children}
    </div>
  )
}

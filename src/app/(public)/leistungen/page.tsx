import Link from 'next/link'
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Clock,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ServicesGrid } from '@/modules/website/services-grid'
import { services } from '@/modules/website/services-data'

export const metadata = {
  title: 'Leistungen — Pflegedienst Bochum | PflegeNest',
  description:
    'Alle ambulanten Pflegeleistungen aus einer Hand: Grundpflege, Behandlungspflege, Demenzbetreuung, Verhinderungspflege, Palliativpflege, Übergangspflege, Hauswirtschaft und Pflegeberatung in Bochum. Direkte Abrechnung mit der Pflegekasse.',
}

const trustChips: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Clock, label: '24/7 erreichbar' },
  { icon: Wallet, label: 'Direkte Abrechnung mit der Pflegekasse' },
  { icon: HeartHandshake, label: 'Pflegegrade 1–5' },
  { icon: MapPin, label: 'Bochum & Umgebung' },
]

const processSteps: Array<{ icon: LucideIcon; step: string; title: string; body: string }> = [
  {
    icon: Phone,
    step: '01',
    title: 'Kontakt aufnehmen',
    body: 'Sie rufen uns an oder schreiben uns – wir melden uns innerhalb von 24 Stunden zurück.',
  },
  {
    icon: HeartHandshake,
    step: '02',
    title: 'Kostenloses Beratungsgespräch',
    body: 'Wir lernen Ihre Situation kennen und klären gemeinsam den individuellen Pflegebedarf.',
  },
  {
    icon: ClipboardList,
    step: '03',
    title: 'Individueller Pflegeplan',
    body: 'Sie erhalten ein passgenaues Leistungspaket – transparent und auf Ihre Pflegekasse abgestimmt.',
  },
  {
    icon: CalendarCheck,
    step: '04',
    title: 'Start der Versorgung',
    body: 'Ihr fester Ansprechpartner koordiniert alles. In der Regel starten wir innerhalb weniger Tage.',
  },
]

const costInfo: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Wallet,
    title: 'Direkte Abrechnung',
    body: 'Wir rechnen unsere Pflegesachleistungen direkt mit Ihrer Pflege- und Krankenkasse ab – ohne Aufwand für Sie.',
  },
  {
    icon: HeartHandshake,
    title: 'Alle Pflegegrade',
    body: 'Von Pflegegrad 1 bis 5 – wir passen den Leistungsumfang individuell an Ihren Bedarf und Ihr Budget an.',
  },
  {
    icon: ClipboardList,
    title: 'Transparente Eigenanteile',
    body: 'Sollten Eigenanteile entstehen, zeigen wir Ihnen diese vorab klar und verständlich auf.',
  },
]

export default function LeistungenPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-slate-50/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(60% 60% at 80% 0%, rgba(37,99,235,0.08) 0%, transparent 60%), radial-gradient(50% 50% at 0% 100%, rgba(27,63,95,0.06) 0%, transparent 60%)',
          }}
          aria-hidden
        />
        <div className="container relative py-14 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
              Unsere Leistungen
            </span>
            <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.12] text-[#1B3F5F] sm:text-4xl lg:text-[3rem]">
              Professionelle Pflege –{' '}
              <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">
                alles aus einer Hand.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Pflege, medizinische Versorgung, Betreuung und Beratung – flexibel kombinierbar nach Ihrem individuellen
              Bedarf. Wir rechnen direkt mit Ihrer Pflegekasse ab.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {trustChips.map(chip => (
                <li
                  key={chip.label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-[#1B3F5F] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <chip.icon className="h-4 w-4 text-[#2563eb]" aria-hidden />
                  {chip.label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-12 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
              >
                <Link href="/pflegegrad">
                  Pflegegrad prüfen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-lg border-slate-300 bg-white px-6 text-[0.9375rem] font-semibold text-[#1B3F5F] hover:bg-slate-50"
              >
                <Link href="/kontakt">Kostenlose Beratung</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* LEISTUNGEN GRID */}
      <section className="container py-14 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-[#1B3F5F] sm:text-3xl">Unser Leistungsspektrum</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Von der Grundpflege bis zur palliativen Begleitung – entdecken Sie, womit wir Sie und Ihre Angehörigen
            unterstützen können.
          </p>
        </div>

        <ServicesGrid />
      </section>

      {/* ABLAUF */}
      <section className="border-y border-slate-200/70 bg-slate-50/60">
        <div className="container py-14 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
              So einfach geht's
            </span>
            <h2 className="mt-5 text-2xl font-bold text-[#1B3F5F] sm:text-3xl">
              In vier Schritten zur passenden Versorgung
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Unkompliziert, schnell und persönlich – wir begleiten Sie von der ersten Anfrage bis zum Pflegestart.
            </p>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map(step => (
              <li
                key={step.step}
                className="relative rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <span className="absolute right-5 top-5 text-3xl font-bold text-slate-100">{step.step}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1B3F5F]/[0.06] text-[#2563eb]">
                  <step.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold text-[#1B3F5F]">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* KOSTEN & ABRECHNUNG */}
      <section className="container py-14 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-[#1B3F5F] sm:text-3xl">Kosten &amp; Kostenübernahme</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Pflege muss nicht teuer sein. Ein Großteil unserer Leistungen wird von der Pflege- und Krankenkasse
            übernommen.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {costInfo.map(info => (
            <div
              key={info.title}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1B3F5F]/[0.06] text-[#2563eb]">
                <info.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-bold text-[#1B3F5F]">{info.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{info.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="container pb-16 sm:pb-20 lg:pb-24">
        <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-[#1B3F5F] to-[#163352] shadow-[0_24px_60px_-24px_rgba(27,63,95,0.5)]">
          <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:p-12">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Nicht sicher, welche Leistung Sie brauchen?
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/75">
                Wir beraten Sie kostenlos und unverbindlich. Gemeinsam finden wir die passende Versorgung für Sie oder
                Ihre Angehörigen.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="tel:+4923279911907"
                className="inline-flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3.5 backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-white">02327 / 9911907</span>
                  <span className="block text-xs text-white/70">Jetzt anrufen</span>
                </span>
              </a>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-md transition-transform hover:scale-[1.01]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.08] text-[#2563eb]">
                  <Mail className="h-5 w-5" aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-[#1B3F5F]">Beratung anfragen</span>
                  <span className="block text-xs text-slate-500">Unverbindlich &amp; kostenlos</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalBusiness',
            name: 'PflegeNest Bochum',
            description:
              'Ambulanter Pflegedienst in Bochum: Grundpflege, Behandlungspflege, Demenzbetreuung, Verhinderungspflege, Palliativpflege, Übergangspflege, Hauswirtschaft und Pflegeberatung.',
            areaServed: 'Bochum',
            telephone: '+49 2327 9911907',
            availableService: services.map(s => ({
              '@type': 'MedicalProcedure',
              name: s.title,
              description: s.body,
            })),
          }),
        }}
      />
    </div>
  )
}

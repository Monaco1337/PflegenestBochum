'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  Clock,
  FileText,
  HeartHandshake,
  Home,
  Lock,
  Mail,
  Phone,
  PiggyBank,
  Plus,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items: Array<{ icon: LucideIcon; q: string; a: string }> = [
  {
    icon: PiggyBank,
    q: 'Was kostet die ambulante Pflege?',
    a: 'Die Kosten hängen vom Pflegegrad und Leistungsumfang ab. Wir rechnen direkt mit der Pflegekasse ab und zeigen Ihnen transparent, welche Eigenanteile entstehen können.',
  },
  {
    icon: HeartHandshake,
    q: 'Welche Leistungen übernehmen Sie?',
    a: 'Wir unterstützen bei Körperpflege, Haushalt, Mobilität, Betreuung und mehr – individuell und bedarfsgerecht.',
  },
  {
    icon: Clock,
    q: 'Wie schnell kann die Pflege starten?',
    a: 'In der Regel können wir innerhalb weniger Tage starten. Wir richten uns nach Ihrer Situation und handeln schnell und unkompliziert.',
  },
  {
    icon: FileText,
    q: 'Was passiert beim Erstgespräch?',
    a: 'Wir nehmen uns Zeit, hören zu und analysieren gemeinsam Ihren Bedarf – kostenlos und unverbindlich.',
  },
  {
    icon: UserRound,
    q: 'Unterstützen Sie beim Pflegegrad-Antrag?',
    a: 'Ja, wir begleiten Sie Schritt für Schritt – von der Vorbereitung bis zum Gutachterbesuch und darüber hinaus.',
  },
  {
    icon: Users,
    q: 'Welche Pflegegrade betreuen Sie?',
    a: 'Wir betreuen alle Pflegegrade – von 1 bis 5. Jede Versorgung wird individuell angepasst.',
  },
  {
    icon: ShieldCheck,
    q: 'Welche Sicherheitsstandards gelten?',
    a: 'Wir arbeiten nach höchsten Qualitätsstandards, sind geprüft und erfüllen alle Anforderungen der Pflegekassen.',
  },
  {
    icon: Lock,
    q: 'Wie gewährleisten Sie Datenschutz?',
    a: 'Ihre Daten sind bei uns sicher. Wir arbeiten DSGVO-konform und behandeln alle Informationen vertraulich.',
  },
  {
    icon: Phone,
    q: 'Wie werden Angehörige eingebunden?',
    a: 'Angehörige sind uns wichtig. Wir halten Sie regelmäßig informiert und sind jederzeit für Sie erreichbar.',
  },
  {
    icon: Home,
    q: 'Wer ist mein Ansprechpartner?',
    a: 'Sie erhalten einen festen Ansprechpartner, der Ihre Situation kennt und immer für Sie da ist.',
  },
]

const stats: Array<{ icon: LucideIcon; value: string; label: string; rating?: boolean }> = [
  { icon: Star, value: '4,9 / 5', label: 'Bewertung bei Google', rating: true },
  { icon: Users, value: '200+', label: 'Betreute Familien in Bochum' },
  { icon: Clock, value: '24 / 7', label: 'Erreichbar für Sie und Ihre Angehörigen' },
  { icon: ShieldCheck, value: 'Pflegegrade 1–5', label: 'Individuelle Versorgung für jede Situation' },
]

function FaqCard({ item, expanded, onToggle }: { item: (typeof items)[number]; expanded: boolean; onToggle: () => void }) {
  const Icon = item.icon
  return (
    <div
      className={cn(
        'rounded-2xl border bg-white/95 transition-shadow',
        expanded
          ? 'border-[#1B3F5F]/20 shadow-[0_8px_30px_-10px_rgba(27,63,95,0.18)]'
          : 'border-slate-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_-10px_rgba(27,63,95,0.12)]'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
            expanded ? 'bg-[#2563eb] text-white' : 'bg-[#1B3F5F]/[0.06] text-[#2563eb]'
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1 text-[0.9375rem] font-semibold leading-snug text-[#1B3F5F]">{item.q}</span>
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform duration-300',
            expanded && 'rotate-45 border-[#2563eb]/30 text-[#2563eb]'
          )}
        >
          <Plus className="h-4 w-4" aria-hidden />
        </span>
      </button>

      {/* Collapsible answer */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 pl-[4.5rem] text-[13px] leading-relaxed text-slate-600">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export function FAQ({ showConsultationBanner = true }: { showConsultationBanner?: boolean }) {
  const [open, setOpen] = useState<number | null>(0)
  const toggle = (i: number) => setOpen(prev => (prev === i ? null : i))

  return (
    <section className="border-t border-slate-200/70 bg-slate-50/60">
      <div className="container py-14 sm:py-16 lg:py-20">
        {/* HERO */}
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
            FAQ · Häufige Fragen
          </span>
          <h2 className="mt-5 text-balance text-2xl font-bold leading-[1.15] text-[#1B3F5F] sm:text-3xl lg:text-[2.35rem]">
            Noch Fragen? Wir beantworten die{' '}
            <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">
              wichtigsten Themen
            </span>{' '}
            direkt.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            Pflege ist Vertrauenssache. Deshalb beantworten wir die Fragen, die Angehörige und Familien uns am
            häufigsten stellen.
          </p>
        </div>

        {/* FAQ ACCORDION — mobile list & desktop grid */}
        <div className="mt-10 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:mt-12">
          {items.map((item, i) => (
            <FaqCard key={item.q} item={item} expanded={open === i} onToggle={() => toggle(i)} />
          ))}
        </div>

        {/* NOCH FRAGEN? — CTA zum Kontaktformular */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#1B3F5F]/10 bg-gradient-to-br from-[#1B3F5F]/[0.03] to-[#2563eb]/[0.05] lg:mt-10">
          <div className="flex flex-col items-center gap-5 px-6 py-7 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
            <div className="flex items-center gap-4">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563eb] shadow-sm sm:flex">
                <HeartHandshake className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1B3F5F]">Noch Fragen?</h3>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600">
                  Ihre Frage war nicht dabei? Schreiben Sie uns – wir melden uns persönlich, schnell und unverbindlich
                  bei Ihnen zurück.
                </p>
              </div>
            </div>
            <Link
              href="/kontakt"
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1B3F5F] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#1B3F5F]/15 transition-colors hover:bg-[#163352] sm:w-auto"
            >
              Zum Kontaktformular
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-10 grid grid-cols-2 gap-3 lg:mt-12 lg:grid-cols-4">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white/95 p-4 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:gap-3 sm:p-5 sm:text-left"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1B3F5F]/[0.06] text-[#2563eb]">
                <stat.icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-bold leading-tight text-[#1B3F5F] sm:text-base">{stat.value}</p>
                {stat.rating ? (
                  <span className="mt-1 flex justify-center text-[#f5a623] sm:justify-start" aria-hidden>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="h-3 w-3 fill-current" />
                    ))}
                  </span>
                ) : null}
                <p className="mt-1 text-[11px] leading-snug text-slate-600 sm:text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA BANNER */}
        {showConsultationBanner ? (
        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_50px_-24px_rgba(27,63,95,0.25)] lg:mt-12">
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-medium text-slate-500">Sie haben keine passende Antwort gefunden?</p>
              <h3 className="mt-1 text-2xl font-bold text-[#1B3F5F] sm:text-[1.75rem]">
                <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">
                  Wir beraten Sie persönlich.
                </span>
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                Unser Team ist gerne für Sie da – telefonisch oder unverbindlich über unser Kontaktformular.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="tel:+4923279911907"
                  className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.06] text-[#2563eb]">
                    <Phone className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-[#1B3F5F]">02327 / 9911907</span>
                    <span className="block text-xs text-slate-500">Jetzt anrufen</span>
                  </span>
                </a>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-3 rounded-xl bg-[#1B3F5F] px-4 py-3 text-white shadow-md shadow-[#1B3F5F]/15 transition-colors hover:bg-[#163352]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold">Beratung anfragen</span>
                    <span className="block text-xs text-white/70">Unverbindlich &amp; kostenlos</span>
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative hidden h-full min-h-[220px] lg:block">
              <Image
                src="/images/beratung-team.jpg"
                alt="Das PflegeNest Beratungsteam aus Bochum"
                fill
                sizes="40vw"
                className="object-cover object-right"
              />
            </div>
          </div>
        </div>
        ) : null}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map(it => ({
              '@type': 'Question',
              name: it.q,
              acceptedAnswer: { '@type': 'Answer', text: it.a },
            })),
          }),
        }}
      />
    </section>
  )
}

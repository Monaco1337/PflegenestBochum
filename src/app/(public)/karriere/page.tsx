import Link from 'next/link'
import { ArrowRight, Clock, Heart, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApplicationForm } from '@/modules/website/application-form'
import { CareerBenefits } from '@/modules/website/career-benefits'

export const metadata = {
  title: 'Karriere — Pflegedienst Bochum sucht Sie',
  description:
    'Wir suchen Pflegefachkräfte, Pflegehelfer:innen und Tourenplaner:innen in Bochum. Übertarifliche Bezahlung, faire Touren, echtes Team.',
}

const heroHighlights = [
  { icon: MapPin, label: 'Standort Bochum' },
  { icon: Clock, label: 'Flexible Modelle' },
  { icon: Sparkles, label: 'Übertariflich' },
]

const openRoles = [
  {
    title: 'Pflegefachkraft (m/w/d)',
    body: 'Examinierte Pflegekraft mit Herz. Tagdienst, Frühdienst oder Spätdienst.',
    tags: ['Vollzeit', 'Teilzeit'],
  },
  {
    title: 'Pflegehelfer:in (m/w/d)',
    body: 'Sie unterstützen unser Team im Alltag — Quereinstieg möglich.',
    tags: ['Teilzeit', 'Minijob'],
  },
  {
    title: 'Pflegedienstleitung (m/w/d)',
    body: 'Sie führen das Pflegeteam, steuern Touren und Qualität.',
    tags: ['Vollzeit'],
  },
  {
    title: 'Tourenplanung (m/w/d)',
    body: 'Sie optimieren unsere Touren und entlasten die Pflege.',
    tags: ['Teilzeit'],
  },
]

export default function KarrierePage() {
  return (
    <div className="bg-slate-50/60">
      {/* HERO */}
      <section className="container py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
            Karriere bei PflegeNest
          </span>
          <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.12] text-[#1B3F5F] sm:text-4xl lg:text-[3rem]">
            Pflege braucht Menschen,{' '}
            <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">
              die bleiben.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Bei PflegeNest finden Sie Wertschätzung, faire Touren und ein Team, das zusammenhält. Übertarifliche
            Bezahlung, moderne Technik und eine strukturierte Einarbeitung.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {heroHighlights.map(item => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-[#1B3F5F] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <item.icon className="h-4 w-4 text-[#2563eb]" aria-hidden />
                {item.label}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              className="h-11 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
            >
              <Link href="#bewerben">
                Jetzt bewerben
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg border-slate-300 bg-white px-6 text-[0.9375rem] font-semibold text-[#1B3F5F] hover:bg-slate-50"
            >
              <Link href="#stellen">Offene Stellen ansehen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* VORTEILE */}
      <section className="border-t border-slate-200/70 bg-white py-14 sm:py-16">
        <div className="container">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#1B3F5F] sm:text-[1.75rem]">Warum PflegeNest?</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Wir schaffen Bedingungen, unter denen gute Pflege gelingt — für Sie und für die Menschen, die wir
              begleiten.
            </p>
          </div>
          <div className="mt-8">
            <CareerBenefits />
          </div>
        </div>
      </section>

      {/* OFFENE STELLEN */}
      <section id="stellen" className="container py-14 sm:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
            Offene Stellen
          </span>
          <h2 className="mt-4 text-2xl font-bold text-[#1B3F5F] sm:text-[1.75rem]">Werden Sie Teil des Teams.</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Sie finden Ihre Position nicht? Bewerben Sie sich initiativ — wir freuen uns auf Sie.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {openRoles.map(role => (
            <div
              key={role.title}
              className="group flex flex-col rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_30px_-8px_rgba(27,63,95,0.14)]"
            >
              <div className="flex flex-wrap gap-2">
                {role.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex rounded-full bg-[#1B3F5F]/[0.06] px-2.5 py-0.5 text-xs font-semibold text-[#2563eb]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-3 text-lg font-bold text-[#1B3F5F]">{role.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{role.body}</p>
              <Link
                href="#bewerben"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] transition-all group-hover:gap-1.5"
              >
                Auf diese Stelle bewerben
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* BEWERBEN */}
      <section id="bewerben" className="border-t border-slate-200/70 bg-white py-14 sm:py-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <div>
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
                Bewerbung
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-tight text-[#1B3F5F] sm:text-3xl">
                In 90 Sekunden bewerben.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Kurz, ehrlich, persönlich. Schicken Sie uns Ihre Daten — wir melden uns innerhalb von 48 Stunden bei
                Ihnen zurück.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  'Keine langen Anschreiben nötig',
                  'Persönliches Gespräch statt anonymem Verfahren',
                  'Schnelle Rückmeldung innerhalb von 48 Stunden',
                ].map(line => (
                  <li key={line} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1B3F5F]/[0.08] text-[#2563eb]">
                      <Heart className="h-3 w-3" aria-hidden />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <ApplicationForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { ContactForm } from '@/modules/website/contact-form'

export const metadata = {
  title: 'Kontakt & Rückruf — Pflegedienst Bochum',
  description: 'Persönlicher Kontakt zu PflegeNest Bochum. Telefon, E-Mail, Adresse und ein direktes Beratungsformular.',
}

const infoTiles = [
  {
    icon: Phone,
    title: 'Telefon',
    lines: ['02327 / 9911907', 'Mo–Fr 8–18 Uhr · 24/7 Notdienst'],
    href: 'tel:+4923279911907',
    accent: true,
  },
  {
    icon: Mail,
    title: 'E-Mail',
    lines: ['info@pflegenest-bochum.de', 'Wir antworten i. d. R. innerhalb 24h'],
    href: 'mailto:info@pflegenest-bochum.de',
    accent: true,
  },
  {
    icon: MapPin,
    title: 'Adresse',
    lines: ['Ruhrstraße 2, 44869 Bochum', 'Zentrale in Bochum-Wattenscheid'],
  },
]

export default function KontaktPage() {
  return (
    <div className="bg-slate-50/60">
      <section className="container py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: intro + info */}
          <div className="lg:col-span-5">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
              Kontakt
            </span>
            <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.12] text-[#1B3F5F] sm:text-4xl">
              Sprechen wir{' '}
              <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">kurz.</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Wir sind für Sie da – persönlich, schnell und unkompliziert. Rufen Sie uns an oder schreiben Sie uns eine
              Nachricht.
            </p>

            <div className="mt-7 space-y-3">
              {infoTiles.map(tile => (
                <div
                  key={tile.title}
                  className="flex items-start gap-3.5 rounded-xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.06] text-[#2563eb]">
                    <tile.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1B3F5F]">{tile.title}</p>
                    {tile.href ? (
                      <a href={tile.href} className="mt-0.5 block text-sm font-medium text-[#2563eb] hover:underline">
                        {tile.lines[0]}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm text-slate-700">{tile.lines[0]}</p>
                    )}
                    <p className="mt-0.5 text-xs text-slate-500">{tile.lines[1]}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-[#2563eb]/15 bg-[#2563eb]/[0.04] p-4">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#2563eb] shadow-sm">
                    <ShieldCheck className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#1B3F5F]">Ihre Daten sind bei uns sicher.</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                      Wir behandeln Ihre Daten vertraulich und DSGVO-konform. Mehr dazu in unserer{' '}
                      <a href="/datenschutz" className="text-[#2563eb] underline">
                        Datenschutzerklärung
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FAQ } from '@/modules/website/faq'
import { LocalBusinessSchema } from '@/modules/website/schema-org'
import { ContactForm } from '@/modules/website/contact-form'
import { Hero } from '@/modules/website/hero'
import { PromiseBanner } from '@/modules/website/promise-banner'
import { HowItWorks } from '@/modules/website/how-it-works'
import { ServicesShowcase } from '@/modules/website/services-showcase'
import { RelativesSection } from '@/modules/website/relatives-section'
import { RelativesProcess } from '@/modules/website/relatives-process'
import { CareerBenefits } from '@/modules/website/career-benefits'

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />

      {/* Hero + Leistungen teilen sich auf Desktop ein durchgehendes Hintergrundbild */}
      <div className="relative">
        <div className="absolute inset-0 hidden lg:block" aria-hidden>
          <Image
            src="/images/hero/desktop.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_16%]"
          />
          {/* Links weiß für die Lesbarkeit des Hero-Textes */}
          <div className="absolute inset-0 bg-gradient-to-r from-white from-22% via-white/94 via-40% to-transparent to-68%" />
          {/* Nach unten ins Weiß auslaufen — Bild bleibt hinter den Karten sichtbar */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-62% to-white/95 to-100%" />
        </div>

        <Hero />
        <ServicesShowcase />
      </div>

      <PromiseBanner />
      <HowItWorks />

      {/* ANGEHÖRIGE */}
      <section className="border-t bg-slate-50/60 py-16 sm:py-20">
        <div className="container space-y-10 sm:space-y-12">
          <RelativesSection />
          <RelativesProcess />
        </div>
      </section>

      {/* KARRIERE */}
      <section className="border-t bg-white py-16 sm:py-20">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
              Karriere
            </span>
            <h2 className="mt-5 text-balance text-2xl font-bold leading-[1.15] text-[#1B3F5F] sm:text-3xl lg:text-[2.35rem]">
              Pflege braucht Menschen,{' '}
              <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">
                die bleiben.
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Bei PflegeNest finden Sie Wertschätzung, faire Touren und ein Team, das zusammenhält. Bewerben Sie sich in
              unter 90 Sekunden.
            </p>
          </div>

          <div className="mt-8">
            <CareerBenefits />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              className="h-11 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
            >
              <Link href="/karriere">
                Stellen ansehen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg border-slate-300 bg-white px-6 text-[0.9375rem] font-semibold text-[#1B3F5F] hover:bg-slate-50"
            >
              <Link href="/karriere#bewerben">Jetzt bewerben</Link>
            </Button>
          </div>
        </div>
      </section>

      <FAQ showConsultationBanner={false} />

      {/* KONTAKT */}
      <Section eyebrow="Kontakt" title="Sprechen wir kurz.">
        <div className="grid gap-8 lg:grid-cols-[1fr,1.1fr]">
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-1">Telefon</h3>
              <a href="tel:+4923279911907" className="text-primary font-medium">02327 / 9911907</a>
              <p className="text-muted-foreground mt-1">Mo–Fr 8–18 Uhr · 24/7 Notdienst</p>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-1">E-Mail</h3>
              <a className="text-primary font-medium" href="mailto:info@pflegenest-bochum.de">info@pflegenest-bochum.de</a>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-1">Adresse</h3>
              <p>Ruhrstraße 2, 44869 Bochum</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  )
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="py-16 sm:py-24 border-t">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <Badge variant="muted" className="mb-3">{eyebrow}</Badge>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">{title}</h2>
          {description ? <p className="mt-3 text-muted-foreground text-balance">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  )
}


import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  FileText,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  User,
  UserCheck,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const imageHighlights = [
  { icon: Clock, title: '24h', subtitle: 'Rückmeldung' },
  { icon: User, title: 'Persönlicher', subtitle: 'Ansprechpartner' },
  { icon: MapPin, title: 'Vor Ort', subtitle: 'in Bochum' },
]

const features = [
  {
    icon: UserCheck,
    title: 'Fester Ansprechpartner',
    description: 'Ein direkter Kontakt für alle Fragen und Anliegen.',
  },
  {
    icon: MessageCircle,
    title: 'Transparente Kommunikation',
    description: 'Wir informieren Sie regelmäßig und halten Sie auf dem Laufenden.',
  },
  {
    icon: Zap,
    title: 'Schnelle Rückmeldungen',
    description: 'Wir reagieren zügig und sind für Sie da.',
  },
  {
    icon: FileText,
    title: 'Unterstützung bei Anträgen',
    description: 'Wir helfen bei Pflegegrad, Kasse und allen Formalitäten.',
  },
  {
    icon: Heart,
    title: 'Hilfe bei Pflegegrad-Fragen',
    description: 'Wir erklären verständlich, was Ihnen zusteht.',
  },
  {
    icon: Sparkles,
    title: 'Entlastung im Alltag',
    description: 'Wir übernehmen, damit Sie mehr Zeit für sich haben.',
  },
]

export function RelativesSection({ headingAs = 'h2', priority = false }: { headingAs?: 'h1' | 'h2'; priority?: boolean }) {
  const Heading = headingAs

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch lg:gap-12 xl:gap-16">
      {/* Image column */}
      <div className="relative order-1 lg:order-none">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-auto lg:h-full lg:min-h-[520px]">
          <Image
            src="/images/relatives-desktop.png"
            alt="Angehörige und PflegeNest im vertrauensvollen Gespräch am Smartphone"
            fill
            priority={priority}
            sizes="(max-width: 1023px) 100vw, 42vw"
            className="hidden object-cover object-left lg:block"
          />
          <Image
            src="/images/relatives-mobile.png"
            alt="Angehörige und PflegeNest im vertrauensvollen Gespräch am Smartphone"
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover object-left lg:hidden"
          />
        </div>

        <div className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-xl border border-white/80 bg-white/95 px-4 py-3.5 shadow-[0_8px_30px_-6px_rgba(27,63,95,0.15)] backdrop-blur-sm sm:block lg:left-6">
          <ul className="space-y-3">
            {imageHighlights.map(item => (
              <li key={item.title} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.08] text-[#2563eb]">
                  <item.icon className="h-4 w-4" aria-hidden />
                </div>
                <p className="text-sm leading-tight text-[#1B3F5F]">
                  <span className="font-semibold">{item.title}</span>
                  <br />
                  <span className="text-slate-600">{item.subtitle}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content column */}
      <div className="order-2 lg:order-none">
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
          Für Angehörige
        </span>

        <Heading className="mt-5 text-balance text-2xl font-bold leading-[1.15] text-[#1B3F5F] sm:text-3xl lg:text-[2.35rem] xl:text-[2.6rem]">
          Mehr Sicherheit für Angehörige.{' '}
          <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent lg:block">
            Immer wissen, wie es Ihren Liebsten geht.
          </span>
        </Heading>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
          Pflege ist Vertrauenssache. Deshalb halten wir Angehörige auf Wunsch transparent informiert und stehen
          jederzeit als Ansprechpartner zur Verfügung.
        </p>

        {/* Mobile highlights */}
        <ul className="mt-5 flex flex-wrap gap-4 sm:hidden">
          {imageHighlights.map(item => (
            <li key={item.title} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.08] text-[#2563eb]">
                <item.icon className="h-3.5 w-3.5" aria-hidden />
              </div>
              <span className="text-xs font-medium text-[#1B3F5F]">
                {item.title} {item.subtitle}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(item => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_16px_-4px_rgba(27,63,95,0.1)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.08] text-[#2563eb]">
                <item.icon className="h-4 w-4" aria-hidden />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[#1B3F5F]">{item.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-[13px]">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            asChild
            className="h-11 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
          >
            <Link href="/kontakt">
              Beratung vereinbaren
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-lg border-slate-300 bg-white px-6 text-[0.9375rem] font-semibold text-[#1B3F5F] hover:bg-slate-50"
          >
            <Link href="/leistungen">Leistungen ansehen</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

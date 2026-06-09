'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Activity,
  Brain,
  Check,
  ChevronDown,
  Heart,
  HeartHandshake,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ShowcaseService = {
  icon: LucideIcon
  title: string
  description: string
  points: string[]
}

const services: ShowcaseService[] = [
  {
    icon: Heart,
    title: 'Grundpflege',
    description: 'Körperpflege, Mobilität, Ernährung und Ausscheidung.',
    points: [
      'Körperpflege, Waschen, Duschen & Hautpflege',
      'An- und Auskleiden',
      'Mobilisation, Lagerung & Sturzprophylaxe',
      'Unterstützung bei Ernährung & Flüssigkeit',
      'Hilfe bei der Ausscheidung & Inkontinenzversorgung',
    ],
  },
  {
    icon: Stethoscope,
    title: 'Behandlungspflege',
    description: 'Medikamentengabe, Wundversorgung, Injektionen und mehr.',
    points: [
      'Medikamentengabe & Medikamentenmanagement',
      'Injektionen (z. B. Insulin) & Blutzuckerkontrolle',
      'Professionelle Wundversorgung & Verbandwechsel',
      'Blutdruck- & Vitalzeichenkontrolle',
      'Kompressionstherapie, Stoma- & Katheterversorgung',
    ],
  },
  {
    icon: Users,
    title: 'Verhinderungspflege',
    description: 'Wir springen ein, wenn Sie eine Pause brauchen.',
    points: [
      'Vertretung bei Urlaub, Krankheit oder Auszeit',
      'Stundenweise bis mehrwöchige Übernahme',
      'Flexibel und kurzfristig planbar',
      'Über die Pflegekasse finanzierbar (ab Pflegegrad 2)',
    ],
  },
  {
    icon: Brain,
    title: 'Demenzbetreuung',
    description: 'Strukturierte Begleitung mit Geduld, Verständnis und Herz.',
    points: [
      'Strukturierte Tages- & Alltagsbegleitung',
      'Aktivierung, Beschäftigung & Orientierungshilfen',
      'Sicherer, vertrauter Umgang im gewohnten Umfeld',
      'Spürbare Entlastung für Angehörige',
    ],
  },
  {
    icon: HeartHandshake,
    title: 'Palliativpflege',
    description: 'Würdevolle, schmerzlindernde und individuelle Begleitung.',
    points: [
      'Schmerz- & Symptomkontrolle',
      'Enge Zusammenarbeit mit Ärzten & Hospizdiensten',
      'Nähe und Geborgenheit bis zuletzt',
      'Unterstützung & Beratung für Angehörige',
    ],
  },
  {
    icon: Activity,
    title: 'Pflege nach KH-Aufenthalt',
    description: 'Sicherer Übergang vom Krankenhaus zurück nach Hause.',
    points: [
      'Übernahme direkt nach der Entlassung',
      'Wundversorgung & Medikamentenmanagement',
      'Abstimmung mit Klinik, Ärzten & Therapeuten',
      'Unterstützung beim Wiedererlangen der Selbstständigkeit',
    ],
  },
]

function ServiceCard({ item, active }: { item: ShowcaseService; active?: boolean }) {
  const Icon = item.icon
  const [open, setOpen] = useState(false)

  return (
    <article
      className={cn(
        'group flex h-full flex-col rounded-xl border bg-white p-4 transition-all duration-200',
        open || active
          ? 'border-[#1B3F5F]/20 shadow-md'
          : 'border-slate-200/80 shadow-sm hover:border-[#1B3F5F]/15 hover:shadow-md'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
          open ? 'bg-[#2563eb] text-white' : 'bg-[#1B3F5F]/[0.08] text-[#2563eb]'
        )}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </div>
      <h3 className="mt-3 text-[0.9375rem] font-semibold leading-tight text-[#1B3F5F]">{item.title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{item.description}</p>

      {/* Collapsible details */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          open ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <ul className="space-y-1.5 border-t border-slate-100 pt-3">
            {item.points.map(point => (
              <li key={point} className="flex gap-2 text-[12px] leading-snug text-slate-600">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2563eb]" aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        className="mt-3 inline-flex items-center gap-0.5 self-start text-[13px] font-medium text-[#2563eb] transition-all hover:gap-1.5"
      >
        {open ? 'Weniger anzeigen' : 'Mehr erfahren'}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-180')} aria-hidden />
      </button>
    </article>
  )
}

function ServicesSlider() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[index] as HTMLElement | undefined
    if (!slide) return
    track.scrollTo({ left: slide.offsetLeft - 16, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const slides = Array.from(track.children).filter(el => !el.getAttribute('aria-hidden')) as HTMLElement[]
      const center = track.scrollLeft + track.clientWidth / 2
      let closest = 0
      let minDist = Infinity
      slides.forEach((slide, i) => {
        const dist = Math.abs(center - (slide.offsetLeft + slide.offsetWidth / 2))
        if (dist < minDist) {
          minDist = dist
          closest = i
        }
      })
      setActive(closest)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative lg:hidden">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory items-start gap-3 overflow-x-auto px-5 pb-1 scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Leistungen — wischen zum Durchblättern"
      >
        {services.map((item, i) => (
          <div key={item.title} className="w-[calc(100vw-3.5rem)] max-w-[280px] shrink-0 snap-center">
            <ServiceCard item={item} active={active === i} />
          </div>
        ))}
        <div className="w-3 shrink-0" aria-hidden />
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {services.map((item, i) => (
          <button
            key={item.title}
            type="button"
            aria-label={item.title}
            aria-current={active === i ? 'true' : undefined}
            onClick={() => scrollTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              active === i ? 'w-6 bg-[#1B3F5F]' : 'w-1.5 bg-slate-300'
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function ServicesShowcase() {
  return (
    <section className="relative z-10 bg-white pb-8 pt-3 lg:bg-transparent lg:pb-16 lg:pt-4">
      <div className="container">
        <ServicesSlider />
        <div className="hidden items-start gap-3 lg:grid lg:grid-cols-6">
          {services.map(item => (
            <ServiceCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FileText,
  Heart,
  MessageCircle,
  Sparkles,
  UserCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Feature = { icon: LucideIcon; title: string; description: string }

const features: Feature[] = [
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

function FeatureCard({ item }: { item: Feature }) {
  const Icon = item.icon
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B3F5F]/[0.08] text-[#2563eb]">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#1B3F5F]">{item.title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
    </div>
  )
}

export function RelativesFeatures({ className }: { className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[index] as HTMLElement | undefined
    if (!slide) return
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
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
    <div className={className}>
      {/* Mobile slider — eine Karte pro Ansicht */}
      <div className="sm:hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Vorteile für Angehörige — wischen zum Durchblättern"
        >
          {features.map(item => (
            <div key={item.title} className="w-[calc(100vw-2.5rem)] shrink-0 snap-center">
              <FeatureCard item={item} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {features.map((item, i) => (
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

      {/* Tablet + desktop grid */}
      <div className="hidden gap-3.5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}

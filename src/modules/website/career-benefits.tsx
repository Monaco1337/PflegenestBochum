'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BadgeEuro, GraduationCap, HeartHandshake, Route, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export const careerBenefits: Array<{
  icon: LucideIcon
  title: string
  description: string
}> = [
  {
    icon: BadgeEuro,
    title: 'Übertarifliche Bezahlung',
    description: 'Faires Gehalt, Zuschläge und Prämien, die Ihre Arbeit wirklich wertschätzen.',
  },
  {
    icon: Route,
    title: 'Faire Touren & moderne Technik',
    description: 'Durchdachte Tourenplanung und digitale Tools, die Ihren Alltag entlasten.',
  },
  {
    icon: GraduationCap,
    title: 'Strukturierte Einarbeitung',
    description: 'Ein klarer Onboarding-Plan und Fortbildungen, die Sie weiterbringen.',
  },
  {
    icon: HeartHandshake,
    title: 'Echte Teamkultur',
    description: 'Ein Team, das zusammenhält — auf Augenhöhe und mit offenem Ohr.',
  },
]

function BenefitCard({ item }: { item: (typeof careerBenefits)[number] }) {
  const Icon = item.icon
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_16px_-4px_rgba(27,63,95,0.1)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.08] text-[#2563eb]">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-3.5 text-[0.9375rem] font-semibold leading-tight text-[#1B3F5F]">{item.title}</h3>
      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-600">{item.description}</p>
    </div>
  )
}

export function CareerBenefits() {
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
    <div>
      {/* Mobile slider */}
      <div className="sm:hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Vorteile — wischen zum Durchblättern"
        >
          {careerBenefits.map(item => (
            <div key={item.title} className="w-[calc(100vw-3.5rem)] max-w-[280px] shrink-0 snap-center">
              <BenefitCard item={item} />
            </div>
          ))}
          <div className="w-2 shrink-0" aria-hidden />
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {careerBenefits.map((item, i) => (
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

      {/* Desktop / tablet grid */}
      <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {careerBenefits.map(item => (
          <BenefitCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FileText, HandHeart, Phone, Users, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps: Array<{
  step: number
  icon: LucideIcon
  title: string
  description: string
}> = [
  {
    step: 1,
    icon: Phone,
    title: 'Kontakt aufnehmen',
    description: 'Rufen Sie uns an oder nutzen Sie das Formular — wir melden uns schnellstmöglich.',
  },
  {
    step: 2,
    icon: Users,
    title: 'Pflegebedarf besprechen',
    description: 'Wir gehen gemeinsam mit Ihnen die Situation durch und klären alle offenen Fragen.',
  },
  {
    step: 3,
    icon: FileText,
    title: 'Pflegegrad prüfen',
    description: 'Falls noch kein Pflegegrad besteht, unterstützen wir Sie bei der Antragstellung.',
  },
  {
    step: 4,
    icon: HandHeart,
    title: 'Versorgung starten',
    description: 'Nach Klärung aller Details starten wir die ambulante Pflege bei Ihnen zu Hause.',
  },
]

function StepCard({ item, active }: { item: (typeof steps)[number]; active?: boolean }) {
  const Icon = item.icon
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-2xl border bg-white px-6 py-8 text-center transition-all duration-300',
        active
          ? 'border-[#1B3F5F]/20 shadow-lg shadow-[#1B3F5F]/10'
          : 'border-slate-100 shadow-sm'
      )}
    >
      <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50">
        <Icon className="h-8 w-8 text-[#2563eb]" aria-hidden />
        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1B3F5F] text-xs font-bold text-white shadow-md">
          {item.step}
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-[#1B3F5F]">{item.title}</h3>
      <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-slate-600">{item.description}</p>
    </div>
  )
}

function StepsSlider() {
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
      const slides = Array.from(track.children).filter(
        el => !el.getAttribute('aria-hidden')
      ) as HTMLElement[]
      const center = track.scrollLeft + track.clientWidth / 2
      let closest = 0
      let minDist = Infinity
      slides.forEach((slide, i) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2
        const dist = Math.abs(center - slideCenter)
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
    <div className="relative mt-10">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent"
        aria-hidden
      />

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Ablauf — wischen zum Durchblättern"
      >
        {steps.map((item, i) => (
          <div key={item.step} className="w-[calc(100vw-3rem)] max-w-[320px] shrink-0 snap-center">
            <StepCard item={item} active={active === i} />
          </div>
        ))}
        <div className="w-4 shrink-0" aria-hidden />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {steps.map(item => (
          <button
            key={item.step}
            type="button"
            aria-label={`Schritt ${item.step}: ${item.title}`}
            aria-current={active === item.step - 1 ? 'true' : undefined}
            onClick={() => scrollTo(item.step - 1)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              active === item.step - 1 ? 'w-7 bg-[#1B3F5F]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-widest text-slate-400">
        Wischen zum Durchblättern
      </p>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#1B3F5F] sm:text-3xl">
            So einfach funktioniert es
          </h2>
          <div
            className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-[#1B3F5F] to-[#3b82f6]"
            aria-hidden
          />
        </div>

        {/* Mobile slider */}
        <div className="sm:hidden">
          <StepsSlider />
        </div>

        {/* Tablet + Desktop grid */}
        <div className="mt-12 hidden gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((item, i) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              {i < steps.length - 1 ? (
                <div
                  className="pointer-events-none absolute top-8 hidden h-px w-[calc(100%+1.5rem)] bg-gradient-to-r from-slate-200 via-slate-300 to-transparent lg:block lg:left-[calc(50%+2.5rem)]"
                  aria-hidden
                />
              ) : null}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <item.icon className="h-7 w-7 text-[#2563eb]" aria-hidden />
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#1B3F5F] text-xs font-bold text-white">
                  {item.step}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-[#1B3F5F]">{item.title}</h3>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

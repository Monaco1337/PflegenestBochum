'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Clock, Phone, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const kpiItems: Array<{
  icon: LucideIcon
  value: string
  title: string
  description: string
}> = [
  { icon: Clock, value: '12 min', title: 'Digitale Aufnahme', description: 'Unkompliziert & schnell' },
  { icon: Users, value: '24 h', title: 'Erstkontakt', description: 'Meist innerhalb eines Tages' },
  { icon: Phone, value: '24/7', title: 'Erreichbarkeit', description: 'Wir sind jederzeit für Sie da' },
  { icon: ShieldCheck, value: '1–5', title: 'Pflegegrade', description: 'Wir begleiten Sie bei jedem Schritt' },
]

function KpiCard({ item, active }: { item: (typeof kpiItems)[number]; active?: boolean }) {
  const Icon = item.icon
  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-2xl border bg-white p-5 transition-all duration-300',
        active
          ? 'border-[#1B3F5F]/20 shadow-lg shadow-[#1B3F5F]/10'
          : 'border-slate-100 shadow-sm'
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1B3F5F]/[0.08] text-[#1B3F5F]">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-2xl font-bold tabular-nums leading-none text-[#1B3F5F]">{item.value}</p>
        <p className="mt-1.5 text-sm font-semibold text-slate-800">{item.title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.description}</p>
      </div>
    </div>
  )
}

function KpiSlider() {
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
      const slides = Array.from(track.children) as HTMLElement[]
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
    <div className="relative">
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
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Leistungsübersicht — wischen zum Durchblättern"
      >
        {kpiItems.map((item, i) => (
          <div key={item.title} className="w-[calc(100vw-3rem)] max-w-[340px] shrink-0 snap-center">
            <KpiCard item={item} active={active === i} />
          </div>
        ))}
        <div className="w-4 shrink-0" aria-hidden />
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {kpiItems.map((item, i) => (
          <button
            key={item.title}
            type="button"
            aria-label={`${item.title} anzeigen`}
            aria-current={active === i ? 'true' : undefined}
            onClick={() => scrollTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              active === i ? 'w-7 bg-[#1B3F5F]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
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

export function KpiBar() {
  return (
    <section className="relative z-10 bg-white pb-4 pt-2 lg:-mt-14 lg:pt-0">
      <div className="container">
        {/* Mobile: swipe slider */}
        <div className="sm:hidden">
          <KpiSlider />
        </div>

        {/* Tablet + Desktop: grid card */}
        <div className="hidden sm:block">
          <div className="rounded-2xl border border-slate-200/70 bg-white px-6 py-8 shadow-xl shadow-slate-900/[0.06] lg:border-white/60 lg:bg-white/95 lg:px-8 lg:backdrop-blur-md">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {kpiItems.map(item => (
                <KpiCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

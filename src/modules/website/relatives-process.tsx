'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ClipboardList, HandHeart, Phone, Users, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps: Array<{
  step: number
  icon: LucideIcon
  title: string
  description: string
}> = [
  { step: 1, icon: Phone, title: 'Erstgespräch', description: 'Wir nehmen uns Zeit für Sie und Ihre Situation.' },
  { step: 2, icon: ClipboardList, title: 'Individuelle Planung', description: 'Wir erstellen einen Plan, der genau zu Ihnen passt.' },
  { step: 3, icon: HandHeart, title: 'Start der Betreuung', description: 'Unsere Pflegekräfte sind für Sie und Ihre Liebsten da.' },
  { step: 4, icon: Users, title: 'Laufende Begleitung', description: 'Wir bleiben an Ihrer Seite und passen uns an Ihre Bedürfnisse an.' },
]

export function RelativesProcess() {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_4px_24px_-6px_rgba(27,63,95,0.1)] sm:p-8">
      <div className="lg:hidden">
        <ProcessSlider />
      </div>
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,220px)_1fr] lg:items-center lg:gap-10">
        <div>
          <h2 className="text-lg font-bold text-[#1B3F5F]">So unterstützen wir Familien</h2>
          <p className="mt-2 text-sm text-slate-600">Ein klarer Prozess. Von Anfang an an Ihrer Seite.</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {steps.map((item, i) => (
            <div key={item.step} className="relative text-center">
              {i < steps.length - 1 ? (
                <div
                  className="pointer-events-none absolute top-5 left-[calc(50%+1.5rem)] h-px w-[calc(100%-3rem)] bg-slate-200"
                  aria-hidden
                />
              ) : null}
              <div className="relative mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B3F5F]/[0.08] text-[#2563eb]">
                <item.icon className="h-5 w-5" aria-hidden />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1B3F5F] text-[10px] font-bold text-white">
                  {item.step}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[#1B3F5F]">{item.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProcessSlider() {
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
      <h2 className="text-lg font-bold text-[#1B3F5F]">So unterstützen wir Familien</h2>
      <p className="mt-1 text-sm text-slate-600">Ein klarer Prozess. Von Anfang an an Ihrer Seite.</p>

      <div
        ref={trackRef}
        className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Prozess — wischen zum Durchblättern"
      >
        {steps.map((item, i) => (
          <div
            key={item.step}
            className={cn(
              'w-[min(78vw,260px)] shrink-0 snap-center rounded-xl border p-4 text-center transition-all',
              active === i ? 'border-[#1B3F5F]/20 bg-slate-50/50 shadow-sm' : 'border-slate-100 bg-white'
            )}
          >
            <div className="relative mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B3F5F]/[0.08] text-[#2563eb]">
              <item.icon className="h-5 w-5" aria-hidden />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1B3F5F] text-[10px] font-bold text-white">
                {item.step}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-[#1B3F5F]">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.description}</p>
          </div>
        ))}
        <div className="w-2 shrink-0" aria-hidden />
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {steps.map((item, i) => (
          <button
            key={item.step}
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

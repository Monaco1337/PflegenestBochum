'use client'

import { useRef } from 'react'
import { Clock, MapPin, Phone, ShieldCheck, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAutoSlider } from '@/modules/website/use-auto-slider'

type TrustItem = {
  icon: LucideIcon
  line1: string
  line2: string
  bold1: boolean
  bold2: boolean
}

const trustItems: TrustItem[] = [
  { icon: ShieldCheck, line1: 'Pflegegrade 1–5', line2: 'Wir begleiten Sie.', bold1: true, bold2: false },
  { icon: Clock, line1: 'Erstkontakt meist', line2: 'unter 24 Stunden', bold1: false, bold2: true },
  { icon: Phone, line1: '24/7', line2: 'erreichbar', bold1: true, bold2: false },
  { icon: MapPin, line1: 'Vor Ort', line2: 'in Bochum', bold1: true, bold2: false },
]

function TrustItemRow({ item }: { item: TrustItem }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.06] text-[#2563eb]">
        <item.icon className="h-4 w-4 stroke-[1.75]" aria-hidden />
      </div>
      <p className="min-w-0 text-[12px] leading-snug text-slate-600 lg:text-[13px]">
        <span className={cn('block', item.bold1 && 'font-semibold text-[#1B3F5F]')}>{item.line1}</span>
        <span className={cn('block', item.bold2 && 'font-semibold text-[#1B3F5F]')}>{item.line2}</span>
      </p>
    </div>
  )
}

export function HeroTrustBar({ layout, className }: { layout: 'mobile' | 'desktop'; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  useAutoSlider(trackRef, layout === 'mobile')

  if (layout !== 'mobile') {
    return (
      <div className={cn('relative', className)}>
        <div className="grid grid-cols-4 gap-4" aria-label="Vertrauensmerkmale">
          {trustItems.map(item => (
            <TrustItemRow key={item.line1} item={item} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 text-left scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Vertrauensmerkmale — automatischer Slider"
      >
        {trustItems.map(item => (
          <div
            key={item.line1}
            className="min-w-[150px] shrink-0 snap-start rounded-xl border border-slate-200/70 bg-white px-3 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <TrustItemRow item={item} />
          </div>
        ))}
        <div className="w-3 shrink-0" aria-hidden />
      </div>
    </div>
  )
}

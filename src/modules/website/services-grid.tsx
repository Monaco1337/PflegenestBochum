'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Service, services } from '@/modules/website/services-data'

function ServiceCard({ service }: { service: Service }) {
  const [open, setOpen] = useState(false)
  const Icon = service.icon

  return (
    <article
      className={cn(
        'group flex h-full flex-col rounded-2xl border bg-white p-6 transition-all',
        open
          ? 'border-[#2563eb]/20 shadow-[0_16px_40px_-18px_rgba(27,63,95,0.22)]'
          : 'border-slate-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-[#2563eb]/20 hover:shadow-[0_16px_40px_-18px_rgba(27,63,95,0.22)]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
            open ? 'bg-[#2563eb] text-white' : 'bg-[#1B3F5F]/[0.06] text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white'
          )}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        {service.badge ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {service.badge}
          </span>
        ) : null}
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#1B3F5F]">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.body}</p>

      {/* Collapsible Leistungsumfang */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          open ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2 border-t border-slate-100 pt-4">
            {service.points.map(point => (
              <li key={point} className="flex gap-2.5 text-[13px] leading-snug text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2563eb]" aria-hidden />
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
        className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[#2563eb] transition-colors hover:text-[#1d4ed8]"
      >
        {open ? 'Weniger anzeigen' : 'Mehr erfahren'}
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', open && 'rotate-180')} aria-hidden />
      </button>
    </article>
  )
}

export function ServicesGrid() {
  return (
    <div className="mt-10 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {services.map(service => (
        <ServiceCard key={service.title} service={service} />
      ))}
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const trustItems = [
  { icon: ShieldCheck, line1: 'Pflegegrade 1–5', line2: 'Wir begleiten Sie.', bold1: true, bold2: false },
  { icon: Clock, line1: 'Erstkontakt meist', line2: 'unter 24 Stunden', bold1: false, bold2: true },
  { icon: Phone, line1: '24/7', line2: 'erreichbar', bold1: true, bold2: false },
  { icon: MapPin, line1: 'Vor Ort', line2: 'in Bochum', bold1: true, bold2: false },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* ── MOBILE ── */}
      <div className="flex flex-col lg:hidden">
        <div className="relative h-[min(38svh,360px)] shrink-0 overflow-hidden">
          <Image
            src="/images/hero/mobile.png"
            alt="PflegeNest Pflegekraft im persönlichen Gespräch mit einem Patienten"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[78%_12%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B3F5F]/8 via-transparent via-45% to-white to-90%" aria-hidden />
        </div>

        <div className="relative z-10 bg-white px-5 pb-2 pt-5 sm:px-6">
          <HeroCopy layout="mobile" />
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 min-h-full" aria-hidden>
          <Image
            src="/images/hero/desktop.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_18%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white from-22% via-white/94 via-40% to-transparent to-68%" />
        </div>

        <div className="container relative z-10 py-10 xl:py-12">
          <HeroCopy layout="desktop" />
        </div>
      </div>
    </section>
  )
}

function HeroCopy({ layout }: { layout: 'mobile' | 'desktop' }) {
  const mobile = layout === 'mobile'

  return (
    <div className={cn(mobile ? 'w-full' : 'max-w-[720px]')}>
      {!mobile ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3.5 py-1.5 text-sm font-medium text-[#1B3F5F] shadow-sm backdrop-blur-md">
          <Heart className="h-3.5 w-3.5 fill-[#1B3F5F]/15 text-[#1B3F5F]" aria-hidden />
          Ihr ambulanter Pflegedienst in Bochum
        </div>
      ) : null}

      <h1
        className={cn(
          'text-balance font-bold leading-[1.12] tracking-tight text-[#1B3F5F]',
          mobile ? 'text-[1.75rem]' : 'mt-4 text-[2.65rem] xl:text-[3rem]'
        )}
      >
        Pflege, die wirklich{' '}
        <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">
          entlastet.
        </span>
      </h1>

      <p
        className={cn(
          'leading-relaxed text-slate-600',
          mobile ? 'mt-3 text-[0.9375rem]' : 'mt-4 text-[1.05rem] lg:max-w-[30rem]'
        )}
      >
        Persönliche ambulante Pflege in Bochum — mit festen Bezugspersonen, kurzen Wegen und einer Aufnahme, die in Minuten statt Wochen erledigt ist.
      </p>

      <div className={cn('mt-5 flex gap-3', mobile ? 'flex-col' : 'flex-row items-center')}>
        <Button
          asChild
          className={cn(
            'h-11 rounded-lg bg-[#1B3F5F] px-6 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]',
            mobile && 'w-full'
          )}
        >
          <Link href="/kontakt">
            Beratung anfragen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className={cn(
            'h-11 rounded-lg border-slate-300 bg-white px-6 text-[0.9375rem] font-semibold text-[#1B3F5F] hover:bg-slate-50',
            mobile && 'w-full'
          )}
        >
          <Link href="/pflegegrad">Pflegegrad prüfen</Link>
        </Button>
      </div>

      <TrustBar className="mt-5" />
    </div>
  )
}

function TrustBar({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0'
        )}
        aria-label="Vertrauensmerkmale"
      >
        {trustItems.map(item => (
          <div key={item.line1} className="flex min-w-[148px] shrink-0 snap-start items-center gap-2.5 lg:min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.06] text-[#2563eb]">
              <item.icon className="h-4 w-4 stroke-[1.75]" aria-hidden />
            </div>
            <p className="min-w-0 text-[12px] leading-snug text-slate-600 lg:text-[13px]">
              <span className={cn('block', item.bold1 && 'font-semibold text-[#1B3F5F]')}>{item.line1}</span>
              <span className={cn('block', item.bold2 && 'font-semibold text-[#1B3F5F]')}>{item.line2}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

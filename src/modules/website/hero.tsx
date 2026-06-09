import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { HeroTrustBar } from '@/modules/website/hero-trust-bar'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white lg:bg-transparent">
      {/* ── MOBILE / TABLET ── */}
      <div className="relative overflow-hidden lg:hidden">
        <div className="relative h-[min(56svh,520px)] w-full">
          <Image
            src="/images/hero/mobile.png"
            alt="PflegeNest Pflegekraft im persönlichen Gespräch mit einem Patienten"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[76%_34%]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent from-20% via-white/80 via-66% to-white to-92%"
            aria-hidden
          />
        </div>
        <div className="relative z-10 -mt-[120px] px-5 pb-2 text-center sm:px-6">
          <HeroCopy layout="mobile" />
        </div>
      </div>

      {/* ── DESKTOP ── (Hintergrundbild liegt im gemeinsamen Wrapper) */}
      <div className="relative hidden lg:block">
        <div className="container relative z-10 py-12 xl:py-16">
          <HeroCopy layout="desktop" />
        </div>
      </div>
    </section>
  )
}

function HeroCopy({ layout }: { layout: 'mobile' | 'desktop' }) {
  const mobile = layout === 'mobile'

  return (
    <div className={cn(mobile ? 'w-full text-center' : 'max-w-[720px]')}>
      {mobile ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1B3F5F]/10 bg-[#1B3F5F]/[0.04] px-3 py-1.5 text-[13px] font-medium text-[#1B3F5F]">
          <Heart className="h-3.5 w-3.5 fill-[#2563eb]/15 text-[#2563eb]" aria-hidden />
          Ihr ambulanter Pflegedienst in Bochum
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3.5 py-1.5 text-sm font-medium text-[#1B3F5F] shadow-sm backdrop-blur-md">
          <Heart className="h-3.5 w-3.5 fill-[#1B3F5F]/15 text-[#1B3F5F]" aria-hidden />
          Ihr ambulanter Pflegedienst in Bochum
        </div>
      )}

      <h1
        className={cn(
          'text-balance font-bold tracking-tight text-[#1B3F5F]',
          mobile ? 'mt-4 text-[1.9rem] leading-[1.1]' : 'mt-4 text-[2.65rem] leading-[1.12] xl:text-[3rem]'
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
          mobile ? 'mx-auto mt-3 max-w-[22rem] text-[0.9375rem]' : 'mt-4 text-[1.05rem] lg:max-w-[30rem]'
        )}
      >
        Persönliche ambulante Pflege in Bochum — mit festen Bezugspersonen, kurzen Wegen und einer Aufnahme, die in Minuten statt Wochen erledigt ist.
      </p>

      <div className={cn('mt-6 flex gap-3', mobile ? 'flex-col' : 'flex-row items-center')}>
        <Button
          asChild
          className={cn(
            'rounded-xl bg-[#1B3F5F] px-6 font-semibold hover:bg-[#163352]',
            mobile
              ? 'h-12 w-full bg-gradient-to-br from-[#1B3F5F] to-[#163352] text-[0.95rem] shadow-lg shadow-[#1B3F5F]/20 transition-transform active:scale-[0.98]'
              : 'h-11 rounded-lg text-[0.9375rem] shadow-md shadow-[#1B3F5F]/15'
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
            'border-slate-300 bg-white px-6 font-semibold text-[#1B3F5F] hover:bg-slate-50',
            mobile
              ? 'h-12 w-full rounded-xl text-[0.95rem] transition-transform active:scale-[0.98]'
              : 'h-11 rounded-lg text-[0.9375rem]'
          )}
        >
          <Link href="/pflegegrad">Pflegegrad prüfen</Link>
        </Button>
      </div>

      <HeroTrustBar layout={layout} className="mt-5" />
    </div>
  )
}

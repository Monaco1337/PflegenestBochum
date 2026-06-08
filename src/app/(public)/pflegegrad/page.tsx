import { Clock, Gift, ShieldCheck } from 'lucide-react'
import { PflegegradWizard } from '@/modules/pflegegrad/Wizard'

export const metadata = {
  title: 'Pflegegrad prüfen — Pflegegrad-Voreinschätzung Bochum',
  description:
    'Schnelle, kostenlose Pflegegrad-Voreinschätzung mit anschließendem Beratungsangebot. NBA-orientiert, DSGVO-konform — eine Orientierung, keine rechtsverbindliche Einstufung.',
}

const trustChips = [
  { icon: Clock, label: 'Ca. 5 Minuten' },
  { icon: Gift, label: 'Kostenlos & unverbindlich' },
  { icon: ShieldCheck, label: 'DSGVO-konform' },
]

export default function PflegegradPage() {
  return (
    <div className="bg-slate-50/60">
      <div className="container py-12 sm:py-16 lg:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
            Pflegegrad-Center
          </span>
          <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.12] text-[#1B3F5F] sm:text-4xl lg:text-[2.75rem]">
            In 5 Minuten zur{' '}
            <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">
              Pflegegrad-Einschätzung.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            Beantworten Sie ein paar einfache Fragen aus sechs Bereichen. Sie erhalten eine fundierte Orientierung und
            ein persönliches Beratungsangebot — verständlich erklärt, ohne Fachchinesisch.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {trustChips.map(chip => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-[#1B3F5F] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <chip.icon className="h-4 w-4 text-[#2563eb]" aria-hidden />
                {chip.label}
              </span>
            ))}
          </div>
        </header>

        <div className="mx-auto mt-10 max-w-3xl">
          <PflegegradWizard />
        </div>

        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
          Hinweis: Diese Einschätzung ist eine Orientierungshilfe und ersetzt keine rechtsverbindliche Begutachtung. Die
          finale Einstufung erfolgt durch den Medizinischen Dienst.
        </p>
      </div>
    </div>
  )
}

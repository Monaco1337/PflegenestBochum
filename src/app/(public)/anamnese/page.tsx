import { Clock, Lock, ShieldCheck } from 'lucide-react'
import { AnamnesisWizard } from '@/modules/anamnesis/Wizard'

export const metadata = {
  title: 'Digitale Anamnese — Aufnahme online vorbereiten',
  description:
    'Mit der digitalen Anamnese erfassen wir alle relevanten Informationen vorab in 17 strukturierten Schritten – sicher, schnell und DSGVO-konform.',
}

const trustChips = [
  { icon: Clock, label: 'Ca. 12 Minuten' },
  { icon: Lock, label: 'Sicher verschlüsselt' },
  { icon: ShieldCheck, label: 'DSGVO-konform' },
]

export default function AnamnesePage() {
  return (
    <div className="bg-slate-50/60">
      <div className="container py-12 sm:py-16 lg:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
            Digitale Aufnahme
          </span>
          <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.12] text-[#1B3F5F] sm:text-4xl lg:text-[2.75rem]">
            Anamnese, online in{' '}
            <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">
              12 Minuten.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            Sie übermitteln alle wichtigen Angaben vorab in strukturierten Schritten. Wir nehmen anschließend Kontakt auf
            und stimmen den Pflegestart konkret mit Ihnen ab.
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
          <AnamnesisWizard />
        </div>

        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
          Ihre Angaben werden verschlüsselt übertragen und ausschließlich zur Vorbereitung Ihrer Pflege verwendet.
        </p>
      </div>
    </div>
  )
}

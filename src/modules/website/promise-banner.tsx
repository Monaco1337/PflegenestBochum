import Image from 'next/image'
import { Award, HeartHandshake, Users } from 'lucide-react'

const pillars = [
  {
    icon: HeartHandshake,
    title: 'Persönliche Betreuung',
    description: 'Feste Bezugspersonen — Sie kennen Ihr Team, Ihr Team kennt Sie.',
  },
  {
    icon: Users,
    title: 'Erfahrenes Team',
    description: 'Qualifizierte Pflegekräfte mit Herz, Verstand und regionaler Erfahrung.',
  },
  {
    icon: Award,
    title: 'Qualität & Vertrauen',
    description: 'Transparente Prozesse, dokumentierte Standards und offene Kommunikation.',
  },
]

export function PromiseBanner() {
  return (
    <section className="bg-white pb-14 pt-2 sm:pb-20">
      <div className="container">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#e8f0fa] via-[#f0f5fb] to-[#e3ecf7]">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10">
              <span className="inline-flex w-fit rounded-full border border-[#1B3F5F]/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B3F5F]">
                Unser Versprechen
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-tight text-[#1B3F5F] sm:text-3xl">
                Verlässlich. Menschlich. Nah.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
                Pflege ist Vertrauenssache. Deshalb setzen wir auf feste Teams, kurze Wege in Bochum und eine Betreuung, die sich anfühlt, als wäre sie für Sie gemacht.
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {pillars.map(p => (
                  <div key={p.title}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2563eb] shadow-sm">
                      <p.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-[#1B3F5F]">{p.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative m-4 mt-0 min-h-[240px] flex-1 overflow-hidden rounded-2xl sm:m-6 sm:min-h-[280px] lg:m-4 lg:ml-0 lg:max-w-[42%] lg:min-h-[320px]">
              <Image
                src="/images/promise-care.png"
                alt="PflegeNest Pflegekraft im vertrauensvollen Gespräch mit einer Patientin"
                fill
                sizes="(max-width: 1023px) 100vw, 42vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

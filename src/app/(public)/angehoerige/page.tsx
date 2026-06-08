import { RelativesProcess } from '@/modules/website/relatives-process'
import { RelativesSection } from '@/modules/website/relatives-section'

export const metadata = {
  title: 'Für Angehörige — PflegeNest Bochum',
  description:
    'Mehr Sicherheit für Angehörige: fester Ansprechpartner, transparente Kommunikation und Unterstützung bei Pflegegrad und Anträgen in Bochum.',
}

export default function AngehoerigePage() {
  return (
    <div className="bg-slate-50/60">
      <section className="container py-10 sm:py-14 lg:py-16">
        <RelativesSection headingAs="h1" priority />
      </section>

      <section className="container pb-14 sm:pb-20">
        <RelativesProcess />
      </section>
    </div>
  )
}

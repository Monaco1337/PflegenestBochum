import type { Metadata } from 'next'
import { Building2, Globe, Hash, Mail, MapPin, Phone, Printer, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Impressum | PflegeNest Bochum',
  description: 'Rechtliche Angaben und Kontaktinformationen der PflegeNest Bochum GbR.',
  alternates: { canonical: '/impressum' },
  openGraph: {
    title: 'Impressum | PflegeNest Bochum',
    description: 'Rechtliche Angaben und Kontaktinformationen der PflegeNest Bochum GbR.',
    url: '/impressum',
    type: 'website',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PflegeNest Bochum GbR',
  url: 'https://www.pflegenest-bochum.de',
  telephone: '+49 2327 9911907',
  faxNumber: '+49 2327 9911908',
  email: 'info@pflegenest-bochum.de',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ruhrstraße 2',
    postalCode: '44869',
    addressLocality: 'Bochum',
    addressCountry: 'DE',
  },
  founder: [
    { '@type': 'Person', name: 'Soner Atsan' },
    { '@type': 'Person', name: 'Seilan Mamedov' },
  ],
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'Institutionskennzeichen (IK)',
    value: '462553230',
  },
}

export default function ImpressumPage() {
  return (
    <div className="bg-muted/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <div className="container max-w-3xl py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <header>
          <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Rechtliches
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Impressum</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz) sowie weitere rechtliche Hinweise.
          </p>
        </header>

        {/* Key facts */}
        <section aria-labelledby="angaben" className="mt-10">
          <h2 id="angaben" className="text-xl font-bold text-foreground">
            Angaben gemäß § 5 DDG
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InfoCard icon={Building2} title="Anbieter">
              <p className="font-semibold text-foreground">PflegeNest Bochum GbR</p>
            </InfoCard>

            <InfoCard icon={MapPin} title="Anschrift">
              <address className="not-italic leading-relaxed">
                Ruhrstraße 2<br />
                44869 Bochum<br />
                Deutschland
              </address>
            </InfoCard>

            <InfoCard icon={Users} title="Vertreten durch">
              <p className="leading-relaxed">
                Soner Atsan
                <br />
                Seilan Mamedov
              </p>
            </InfoCard>

            <InfoCard icon={Phone} title="Kontakt">
              <dl className="space-y-1">
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Telefon:</dt>
                  <dd>
                    <a className="font-medium text-primary hover:underline" href="tel:+4923279911907">
                      02327 / 9911907
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Fax:</dt>
                  <dd className="flex items-center gap-1.5">
                    <Printer className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                    02327 / 9911908
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">E-Mail:</dt>
                  <dd>
                    <a className="font-medium text-primary hover:underline" href="mailto:info@pflegenest-bochum.de">
                      info@pflegenest-bochum.de
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Website:</dt>
                  <dd>
                    <a
                      className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                      href="https://www.pflegenest-bochum.de"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-3.5 w-3.5" aria-hidden />
                      www.pflegenest-bochum.de
                    </a>
                  </dd>
                </div>
              </dl>
            </InfoCard>
          </div>

          {/* IK */}
          <div className="mt-3 rounded-xl border border-primary/15 bg-primary/[0.04] p-5">
            <div className="flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-sm">
                <Hash className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Institutionskennzeichen (IK)</h3>
                <p className="mt-1 text-lg font-bold tabular-nums text-foreground">462553230</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Das Institutionskennzeichen dient der eindeutigen Identifikation unseres Pflegedienstes gegenüber
                  Kranken- und Pflegekassen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal sections */}
        <div className="mt-12 space-y-10">
          <LegalSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
            <p className="leading-relaxed">
              Soner Atsan
              <br />
              Seilan Mamedov
            </p>
            <address className="mt-3 not-italic leading-relaxed text-muted-foreground">
              PflegeNest Bochum GbR
              <br />
              Ruhrstraße 2<br />
              44869 Bochum
              <br />
              Deutschland
            </address>
          </LegalSection>

          <LegalSection title="Berufsrechtliche Angaben">
            <h3 className="text-sm font-semibold text-foreground">Berufsbezeichnung</h3>
            <p className="mt-1 leading-relaxed text-muted-foreground">Ambulanter Pflegedienst</p>

            <h3 className="mt-5 text-sm font-semibold text-foreground">Zuständige Aufsichtsbehörde</h3>
            <p className="mt-1 leading-relaxed text-muted-foreground">Gesundheitsamt Bochum</p>

            <h3 className="mt-5 text-sm font-semibold text-foreground">Berufsrechtliche Grundlagen</h3>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              Unsere Leistungen werden auf Grundlage der geltenden gesetzlichen Bestimmungen der Bundesrepublik
              Deutschland sowie der einschlägigen Vorschriften des Sozialgesetzbuches (SGB V und SGB XI) erbracht.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Die Zulassung und Tätigkeit erfolgen nach den gesetzlichen Vorgaben des Landes Nordrhein-Westfalen.
            </p>
          </LegalSection>

          <LegalSection title="Angaben zur Berufshaftpflichtversicherung">
            <h3 className="text-sm font-semibold text-foreground">Versicherer</h3>
            <address className="mt-1 not-italic leading-relaxed text-muted-foreground">
              BGB
              <br />
              Universitätsstraße 78
              <br />
              Postfach 100224
              <br />
              44702 Bochum
            </address>

            <h3 className="mt-5 text-sm font-semibold text-foreground">Räumlicher Geltungsbereich</h3>
            <p className="mt-1 leading-relaxed text-muted-foreground">Deutschland</p>
          </LegalSection>

          <LegalSection title="Handelsregister">
            <p className="leading-relaxed text-muted-foreground">
              Die PflegeNest Bochum GbR ist nicht im Handelsregister eingetragen.
            </p>
          </LegalSection>

          <LegalSection title="EU-Streitschlichtung">
            <p className="leading-relaxed text-muted-foreground">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            </p>
            <p className="mt-2">
              <a
                className="font-medium text-primary hover:underline"
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </LegalSection>

          <LegalSection title="Verbraucherstreitbeilegung">
            <p className="leading-relaxed text-muted-foreground">
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </LegalSection>

          <LegalSection title="Haftung für Inhalte">
            <p className="leading-relaxed text-muted-foreground">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Nach §§ 8 bis 10 DDG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
              bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
              konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir diese
              Inhalte unverzüglich entfernen.
            </p>
          </LegalSection>

          <LegalSection title="Haftung für Links">
            <p className="leading-relaxed text-muted-foreground">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Deshalb können wir für diese fremden Inhalte keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten
              ist stets der jeweilige Anbieter oder Betreiber der jeweiligen Website verantwortlich.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer
              Rechtsverletzung nicht zumutbar.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Bei Bekanntwerden von Rechtsverletzungen werden entsprechende Links unverzüglich entfernt.
            </p>
          </LegalSection>

          <LegalSection title="Urheberrecht">
            <p className="leading-relaxed text-muted-foreground">
              Die auf dieser Website veröffentlichten Inhalte, Texte, Bilder, Grafiken, Dokumente sowie sonstigen Werke
              unterliegen dem deutschen Urheberrecht.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Jede Form der Vervielfältigung, Bearbeitung, Verbreitung oder sonstigen Verwertung außerhalb der
              gesetzlichen Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des jeweiligen
              Rechteinhabers.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Downloads und Kopien dieser Website sind ausschließlich für den privaten und nicht kommerziellen Gebrauch
              gestattet.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Soweit Inhalte auf dieser Website nicht durch den Betreiber erstellt wurden, werden die Urheberrechte
              Dritter beachtet und entsprechend gekennzeichnet.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Sollten Sie dennoch auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden
              Hinweis. Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir die betroffenen Inhalte
              unverzüglich entfernen.
            </p>
          </LegalSection>
        </div>
      </div>
    </div>
  )
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Building2
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="mt-3 text-sm text-foreground/90">{children}</div>
    </div>
  )
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title}>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 text-sm text-foreground/90">{children}</div>
    </section>
  )
}

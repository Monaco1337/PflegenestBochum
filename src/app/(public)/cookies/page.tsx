import type { Metadata } from 'next'
import { Building2, Globe, Phone, ShieldCheck } from 'lucide-react'
import { CookieSettingsButton } from '@/modules/website/cookie-consent'

export const metadata: Metadata = {
  title: 'Cookie-Richtlinie | PflegeNest Bochum',
  description:
    'Informationen zur Verwendung von Cookies und vergleichbaren Technologien auf der Website der PflegeNest Bochum GbR.',
  alternates: { canonical: '/cookies' },
  openGraph: {
    title: 'Cookie-Richtlinie | PflegeNest Bochum',
    description:
      'Informationen zur Verwendung von Cookies und vergleichbaren Technologien auf der Website der PflegeNest Bochum GbR.',
    url: '/cookies',
    type: 'website',
  },
}

export default function CookiesPage() {
  return (
    <div className="bg-muted/30">
      <div className="container max-w-3xl py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <header>
          <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Rechtliches
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Cookie-Richtlinie</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Informationen zur Verwendung von Cookies und vergleichbaren Technologien auf unserer Website.
          </p>
          <div className="mt-5">
            <CookieSettingsButton className="inline-flex h-11 items-center rounded-lg bg-[#1B3F5F] px-5 text-[0.9375rem] font-semibold text-white shadow-md shadow-[#1B3F5F]/15 transition-colors hover:bg-[#163352]" />
          </div>
        </header>

        <div className="mt-12 space-y-10">
          <Section title="Informationen zur Verwendung von Cookies">
            <P>
              Unsere Website verwendet Cookies und vergleichbare Technologien, um die sichere, stabile und technisch
              einwandfreie Bereitstellung unserer Online-Dienste zu gewährleisten.
            </P>
            <P>
              Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden und bestimmte Informationen
              enthalten. Sie ermöglichen grundlegende Funktionen unserer Website und tragen dazu bei, die Sicherheit,
              Benutzerfreundlichkeit und technische Leistungsfähigkeit unserer Systeme sicherzustellen.
            </P>
            <P>
              Wir verwenden Cookies ausschließlich im Einklang mit den geltenden datenschutzrechtlichen Vorschriften,
              insbesondere der Datenschutz-Grundverordnung (DSGVO) und dem
              Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG).
            </P>
          </Section>

          <Section title="Welche Arten von Cookies verwenden wir?">
            <SubHeading>Technisch notwendige Cookies</SubHeading>
            <P>Technisch notwendige Cookies sind für den Betrieb unserer Website unverzichtbar.</P>
            <P>Sie ermöglichen insbesondere:</P>
            <List
              items={[
                'die sichere Bereitstellung unserer Website,',
                'die Speicherung Ihrer Cookie-Einstellungen,',
                'den Schutz vor Missbrauch und automatisierten Angriffen,',
                'die technische Stabilität und Funktionsfähigkeit unserer Systeme,',
                'die fehlerfreie Darstellung von Inhalten,',
                'die Gewährleistung von Sicherheitsfunktionen.',
              ]}
            />
            <P>Ohne diese Cookies kann die Website nicht ordnungsgemäß betrieben werden.</P>
            <LegalBasis>§ 25 Abs. 2 Nr. 2 TDDDG · Art. 6 Abs. 1 lit. f DSGVO</LegalBasis>

            <SubHeading>Analyse- und Statistik-Cookies</SubHeading>
            <P>Derzeit setzen wir keine Analyse- oder Statistik-Cookies ein.</P>
            <P>
              Sollten zukünftig Analysewerkzeuge eingesetzt werden, erfolgt deren Nutzung ausschließlich nach Ihrer
              vorherigen ausdrücklichen Einwilligung.
            </P>
            <LegalBasis>Art. 6 Abs. 1 lit. a DSGVO</LegalBasis>

            <SubHeading>Marketing- und Tracking-Cookies</SubHeading>
            <P>Derzeit setzen wir keine Marketing-, Werbe- oder Tracking-Cookies ein.</P>
            <P>
              Eine Nutzung entsprechender Technologien erfolgt ausschließlich nach Ihrer vorherigen ausdrücklichen
              Einwilligung.
            </P>
            <LegalBasis>Art. 6 Abs. 1 lit. a DSGVO</LegalBasis>
          </Section>

          <Section title="Cookie-Einwilligung">
            <P>
              Beim erstmaligen Besuch unserer Website können Sie über unser Cookie-Banner festlegen, welche Arten von
              Cookies gespeichert werden dürfen.
            </P>
            <P>
              Technisch notwendige Cookies können nicht deaktiviert werden, da diese für den sicheren und ordnungsgemäßen
              Betrieb der Website erforderlich sind.
            </P>
            <P>Alle weiteren Cookie-Kategorien werden ausschließlich nach Ihrer ausdrücklichen Zustimmung aktiviert.</P>
          </Section>

          <Section title="Speicherung Ihrer Cookie-Einstellungen">
            <P>
              Um Ihre Auswahl zu dokumentieren und bei zukünftigen Besuchen berücksichtigen zu können, speichern wir Ihre
              Cookie-Einstellungen.
            </P>
            <P>
              Dadurch wird sichergestellt, dass Ihre Präferenzen nicht bei jedem Besuch erneut abgefragt werden müssen.
            </P>
          </Section>

          <Section title="Widerruf und Änderung Ihrer Einwilligung">
            <P>Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen oder ändern.</P>
            <P>
              Ihre Cookie-Einstellungen können jederzeit über die entsprechenden Datenschutzeinstellungen auf unserer
              Website angepasst werden.
            </P>
            <P>Der Widerruf berührt nicht die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung.</P>
            <div className="mt-4">
              <CookieSettingsButton className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm font-semibold text-primary transition-colors hover:bg-muted" />
            </div>
          </Section>

          <Section title="Speicherdauer">
            <P>Cookies werden entweder:</P>
            <List
              items={[
                'für die Dauer Ihres Besuchs gespeichert (Session-Cookies),',
                'oder für einen festgelegten Zeitraum gespeichert und anschließend automatisch gelöscht (persistente Cookies).',
              ]}
            />
            <P>Die konkrete Speicherdauer richtet sich nach dem jeweiligen Zweck des eingesetzten Cookies.</P>
          </Section>

          <Section title="Hosting- und Sicherheitsinfrastruktur">
            <P>Zur technischen Bereitstellung unserer Website nutzen wir professionelle Hosting- und Sicherheitsinfrastrukturen.</P>
            <P>Im Rahmen dieser Systeme können technisch notwendige Cookies eingesetzt werden, um:</P>
            <List
              items={[
                'die Sicherheit unserer Website zu gewährleisten,',
                'Systemstörungen zu erkennen,',
                'Angriffe abzuwehren,',
                'technische Funktionen bereitzustellen,',
                'die Stabilität und Verfügbarkeit unserer Online-Dienste sicherzustellen.',
              ]}
            />
          </Section>

          <Section title="Drittanbieter">
            <P>
              Derzeit werden über unsere Website keine Analyse-, Marketing- oder Werbe-Cookies von Drittanbietern
              eingesetzt.
            </P>
            <P>
              Sollten zukünftig externe Dienste eingebunden werden, die eine Einwilligung erfordern, informieren wir
              hierüber gesondert und holen – soweit gesetzlich erforderlich – Ihre ausdrückliche Zustimmung ein.
            </P>
          </Section>

          <Section title="Kontakt">
            <P>
              Bei Fragen zur Verwendung von Cookies oder zur Verarbeitung personenbezogener Daten können Sie sich
              jederzeit an uns wenden.
            </P>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoCard icon={Building2} title="Anbieter">
                <p className="font-semibold text-foreground">PflegeNest Bochum GbR</p>
                <address className="mt-1 not-italic leading-relaxed">
                  Ruhrstraße 2<br />
                  44869 Bochum
                  <br />
                  Deutschland
                </address>
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
          </Section>

          <Section title="Änderungen dieser Cookie-Richtlinie">
            <P>
              Wir behalten uns vor, diese Cookie-Richtlinie anzupassen, sofern dies aufgrund technischer,
              organisatorischer oder rechtlicher Änderungen erforderlich wird.
            </P>
            <P>Es gilt jeweils die aktuelle auf unserer Website veröffentlichte Fassung.</P>
          </Section>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title}>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 text-sm text-foreground/90">{children}</div>
    </section>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-5 text-sm font-semibold text-foreground">{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 leading-relaxed text-muted-foreground first:mt-0">{children}</p>
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map(item => (
        <li key={item} className="flex gap-2.5 leading-relaxed text-muted-foreground">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}

function LegalBasis({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary/15 bg-primary/[0.04] p-3.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-sm">
        <ShieldCheck className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rechtsgrundlage</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{children}</p>
      </div>
    </div>
  )
}

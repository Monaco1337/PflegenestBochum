import type { Metadata } from 'next'
import { Building2, Globe, Phone, Printer, ShieldCheck, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | PflegeNest Bochum',
  description:
    'Informationen zur Verarbeitung personenbezogener Daten, zu Ihren Rechten als betroffene Person sowie zu den eingesetzten Technologien bei PflegeNest Bochum.',
  alternates: { canonical: '/datenschutz' },
  openGraph: {
    title: 'Datenschutzerklärung | PflegeNest Bochum',
    description:
      'Informationen zur Verarbeitung personenbezogener Daten, zu Ihren Rechten als betroffene Person sowie zu den eingesetzten Technologien bei PflegeNest Bochum.',
    url: '/datenschutz',
    type: 'website',
  },
}

const privacySchema = {
  '@context': 'https://schema.org',
  '@type': 'PrivacyPolicy',
  name: 'Datenschutzerklärung',
  url: 'https://www.pflegenest-bochum.de/datenschutz',
  inLanguage: 'de-DE',
  publisher: {
    '@type': 'Organization',
    name: 'PflegeNest Bochum GbR',
    url: 'https://www.pflegenest-bochum.de',
    email: 'info@pflegenest-bochum.de',
    telephone: '+49 2327 9911907',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ruhrstraße 2',
      postalCode: '44869',
      addressLocality: 'Bochum',
      addressCountry: 'DE',
    },
  },
}

export default function DatenschutzPage() {
  return (
    <div className="bg-muted/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }} />

      <div className="container max-w-3xl py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <header>
          <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Rechtliches
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Datenschutzerklärung</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Informationen zur Verarbeitung personenbezogener Daten, zu Ihren Rechten als betroffene Person sowie zu den
            eingesetzten Technologien finden Sie in dieser Datenschutzerklärung.
          </p>
        </header>

        <div className="mt-12 space-y-10">
          <Section n="1" title="Datenschutz auf einen Blick">
            <P>
              Der Schutz Ihrer personenbezogenen Daten hat für PflegeNest Bochum höchste Priorität.
            </P>
            <P>
              Wir verarbeiten personenbezogene Daten ausschließlich im Einklang mit den geltenden datenschutzrechtlichen
              Vorschriften, insbesondere der Datenschutz-Grundverordnung (DSGVO), dem Bundesdatenschutzgesetz (BDSG), dem
              Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG) sowie weiteren anwendbaren europäischen und
              nationalen Datenschutzbestimmungen.
            </P>
            <P>
              Diese Datenschutzerklärung informiert Sie über Art, Umfang, Zwecke und Rechtsgrundlagen der Verarbeitung
              personenbezogener Daten im Zusammenhang mit der Nutzung unserer Website, der Kontaktaufnahme, der
              Vereinbarung von Rückrufen, Pflegeanfragen, Pflegegrad-Anfragen, Bewerbungen sowie der Nutzung unserer
              digitalen Dienstleistungen.
            </P>
          </Section>

          <Section n="2" title="Verantwortlicher">
            <P>Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO ist:</P>
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

              <InfoCard icon={Users} title="Vertretungsberechtigte Gesellschafter">
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
                </dl>
              </InfoCard>

              <InfoCard icon={Globe} title="Website">
                <a
                  className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                  href="https://www.pflegenest-bochum.de"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden />
                  www.pflegenest-bochum.de
                </a>
              </InfoCard>
            </div>
          </Section>

          <Section n="3" title="Grundsätze der Datenverarbeitung">
            <P>Wir verarbeiten personenbezogene Daten ausschließlich nach den Grundsätzen des Art. 5 DSGVO.</P>
            <P>Dies umfasst insbesondere:</P>
            <List
              items={[
                'Rechtmäßigkeit, Verarbeitung nach Treu und Glauben und Transparenz',
                'Zweckbindung',
                'Datenminimierung',
                'Richtigkeit',
                'Speicherbegrenzung',
                'Integrität und Vertraulichkeit',
                'Rechenschaftspflicht',
              ]}
            />
            <P>
              Personenbezogene Daten werden nur verarbeitet, soweit dies zur Bereitstellung unserer Leistungen, zur
              Bearbeitung von Anfragen, zur Durchführung vorvertraglicher oder vertraglicher Maßnahmen oder aufgrund
              gesetzlicher Verpflichtungen erforderlich ist.
            </P>
          </Section>

          <Section n="4" title="Hosting und technische Bereitstellung">
            <P>Unsere Website wird über die Infrastruktur der Vercel Inc. bereitgestellt.</P>
            <SubHeading>Anbieter</SubHeading>
            <address className="mt-1 not-italic leading-relaxed text-muted-foreground">
              Vercel Inc.
              <br />
              340 S Lemon Ave #4133
              <br />
              Walnut, CA 91789
              <br />
              USA
            </address>
            <P>
              Vercel stellt die technische Infrastruktur, Hosting-Leistungen, Sicherheitsfunktionen, Serverressourcen
              sowie Content-Delivery-Netzwerke (CDN) zur Verfügung.
            </P>
            <P>Beim Besuch unserer Website werden automatisch technische Daten verarbeitet:</P>
            <List
              items={[
                'IP-Adresse',
                'Browsertyp und Browserversion',
                'Betriebssystem',
                'Referrer-URL',
                'Datum und Uhrzeit des Zugriffs',
                'aufgerufene Seiten und Dateien',
                'HTTP-Statuscodes',
                'Server-Logdaten',
              ]}
            />
            <P>
              Die Verarbeitung erfolgt ausschließlich zur Bereitstellung der Website, zur Systemsicherheit,
              Fehleranalyse, Missbrauchserkennung sowie zur Optimierung der technischen Stabilität.
            </P>
            <SubHeading>Datenbank- und Systeminfrastruktur</SubHeading>
            <P>
              Zur Speicherung von Kontaktanfragen, Interessentenanfragen, Bewerbungen und Verwaltungsdaten werden
              geschützte Datenbanksysteme innerhalb sicherheitsüberwachter Infrastruktur eingesetzt.
            </P>
            <P>
              Der Zugriff auf diese Systeme erfolgt ausschließlich durch berechtigte Personen im Rahmen ihrer jeweiligen
              Aufgaben und Zuständigkeiten.
            </P>
            <LegalBasis>Art. 6 Abs. 1 lit. f DSGVO</LegalBasis>
            <P>
              Soweit personenbezogene Daten in Staaten außerhalb der Europäischen Union übertragen werden, erfolgt dies
              ausschließlich auf Grundlage geeigneter Garantien gemäß Art. 44 ff. DSGVO, insbesondere
              Standardvertragsklauseln (SCC) sowie des EU-U.S. Data Privacy Frameworks.
            </P>
          </Section>

          <Section n="5" title="Entwicklungs- und Versionsverwaltung">
            <P>Zur Entwicklung, Wartung und Verwaltung unserer Website nutzen wir GitHub.</P>
            <SubHeading>Anbieter</SubHeading>
            <address className="mt-1 not-italic leading-relaxed text-muted-foreground">
              GitHub Inc.
              <br />
              88 Colin P. Kelly Jr. Street
              <br />
              San Francisco, CA 94107
              <br />
              USA
            </address>
            <P>
              GitHub dient ausschließlich der Entwicklung, Versionsverwaltung und technischen Verwaltung unserer
              Software.
            </P>
            <P>
              Eine Verarbeitung personenbezogener Besucherdaten unserer Website über GitHub erfolgt im Rahmen des
              normalen Websitebesuchs nicht.
            </P>
            <LegalBasis>Art. 6 Abs. 1 lit. f DSGVO</LegalBasis>
          </Section>

          <Section n="6" title="SSL-/TLS-Verschlüsselung">
            <P>Diese Website nutzt moderne SSL-/TLS-Verschlüsselungstechnologien.</P>
            <P>
              Die Übertragung vertraulicher Inhalte erfolgt verschlüsselt und schützt die Kommunikation vor unbefugten
              Zugriffen Dritter.
            </P>
          </Section>

          <Section n="7" title="Kontaktformular">
            <P>Über unser Kontaktformular können Sie mit uns Kontakt aufnehmen.</P>
            <P>Hierbei können insbesondere folgende Daten verarbeitet werden:</P>
            <List
              items={[
                'Vorname',
                'Nachname',
                'E-Mail-Adresse',
                'Telefonnummer',
                'Anliegen',
                'Nachrichteninhalt',
                'Zeitpunkt der Anfrage',
              ]}
            />
            <P>Die Verarbeitung erfolgt ausschließlich zur Bearbeitung Ihrer Anfrage und zur Kontaktaufnahme.</P>
            <P>Vor Absenden des Formulars muss die Kenntnisnahme dieser Datenschutzerklärung bestätigt werden.</P>
            <P>Ohne diese Bestätigung kann die Anfrage nicht übermittelt werden.</P>
            <LegalBasis>Art. 6 Abs. 1 lit. b DSGVO</LegalBasis>
          </Section>

          <Section n="8" title="Rückrufservice">
            <P>Über unsere Website können Sie einen Rückruf anfordern.</P>
            <P>Dabei werden insbesondere folgende Daten verarbeitet:</P>
            <List items={['Vorname', 'Nachname', 'Telefonnummer', 'gewünschter Rückrufzeitpunkt']} />
            <P>Die Verarbeitung erfolgt ausschließlich zur Durchführung des gewünschten Rückrufs und zur Kontaktaufnahme.</P>
            <LegalBasis>Art. 6 Abs. 1 lit. b DSGVO</LegalBasis>
          </Section>

          <Section n="9" title="Pflegeanfragen und Pflegegrad-Anfragen">
            <P>
              Über unsere Website können Anfragen zu Pflegeleistungen, Pflegegraden und Beratungsleistungen gestellt
              werden.
            </P>
            <P>Hierbei können insbesondere folgende Daten verarbeitet werden:</P>
            <List
              items={[
                'Name',
                'Telefonnummer',
                'E-Mail-Adresse',
                'Wohnort',
                'Angaben zum Pflegebedarf',
                'Angaben zur Versorgungssituation',
                'freiwillig übermittelte Informationen',
              ]}
            />
            <P>Die Verarbeitung erfolgt ausschließlich:</P>
            <List
              items={[
                'zur Bearbeitung Ihrer Anfrage,',
                'zur Durchführung von Beratungsgesprächen,',
                'zur Einschätzung möglicher Pflegeleistungen,',
                'zur Vorbereitung einer möglichen Leistungsaufnahme.',
              ]}
            />
            <LegalBasis>Art. 6 Abs. 1 lit. b DSGVO</LegalBasis>
          </Section>

          <Section n="10" title="Verarbeitung besonderer Kategorien personenbezogener Daten">
            <P>
              Im Rahmen von Pflegeanfragen oder Beratungen können freiwillig Angaben zum Gesundheitszustand übermittelt
              werden.
            </P>
            <P>Hierbei kann es sich um besondere Kategorien personenbezogener Daten gemäß Art. 9 DSGVO handeln.</P>
            <P>Dies betrifft insbesondere:</P>
            <List
              items={[
                'Pflegegrade',
                'gesundheitliche Einschränkungen',
                'medizinische Versorgungssituationen',
                'Unterstützungsbedarf',
                'pflegerische Anforderungen',
                'gesundheitsbezogene Angaben',
              ]}
            />
            <P>
              Besondere Kategorien personenbezogener Daten werden ausschließlich verarbeitet, soweit dies für die
              Bearbeitung Ihrer Anfrage, die Vorbereitung möglicher Pflegeleistungen oder aufgrund gesetzlicher
              Verpflichtungen erforderlich ist.
            </P>
            <P>Der Zugriff auf diese Daten ist auf berechtigte Personen beschränkt.</P>
            <LegalBasis>Art. 6 Abs. 1 lit. b DSGVO · Art. 9 Abs. 2 lit. a DSGVO · Art. 9 Abs. 2 lit. h DSGVO</LegalBasis>
          </Section>

          <Section n="11" title="Patienten-, Angehörigen- und Betreuerkommunikation">
            <P>Zur Organisation und Durchführung möglicher Pflegeleistungen kann eine Kommunikation mit:</P>
            <List
              items={[
                'Pflegebedürftigen,',
                'Angehörigen,',
                'gesetzlichen Vertretern,',
                'Betreuern,',
                'Bevollmächtigten,',
                'sonstigen berechtigten Kontaktpersonen',
              ]}
            />
            <P>erfolgen.</P>
            <P>Dabei können insbesondere verarbeitet werden:</P>
            <List
              items={[
                'Kontaktdaten',
                'Kommunikationshistorien',
                'Terminabsprachen',
                'Informationen zur Versorgungssituation',
                'Angaben zur Betreuungssituation',
              ]}
            />
            <P>
              Die Verarbeitung erfolgt ausschließlich zur Durchführung vorvertraglicher Maßnahmen, Pflegeberatungen sowie
              möglicher Pflegeleistungen.
            </P>
            <LegalBasis>Art. 6 Abs. 1 lit. b DSGVO · Art. 6 Abs. 1 lit. f DSGVO</LegalBasis>
          </Section>

          <Section n="12" title="Bewerbungsverfahren">
            <P>
              Wenn Sie sich bei uns bewerben, verarbeiten wir Ihre Bewerbungsunterlagen ausschließlich zur Durchführung
              des Bewerbungsverfahrens.
            </P>
            <P>Hierzu können insbesondere verarbeitet werden:</P>
            <List
              items={[
                'Name',
                'Anschrift',
                'Telefonnummer',
                'E-Mail-Adresse',
                'Lebenslauf',
                'Zeugnisse',
                'Qualifikationen',
                'Zertifikate',
                'sonstige Bewerbungsunterlagen',
                'Kommunikationshistorien im Bewerbungsprozess',
              ]}
            />
            <P>
              Die Verarbeitung erfolgt ausschließlich zur Entscheidung über die Begründung eines
              Beschäftigungsverhältnisses.
            </P>
            <LegalBasis>§ 26 BDSG · Art. 6 Abs. 1 lit. b DSGVO</LegalBasis>
            <P>
              Bewerbungsunterlagen werden grundsätzlich spätestens sechs Monate nach Abschluss des Bewerbungsverfahrens
              gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen oder eine längere Speicherung
              ausdrücklich vereinbart wurde.
            </P>
          </Section>

          <Section n="13" title="Kunden- und Interessentenmanagement">
            <P>
              Zur Bearbeitung von Anfragen und Organisation unserer Dienstleistungen können personenbezogene Daten in
              internen Verwaltungs- und CRM-Systemen gespeichert werden.
            </P>
            <P>Hierzu zählen insbesondere:</P>
            <List
              items={[
                'Stammdaten',
                'Kontaktdaten',
                'Kommunikationsverläufe',
                'Anfragehistorien',
                'Rückrufinformationen',
                'Bearbeitungsstatus',
                'Termininformationen',
              ]}
            />
            <P>
              Die Speicherung erfolgt zur Dokumentation, Qualitätssicherung, Anfragenachverfolgung, Interessentenbetreuung
              sowie zur effizienten Organisation unserer Pflege- und Beratungsleistungen.
            </P>
            <P>
              Kontaktanfragen können nach Bearbeitung weiterhin gespeichert werden, soweit dies zur Dokumentation,
              Kundenbetreuung, Qualitätssicherung oder zur Wahrung berechtigter Interessen erforderlich ist.
            </P>
            <LegalBasis>Art. 6 Abs. 1 lit. b DSGVO · Art. 6 Abs. 1 lit. f DSGVO</LegalBasis>
          </Section>

          <Section n="14" title="Empfänger personenbezogener Daten">
            <P>
              Eine Weitergabe personenbezogener Daten erfolgt ausschließlich, soweit dies gesetzlich zulässig,
              vertraglich erforderlich oder von Ihnen ausdrücklich gewünscht ist.
            </P>
            <P>Empfänger können insbesondere sein:</P>
            <List
              items={[
                'Krankenkassen',
                'Pflegekassen',
                'Ärzte',
                'Therapeuten',
                'Apotheken',
                'Krankenhäuser',
                'Sozialhilfeträger',
                'Medizinischer Dienst',
                'Pflegeberater',
                'gesetzliche Betreuer',
                'Bevollmächtigte',
                'Abrechnungsstellen',
                'Behörden',
                'externe Dienstleister',
                'IT- und Hosting-Dienstleister',
              ]}
            />
            <P>
              Eine Weitergabe erfolgt ausschließlich im erforderlichen Umfang und auf Grundlage der jeweils geltenden
              gesetzlichen Bestimmungen.
            </P>
          </Section>

          <Section n="15" title="Auftragsverarbeiter">
            <P>
              Wir setzen externe Dienstleister ein, die personenbezogene Daten ausschließlich in unserem Auftrag und auf
              Grundlage von Auftragsverarbeitungsverträgen gemäß Art. 28 DSGVO verarbeiten.
            </P>
            <P>Hierzu können insbesondere gehören:</P>
            <List
              items={[
                'Vercel Inc. (Hosting)',
                'IT-Dienstleister',
                'Softwareanbieter',
                'CRM-Systeme',
                'E-Mail-Dienstleister',
                'Support- und Wartungsdienstleister',
              ]}
            />
            <P>
              Alle eingesetzten Dienstleister werden sorgfältig ausgewählt und regelmäßig datenschutzrechtlich überprüft.
            </P>
          </Section>

          <Section n="16" title="Cookies und lokale Speichertechnologien">
            <P>Unsere Website verwendet technisch notwendige Cookies und vergleichbare Technologien.</P>
            <P>Diese dienen insbesondere:</P>
            <List
              items={[
                'der technischen Bereitstellung der Website,',
                'der Sicherheit,',
                'der Speicherung von Einstellungen,',
                'der Verbesserung der Benutzerfreundlichkeit.',
              ]}
            />
            <P>
              Sofern Analyse-, Komfort- oder Marketingtechnologien eingesetzt werden, erfolgt dies ausschließlich auf
              Grundlage Ihrer ausdrücklichen Einwilligung.
            </P>
            <LegalBasis>§ 25 TDDDG · Art. 6 Abs. 1 lit. a DSGVO · Art. 6 Abs. 1 lit. f DSGVO</LegalBasis>
          </Section>

          <Section n="17" title="Social-Media-Verlinkungen">
            <P>Unsere Website kann Verlinkungen zu sozialen Netzwerken enthalten.</P>
            <P>
              Beim bloßen Besuch unserer Website werden keine personenbezogenen Daten an die jeweiligen Anbieter
              übertragen.
            </P>
            <P>Eine Datenübermittlung erfolgt erst nach dem aktiven Anklicken eines entsprechenden Links.</P>
          </Section>

          <Section n="18" title="Speicherdauer">
            <P>Wir speichern personenbezogene Daten nur so lange, wie dies für die jeweiligen Zwecke erforderlich ist.</P>
            <P>Insbesondere gelten folgende Speicherfristen:</P>
            <List
              items={[
                'Bewerbungsunterlagen: bis zu 6 Monate',
                'Kontakt- und Interessentenanfragen: bis zur abschließenden Bearbeitung oder darüber hinaus, soweit berechtigte Interessen dies erfordern',
                'Rückrufanfragen: bis zur Durchführung und Bearbeitung',
                'Server-Logdaten: maximal 30 Tage',
                'gesetzlich relevante Unterlagen: entsprechend gesetzlicher Aufbewahrungspflichten',
              ]}
            />
            <P>Gesetzliche Aufbewahrungspflichten bleiben hiervon unberührt.</P>
          </Section>

          <Section n="19" title="Datensicherheit">
            <P>
              Wir setzen technische und organisatorische Maßnahmen gemäß Art. 32 DSGVO ein, um ein dem Risiko
              angemessenes Schutzniveau sicherzustellen.
            </P>
            <P>Hierzu gehören insbesondere:</P>
            <List
              items={[
                'SSL-/TLS-Verschlüsselung',
                'rollenbasierte Berechtigungskonzepte',
                'Zugriffskontrollen',
                'Zugriffsbeschränkungen',
                'regelmäßige Datensicherungen',
                'Protokollierungen',
                'Systemüberwachung',
                'Sicherheitsupdates',
                'Schutzmaßnahmen gegen unbefugte Zugriffe',
                'regelmäßige Sicherheitsüberprüfungen',
              ]}
            />
            <P>
              Unsere Sicherheitsmaßnahmen werden fortlaufend überprüft und an den aktuellen Stand der Technik angepasst.
            </P>
          </Section>

          <Section n="20" title="Ihre Rechte">
            <P>Sie haben jederzeit das Recht auf:</P>
            <List
              items={[
                'Auskunft gemäß Art. 15 DSGVO',
                'Berichtigung gemäß Art. 16 DSGVO',
                'Löschung gemäß Art. 17 DSGVO',
                'Einschränkung der Verarbeitung gemäß Art. 18 DSGVO',
                'Datenübertragbarkeit gemäß Art. 20 DSGVO',
                'Widerspruch gemäß Art. 21 DSGVO',
                'Widerruf erteilter Einwilligungen gemäß Art. 7 Abs. 3 DSGVO',
              ]}
            />
            <P>
              Zur Wahrnehmung Ihrer Rechte können Sie sich jederzeit an uns wenden:{' '}
              <a className="font-medium text-primary hover:underline" href="mailto:info@pflegenest-bochum.de">
                info@pflegenest-bochum.de
              </a>
            </P>
          </Section>

          <Section n="21" title="Beschwerderecht">
            <P>Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.</P>
            <SubHeading>Zuständige Aufsichtsbehörde</SubHeading>
            <address className="mt-1 not-italic leading-relaxed text-muted-foreground">
              Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen
              <br />
              Kavalleriestraße 2–4<br />
              40213 Düsseldorf
              <br />
              Deutschland
            </address>
          </Section>

          <Section n="22" title="Änderungen dieser Datenschutzerklärung">
            <P>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, sofern dies aufgrund technischer,
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

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-label={`${n}. ${title}`}>
      <h2 className="flex items-baseline gap-2.5 text-xl font-bold text-foreground">
        <span className="text-base font-bold text-primary tabular-nums">{n}.</span>
        {title}
      </h2>
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

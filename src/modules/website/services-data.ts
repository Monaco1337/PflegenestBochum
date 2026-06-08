import {
  Activity,
  Brain,
  ClipboardList,
  Heart,
  HeartHandshake,
  Home,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type Service = {
  icon: LucideIcon
  title: string
  badge?: string
  body: string
  points: string[]
}

export const services: Service[] = [
  {
    icon: Heart,
    title: 'Grundpflege',
    badge: 'SGB XI',
    body: 'Würdevolle Unterstützung bei allen täglichen Verrichtungen rund um Körper und Wohlbefinden.',
    points: [
      'Körperpflege, Waschen, Duschen & Hautpflege',
      'An- und Auskleiden',
      'Mobilisation, Lagerung & Sturzprophylaxe',
      'Unterstützung bei Ernährung & Flüssigkeit',
      'Hilfe bei der Ausscheidung & Inkontinenzversorgung',
    ],
  },
  {
    icon: Stethoscope,
    title: 'Behandlungspflege',
    badge: 'Auf ärztliche Verordnung',
    body: 'Medizinische Versorgung nach ärztlicher Verordnung – fachgerecht und zuverlässig zu Hause.',
    points: [
      'Medikamentengabe & Medikamentenmanagement',
      'Injektionen (z. B. Insulin) & Blutzuckerkontrolle',
      'Professionelle Wundversorgung & Verbandwechsel',
      'Blutdruck- & Vitalzeichenkontrolle',
      'Kompressionstherapie, Stoma- & Katheterversorgung',
    ],
  },
  {
    icon: Users,
    title: 'Verhinderungspflege',
    badge: 'Bis 1.685 € / Jahr',
    body: 'Entlastung für pflegende Angehörige – stundenweise oder über mehrere Wochen hinweg.',
    points: [
      'Vertretung bei Urlaub, Krankheit oder Auszeit',
      'Stundenweise bis mehrwöchige Übernahme',
      'Flexibel und kurzfristig planbar',
      'Über die Pflegekasse finanzierbar (ab Pflegegrad 2)',
    ],
  },
  {
    icon: Brain,
    title: 'Demenzbetreuung',
    badge: 'Spezialisiert',
    body: 'Geduldige, strukturierte Begleitung für Menschen mit kognitiven Einschränkungen.',
    points: [
      'Strukturierte Tages- & Alltagsbegleitung',
      'Aktivierung, Beschäftigung & Orientierungshilfen',
      'Sicherer, vertrauter Umgang im gewohnten Umfeld',
      'Spürbare Entlastung für Angehörige',
    ],
  },
  {
    icon: HeartHandshake,
    title: 'Palliativpflege',
    body: 'Würdevolle und einfühlsame Begleitung in der letzten Lebensphase.',
    points: [
      'Schmerz- & Symptomkontrolle',
      'Enge Zusammenarbeit mit Ärzten & Hospizdiensten',
      'Nähe und Geborgenheit bis zuletzt',
      'Unterstützung & Beratung für Angehörige',
    ],
  },
  {
    icon: Activity,
    title: 'Pflege nach Krankenhausaufenthalt',
    badge: 'Übergangspflege',
    body: 'Ein sicherer Übergang von der Klinik zurück in die eigenen vier Wände.',
    points: [
      'Übernahme direkt nach der Entlassung',
      'Wundversorgung & Medikamentenmanagement',
      'Abstimmung mit Klinik, Ärzten & Therapeuten',
      'Unterstützung beim Wiedererlangen der Selbstständigkeit',
    ],
  },
  {
    icon: Home,
    title: 'Hauswirtschaftliche Versorgung',
    body: 'Damit der Haushalt auch dann läuft, wenn es allein nicht mehr geht.',
    points: [
      'Reinigung der Wohnung & Wäschepflege',
      'Einkäufe & Besorgungen',
      'Zubereitung von Mahlzeiten',
      'Begleitung zu Terminen & Behörden',
    ],
  },
  {
    icon: ClipboardList,
    title: 'Pflegeberatung',
    badge: '§ 37 Abs. 3 SGB XI',
    body: 'Wir nehmen Ihnen den Papierkram ab und erklären verständlich, was Ihnen zusteht.',
    points: [
      'Unterstützung bei Pflegegrad-Anträgen',
      'Vorbereitung auf die MD-Begutachtung',
      'Beratungseinsätze nach § 37 Abs. 3 SGB XI',
      'Antworten auf alle Fragen zur Pflegeversicherung',
    ],
  },
]

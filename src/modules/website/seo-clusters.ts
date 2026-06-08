export interface SeoCluster {
  slug: string
  title: string
  h1: string
  description: string
  body: string
  bullets: string[]
}

export const seoClusters: SeoCluster[] = [
  {
    slug: 'pflegedienst-bochum',
    title: 'Pflegedienst Bochum — PflegeNest',
    h1: 'Pflegedienst in Bochum: Persönlich, qualifiziert, lokal.',
    description: 'Ambulanter Pflegedienst in Bochum für Grund- und Behandlungspflege, Verhinderungspflege und Demenzbetreuung. Lokal, persönlich, qualifiziert.',
    body: 'Als ambulanter Pflegedienst in Bochum betreuen wir Patient:innen in allen Pflegegraden. Wir kennen die Wege in Bochum und arbeiten eng mit Hausärzten, Krankenhäusern und Pflegekassen zusammen.',
    bullets: ['Examiniertes Pflegepersonal', 'Direkte Abrechnung mit der Pflegekasse', '24/7 erreichbar', 'Lokale Tourenplanung'],
  },
  {
    slug: 'pflege-bochum',
    title: 'Pflege Bochum — Ambulante Pflege & Beratung',
    h1: 'Pflege in Bochum — menschlich und digital organisiert.',
    description: 'Pflege in Bochum aus einer Hand: Grundpflege, Behandlungspflege, Pflegeberatung, Pflegegrad-Hilfe. Schnelle Aufnahme, digitale Prozesse.',
    body: 'Pflege in Bochum bedeutet für uns: persönlicher Erstkontakt, strukturierte Aufnahme und ein verlässliches Pflegeteam, das langfristig bei Ihnen bleibt.',
    bullets: ['Schnelle Aufnahme in <24h möglich', 'Anamnese vorab digital', 'Beratung Pflegegrad 1–5', 'Hilfe bei Anträgen'],
  },
  {
    slug: 'pflegegrad-bochum',
    title: 'Pflegegrad Bochum — Beratung & Voreinschätzung',
    h1: 'Pflegegrad in Bochum: Schnelle Orientierung, persönliche Beratung.',
    description: 'Pflegegrad-Beratung in Bochum: Voreinschätzung der Einstufung (PG 1–5), Hilfe bei Antrag und MDK-Begutachtung.',
    body: 'Wir helfen Ihnen, den passenden Pflegegrad zu beantragen. Online-Voreinschätzung in 5 Minuten, anschließend persönliche Beratung.',
    bullets: ['NBA-orientierte Voreinschätzung', 'Hilfe bei Antrag & MDK-Termin', 'Erklärung der Pflegeleistungen', 'Beratung kostenfrei'],
  },
  {
    slug: 'demenzbetreuung-bochum',
    title: 'Demenzbetreuung Bochum — Strukturierte Begleitung',
    h1: 'Demenzbetreuung in Bochum.',
    description: 'Geduldige, geschulte Demenzbetreuung in Bochum: Aktivierung, Sicherheit, Entlastung für Angehörige.',
    body: 'Demenz verändert den Alltag — für Betroffene und Angehörige. Wir begleiten strukturiert, mit Geduld und nach validierten Methoden.',
    bullets: ['Validierende Kommunikation', 'Aktivierende Betreuung', 'Sturzprophylaxe', 'Entlastung für Angehörige'],
  },
  {
    slug: 'verhinderungspflege-bochum',
    title: 'Verhinderungspflege Bochum — Auszeit für Angehörige',
    h1: 'Verhinderungspflege in Bochum: Wenn Sie eine Pause brauchen.',
    description: 'Verhinderungspflege in Bochum: stundenweise oder mehrwöchig. Wir übernehmen, wenn pflegende Angehörige eine Auszeit benötigen.',
    body: 'Bei Krankheit, Urlaub oder einfach einer Erholungspause: wir übernehmen die Pflege stundenweise oder über mehrere Wochen — bis zu 6 Wochen pro Jahr durch die Pflegekasse erstattbar.',
    bullets: ['Bis zu 1.612 € jährlich von der Pflegekasse', 'Stundenweise oder Wochen', 'Auf Wunsch im häuslichen Umfeld', 'Schnelle Organisation'],
  },
  {
    slug: 'grundpflege-bochum',
    title: 'Grundpflege Bochum — Körperpflege, Mobilität, Alltag',
    h1: 'Grundpflege in Bochum.',
    description: 'Grundpflege in Bochum: Körperpflege, An- und Auskleiden, Mobilität, Ernährung, Ausscheidung — würdevoll und auf Augenhöhe.',
    body: 'Grundpflege ist die Basis: Sie soll das tägliche Leben erleichtern, Würde bewahren und Sicherheit geben.',
    bullets: ['Körperpflege & Hygiene', 'Mobilitätsunterstützung', 'Hilfe bei Ernährung', 'Sicherheit im Alltag'],
  },
  {
    slug: 'behandlungspflege-bochum',
    title: 'Behandlungspflege Bochum — Medizinische Versorgung zu Hause',
    h1: 'Behandlungspflege in Bochum.',
    description: 'Medikamentengabe, Injektionen, Wundversorgung und Verbandwechsel in Bochum — auf ärztliche Verordnung, durch examinierte Pflegekräfte.',
    body: 'Behandlungspflege erfolgt auf ärztliche Verordnung und wird durch examinierte Pflegekräfte ausgeführt. Wir koordinieren mit Hausärzten und Spezialisten.',
    bullets: ['Medikamentengabe', 'Wundmanagement', 'Injektionen / Infusionen', 'Vitalzeichen-Kontrolle'],
  },
  {
    slug: 'pflegeberatung-bochum',
    title: 'Pflegeberatung Bochum — Wir erklären das System',
    h1: 'Pflegeberatung in Bochum.',
    description: 'Pflegeberatung in Bochum: Pflegegrad, Pflegegeld, Pflegesachleistungen, Entlastungsbetrag — alles, was Sie wissen sollten.',
    body: 'Das Pflegesystem ist komplex. Wir erklären verständlich, was Ihnen zusteht, und unterstützen bei Anträgen und Widersprüchen.',
    bullets: ['Erstberatung kostenfrei', 'Pflegegrad-Hilfe', 'Antragsbegleitung', 'Widerspruchsverfahren'],
  },
  {
    slug: 'palliativpflege-bochum',
    title: 'Palliativpflege Bochum — Würdevolle Begleitung',
    h1: 'Palliativpflege in Bochum.',
    description: 'Palliativpflege in Bochum: Schmerzlinderung, Symptomkontrolle, Begleitung für Betroffene und Angehörige in der letzten Lebensphase.',
    body: 'Palliativpflege bedeutet, Lebensqualität in der letzten Lebensphase zu erhalten. Wir arbeiten eng mit Hausärzten und Palliativnetzwerken zusammen.',
    bullets: ['Schmerz- und Symptomkontrolle', 'Begleitung für Familien', 'Koordination mit Palliativteam', 'Spirituelle Sensibilität'],
  },
  {
    slug: 'pflege-nach-krankenhausaufenthalt-bochum',
    title: 'Pflege nach Krankenhausaufenthalt Bochum',
    h1: 'Pflege nach Krankenhausaufenthalt in Bochum.',
    description: 'Sicherer Übergang vom Krankenhaus nach Hause: Wir übernehmen die ambulante Pflege direkt nach dem Klinikaufenthalt in Bochum.',
    body: 'Nach einer Operation oder einem längeren Klinikaufenthalt ist die Rückkehr nach Hause oft heikel. Wir koordinieren den Übergang, übernehmen die Pflege und sorgen für Sicherheit.',
    bullets: ['Übergangspflege bis 4 Wochen', 'Direkter Klinikkontakt', 'Wundversorgung', 'Mobilitätsförderung'],
  },
]

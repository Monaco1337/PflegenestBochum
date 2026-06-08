export function LocalBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'PflegeNest Bochum',
    description: 'Ambulanter Pflegedienst in Bochum – Pflegegrad-Beratung, Demenzbetreuung, Verhinderungspflege, Grundpflege und Behandlungspflege.',
    image: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pflegenest-bochum.de'}/brand/pflegenest-logo.png`,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pflegenest-bochum.de'}/brand/pflegenest-logo.png`,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pflegenest-bochum.de',
    telephone: '+4923279911907',
    email: 'info@pflegenest-bochum.de',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ruhrstraße 2',
      postalCode: '44869',
      addressLocality: 'Bochum',
      addressCountry: 'DE',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 51.45, longitude: 7.21 },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    areaServed: ['Bochum', 'Wattenscheid', 'Linden', 'Werne', 'Langendreer'],
    medicalSpecialty: ['Geriatrics', 'Nursing'],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

import { FAQ } from '@/modules/website/faq'

export const metadata = {
  title: 'FAQ — Häufige Fragen zur ambulanten Pflege',
  description: 'Antworten zu Pflegegrad, Aufnahme, Kosten und Sicherheitsstandards der ambulanten Pflege in Bochum.',
}

export default function FAQPage() {
  return (
    <FAQ />
  )
}

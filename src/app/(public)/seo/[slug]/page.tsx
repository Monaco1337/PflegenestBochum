import Link from 'next/link'
import { notFound } from 'next/navigation'
import { seoClusters } from '@/modules/website/seo-clusters'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/modules/website/contact-form'
import { LocalBusinessSchema } from '@/modules/website/schema-org'
import { FAQ } from '@/modules/website/faq'

export function generateStaticParams() {
  return seoClusters.map(c => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const cluster = seoClusters.find(c => c.slug === params.slug)
  if (!cluster) return {}
  return {
    title: cluster.title,
    description: cluster.description,
    alternates: { canonical: `/seo/${cluster.slug}` },
  }
}

export default function SeoLanding({ params }: { params: { slug: string } }) {
  const cluster = seoClusters.find(c => c.slug === params.slug)
  if (!cluster) return notFound()
  return (
    <>
      <LocalBusinessSchema />
      <section className="container py-16 sm:py-24">
        <Badge variant="muted" className="mb-3">Lokal in Bochum</Badge>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">{cluster.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{cluster.description}</p>
        <p className="mt-6 max-w-3xl text-base text-foreground/90">{cluster.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href="/pflegegrad">Pflegegrad prüfen</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/kontakt">Beratung anfragen</Link></Button>
        </div>
      </section>

      <section className="container pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cluster.bullets.map(b => (
            <Card key={b}>
              <CardHeader>
                <CardTitle className="text-base">{b}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="container pb-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">Auch interessant</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {seoClusters.filter(c => c.slug !== cluster.slug).slice(0, 6).map(c => (
            <Card key={c.slug}>
              <CardHeader>
                <CardTitle className="text-base">{c.h1.replace(' in Bochum', ' Bochum')}</CardTitle>
                <CardDescription className="line-clamp-2">{c.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link className="text-sm font-medium text-primary" href={`/seo/${c.slug}`}>Mehr lesen →</Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <FAQ />

      <section className="container py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">Sprechen wir.</h2>
        <div className="max-w-2xl">
          <ContactForm />
        </div>
      </section>
    </>
  )
}

import type { MetadataRoute } from 'next'
import { seoClusters } from '@/modules/website/seo-clusters'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pflegenest-bochum.de'
  const lastModified = new Date()
  const staticRoutes = [
    '',
    '/leistungen',
    '/pflegegrad',
    '/anamnese',
    '/angehoerige',
    '/karriere',
    '/kontakt',
    '/faq',
    '/impressum',
    '/datenschutz',
    '/cookies',
  ]
  return [
    ...staticRoutes.map(path => ({
      url: `${base}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1.0 : 0.7,
    })),
    ...seoClusters.map(c => ({
      url: `${base}/seo/${c.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SessionProvider } from '@/core/auth/session-provider'
import { getSession } from '@/core/auth/session'
import { bootstrap } from '@/core/bootstrap'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pflegenest-bochum.de'),
  title: {
    default: 'PflegeNest Bochum — Menschliche Pflege, digital organisiert',
    template: '%s · PflegeNest Bochum',
  },
  description:
    'Ambulanter Pflegedienst in Bochum: Grundpflege, Behandlungspflege, Verhinderungspflege, Demenzbetreuung und Pflegeberatung. Digitaler Aufnahmeprozess, Pflegegrad-Check und Beratung — persönlich und in Bochum.',
  applicationName: 'PflegeNest OS',
  keywords: [
    'Pflegedienst Bochum',
    'Ambulante Pflege Bochum',
    'Pflegegrad Bochum',
    'Demenzbetreuung Bochum',
    'Verhinderungspflege Bochum',
    'Grundpflege Bochum',
    'Behandlungspflege Bochum',
    'Pflegeberatung Bochum',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'PflegeNest Bochum',
    title: 'PflegeNest Bochum — Menschliche Pflege, digital organisiert',
    description:
      'Pflege. Neu gedacht. Menschlich. Digital. Persönlich. Beratung, Pflegegrad-Check und digitale Aufnahme bei PflegeNest Bochum.',
    images: [{ url: '/brand/pflegenest-logo.png', width: 1024, height: 1024, alt: 'PflegeNest Bochum Logo' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/brand/logo-mark.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/brand/pflegenest-logo.png', sizes: '1024x1024' }],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await bootstrap()
  const session = await getSession()
  return (
    <html lang="de" className={inter.variable} suppressHydrationWarning>
      <body>
        <SessionProvider value={session}>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" closeButton />
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

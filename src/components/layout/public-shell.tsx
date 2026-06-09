'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Phone, ChevronRight, Clock, Facebook, Instagram, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoLink } from '@/components/brand/logo'
import { cn } from '@/lib/utils'
import { CookieConsent, CookieSettingsButton } from '@/modules/website/cookie-consent'

const navItems = [
  { href: '/leistungen', label: 'Leistungen' },
  { href: '/pflegegrad', label: 'Pflegegrad' },
  { href: '/anamnese', label: 'Aufnahme' },
  { href: '/angehoerige', label: 'Angehörige' },
  { href: '/karriere', label: 'Karriere' },
  { href: '/kontakt', label: 'Kontakt' },
]

export function PublicShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="container flex h-20 items-center justify-between gap-4 sm:h-24">
          <LogoLink size="xl" priority />
          <nav className="hidden lg:flex items-center gap-1" aria-label="Hauptnavigation">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground',
                  isActive(item.href)
                    ? 'font-semibold text-[#1B3F5F] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-[#2563eb]'
                    : 'text-foreground/80 hover:bg-muted'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="tel:+4923279911907" className="hidden sm:inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5">
              <Phone className="h-4 w-4" />
              02327 / 9911907
            </a>
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/pflegegrad">Pflegegrad prüfen</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(v => !v)}
              aria-label="Menü öffnen"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {open ? (
          <div className="lg:hidden border-t bg-background animate-fade-in">
            <div className="container flex flex-col gap-0.5 py-3">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-3 text-[0.9375rem] font-medium transition-colors active:scale-[0.99] hover:bg-muted',
                    isActive(item.href) && 'bg-[#1B3F5F]/5 font-semibold text-[#1B3F5F]'
                  )}
                >
                  {item.label}
                  <ChevronRight className={cn('h-4 w-4', isActive(item.href) ? 'text-[#2563eb]' : 'text-muted-foreground')} />
                </Link>
              ))}
              <a
                href="tel:+4923279911907"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-3 text-[0.9375rem] font-medium text-[#1B3F5F] transition-colors active:scale-[0.99]"
              >
                <Phone className="h-4 w-4 text-[#2563eb]" aria-hidden />
                02327 / 9911907
              </a>
              <div className="flex gap-2 pt-2">
                <Button asChild className="h-11 flex-1 rounded-xl transition-transform active:scale-[0.98]">
                  <Link href="/pflegegrad" onClick={() => setOpen(false)}>Pflegegrad prüfen</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 flex-1 rounded-xl transition-transform active:scale-[0.98]">
                  <Link href="/kontakt" onClick={() => setOpen(false)}>Rückruf</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  )
}

const socials = [
  { href: 'https://facebook.com', label: 'Facebook', icon: Facebook },
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
]

function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-slate-50/60">
      <div className="container py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-4 lg:col-span-4">
            <LogoLink size="2xl" href="/" />
            <p className="max-w-xs text-sm leading-relaxed text-slate-600">
              Menschliche Pflege, digital organisiert. Ambulante Pflege &amp; Beratung in Bochum und Umgebung.
            </p>
            <div className="flex gap-2">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#1B3F5F] transition-colors hover:bg-[#1B3F5F] hover:text-white"
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-semibold text-[#1B3F5F]">Service</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link href="/leistungen" className="hover:text-[#2563eb]">Leistungen</Link></li>
              <li><Link href="/pflegegrad" className="hover:text-[#2563eb]">Pflegegrad-Center</Link></li>
              <li><Link href="/anamnese" className="hover:text-[#2563eb]">Digitale Aufnahme</Link></li>
              <li><Link href="/angehoerige" className="hover:text-[#2563eb]">Angehörige</Link></li>
              <li><Link href="/#faq" className="hover:text-[#2563eb]">FAQ</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-semibold text-[#1B3F5F]">Karriere</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link href="/karriere" className="hover:text-[#2563eb]">Stellen</Link></li>
              <li><Link href="/karriere#bewerben" className="hover:text-[#2563eb]">Online bewerben</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-semibold text-[#1B3F5F]">Kontakt</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>Ruhrstraße 2</li>
              <li>44869 Bochum</li>
              <li><a className="font-medium text-[#2563eb] hover:underline" href="tel:+4923279911907">02327 / 9911907</a></li>
              <li><a className="hover:text-[#2563eb]" href="mailto:info@pflegenest-bochum.de">info@pflegenest-bochum.de</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B3F5F]/[0.06] text-[#2563eb]">
                <Clock className="h-4 w-4" aria-hidden />
              </span>
              <p className="mt-3 text-sm font-semibold text-[#1B3F5F]">24/7 für Sie erreichbar</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Unser Notdienst ist rund um die Uhr für Sie da.
              </p>
              <a
                href="tel:+4923279911907"
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#1B3F5F] transition-colors hover:bg-slate-50"
              >
                <Phone className="h-3.5 w-3.5 text-[#2563eb]" aria-hidden /> 02327 / 9911907
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/70">
        <div className="container flex flex-col gap-2 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PflegeNest Bochum. Alle Rechte vorbehalten.</p>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/impressum" className="font-semibold text-[#1B3F5F] hover:text-[#2563eb]">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-[#2563eb]">Datenschutzerklärung</Link>
            <Link href="/cookies" className="hover:text-[#2563eb]">Cookie-Richtlinie</Link>
            <CookieSettingsButton className="hover:text-[#2563eb]" />
            <Link href="/admin" className="hover:text-[#2563eb]">Mitarbeiter-Login</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

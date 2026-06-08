'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BarChart3, Cookie, Megaphone, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'pflegenest_cookie_consent_v1'
export const OPEN_COOKIE_SETTINGS_EVENT = 'pflegenest:open-cookie-settings'

interface Consent {
  necessary: true
  analytics: boolean
  marketing: boolean
  ts: number
}

export function openCookieSettings() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT))
  }
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    setMounted(true)
    let stored: Consent | null = null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      stored = raw ? (JSON.parse(raw) as Consent) : null
    } catch {
      stored = null
    }
    if (!stored) {
      setVisible(true)
    } else {
      setAnalytics(Boolean(stored.analytics))
      setMarketing(Boolean(stored.marketing))
    }

    const open = () => {
      setShowPrefs(true)
      setVisible(true)
    }
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open)
  }, [])

  function persist(consent: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
    } catch {
      /* storage unavailable — choice still applied for this session */
    }
    setVisible(false)
    setShowPrefs(false)
  }

  const acceptAll = () => {
    setAnalytics(true)
    setMarketing(true)
    persist({ necessary: true, analytics: true, marketing: true, ts: Date.now() })
  }
  const acceptNecessary = () => {
    setAnalytics(false)
    setMarketing(false)
    persist({ necessary: true, analytics: false, marketing: false, ts: Date.now() })
  }
  const savePrefs = () => persist({ necessary: true, analytics, marketing, ts: Date.now() })

  if (!mounted || !visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Cookie-Einwilligung">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" aria-hidden />

      <div className="animate-slide-in-up relative m-3 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.4)] sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
            <Cookie className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="text-lg font-bold text-foreground">Wir respektieren Ihre Privatsphäre</h2>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Wir verwenden Cookies, um den sicheren und technisch einwandfreien Betrieb unserer Website zu gewährleisten.
          Technisch notwendige Cookies sind für den Betrieb erforderlich. Weitere Cookies setzen wir nur mit Ihrer
          Einwilligung ein. Mehr dazu in unserer{' '}
          <Link href="/cookies" className="font-medium text-primary hover:underline">
            Cookie-Richtlinie
          </Link>{' '}
          und{' '}
          <Link href="/datenschutz" className="font-medium text-primary hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </p>

        {showPrefs ? (
          <div className="mt-5 space-y-2.5">
            <PrefRow
              icon={ShieldCheck}
              title="Technisch notwendig"
              description="Für den sicheren Betrieb der Website erforderlich. Immer aktiv."
              checked
              locked
            />
            <PrefRow
              icon={BarChart3}
              title="Analyse & Statistik"
              description="Helfen uns, die Website zu verbessern. Derzeit nicht im Einsatz."
              checked={analytics}
              onChange={setAnalytics}
            />
            <PrefRow
              icon={Megaphone}
              title="Marketing"
              description="Für personalisierte Inhalte. Derzeit nicht im Einsatz."
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button
            onClick={acceptAll}
            className="h-11 flex-1 rounded-lg bg-[#1B3F5F] px-5 text-[0.9375rem] font-semibold shadow-md shadow-[#1B3F5F]/15 hover:bg-[#163352]"
          >
            Alle akzeptieren
          </Button>
          {showPrefs ? (
            <Button
              onClick={savePrefs}
              variant="outline"
              className="h-11 flex-1 rounded-lg border-slate-300 bg-white px-5 text-[0.9375rem] font-semibold text-[#1B3F5F] hover:bg-slate-50"
            >
              Auswahl speichern
            </Button>
          ) : (
            <Button
              onClick={acceptNecessary}
              variant="outline"
              className="h-11 flex-1 rounded-lg border-slate-300 bg-white px-5 text-[0.9375rem] font-semibold text-[#1B3F5F] hover:bg-slate-50"
            >
              Nur notwendige
            </Button>
          )}
        </div>

        {!showPrefs ? (
          <button
            type="button"
            onClick={() => setShowPrefs(true)}
            className="mt-3 w-full text-center text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Einstellungen anpassen
          </button>
        ) : null}
      </div>
    </div>
  )
}

function PrefRow({
  icon: Icon,
  title,
  description,
  checked,
  locked,
  onChange,
}: {
  icon: typeof Cookie
  title: string
  description: string
  checked: boolean
  locked?: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background/50 p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={locked}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors',
          checked ? 'bg-[#1B3F5F]' : 'bg-slate-300',
          locked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-[1.125rem]' : 'translate-x-0.5'
          )}
          aria-hidden
        />
      </button>
    </div>
  )
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie-Einstellungen
    </button>
  )
}

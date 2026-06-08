import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | undefined | null, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }): string {
  if (!date) return '—'
  try {
    return new Intl.DateTimeFormat('de-DE', opts).format(typeof date === 'string' ? new Date(date) : date)
  } catch {
    return '—'
  }
}

export function formatDateTime(date: string | Date | undefined | null): string {
  return formatDate(date, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function formatRelative(date: string | Date | undefined | null): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = (Date.now() - d.getTime()) / 1000
  const abs = Math.abs(diff)
  const sign = diff >= 0 ? -1 : 1
  const rtf = new Intl.RelativeTimeFormat('de-DE', { numeric: 'auto' })
  if (abs < 60) return rtf.format(Math.round(sign * abs), 'second')
  if (abs < 3600) return rtf.format(Math.round((sign * abs) / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round((sign * abs) / 3600), 'hour')
  if (abs < 86400 * 14) return rtf.format(Math.round((sign * abs) / 86400), 'day')
  return formatDate(d)
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

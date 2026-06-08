import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Original brand asset — 1:1 from PflegeNest Bochum corporate identity */
export const BRAND_LOGO_SRC = '/brand/pflegenest-logo.png'
export const BRAND_MARK_SRC = '/brand/logo-mark.svg'

const heights = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
  '2xl': 96,
  hero: 128,
} as const

export type LogoSize = keyof typeof heights

interface LogoProps {
  /** Pixel height — width follows the original 1:1 asset ratio */
  size?: LogoSize
  className?: string
  priority?: boolean
}

/** Full stacked logo (icon + PflegeNest Bochum) — pixel-perfect from brand PNG */
export function Logo({ size = 'md', className, priority = false }: LogoProps) {
  const h = heights[size]
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt="PflegeNest Bochum"
      width={1024}
      height={1024}
      priority={priority}
      className={cn('select-none', className)}
      style={{ height: h, width: h }}
      draggable={false}
    />
  )
}

interface LogoMarkProps {
  size?: number
  className?: string
}

/** Icon mark only — SVG for crisp favicons and compact UI slots */
export function LogoMark({ size = 32, className }: LogoMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BRAND_MARK_SRC}
      alt=""
      width={size}
      height={Math.round(size * 0.8)}
      className={cn('select-none', className)}
      draggable={false}
      aria-hidden
    />
  )
}

interface LogoLinkProps extends LogoProps {
  href?: string
  label?: string
  className?: string
}

export function LogoLink({ href = '/', label = 'PflegeNest Bochum Startseite', className, ...props }: LogoLinkProps) {
  return (
    <Link href={href} className={cn('inline-flex shrink-0 items-center', className)} aria-label={label}>
      <Logo {...props} />
    </Link>
  )
}

interface AdminLogoProps extends LogoProps {
  showOsBadge?: boolean
}

/** Admin shell: brand logo + subtle OS indicator */
export function AdminLogo({ size = 'sm', showOsBadge = true, className }: AdminLogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Logo size={size} />
      {showOsBadge ? (
        <span className="hidden xl:inline-flex items-center rounded-md border border-primary/15 bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
          OS
        </span>
      ) : null}
    </div>
  )
}

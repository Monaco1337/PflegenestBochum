/**
 * Loading / Empty / Error / Skeleton primitives.
 * Every list, table, board, calendar uses these — never custom placeholders.
 */
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

export function LoadingState({
  label = 'Wird geladen…',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground', className)}
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function EmptyState({
  icon = <Inbox className="h-6 w-6 text-muted-foreground" />,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      role="status"
      className={cn('flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-card/50 py-12 px-6 text-center', className)}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">{icon}</div>
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      {description ? <p className="text-sm text-muted-foreground max-w-md">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export function ErrorState({
  title = 'Etwas ist schiefgelaufen',
  description,
  onRetry,
  className,
}: {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/5 py-10 px-6 text-center', className)}
    >
      <AlertTriangle className="h-6 w-6 text-destructive" />
      <h3 className="text-base font-semibold text-destructive">{title}</h3>
      {description ? <p className="text-sm text-muted-foreground max-w-md">{description}</p> : null}
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Erneut versuchen
        </Button>
      ) : null}
    </div>
  )
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton rounded-md h-4 w-full', className)} {...props} />
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6', className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

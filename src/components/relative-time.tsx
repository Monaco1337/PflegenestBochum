'use client'

import { useEffect, useState } from 'react'
import { formatRelative } from '@/lib/utils'

/**
 * Relative timestamp for client components. `formatRelative` depends on
 * `Date.now()`, which differs slightly between the server render and client
 * hydration (e.g. "vor 4 Sekunden" vs "vor 5 Sekunden"). `suppressHydrationWarning`
 * keeps the server value on first paint; we then refresh to the live value
 * after mount and on an interval.
 */
export function RelativeTime({
  date,
  className,
}: {
  date: string | Date | null | undefined
  className?: string
}) {
  const [value, setValue] = useState(() => formatRelative(date))

  useEffect(() => {
    setValue(formatRelative(date))
    const id = setInterval(() => setValue(formatRelative(date)), 30_000)
    return () => clearInterval(id)
  }, [date])

  return (
    <span className={className} suppressHydrationWarning>
      {value}
    </span>
  )
}

'use client'

import type { ReactNode } from 'react'
import { SessionContext, type ClientSession } from './session-client'

export function SessionProvider({
  value,
  children,
}: {
  value: ClientSession | null
  children: ReactNode
}) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

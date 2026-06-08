'use client'

import { createContext, useContext } from 'react'
import type { SessionUser } from '@/core/types'

export interface ClientSession {
  user: SessionUser
}

export const SessionContext = createContext<ClientSession | null>(null)

export function useSession(): ClientSession | null {
  return useContext(SessionContext)
}

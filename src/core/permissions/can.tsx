/**
 * <Can permission=".."> — declarative permission gate for client UI.
 * Note: Server Actions and route handlers still enforce permissions in
 * `requirePermission()` independently. This component is for UX only.
 */
'use client'

import type { ReactNode } from 'react'
import { useSession } from '@/core/auth/session-client'
import { can } from './matrix'
import type { Permission } from '@/core/types'

interface CanProps {
  permission: Permission | Permission[]
  fallback?: ReactNode
  children: ReactNode
  mode?: 'any' | 'all'
}

export function Can({ permission, fallback = null, children, mode = 'any' }: CanProps) {
  const session = useSession()
  if (!session?.user) return <>{fallback}</>
  const perms = Array.isArray(permission) ? permission : [permission]
  const ok = mode === 'all' ? perms.every(p => can(session.user, p)) : perms.some(p => can(session.user, p))
  return <>{ok ? children : fallback}</>
}

export function usePermissions() {
  const session = useSession()
  return {
    user: session?.user ?? null,
    can: (perm: Permission) => (session?.user ? can(session.user, perm) : false),
    isAuthed: Boolean(session?.user),
  }
}

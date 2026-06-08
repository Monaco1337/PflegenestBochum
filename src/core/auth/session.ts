/**
 * Server-side session helpers.
 *
 * Iteration 1: a signed-cookie session with role/permissions, set by
 * /api/auth/login. Suitable for an internal pilot. Replace with NextAuth/SSO
 * by swapping `getSessionFromRequest()` and `setSessionCookie()`.
 *
 * Cookie payload is JSON, signed via HMAC with NEXTAUTH_SECRET.
 */

import { cookies, headers } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { redirect } from 'next/navigation'
import type { Permission, SessionUser, User } from '@/core/types'
import { ROLE_PERMISSIONS, effectivePermissions } from '@/core/permissions/matrix'
import { repos } from '@/core/repositories'

const COOKIE = 'pflegenest_session'
const ONE_WEEK = 60 * 60 * 24 * 7

const SECRET = process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-me'

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('base64url')
}

function verify(payload: string, sig: string): boolean {
  const expected = sign(payload)
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  } catch {
    return false
  }
}

export interface SessionPayload {
  userId: string
  issuedAt: number
}

export function encodeSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = sign(body)
  return `${body}.${sig}`
}

export function decodeSession(token: string): SessionPayload | null {
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  if (!verify(body, sig)) return null
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as SessionPayload
  } catch {
    return null
  }
}

export async function setSessionCookie(userId: string) {
  const jar = cookies()
  jar.set(COOKIE, encodeSession({ userId, issuedAt: Date.now() }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ONE_WEEK,
    path: '/',
  })
}

export async function clearSessionCookie() {
  const jar = cookies()
  jar.set(COOKIE, '', { maxAge: 0, path: '/' })
}

export async function getSession(): Promise<{ user: SessionUser } | null> {
  const jar = cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null
  const payload = decodeSession(token)
  if (!payload) return null
  const user = (await repos.users.findById(payload.userId)) as User | null
  if (!user || !user.active) return null
  return {
    user: {
      ...user,
      effectivePermissions: effectivePermissions(user),
    },
  }
}

export async function requireSession(redirectTo: string = '/login'): Promise<{ user: SessionUser }> {
  const session = await getSession()
  if (!session) {
    const url = new URL(redirectTo, 'http://localhost')
    const referer = headers().get('referer')
    if (referer) url.searchParams.set('next', referer)
    redirect(url.pathname + url.search)
  }
  return session
}

export async function requirePermission(permission: Permission | Permission[]) {
  const session = await requireSession()
  const perms = Array.isArray(permission) ? permission : [permission]
  const role = session.user.role
  const allowed = role === 'super_admin' || perms.some(p => (ROLE_PERMISSIONS[role] ?? []).includes(p) || session.user.permissions.includes(p))
  if (!allowed) {
    throw new Error(`Forbidden: missing permission ${perms.join(',')}`)
  }
  return session
}

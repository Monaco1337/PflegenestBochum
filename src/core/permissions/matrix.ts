/**
 * Role → Permission matrix. Single source of truth for what each role may do.
 * UI checks via `can()`/<Can/>; Server Actions enforce via `requirePermission()`.
 */

import type { Permission, UserRole } from '@/core/types'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'view_dashboard',
    'manage_patients',
    'view_patients',
    'manage_applicants',
    'manage_employees',
    'manage_documents',
    'manage_shifts',
    'manage_tours',
    'manage_tasks',
    'view_analytics',
    'manage_settings',
    'export_data',
    'delete_data',
    'view_audit_logs',
  ],
  geschaeftsfuehrung: [
    'view_dashboard',
    'view_patients',
    'view_analytics',
    'manage_settings',
    'export_data',
    'view_audit_logs',
  ],
  pflegedienstleitung: [
    'view_dashboard',
    'manage_patients',
    'view_patients',
    'manage_employees',
    'manage_documents',
    'manage_shifts',
    'manage_tours',
    'manage_tasks',
    'view_analytics',
    'view_audit_logs',
  ],
  verwaltung: [
    'view_dashboard',
    'manage_patients',
    'view_patients',
    'manage_documents',
    'manage_tasks',
    'view_analytics',
  ],
  recruiting: [
    'view_dashboard',
    'manage_applicants',
    'manage_documents',
    'manage_tasks',
    'view_analytics',
  ],
  mitarbeiter: ['view_dashboard', 'manage_tasks'],
  angehoerige: ['view_patients'],
  patient: ['view_patients'],
}

export function permissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function can(user: { role: UserRole; permissions?: Permission[] }, perm: Permission): boolean {
  if (user.role === 'super_admin') return true
  const fromRole = ROLE_PERMISSIONS[user.role] ?? []
  if (fromRole.includes(perm)) return true
  return Boolean(user.permissions?.includes(perm))
}

export function effectivePermissions(user: { role: UserRole; permissions?: Permission[] }): Permission[] {
  const set = new Set<Permission>(ROLE_PERMISSIONS[user.role] ?? [])
  for (const p of user.permissions ?? []) set.add(p)
  return Array.from(set)
}

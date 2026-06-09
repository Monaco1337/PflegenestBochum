/**
 * Postgres-backed user repository (standard `pg` driver).
 *
 * Active when a Postgres connection string is present (POSTGRES_URL /
 * DATABASE_URL — injected automatically when a database is linked to the
 * project). This is the only entity that needs durable, cross-instance
 * persistence on serverless, so it is the only repository backed by SQL.
 * Everything else stays in the in-memory/demo store (see ../index.ts).
 *
 * We use the plain `pg` driver (TCP/TLS) so it works with any Postgres
 * provider, not just Neon's WebSocket endpoint.
 */

import 'server-only'
import { nanoid } from 'nanoid'
import { pgQuery as query } from './client'
import type { BaseEntity, IRepository } from '../base'
import type { ID, ListQuery, Paginated, Permission, User, UserRole } from '@/core/types'

const TABLE = 'app_users'

type Row = {
  id: string
  username: string | null
  email: string
  name: string
  password_hash: string | null
  role: string
  permissions: unknown
  avatar_url: string | null
  active: boolean
  last_login_at: Date | string | null
  created_at: Date | string
  updated_at: Date | string
}

function toIso(value: Date | string | null | undefined): string | undefined {
  if (!value) return undefined
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

function parsePermissions(value: unknown): Permission[] {
  if (Array.isArray(value)) return value as Permission[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? (parsed as Permission[]) : []
    } catch {
      return []
    }
  }
  return []
}

function mapRow(row: Row): User {
  return {
    id: row.id,
    username: row.username ?? undefined,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash ?? undefined,
    role: row.role as UserRole,
    permissions: parsePermissions(row.permissions),
    avatarUrl: row.avatar_url ?? undefined,
    active: row.active,
    lastLoginAt: toIso(row.last_login_at),
    createdAt: toIso(row.created_at)!,
    updatedAt: toIso(row.updated_at)!,
  }
}

export class PostgresUserRepository implements IRepository<User> {
  private schemaReady: Promise<void> | null = null

  async ensureSchema(): Promise<void> {
    if (!this.schemaReady) {
      this.schemaReady = query`
        CREATE TABLE IF NOT EXISTS app_users (
          id            text PRIMARY KEY,
          username      text UNIQUE,
          email         text UNIQUE NOT NULL,
          name          text NOT NULL,
          password_hash text,
          role          text NOT NULL DEFAULT 'mitarbeiter',
          permissions   jsonb NOT NULL DEFAULT '[]'::jsonb,
          avatar_url    text,
          active        boolean NOT NULL DEFAULT true,
          last_login_at timestamptz,
          created_at    timestamptz NOT NULL DEFAULT now(),
          updated_at    timestamptz NOT NULL DEFAULT now()
        )
      `
        .then(() => undefined)
        .catch(err => {
          this.schemaReady = null
          throw err
        })
    }
    return this.schemaReady
  }

  async all(): Promise<User[]> {
    await this.ensureSchema()
    const { rows } = await query<Row>`SELECT * FROM app_users ORDER BY created_at DESC`
    return rows.map(mapRow)
  }

  async findById(id: ID): Promise<User | null> {
    await this.ensureSchema()
    const { rows } = await query<Row>`SELECT * FROM app_users WHERE id = ${id} LIMIT 1`
    return rows[0] ? mapRow(rows[0]) : null
  }

  async findMany(predicate: (entity: User) => boolean): Promise<User[]> {
    const all = await this.all()
    return all.filter(predicate)
  }

  async count(predicate?: (entity: User) => boolean): Promise<number> {
    if (!predicate) {
      await this.ensureSchema()
      const { rows } = await query<{ count: string }>`SELECT COUNT(*)::text AS count FROM app_users`
      return Number(rows[0]?.count ?? 0)
    }
    return (await this.findMany(predicate)).length
  }

  async list(q: ListQuery = {}): Promise<Paginated<User>> {
    let data = await this.all()
    if (q.search) {
      const term = q.search.toLowerCase()
      data = data.filter(
        u =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          (u.username ?? '').toLowerCase().includes(term)
      )
    }
    const total = data.length
    const offset = q.offset ?? 0
    const limit = q.limit ?? data.length
    return { data: data.slice(offset, offset + limit), total, offset, limit }
  }

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<User, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<User> {
    await this.ensureSchema()
    const id = data.id ?? nanoid()
    const permissions = JSON.stringify(data.permissions ?? [])
    const { rows } = await query<Row>`
      INSERT INTO app_users (id, username, email, name, password_hash, role, permissions, avatar_url, active, last_login_at)
      VALUES (
        ${id},
        ${data.username ?? null},
        ${data.email},
        ${data.name},
        ${data.passwordHash ?? null},
        ${data.role},
        ${permissions}::jsonb,
        ${data.avatarUrl ?? null},
        ${data.active ?? true},
        ${data.lastLoginAt ?? null}
      )
      RETURNING *
    `
    return mapRow(rows[0])
  }

  async update(id: ID, patch: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    const existing = await this.findById(id)
    if (!existing) throw new Error(`Entity ${TABLE}/${id} not found`)
    const merged: User = { ...existing, ...patch, id: existing.id, createdAt: existing.createdAt }
    const permissions = JSON.stringify(merged.permissions ?? [])
    const { rows } = await query<Row>`
      UPDATE app_users SET
        username      = ${merged.username ?? null},
        email         = ${merged.email},
        name          = ${merged.name},
        password_hash = ${merged.passwordHash ?? null},
        role          = ${merged.role},
        permissions   = ${permissions}::jsonb,
        avatar_url    = ${merged.avatarUrl ?? null},
        active        = ${merged.active},
        last_login_at = ${merged.lastLoginAt ?? null},
        updated_at    = now()
      WHERE id = ${id}
      RETURNING *
    `
    return mapRow(rows[0])
  }

  async delete(id: ID): Promise<boolean> {
    await this.ensureSchema()
    const { rowCount } = await query`DELETE FROM app_users WHERE id = ${id}`
    return rowCount > 0
  }
}

export type { BaseEntity }

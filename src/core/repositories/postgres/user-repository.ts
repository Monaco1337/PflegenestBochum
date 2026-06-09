/**
 * Postgres-backed user repository (Vercel Postgres).
 *
 * Active when a Postgres connection string is present (POSTGRES_URL — injected
 * automatically when a Vercel Postgres store is linked to the project). This is
 * the only entity that needs durable, cross-instance persistence on serverless,
 * so it is the only repository backed by SQL. Everything else stays in the
 * in-memory/demo store (see ../index.ts).
 */

import 'server-only'
import { createClient, type VercelClient } from '@vercel/postgres'
import { nanoid } from 'nanoid'
import type { BaseEntity, IRepository } from '../base'
import type { ID, ListQuery, Paginated, Permission, User, UserRole } from '@/core/types'

const TABLE = 'app_users'

/**
 * Resolve the connection string from whichever variable the platform injected.
 * The provided string is a *direct* (non-pooled) connection, so we use
 * `createClient()` (which accepts direct connections) rather than a pool.
 */
function connectionString(): string | undefined {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    undefined
  )
}

/** Open a short-lived client for one unit of work and always close it. */
async function withClient<T>(fn: (client: VercelClient) => Promise<T>): Promise<T> {
  const client = createClient({ connectionString: connectionString() })
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

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

function mapRow(row: Row): User {
  return {
    id: row.id,
    username: row.username ?? undefined,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash ?? undefined,
    role: row.role as UserRole,
    permissions: (Array.isArray(row.permissions) ? row.permissions : []) as Permission[],
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
      this.schemaReady = withClient(async client => {
        await client.sql`
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
      }).catch(err => {
        // allow a later retry if the first attempt failed
        this.schemaReady = null
        throw err
      })
    }
    return this.schemaReady
  }

  async all(): Promise<User[]> {
    await this.ensureSchema()
    return withClient(async client => {
      const { rows } = await client.sql<Row>`SELECT * FROM app_users ORDER BY created_at DESC`
      return rows.map(mapRow)
    })
  }

  async findById(id: ID): Promise<User | null> {
    await this.ensureSchema()
    return withClient(async client => {
      const { rows } = await client.sql<Row>`SELECT * FROM app_users WHERE id = ${id} LIMIT 1`
      return rows[0] ? mapRow(rows[0]) : null
    })
  }

  async findMany(predicate: (entity: User) => boolean): Promise<User[]> {
    const all = await this.all()
    return all.filter(predicate)
  }

  async count(predicate?: (entity: User) => boolean): Promise<number> {
    if (!predicate) {
      await this.ensureSchema()
      return withClient(async client => {
        const { rows } = await client.sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM app_users`
        return Number(rows[0]?.count ?? 0)
      })
    }
    return (await this.findMany(predicate)).length
  }

  async list(query: ListQuery = {}): Promise<Paginated<User>> {
    let data = await this.all()
    if (query.search) {
      const term = query.search.toLowerCase()
      data = data.filter(
        u =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          (u.username ?? '').toLowerCase().includes(term)
      )
    }
    const total = data.length
    const offset = query.offset ?? 0
    const limit = query.limit ?? data.length
    return { data: data.slice(offset, offset + limit), total, offset, limit }
  }

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<User, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<User> {
    await this.ensureSchema()
    const id = data.id ?? nanoid()
    const permissions = JSON.stringify(data.permissions ?? [])
    return withClient(async client => {
      const { rows } = await client.sql<Row>`
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
    })
  }

  async update(id: ID, patch: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    const existing = await this.findById(id)
    if (!existing) throw new Error(`Entity ${TABLE}/${id} not found`)
    const merged: User = { ...existing, ...patch, id: existing.id, createdAt: existing.createdAt }
    const permissions = JSON.stringify(merged.permissions ?? [])
    return withClient(async client => {
      const { rows } = await client.sql<Row>`
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
    })
  }

  async delete(id: ID): Promise<boolean> {
    await this.ensureSchema()
    return withClient(async client => {
      const { rowCount } = await client.sql`DELETE FROM app_users WHERE id = ${id}`
      return (rowCount ?? 0) > 0
    })
  }
}

export type { BaseEntity }

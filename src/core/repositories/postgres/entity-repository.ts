/**
 * Generic Postgres repository — mirrors MemoryRepository semantics exactly but
 * persists every collection as JSONB rows in a single `app_entities` table.
 *
 * This gives durable, cross-instance persistence for everything the website and
 * admin panel read/write (leads, applicants, anamneses, pflegegrad assessments,
 * tasks, consent records, …) without hand-modelling a column schema per entity.
 *
 * Read paths load a collection and reuse `runListQuery` so filtering, sorting
 * and pagination are byte-for-byte identical to the in-memory backend.
 */

import 'server-only'
import { nanoid } from 'nanoid'
import { pgQuery } from './client'
import { runListQuery, type CollectionQueryOptions } from '../query'
import type { BaseEntity, IRepository } from '../base'
import type { ID, ISODateTime, ListQuery, Paginated } from '@/core/types'

let schemaReady: Promise<void> | null = null

/** Idempotently create the shared entity table. */
export async function ensureEntitySchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = pgQuery`
      CREATE TABLE IF NOT EXISTS app_entities (
        collection text NOT NULL,
        id         text NOT NULL,
        data       jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (collection, id)
      )
    `
      .then(() => undefined)
      .catch(err => {
        schemaReady = null
        throw err
      })
  }
  return schemaReady
}

/**
 * Atomically claim a one-time action (e.g. demo seeding) across all serverless
 * instances. Returns true for exactly one caller; concurrent cold-starts that
 * lose the race get false and must skip the action.
 */
export async function claimSeedOnce(key: string): Promise<boolean> {
  await ensureEntitySchema()
  const { rowCount } = await pgQuery`
    INSERT INTO app_entities (collection, id, data)
    VALUES ('_seed_locks', ${key}, '{}'::jsonb)
    ON CONFLICT (collection, id) DO NOTHING
  `
  return rowCount > 0
}

export interface PostgresRepositoryOptions<T> extends CollectionQueryOptions<T> {
  collection: string
}

export class PostgresRepository<T extends BaseEntity> implements IRepository<T> {
  constructor(private readonly options: PostgresRepositoryOptions<T>) {}

  private nowIso(): ISODateTime {
    return new Date().toISOString()
  }

  private async items(): Promise<T[]> {
    await ensureEntitySchema()
    const { rows } = await pgQuery<{ data: T }>`
      SELECT data FROM app_entities WHERE collection = ${this.options.collection} ORDER BY created_at ASC
    `
    return rows.map(r => r.data)
  }

  async all(): Promise<T[]> {
    return this.items()
  }

  async findById(id: ID): Promise<T | null> {
    await ensureEntitySchema()
    const { rows } = await pgQuery<{ data: T }>`
      SELECT data FROM app_entities WHERE collection = ${this.options.collection} AND id = ${id} LIMIT 1
    `
    return rows[0]?.data ?? null
  }

  async findMany(predicate: (entity: T) => boolean): Promise<T[]> {
    return (await this.items()).filter(predicate)
  }

  async count(predicate?: (entity: T) => boolean): Promise<number> {
    if (!predicate) {
      await ensureEntitySchema()
      const { rows } = await pgQuery<{ count: string }>`
        SELECT COUNT(*)::text AS count FROM app_entities WHERE collection = ${this.options.collection}
      `
      return Number(rows[0]?.count ?? 0)
    }
    return (await this.findMany(predicate)).length
  }

  async list(query: ListQuery = {}): Promise<Paginated<T>> {
    return runListQuery(await this.items(), this.options, query)
  }

  async create(
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T> {
    await ensureEntitySchema()
    const id = (data.id as string) ?? nanoid()
    const now = this.nowIso()
    const entity = {
      ...data,
      id,
      createdAt: (data.createdAt as string) ?? now,
      updatedAt: now,
    } as T
    await pgQuery`
      INSERT INTO app_entities (collection, id, data)
      VALUES (${this.options.collection}, ${id}, ${JSON.stringify(entity)}::jsonb)
      ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `
    return entity
  }

  async update(id: ID, patch: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T> {
    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Entity ${this.options.collection}/${id} not found`)
    }
    const updated = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: this.nowIso(),
    } as T
    await pgQuery`
      UPDATE app_entities SET data = ${JSON.stringify(updated)}::jsonb, updated_at = now()
      WHERE collection = ${this.options.collection} AND id = ${id}
    `
    return updated
  }

  async delete(id: ID): Promise<boolean> {
    await ensureEntitySchema()
    const { rowCount } = await pgQuery`
      DELETE FROM app_entities WHERE collection = ${this.options.collection} AND id = ${id}
    `
    return rowCount > 0
  }
}

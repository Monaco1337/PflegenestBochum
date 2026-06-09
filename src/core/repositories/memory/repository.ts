/**
 * Generic in-memory repository implementation backed by `store.ts`.
 * Provides CRUD + list with search/filter/sort/pagination semantics that
 * a Prisma-backed implementation would expose identically.
 */

import { nanoid } from 'nanoid'
import { store } from './store'
import { runListQuery } from '../query'
import type { BaseEntity, IRepository } from '../base'
import type { ID, ISODateTime, ListQuery, Paginated } from '@/core/types'

export interface MemoryRepositoryOptions<T> {
  collection: string
  searchableFields?: (keyof T)[]
  defaultSortField?: keyof T
}

export class MemoryRepository<T extends BaseEntity>
  implements IRepository<T>
{
  constructor(private readonly options: MemoryRepositoryOptions<T>) {}

  private nowIso(): ISODateTime {
    return new Date().toISOString()
  }

  private get items(): Record<string, T> {
    return store.getCollection<T>(this.options.collection)
  }

  async all(): Promise<T[]> {
    return Object.values(this.items)
  }

  async findById(id: ID): Promise<T | null> {
    return this.items[id] ?? null
  }

  async findMany(predicate: (entity: T) => boolean): Promise<T[]> {
    return Object.values(this.items).filter(predicate)
  }

  async count(predicate?: (entity: T) => boolean): Promise<number> {
    const all = Object.values(this.items)
    return predicate ? all.filter(predicate).length : all.length
  }

  async list(query: ListQuery = {}): Promise<Paginated<T>> {
    return runListQuery(Object.values(this.items), this.options, query)
  }

  async create(
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<T, 'id'>>
  ): Promise<T> {
    const id = (data.id as string) ?? nanoid()
    const now = this.nowIso()
    const entity = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    } as T
    store.putItem(this.options.collection, id, entity)
    return entity
  }

  async update(id: ID, patch: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T> {
    const existing = this.items[id]
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
    store.putItem(this.options.collection, id, updated)
    return updated
  }

  async delete(id: ID): Promise<boolean> {
    if (!this.items[id]) return false
    store.deleteItem(this.options.collection, id)
    return true
  }
}

/**
 * Generic in-memory repository implementation backed by `store.ts`.
 * Provides CRUD + list with search/filter/sort/pagination semantics that
 * a Prisma-backed implementation would expose identically.
 */

import { nanoid } from 'nanoid'
import { store } from './store'
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
    let data = Object.values(this.items)

    if (query.search && this.options.searchableFields?.length) {
      const term = query.search.toLowerCase()
      data = data.filter(item =>
        this.options.searchableFields!.some(field => {
          const value = item[field]
          if (typeof value !== 'string') return false
          return value.toLowerCase().includes(term)
        })
      )
    }

    if (query.filters) {
      for (const [key, value] of Object.entries(query.filters)) {
        if (value === undefined || value === null || value === '') continue
        data = data.filter(item => {
          const itemValue = (item as Record<string, unknown>)[key]
          if (Array.isArray(value)) {
            return value.includes(itemValue as never)
          }
          return itemValue === value
        })
      }
    }

    const sortKey = (query.sortBy as keyof T) ?? this.options.defaultSortField ?? ('createdAt' as keyof T)
    const dir = query.sortDir ?? 'desc'
    data.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (av < bv) return dir === 'asc' ? -1 : 1
      if (av > bv) return dir === 'asc' ? 1 : -1
      return 0
    })

    const total = data.length
    const offset = query.offset ?? 0
    const limit = query.limit ?? data.length
    return {
      data: data.slice(offset, offset + limit),
      total,
      offset,
      limit,
    }
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

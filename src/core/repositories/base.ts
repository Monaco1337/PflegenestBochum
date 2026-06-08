/**
 * Repository abstraction. UI/services never depend on a concrete persistence
 * implementation. The factory in `./index.ts` selects backend based on env.
 */

import type { ID, ListQuery, Paginated } from '@/core/types'

export interface BaseEntity {
  id: ID
  createdAt?: string
  updatedAt?: string
}

export interface IRepository<T extends BaseEntity, TSortKey extends string = string> {
  list(query?: ListQuery<TSortKey>): Promise<Paginated<T>>
  all(): Promise<T[]>
  findById(id: ID): Promise<T | null>
  findMany(predicate: (entity: T) => boolean): Promise<T[]>
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T>
  update(id: ID, patch: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T>
  delete(id: ID): Promise<boolean>
  count(predicate?: (entity: T) => boolean): Promise<number>
}

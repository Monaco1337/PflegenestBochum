/**
 * Shared list/filter/sort/paginate logic so the in-memory and Postgres backends
 * behave identically. UI relies on this consistency.
 */

import type { ListQuery, Paginated } from '@/core/types'

export interface CollectionQueryOptions<T> {
  searchableFields?: (keyof T)[]
  defaultSortField?: keyof T
}

export function runListQuery<T>(
  items: T[],
  options: CollectionQueryOptions<T>,
  query: ListQuery = {}
): Paginated<T> {
  let data = [...items]

  if (query.search && options.searchableFields?.length) {
    const term = query.search.toLowerCase()
    data = data.filter(item =>
      options.searchableFields!.some(field => {
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

  const sortKey = (query.sortBy as keyof T) ?? options.defaultSortField ?? ('createdAt' as keyof T)
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

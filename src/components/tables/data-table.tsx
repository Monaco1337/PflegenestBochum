/**
 * Lightweight, header-sortable, search-filterable data table. Server-rendered
 * for the initial paint, client-enhanced for search/sort. Includes built-in
 * loading/empty/error states from `feedback/states`.
 */
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDownAZ, ArrowUpZA, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/feedback/states'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  id: string
  header: string
  cell: (row: T) => React.ReactNode
  sortKey?: keyof T
  className?: string
}

export interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: DataTableColumn<T>[]
  searchPlaceholder?: string
  searchableFields?: (keyof T)[]
  rowHref?: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
  className?: string
  filters?: React.ReactNode
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = 'Suchen…',
  searchableFields = [],
  rowHref,
  emptyTitle = 'Nichts gefunden',
  emptyDescription = 'Es liegen aktuell keine Einträge vor.',
  emptyAction,
  className,
  filters,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    let rows = data
    if (search && searchableFields.length) {
      const term = search.toLowerCase()
      rows = rows.filter(row =>
        searchableFields.some(field => {
          const value = row[field]
          if (typeof value !== 'string') return false
          return value.toLowerCase().includes(term)
        })
      )
    }
    if (sortBy) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortBy]
        const bv = b[sortBy]
        if (av == null && bv == null) return 0
        if (av == null) return 1
        if (bv == null) return -1
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }
    return rows
  }, [data, search, sortBy, sortDir, searchableFields])

  const setSort = (key: keyof T) => {
    if (sortBy === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortDir('asc')
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {searchableFields.length > 0 ? (
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-8"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        ) : <div />}
        {filters ? <div className="flex flex-wrap items-center gap-2">{filters}</div> : null}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  {columns.map(col => (
                    <th
                      key={col.id}
                      className={cn(
                        'px-4 py-3 text-left font-medium',
                        col.sortKey && 'cursor-pointer select-none hover:text-foreground',
                        col.className
                      )}
                      onClick={() => col.sortKey && setSort(col.sortKey)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.header}
                        {col.sortKey && sortBy === col.sortKey ? (
                          sortDir === 'asc' ? (
                            <ArrowDownAZ className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpZA className="h-3.5 w-3.5" />
                          )
                        ) : null}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(row => {
                  const href = rowHref?.(row)
                  return (
                    <tr key={row.id} className="hover:bg-muted/40 transition-colors group">
                      {columns.map(col => (
                        <td key={col.id} className={cn('px-4 py-3 align-middle', col.className)}>
                          {href ? (
                            <Link href={href} className="block">
                              {col.cell(row)}
                            </Link>
                          ) : (
                            col.cell(row)
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

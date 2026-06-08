/**
 * In-memory store with JSON-file persistence for development/preview.
 *
 * Why a JSON file: Server Actions run in separate worker invocations on
 * Vercel-like platforms. Process-local memory is not durable enough across
 * cold starts. Writing to `.data/store.json` keeps demo data stable between
 * Server Action calls while DATABASE_URL is unset.
 *
 * Production: replaced by Prisma. UI/services depend only on IRepository.
 */

import 'server-only'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export interface StoreShape {
  [collection: string]: Record<string, unknown>
}

const DATA_DIR = process.env.PFLEGENEST_DATA_DIR ?? join(process.cwd(), '.data')
const STORE_FILE = join(DATA_DIR, 'store.json')

class Store {
  private data: StoreShape = {}
  private loaded = false
  private writeTimer: NodeJS.Timeout | null = null

  private ensureLoaded() {
    if (this.loaded) return
    try {
      if (existsSync(STORE_FILE)) {
        const raw = readFileSync(STORE_FILE, 'utf-8')
        this.data = JSON.parse(raw) as StoreShape
      }
    } catch (err) {
      console.warn('[Store] failed to read existing store, starting fresh', err)
      this.data = {}
    }
    this.loaded = true
  }

  private scheduleWrite() {
    if (this.writeTimer) clearTimeout(this.writeTimer)
    this.writeTimer = setTimeout(() => this.flush(), 50)
  }

  flush() {
    try {
      if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
      writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8')
    } catch (err) {
      console.warn('[Store] failed to persist', err)
    }
  }

  getCollection<T>(name: string): Record<string, T> {
    this.ensureLoaded()
    if (!this.data[name]) this.data[name] = {}
    return this.data[name] as Record<string, T>
  }

  setCollection<T>(name: string, collection: Record<string, T>) {
    this.ensureLoaded()
    this.data[name] = collection as Record<string, unknown>
    this.scheduleWrite()
  }

  putItem<T>(collection: string, id: string, item: T) {
    const col = this.getCollection<T>(collection)
    col[id] = item
    this.scheduleWrite()
  }

  deleteItem(collection: string, id: string) {
    const col = this.getCollection(collection)
    delete col[id]
    this.scheduleWrite()
  }

  hasAnyData(): boolean {
    this.ensureLoaded()
    return Object.values(this.data).some(c => Object.keys(c).length > 0)
  }
}

declare global {
  var __pflegenest_store__: Store | undefined
}

export const store: Store = globalThis.__pflegenest_store__ ?? new Store()
if (!globalThis.__pflegenest_store__) globalThis.__pflegenest_store__ = store

/**
 * Storage abstraction for file uploads. Default backend writes to
 * `public/uploads/` so files are served directly. Production backends
 * (S3, R2, Azure Blob) can be swapped by reading S3_* env vars.
 */
import 'server-only'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { nanoid } from 'nanoid'

export interface StoredFile {
  url: string
  size: number
  mimeType: string
  name: string
}

export interface IStorage {
  put(input: { name: string; data: ArrayBuffer; mimeType: string }): Promise<StoredFile>
}

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
])

class LocalStorageBackend implements IStorage {
  async put({ name, data, mimeType }: { name: string; data: ArrayBuffer; mimeType: string }): Promise<StoredFile> {
    if (data.byteLength > MAX_BYTES) {
      throw new Error('Datei ist zu groß (max 10 MB).')
    }
    if (!ALLOWED_MIME.has(mimeType)) {
      throw new Error(`Dateityp ${mimeType} nicht erlaubt.`)
    }
    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileId = `${nanoid(10)}-${safeName}`
    const dir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    const filePath = join(dir, fileId)
    writeFileSync(filePath, Buffer.from(data))
    return {
      url: `/uploads/${fileId}`,
      size: data.byteLength,
      mimeType,
      name: safeName,
    }
  }
}

declare global {
  var __pflegenest_storage__: IStorage | undefined
}

export const storage: IStorage = globalThis.__pflegenest_storage__ ?? new LocalStorageBackend()
if (!globalThis.__pflegenest_storage__) globalThis.__pflegenest_storage__ = storage

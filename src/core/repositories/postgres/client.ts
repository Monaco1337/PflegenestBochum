/**
 * Shared Postgres connection for all SQL-backed repositories.
 *
 * Uses the standard `pg` driver (TCP/TLS) so it works with any Postgres
 * provider. A single pool is reused across warm serverless invocations.
 */

import 'server-only'
import { Pool } from 'pg'

export function pgConnectionString(): string | undefined {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    undefined
  )
}

declare global {
  // eslint-disable-next-line no-var
  var __pflegenest_pg_pool__: Pool | undefined
}

export function pgPool(): Pool {
  if (!globalThis.__pflegenest_pg_pool__) {
    globalThis.__pflegenest_pg_pool__ = new Pool({
      connectionString: pgConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    })
  }
  return globalThis.__pflegenest_pg_pool__
}

/** Tagged-template helper → parameterized `pg` query ($1, $2, …). */
function build(strings: TemplateStringsArray, values: unknown[]): { text: string; values: unknown[] } {
  let text = ''
  strings.forEach((part, i) => {
    text += part
    if (i < values.length) text += `$${i + 1}`
  })
  return { text, values }
}

export async function pgQuery<T extends Record<string, unknown> = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  const { text, values: params } = build(strings, values)
  const res = await pgPool().query(text, params)
  return { rows: res.rows as T[], rowCount: res.rowCount ?? 0 }
}

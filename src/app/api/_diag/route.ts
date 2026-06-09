import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// TEMPORARY diagnostic — reports runtime DB wiring without leaking secrets.
export async function GET() {
  const present = (v?: string) => Boolean(v && v.length > 0)
  const out: Record<string, unknown> = {
    POSTGRES_URL: present(process.env.POSTGRES_URL),
    POSTGRES_PRISMA_URL: present(process.env.POSTGRES_PRISMA_URL),
    POSTGRES_URL_NON_POOLING: present(process.env.POSTGRES_URL_NON_POOLING),
    DATABASE_URL: present(process.env.DATABASE_URL),
    PRISMA_DATABASE_URL: present(process.env.PRISMA_DATABASE_URL),
    DATABASE_URL_scheme: (process.env.DATABASE_URL ?? '').split(':')[0] || null,
    POSTGRES_URL_scheme: (process.env.POSTGRES_URL ?? '').split(':')[0] || null,
  }

  try {
    const { createPool } = await import('@vercel/postgres')
    const cs =
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL
    const pool = createPool({ connectionString: cs })
    const r = await pool.sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM app_users`
    out.app_users_count = Number(r.rows[0]?.count ?? -1)
    out.db_ok = true
  } catch (e) {
    out.db_ok = false
    out.db_error = (e as Error).message
  }

  return NextResponse.json(out)
}

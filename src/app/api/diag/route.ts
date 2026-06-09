import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// TEMPORARY diagnostic — reports runtime DB wiring without leaking secrets.
export async function GET() {
  const present = (v?: string) => Boolean(v && v.length > 0)
  const scheme = (v?: string) => (v ? v.split('://')[0] : null)
  const out: Record<string, unknown> = {
    POSTGRES_URL: present(process.env.POSTGRES_URL),
    POSTGRES_PRISMA_URL: present(process.env.POSTGRES_PRISMA_URL),
    POSTGRES_URL_NON_POOLING: present(process.env.POSTGRES_URL_NON_POOLING),
    DATABASE_URL: present(process.env.DATABASE_URL),
    PRISMA_DATABASE_URL: present(process.env.PRISMA_DATABASE_URL),
    DATABASE_URL_scheme: scheme(process.env.DATABASE_URL),
    POSTGRES_URL_scheme: scheme(process.env.POSTGRES_URL),
    PRISMA_DATABASE_URL_scheme: scheme(process.env.PRISMA_DATABASE_URL),
  }

  try {
    const { Pool } = await import('pg')
    const cs =
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING
    const pool = new Pool({ connectionString: cs, ssl: { rejectUnauthorized: false }, max: 1 })
    try {
      const r = await pool.query('SELECT COUNT(*)::text AS count FROM app_users')
      out.app_users_count = Number(r.rows[0]?.count ?? -1)
      out.usernames = (
        await pool.query('SELECT username FROM app_users ORDER BY username')
      ).rows.map((x: { username: string }) => x.username)

      // End-to-end credential self-test (no secrets leaked, only booleans).
      const admin = (
        await pool.query('SELECT password_hash, active FROM app_users WHERE username = $1', ['admin'])
      ).rows[0] as { password_hash: string | null; active: boolean } | undefined
      if (admin?.password_hash) {
        const bcrypt = (await import('bcryptjs')).default
        out.admin_login_ok = admin.active && (await bcrypt.compare('Volvic1337!', admin.password_hash))
      } else {
        out.admin_login_ok = false
      }
      out.db_ok = true
    } finally {
      await pool.end()
    }
  } catch (e) {
    out.db_ok = false
    out.db_error = (e as Error).message
  }

  return NextResponse.json(out)
}

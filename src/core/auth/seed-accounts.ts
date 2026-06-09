import 'server-only'
import { repos } from '@/core/repositories'
import { hashPassword } from '@/core/auth/passwords'
import type { User, UserRole } from '@/core/types'

/**
 * The three fixed operator accounts. All three get full system access
 * (super_admin) and may create further users / assign roles. Seeded once; if an
 * account already exists it is left untouched so password changes persist.
 *
 * The default password can be overridden per-environment via
 * PFLEGENEST_SEED_PASSWORD without touching the code.
 */
const DEFAULT_PASSWORD = process.env.PFLEGENEST_SEED_PASSWORD ?? 'Volvic1337!'

const ACCOUNTS: Array<{ username: string; name: string; email: string; role: UserRole }> = [
  { username: 'admin', name: 'Admin', email: 'admin@pflegenest-bochum.de', role: 'super_admin' },
  { username: 'soner', name: 'Soner', email: 'soner@pflegenest-bochum.de', role: 'super_admin' },
  { username: 'seilan', name: 'Seilan', email: 'seilan@pflegenest-bochum.de', role: 'super_admin' },
]

export async function ensureAuthAccounts(): Promise<void> {
  const existing = await repos.users.all()
  const byUsername = new Set(existing.map(u => (u.username ?? '').toLowerCase()))
  const byEmail = new Set(existing.map(u => u.email.toLowerCase()))

  for (const cfg of ACCOUNTS) {
    if (byUsername.has(cfg.username.toLowerCase()) || byEmail.has(cfg.email.toLowerCase())) continue
    try {
      const passwordHash = await hashPassword(DEFAULT_PASSWORD)
      await repos.users.create({
        username: cfg.username,
        name: cfg.name,
        email: cfg.email,
        passwordHash,
        role: cfg.role,
        permissions: [],
        active: true,
      } as Omit<User, 'id' | 'createdAt' | 'updatedAt'>)
    } catch {
      // Ignore unique-violation races: when several serverless instances cold-start
      // at once they may try to seed the same account. The account ends up created
      // exactly once; remaining accounts are still attempted on the next request.
    }
  }
}

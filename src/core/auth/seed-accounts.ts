import 'server-only'
import { repos, claimOnce } from '@/core/repositories'
import { hashPassword } from '@/core/auth/passwords'
import type { User, UserRole } from '@/core/types'

/**
 * The three fixed operator accounts. All three get full system access
 * (super_admin) and may create further users / assign roles. Seeded once; if an
 * account already exists it is left untouched so self-service password changes
 * persist.
 *
 * Admin keeps the operator default password. Soner and Seilan get their own
 * initial password and can change it later in the profile settings.
 */
const ADMIN_PASSWORD = process.env.PFLEGENEST_SEED_PASSWORD ?? 'Volvic1337!'

const ACCOUNTS: Array<{ username: string; name: string; email: string; role: UserRole; password: string }> = [
  { username: 'admin', name: 'Admin', email: 'admin@pflegenest-bochum.de', role: 'super_admin', password: ADMIN_PASSWORD },
  { username: 'soner', name: 'Soner', email: 'soner@pflegenest-bochum.de', role: 'super_admin', password: 'pflege123' },
  { username: 'seilan', name: 'Seilan', email: 'seilan@pflegenest-bochum.de', role: 'super_admin', password: 'pflege123' },
]

export async function ensureAuthAccounts(): Promise<void> {
  const existing = await repos.users.all()
  const byUsername = new Map(existing.map(u => [(u.username ?? '').toLowerCase(), u]))
  const byEmail = new Set(existing.map(u => u.email.toLowerCase()))

  for (const cfg of ACCOUNTS) {
    if (byUsername.has(cfg.username.toLowerCase()) || byEmail.has(cfg.email.toLowerCase())) continue
    try {
      const passwordHash = await hashPassword(cfg.password)
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

  // One-time migration for accounts that were already seeded with the old shared password.
  if (await claimOnce('auth-passwords-soner-seilan-pflege123')) {
    for (const username of ['soner', 'seilan'] as const) {
      const user = byUsername.get(username) ?? (await repos.users.findMany(u => (u.username ?? '').toLowerCase() === username))[0]
      if (!user) continue
      const cfg = ACCOUNTS.find(a => a.username === username)
      if (!cfg) continue
      await repos.users.update(user.id, { passwordHash: await hashPassword(cfg.password) })
    }
  }
}

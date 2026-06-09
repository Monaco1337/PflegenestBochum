import 'server-only'
import bcrypt from 'bcryptjs'

const ROUNDS = 10

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS)
}

export async function verifyPassword(plain: string, hash: string | undefined | null): Promise<boolean> {
  if (!hash) return false
  try {
    return await bcrypt.compare(plain, hash)
  } catch {
    return false
  }
}

/** Lightweight password policy used for new accounts and self-service changes. */
export function validatePasswordStrength(pw: string): string | null {
  if (pw.length < 8) return 'Das Passwort muss mindestens 8 Zeichen lang sein.'
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) {
    return 'Das Passwort muss Buchstaben und Zahlen enthalten.'
  }
  return null
}

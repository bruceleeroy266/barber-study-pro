'use server'

import { logSecurityEvent } from '@/lib/security/audit-logger'

export async function logFailedLogin(email: string, reason: string): Promise<void> {
  await logSecurityEvent('failed_login', 'failure', reason, {
    email,
    resource: '/login',
    action: 'signInWithPassword',
  })
}

export async function logLogout(userId: string, email?: string | null): Promise<void> {
  await logSecurityEvent('logout', 'success', 'User signed out', {
    userId,
    email,
    resource: '/logout',
    action: 'signOut',
  })
}

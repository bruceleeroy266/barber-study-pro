/**
 * Client-safe authentication access helpers.
 *
 * These functions do NOT import any server-only modules (e.g. next/headers)
 * so they can be used in both client components and middleware.
 */

export type LoginAccessError = 'not_approved' | 'disabled' | 'missing_profile' | 'invalid_role'

export interface LoginAccessProfile {
  role: string | null | undefined
  approval_status: string | null | undefined
  is_disabled: boolean | null | undefined
}

/** Canonical portal routes for each active role. */
const ROLE_PORTAL: Record<string, string> = {
  admin: '/admin',
  school_admin: '/school',
  instructor: '/instructor',
  student: '/dashboard',
  apprentice: '/dashboard',
}

/**
 * Returns the default post-login redirect path for a given role.
 * Used by login flow and middleware to send each user to the right dashboard.
 *
 * Security: unknown or missing roles NEVER default to /admin. They are sent
 * back to login with an invalid_role error so the issue is surfaced and fixed.
 */
export function getRoleBasedRedirect(role: string | null | undefined): string {
  if (!role) {
    return '/login?error=invalid_role'
  }

  const portal = ROLE_PORTAL[role]
  if (!portal) {
    return '/login?error=invalid_role'
  }

  return portal
}

/**
 * Validates whether an authenticated user with a profile may log in.
 * Returns an error key and human-readable message if access is denied.
 */
export function validateLoginAccess(
  profile: LoginAccessProfile | null | undefined
): {
  ok: boolean
  errorKey?: LoginAccessError
  message?: string
} {
  if (!profile) {
    return {
      ok: false,
      errorKey: 'missing_profile',
      message: 'Account profile not found. Please contact support.',
    }
  }

  if (profile.is_disabled) {
    return {
      ok: false,
      errorKey: 'disabled',
      message: 'Your account has been disabled. Contact your administrator.',
    }
  }

  if (profile.approval_status !== 'approved') {
    return {
      ok: false,
      errorKey: 'not_approved',
      message:
        profile.approval_status === 'rejected'
          ? 'Your account request was not approved. Contact your administrator for more information.'
          : 'Your account is pending approval. You will receive access once an administrator approves your request.',
    }
  }

  if (!profile.role || !(profile.role in ROLE_PORTAL)) {
    return {
      ok: false,
      errorKey: 'invalid_role',
      message: 'Your account has an unrecognized role. Please contact support.',
    }
  }

  return { ok: true }
}

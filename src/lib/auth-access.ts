/**
 * Client-safe authentication access helpers.
 *
 * These functions do NOT import any server-only modules (e.g. next/headers)
 * so they can be used in both client components and middleware.
 */

export type LoginAccessError = 'not_approved' | 'disabled' | 'missing_profile'

export interface LoginAccessProfile {
  role: string | null | undefined
  approval_status: string | null | undefined
  is_disabled: boolean | null | undefined
}

/**
 * Returns the default post-login redirect path for a given role.
 * Used by login flow and middleware to send each user to the right dashboard.
 */
export function getRoleBasedRedirect(role: string | null | undefined): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'instructor':
      return '/instructor'
    case 'student':
    case 'apprentice':
    default:
      return '/dashboard'
  }
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

  return { ok: true }
}

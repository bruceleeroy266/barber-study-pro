/**
 * Phase 13B — Server-Side Authorization Helpers
 *
 * Reusable helpers for server components and server actions.
 * These helpers enforce authentication, role checks, and school-scoped
 * access in one place so individual pages cannot drift.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { Permission, hasPermission } from './permissions'
import { logPermissionDenied, logUnauthorizedAccess } from './audit-logger'
import { Profile } from '@/types'

export interface AuthenticatedContext {
  user: { id: string; email?: string | null }
  profile: Profile
}

interface RequireAuthResult {
  user: { id: string; email?: string | null }
  supabase: Awaited<ReturnType<typeof createClient>>
}

/**
 * Require a signed-in user. Redirects to /login if not authenticated.
 * Safe in demo mode because createClient returns a mock demo user.
 */
export async function requireAuth(): Promise<RequireAuthResult> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return { user, supabase }
}

/**
 * Require a signed-in user with a profile. Redirects to /login if not
 * authenticated or /dashboard if the profile is missing.
 */
export async function requireProfile(): Promise<AuthenticatedContext> {
  const { user, supabase } = await requireAuth()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    redirect('/dashboard')
  }

  return {
    user,
    profile: profile as Profile,
  }
}

/**
 * Require a specific permission. Returns the authenticated context on success
 * and redirects/returns null on failure (behavior chosen by caller).
 *
 * For server components, pass `redirectTo` to perform a Next redirect.
 * For server actions, omit `redirectTo` and check the returned value.
 */
export async function requirePermission(
  permission: Permission,
  options: { redirectTo?: string; log?: boolean } = {}
): Promise<AuthenticatedContext | null> {
  const ctx = await requireProfile()

  if (!hasPermission(ctx.profile.role, permission)) {
    if (options.log !== false) {
      await logPermissionDenied(permission, {
        userId: ctx.user.id,
        email: ctx.user.email,
        role: ctx.profile.role,
        schoolId: ctx.profile.school_id,
      })
    }

    if (options.redirectTo) {
      if (options.redirectTo === '/dashboard') {
        redirect('/dashboard')
      }
      redirect(options.redirectTo)
    }

    return null
  }

  return ctx
}

/**
 * Require any of the listed permissions.
 */
export async function requireAnyPermission(
  permissions: Permission[],
  options: { redirectTo?: string; log?: boolean } = {}
): Promise<AuthenticatedContext | null> {
  const ctx = await requireProfile()

  const allowed = permissions.some((p) => hasPermission(ctx.profile.role, p))
  if (!allowed) {
    if (options.log !== false) {
      await logPermissionDenied(permissions.join('|'), {
        userId: ctx.user.id,
        email: ctx.user.email,
        role: ctx.profile.role,
        schoolId: ctx.profile.school_id,
      })
    }

    if (options.redirectTo) {
      redirect(options.redirectTo)
    }
    return null
  }

  return ctx
}

/**
 * Require that the current user belongs to a school.
 * Returns the school id or null if the user is unassigned.
 *
 * Some roles (e.g. apprentice without a school, or a platform admin) may
 * legitimately have no school. Callers decide whether to reject.
 */
export function getUserSchoolId(profile: Profile): string | null {
  return profile.school_id ?? null
}

/**
 * Require that the current user's school matches the target school id.
 * Logs and returns false on mismatch.
 */
export async function requireSameSchool(
  ctx: AuthenticatedContext,
  targetSchoolId: string | null | undefined,
  options: { log?: boolean } = {}
): Promise<boolean> {
  const userSchoolId = getUserSchoolId(ctx.profile)

  if (!targetSchoolId) return true
  if (userSchoolId === targetSchoolId) return true

  if (options.log !== false) {
    await logUnauthorizedAccess('school-scoped resource', {
      userId: ctx.user.id,
      email: ctx.user.email,
      role: ctx.profile.role,
      schoolId: userSchoolId,
      resourceId: targetSchoolId,
      action: 'access',
      metadata: { userSchoolId, targetSchoolId },
    })
  }

  return false
}

/**
 * Require that a target student profile belongs to the current user's school.
 * Useful in server actions that accept a studentId parameter.
 */
export async function requireStudentInSchool(
  ctx: AuthenticatedContext,
  studentId: string
): Promise<Profile | null> {
  const { supabase } = await requireAuth()
  const userSchoolId = getUserSchoolId(ctx.profile)

  const { data: student } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', studentId)
    .in('role', ['student', 'apprentice'])
    .single()

  if (!student) return null

  const studentProfile = student as Profile

  // An instructor/admin must only act on students in their own school.
  if (userSchoolId && studentProfile.school_id !== userSchoolId) {
    await logUnauthorizedAccess('student record', {
      userId: ctx.user.id,
      email: ctx.user.email,
      role: ctx.profile.role,
      schoolId: userSchoolId,
      resourceId: studentId,
      action: 'access',
      metadata: { studentSchoolId: studentProfile.school_id, userSchoolId },
    })
    return null
  }

  return studentProfile
}

/**
 * Re-export client-safe access helpers so server-auth remains a single import
 * point for server components while the helpers stay usable in client code.
 */
export { getRoleBasedRedirect, validateLoginAccess, type LoginAccessError } from '@/lib/auth-access'

/**
 * Validate that a role string is one of the known active roles.
 * Use this on signup / role-assignment paths to reject crafted metadata.
 */
export function sanitizeRole(role: string | null | undefined): 'student' | 'apprentice' | 'instructor' | null {
  if (!role) return null
  // Self-registration is never allowed to create admins or platform roles.
  if (role === 'student' || role === 'apprentice' || role === 'instructor') {
    return role
  }
  return null
}

/**
 * Returns true if the user's role allows them to administer students within
 * the same school. Platform super admin would also return true when added.
 */
export function canManageSchoolUsers(profile: Profile): boolean {
  return hasPermission(profile.role, 'manage_school_users') || hasPermission(profile.role, 'manage_students')
}

/**
 * Auth role helpers used across the app for consistent access control.
 *
 * These helpers centralize role checks so middleware, server components,
 * and client components cannot drift out of sync.
 *
 * Roles defined in the database / types:
 * - 'student'
 * - 'instructor'
 * - 'admin'
 * - 'apprentice'
 */

export type AppRole = 'student' | 'instructor' | 'admin' | 'apprentice'

/** Returns true for instructors and admins (the roles allowed to access /instructor). */
export function isInstructorOrAdmin(role: string | null | undefined): boolean {
  return role === 'instructor' || role === 'admin'
}

/** Returns true only for admins. */
export function isAdmin(role: string | null | undefined): boolean {
  return role === 'admin'
}

/** Returns true for students and apprentices (the learner roles). */
export function isLearner(role: string | null | undefined): boolean {
  return role === 'student' || role === 'apprentice'
}

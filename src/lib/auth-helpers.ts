/**
 * Auth role helpers used across the app for consistent access control.
 *
 * These helpers centralize role checks so middleware, server components,
 * and client components cannot drift out of sync.
 *
 * Phase 13B: the canonical implementation now lives in
 * `@/lib/security/permissions`. This file re-exports the helpers so existing
 * imports continue to work and cannot drift out of sync.
 *
 * Roles defined in the database / types:
 * - 'student'
 * - 'instructor'
 * - 'admin'
 * - 'apprentice'
 */

export {
  type AppRole,
  ACTIVE_ROLES,
  FUTURE_ROLES,
  type FutureRole,
  type KnownRole,
  type Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canAccessRoute,
  isInstructorOrAdmin,
  isAdmin,
  isSchoolAdmin,
  isLearner,
  isKnownRole,
  getRoleDisplayName,
} from './security/permissions'

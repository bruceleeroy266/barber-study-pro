/**
 * Phase 13B — Centralized Role-Based Access Control (RBAC)
 *
 * Single source of truth for roles, permissions, and authorization checks.
 * All middleware, server components, server actions, and client components
 * should import helpers from here to avoid authorization drift.
 */

import { AppRole } from '@/types'

export type { AppRole }

// ============================================================================
// ROLES
// ============================================================================

/** Roles currently active in the platform. */
export const ACTIVE_ROLES: AppRole[] = ['student', 'apprentice', 'instructor', 'admin', 'school_admin']

/** Roles planned for future phases. Kept here for forward compatibility. */
export const FUTURE_ROLES = [
  'admissions',
  'compliance_officer',
  'financial_office',
  'receptionist',
  'teaching_assistant',
  'platform_super_admin',
] as const

export type FutureRole = (typeof FUTURE_ROLES)[number]
export type KnownRole = AppRole | FutureRole

// ============================================================================
// PERMISSIONS
// ============================================================================

export type Permission =
  | 'view_dashboard'
  | 'view_own_progress'
  | 'view_own_grades'
  | 'view_own_compliance'
  | 'view_own_messages'
  | 'view_instructor_portal'
  | 'view_school_students'
  | 'view_school_analytics'
  | 'view_school_reports'
  | 'view_school_compliance'
  | 'view_school_dashboard'
  | 'manage_students'
  | 'manage_instructors'
  | 'manage_attendance'
  | 'manage_gradebook'
  | 'manage_assessments'
  | 'manage_compliance'
  | 'manage_messaging'
  | 'manage_settings'
  | 'manage_school_users'
  | 'view_admin_dashboard'
  | 'view_platform_analytics'
  | 'manage_platform_schools'
  | 'manage_platform_users'
  | 'manage_platform'
  | 'impersonate_users'

// ============================================================================
// ROLE → PERMISSIONS MAPPING
// ============================================================================

const ROLE_PERMISSIONS: Record<KnownRole, Permission[]> = {
  student: ['view_dashboard', 'view_own_progress', 'view_own_grades', 'view_own_compliance', 'view_own_messages'],
  apprentice: ['view_dashboard', 'view_own_progress', 'view_own_grades', 'view_own_compliance', 'view_own_messages'],
  instructor: [
    'view_dashboard',
    'view_instructor_portal',
    'view_school_students',
    'view_school_analytics',
    'view_school_reports',
    'view_school_compliance',
    'manage_students',
    'manage_attendance',
    'manage_gradebook',
    'manage_assessments',
    'manage_compliance',
    'manage_messaging',
  ],
  admin: [
    'view_dashboard',
    'view_instructor_portal',
    'view_school_students',
    'view_school_analytics',
    'view_school_reports',
    'view_school_compliance',
    'view_school_dashboard',
    'view_admin_dashboard',
    'manage_students',
    'manage_instructors',
    'manage_attendance',
    'manage_gradebook',
    'manage_assessments',
    'manage_compliance',
    'manage_messaging',
    'manage_settings',
    'manage_school_users',
    'manage_platform',
  ],
  school_admin: [
    'view_dashboard',
    'view_instructor_portal',
    'view_school_students',
    'view_school_analytics',
    'view_school_reports',
    'view_school_compliance',
    'view_school_dashboard',
    'manage_students',
    'manage_instructors',
    'manage_attendance',
    'manage_gradebook',
    'manage_assessments',
    'manage_compliance',
    'manage_messaging',
    'manage_settings',
    'manage_school_users',
  ],
  admissions: ['view_dashboard', 'view_school_students', 'manage_students', 'view_school_reports'],
  compliance_officer: [
    'view_dashboard',
    'view_instructor_portal',
    'view_school_students',
    'view_school_compliance',
    'view_school_reports',
    'manage_compliance',
  ],
  financial_office: ['view_dashboard', 'view_school_reports', 'view_school_analytics'],
  receptionist: ['view_dashboard', 'view_school_students', 'manage_attendance'],
  teaching_assistant: [
    'view_dashboard',
    'view_instructor_portal',
    'view_school_students',
    'manage_attendance',
    'manage_gradebook',
  ],
  platform_super_admin: [
    'view_dashboard',
    'view_instructor_portal',
    'view_admin_dashboard',
    'view_platform_analytics',
    'manage_platform_schools',
    'manage_platform_users',
    'manage_platform',
    'impersonate_users',
  ],
}

// ============================================================================
// ROUTE ACCESS MAPPING
// ============================================================================

export type ProtectedRoute =
  | '/dashboard'
  | '/dashboard/*'
  | '/instructor'
  | '/instructor/*'
  | '/admin'
  | '/admin/*'
  | '/school'
  | '/school/*'

const ROUTE_PERMISSIONS: Record<ProtectedRoute, Permission[]> = {
  '/dashboard': ['view_dashboard'],
  '/dashboard/*': ['view_dashboard'],
  '/instructor': ['view_instructor_portal'],
  '/instructor/*': ['view_instructor_portal'],
  '/admin': ['view_admin_dashboard'],
  '/admin/*': ['view_admin_dashboard'],
  '/school': ['view_school_dashboard'],
  '/school/*': ['view_school_dashboard'],
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Returns true if the given role has a specific permission.
 * Unknown roles default to no permissions.
 */
export function hasPermission(role: string | null | undefined, permission: Permission): boolean {
  if (!role) return false
  const permissions = ROLE_PERMISSIONS[role as KnownRole]
  if (!permissions) return false
  return permissions.includes(permission)
}

/**
 * Returns true if the role has any of the listed permissions.
 */
export function hasAnyPermission(role: string | null | undefined, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

/**
 * Returns true if the role has all listed permissions.
 */
export function hasAllPermissions(role: string | null | undefined, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

/**
 * Returns the full list of permissions for a role.
 */
export function getRolePermissions(role: string | null | undefined): Permission[] {
  if (!role) return []
  return ROLE_PERMISSIONS[role as KnownRole] ?? []
}

/**
 * Returns true if a role may access a protected route prefix.
 */
export function canAccessRoute(role: string | null | undefined, route: string): boolean {
  if (!role) return false

  const normalizedRoute = route.endsWith('/') && route !== '/' ? route.slice(0, -1) : route

  // Direct prefix matches
  for (const [prefix, perms] of Object.entries(ROUTE_PERMISSIONS)) {
    if (normalizedRoute === prefix || (prefix.endsWith('/*') && normalizedRoute.startsWith(prefix.slice(0, -1)))) {
      return perms.some((p) => hasPermission(role, p))
    }
  }

  return false
}

/**
 * Backward-compatible helpers used by existing middleware and pages.
 */
export function isInstructorOrAdmin(role: string | null | undefined): boolean {
  return hasAnyPermission(role, ['view_instructor_portal'])
}

export function isAdmin(role: string | null | undefined): boolean {
  return hasPermission(role, 'view_admin_dashboard')
}

export function isSchoolAdmin(role: string | null | undefined): boolean {
  return hasPermission(role, 'view_school_dashboard')
}

export function isLearner(role: string | null | undefined): boolean {
  return role === 'student' || role === 'apprentice'
}

/**
 * Returns true if the role is a known active role.
 */
export function isKnownRole(role: string | null | undefined): role is AppRole {
  return !!role && ACTIVE_ROLES.includes(role as AppRole)
}

/**
 * Returns a display label for a role.
 */
export function getRoleDisplayName(role: string | null | undefined): string {
  switch (role) {
    case 'student':
      return 'Student'
    case 'apprentice':
      return 'Apprentice'
    case 'instructor':
      return 'Instructor'
    case 'admin':
      return 'Administrator'
    case 'school_admin':
      return 'School Administrator'
    case 'admissions':
      return 'Admissions'
    case 'compliance_officer':
      return 'Compliance Officer'
    case 'financial_office':
      return 'Financial Office'
    case 'receptionist':
      return 'Receptionist'
    case 'teaching_assistant':
      return 'Teaching Assistant'
    case 'platform_super_admin':
      return 'Platform Super Admin'
    default:
      return 'Unknown'
  }
}

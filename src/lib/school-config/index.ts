import { SchoolConfiguration, Permission, AppRole } from '@/types'

/**
 * Get all permissions assigned to a role.
 */
export function getPermissionsForRole(
  config: SchoolConfiguration,
  role: AppRole
): Permission[] {
  return config.rolePermissions.find((rp) => rp.role === role)?.permissions || []
}

/**
 * Check whether a role has a specific permission.
 */
export function hasPermission(
  config: SchoolConfiguration,
  role: AppRole,
  permission: Permission
): boolean {
  return getPermissionsForRole(config, role).includes(permission)
}

/**
 * Get the active academic programs only.
 */
export function getActivePrograms(config: SchoolConfiguration) {
  return config.programs.filter((p) => p.active)
}

/**
 * Find a program by ID.
 */
export function getProgramById(config: SchoolConfiguration, programId: string) {
  return config.programs.find((p) => p.id === programId)
}

/**
 * Default permission set for new roles (read-only).
 */
export const DEFAULT_PERMISSIONS: Permission[] = ['view_dashboard']

/**
 * All available permissions in the system.
 */
export const ALL_PERMISSIONS: { value: Permission; label: string }[] = [
  { value: 'view_dashboard', label: 'View Dashboard' },
  { value: 'manage_students', label: 'Manage Students' },
  { value: 'manage_instructors', label: 'Manage Instructors' },
  { value: 'manage_attendance', label: 'Manage Attendance' },
  { value: 'manage_gradebook', label: 'Manage Gradebook' },
  { value: 'manage_assessments', label: 'Manage Assessments' },
  { value: 'manage_compliance', label: 'Manage Compliance' },
  { value: 'manage_messaging', label: 'Manage Messaging' },
  { value: 'manage_settings', label: 'Manage School Settings' },
  { value: 'view_reports', label: 'View Reports' },
  { value: 'export_data', label: 'Export Data' },
]

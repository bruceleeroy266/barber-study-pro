'use server'

import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import { AppRole } from '@/types'
import { isKnownRole } from '@/lib/security/permissions'

export interface UserListItem {
  id: string
  email: string
  full_name: string
  role: AppRole
  school_id: string | null
  school_name: string | null
  approval_status: 'pending' | 'approved' | 'rejected'
  is_disabled: boolean
  requires_password_change: boolean
  enrollment_count?: number
  created_at: string
  updated_at: string
}

export interface UserFilters {
  search?: string
  role?: AppRole | 'all'
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'all'
  schoolId?: string | 'all'
  limit?: number
  offset?: number
}

export interface AdminContext {
  userId: string
  email: string
  role: AppRole
  schoolId: string | null
  isPlatformAdmin: boolean
}

export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

interface UserFormData {
  full_name: string
  email: string
  password: string
  role: AppRole
  school_id: string | null
  approval_status: 'pending' | 'approved' | 'rejected'
}

export interface InviteUserFormData {
  full_name: string
  email: string
  role: AppRole
  school_id: string | null
  approval_status: 'pending' | 'approved' | 'rejected'
}

const MANAGEABLE_ROLES: AppRole[] = ['student', 'instructor', 'apprentice', 'admin', 'school_admin']

/**
 * Creates a domain record (student or instructor) for a user profile.
 * This is called AFTER the profile has been successfully created/upserted.
 * 
 * Idempotency: Uses the database UNIQUE(profile_id, school_id) constraint.
 * PostgreSQL error 23505 (unique violation) is treated as success (record already exists).
 * 
 * @param serviceClient - Service-role client (bypasses RLS)
 * @param profileId - The profile/user ID (from auth.users)
 * @param role - The user's role
 * @param schoolId - The authoritative school ID (from validated profile)
 * @returns ActionResult indicating success or failure
 */
async function createDomainRecord(
  serviceClient: ReturnType<typeof createServiceRoleClient>,
  profileId: string,
  role: AppRole,
  schoolId: string | null
): Promise<ActionResult> {
  // Only create domain records for student and instructor roles with a valid school_id
  if (!schoolId || (role !== 'student' && role !== 'instructor')) {
    return { success: true }
  }

  const table = role === 'student' ? 'students' : 'instructors'
  const { error } = await serviceClient.from(table).insert({
    profile_id: profileId,
    school_id: schoolId,
  })

  if (error) {
    // PostgreSQL 23505 = unique_violation (record already exists — idempotent success)
    if (error.code === '23505') {
      return { success: true }
    }
    return { success: false, error: `Failed to create ${role} record: ${error.message}` }
  }

  return { success: true }
}

async function getCurrentAdmin(): Promise<ActionResult<AdminContext>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    return { success: false, error: 'Forbidden' }
  }

  return {
    success: true,
    data: {
      userId: user.id,
      email: user.email ?? '',
      role: profile.role as AppRole,
      schoolId: profile.school_id ?? null,
      isPlatformAdmin: isAdmin(profile.role),
    },
  }
}

async function logUserManagementAction(
  admin: AdminContext,
  targetUserId: string,
  targetEmail: string,
  action: string,
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>,
  schoolId: string | null
): Promise<void> {
  try {
    const serviceClient = createServiceRoleClient()
    await serviceClient.from('user_management_audit_logs').insert({
      actor_id: admin.userId,
      actor_email: admin.email,
      actor_role: admin.role,
      target_user_id: targetUserId,
      target_user_email: targetEmail,
      action,
      old_values: oldValues,
      new_values: newValues,
      school_id: schoolId,
    })
  } catch (err) {
    // Audit logging must never break the action. Log to console for visibility.
    console.error('[USER_MGMT_AUDIT] Failed to write audit log:', err)
  }
}

export async function getSchools(): Promise<ActionResult<{ id: string; name: string }[]>> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data
  const supabase = await createClient()

  let query = supabase.from('schools').select('id, name').order('name')

  if (!admin.isPlatformAdmin && admin.schoolId) {
    query = query.eq('id', admin.schoolId)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data ?? [] }
}

export async function getUsers(filters: UserFilters = {}): Promise<ActionResult<{ users: UserListItem[]; count: number }>> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data
  const supabase = await createClient()

  let countQuery = supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  let dataQuery = supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      role,
      school_id,
      approval_status,
      is_disabled,
      requires_password_change,
      created_at,
      updated_at,
      schools (name)
    `)
    .order('created_at', { ascending: false })

  // School admins are scoped to their own school.
  if (!admin.isPlatformAdmin && admin.schoolId) {
    countQuery = countQuery.eq('school_id', admin.schoolId)
    dataQuery = dataQuery.eq('school_id', admin.schoolId)
  }

  if (filters.role && filters.role !== 'all') {
    countQuery = countQuery.eq('role', filters.role)
    dataQuery = dataQuery.eq('role', filters.role)
  }

  if (filters.approvalStatus && filters.approvalStatus !== 'all') {
    countQuery = countQuery.eq('approval_status', filters.approvalStatus)
    dataQuery = dataQuery.eq('approval_status', filters.approvalStatus)
  }

  if (filters.schoolId && filters.schoolId !== 'all') {
    countQuery = countQuery.eq('school_id', filters.schoolId)
    dataQuery = dataQuery.eq('school_id', filters.schoolId)
  }

  if (filters.search?.trim()) {
    const search = `%${filters.search.trim()}%`
    countQuery = countQuery.or(`email.ilike.${search},full_name.ilike.${search}`)
    dataQuery = dataQuery.or(`email.ilike.${search},full_name.ilike.${search}`)
  }

  const limit = filters.limit ?? 50
  const offset = filters.offset ?? 0
  dataQuery = dataQuery.range(offset, offset + limit - 1)

  const [{ count, error: countError }, { data, error: dataError }] = await Promise.all([
    countQuery,
    dataQuery,
  ])

  if (countError || dataError) {
    return { success: false, error: countError?.message || dataError?.message || 'Failed to load users' }
  }

  const users: UserListItem[] = (data ?? []).map((row: Record<string, unknown>) => {
    const school = row.schools as { name?: string } | null
    return {
      id: String(row.id),
      email: String(row.email),
      full_name: String(row.full_name || ''),
      role: String(row.role) as AppRole,
      school_id: row.school_id ? String(row.school_id) : null,
      school_name: school?.name ?? null,
      approval_status: String(row.approval_status) as 'pending' | 'approved' | 'rejected',
      is_disabled: Boolean(row.is_disabled),
      requires_password_change: Boolean(row.requires_password_change),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }
  })

  // Fetch enrollment counts for students
  const studentProfileIds = users.filter((u) => u.role === 'student').map((u) => u.id)
  if (studentProfileIds.length > 0) {
    const serviceClient = createServiceRoleClient()
    // Resolve profile IDs to canonical student IDs first
    const { data: studentRecords } = await serviceClient
      .from('students')
      .select('id, profile_id')
      .in('profile_id', studentProfileIds)

    if (studentRecords && studentRecords.length > 0) {
      const studentIdToProfileId = new Map<string, string>()
      const canonicalStudentIds: string[] = []
      for (const rec of studentRecords) {
        studentIdToProfileId.set(String(rec.id), String(rec.profile_id))
        canonicalStudentIds.push(String(rec.id))
      }

      const { data: enrollmentCounts } = await serviceClient
        .from('enrollments')
        .select('student_id')
        .in('student_id', canonicalStudentIds)
        .eq('is_active', true)

      if (enrollmentCounts) {
        const countByStudentId = new Map<string, number>()
        for (const row of enrollmentCounts) {
          const sid = String(row.student_id)
          countByStudentId.set(sid, (countByStudentId.get(sid) ?? 0) + 1)
        }
        // Map back to profile IDs
        const countByProfileId = new Map<string, number>()
        for (const [studentId, count] of countByStudentId) {
          const profileId = studentIdToProfileId.get(studentId)
          if (profileId) {
            countByProfileId.set(profileId, count)
          }
        }
        for (const user of users) {
          if (user.role === 'student') {
            user.enrollment_count = countByProfileId.get(user.id) ?? 0
          }
        }
      }
    } else {
      // No student records — set all student enrollment counts to 0
      for (const user of users) {
        if (user.role === 'student') {
          user.enrollment_count = 0
        }
      }
    }
  }

  return { success: true, data: { users, count: count ?? 0 } }
}

export async function getUserById(id: string): Promise<ActionResult<UserListItem>> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      role,
      school_id,
      approval_status,
      is_disabled,
      requires_password_change,
      created_at,
      updated_at,
      schools (name)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return { success: false, error: error?.message || 'User not found' }
  }

  if (!admin.isPlatformAdmin && data.school_id !== admin.schoolId) {
    return { success: false, error: 'Forbidden' }
  }

  const school = data.schools as { name?: string } | null

  return {
    success: true,
    data: {
      id: String(data.id),
      email: String(data.email),
      full_name: String(data.full_name || ''),
      role: String(data.role) as AppRole,
      school_id: data.school_id ? String(data.school_id) : null,
      school_name: school?.name ?? null,
      approval_status: String(data.approval_status) as 'pending' | 'approved' | 'rejected',
      is_disabled: Boolean(data.is_disabled),
      requires_password_change: Boolean(data.requires_password_change),
      created_at: String(data.created_at),
      updated_at: String(data.updated_at),
    },
  }
}

export async function createUser(formData: UserFormData): Promise<ActionResult<{ id: string }>> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data

  // Validate role.
  if (!isKnownRole(formData.role) || !MANAGEABLE_ROLES.includes(formData.role)) {
    return { success: false, error: 'Invalid role' }
  }

  // School admins cannot create admins.
  if (!admin.isPlatformAdmin && (formData.role === 'admin' || formData.role === 'school_admin')) {
    return { success: false, error: 'School admins cannot create administrator accounts' }
  }

  // Validate school assignment.
  if (formData.school_id) {
    if (!admin.isPlatformAdmin && formData.school_id !== admin.schoolId) {
      return { success: false, error: 'Cannot assign user to a different school' }
    }
  }

  const serviceClient = createServiceRoleClient()

  // Prevent duplicate email accounts.
  const { data: existingUsers } = await serviceClient.auth.admin.listUsers()
  if (existingUsers.users.some((u) => u.email?.toLowerCase() === formData.email.toLowerCase())) {
    return { success: false, error: 'An account with this email already exists' }
  }

  // Create auth user with service role.
  const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
    user_metadata: {
      full_name: formData.full_name,
      role: formData.role,
    },
  })

  if (authError || !authData.user) {
    return { success: false, error: authError?.message || 'Failed to create user' }
  }

  // Create profile row.
  const { error: profileError } = await serviceClient.from('profiles').insert({
    id: authData.user.id,
    email: formData.email,
    full_name: formData.full_name,
    role: formData.role,
    school_id: formData.school_id,
    approval_status: formData.approval_status,
    is_disabled: false,
    requires_password_change: true,
  })

  if (profileError) {
    // Best-effort cleanup: delete the auth user if profile insert failed.
    await serviceClient.auth.admin.deleteUser(authData.user.id)
    return { success: false, error: profileError.message }
  }

  // Create domain record (student/instructor) if applicable.
  // This occurs AFTER profile creation succeeds. If domain record creation fails,
  // the profile is preserved (partial success) and the error is reported.
  const domainResult = await createDomainRecord(
    serviceClient,
    authData.user.id,
    formData.role,
    formData.school_id
  )

  if (!domainResult.success) {
    // Partial success: auth user and profile exist, but domain record failed.
    // Do NOT delete the auth user/profile — that would be destructive.
    // Report the error so the admin knows manual intervention may be needed.
    return { success: false, error: domainResult.error }
  }

  await logUserManagementAction(
    admin,
    authData.user.id,
    formData.email,
    'create_user',
    {},
    {
      full_name: formData.full_name,
      role: formData.role,
      school_id: formData.school_id,
      approval_status: formData.approval_status,
      requires_password_change: true,
    },
    formData.school_id
  )

  return { success: true, data: { id: authData.user.id } }
}

/**
 * Returns the canonical site URL for auth redirects.
 * Uses NEXT_PUBLIC_SITE_URL in non-production environments; in production
 * it always returns the approved ascynpro.com origin to prevent redirect
 * manipulation through environment variables.
 */
function getSiteUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return 'https://ascynpro.com'
  }
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000'
}

export async function inviteUser(formData: InviteUserFormData): Promise<ActionResult<{ id: string }>> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data

  // Validate role.
  if (!isKnownRole(formData.role) || !MANAGEABLE_ROLES.includes(formData.role)) {
    return { success: false, error: 'Invalid role' }
  }

  // School admins cannot invite admins.
  if (!admin.isPlatformAdmin && (formData.role === 'admin' || formData.role === 'school_admin')) {
    return { success: false, error: 'School admins cannot create administrator accounts' }
  }

  // Validate school assignment.
  if (formData.school_id) {
    if (!admin.isPlatformAdmin && formData.school_id !== admin.schoolId) {
      return { success: false, error: 'Cannot assign user to a different school' }
    }

    // Verify the school exists and is active.
    const serviceClientForValidation = createServiceRoleClient()
    const { data: school, error: schoolError } = await serviceClientForValidation
      .from('schools')
      .select('id, is_active, deleted_at')
      .eq('id', formData.school_id)
      .single()

    if (schoolError || !school) {
      return { success: false, error: 'Invalid school' }
    }
    if (!school.is_active || school.deleted_at) {
      return { success: false, error: 'School is not active' }
    }
  }

  const serviceClient = createServiceRoleClient()
  const normalizedEmail = formData.email.toLowerCase().trim()

  // Prevent duplicate email accounts in Auth.
  const { data: existingUsers, error: listError } = await serviceClient.auth.admin.listUsers()
  if (listError) {
    return { success: false, error: 'Failed to check existing users' }
  }
  if (existingUsers.users.some((u) => u.email?.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists' }
  }

  // Note: we intentionally do not reject here if a profile row with the same
  // email already exists. The Supabase Auth trigger `on_auth_user_created`
  // creates a profile when `inviteUserByEmail` inserts the auth user, so a
  // pre-invite profile check would always fail. Duplicate *Auth* accounts are
  // still prevented above. The upsert below ensures exactly one profile per
  // invited auth user and overwrites trigger defaults with validated values.

  // Send the invitation email. The user will set their own password.
  const redirectTo = `${getSiteUrl()}/auth/callback`
  const { data: inviteData, error: inviteError } = await serviceClient.auth.admin.inviteUserByEmail(
    normalizedEmail,
    {
      redirectTo,
      data: {
        full_name: formData.full_name,
        role: formData.role,
      },
    }
  )

  if (inviteError || !inviteData.user) {
    return { success: false, error: inviteError?.message || 'Failed to send invitation' }
  }

  // Upsert the profile row. Supabase Auth trigger `on_auth_user_created` already
  // inserts a profile when the auth user is created, but it cannot set
  // school_id or approval_status. Upsert guarantees exactly one profile and
  // safely overwrites the trigger-created defaults with the validated values.
  const { error: profileError } = await serviceClient
    .from('profiles')
    .upsert(
      {
        id: inviteData.user.id,
        email: normalizedEmail,
        full_name: formData.full_name,
        role: formData.role,
        school_id: formData.school_id,
        approval_status: formData.approval_status,
        is_disabled: false,
        requires_password_change: false,
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    // Best-effort cleanup: delete the invited auth user if profile upsert failed.
    await serviceClient.auth.admin.deleteUser(inviteData.user.id)
    return { success: false, error: profileError.message }
  }

  // Create domain record (student/instructor) if applicable.
  // This occurs AFTER profile upsert succeeds. If domain record creation fails,
  // the profile is preserved (partial success) and the error is reported.
  const domainResult = await createDomainRecord(
    serviceClient,
    inviteData.user.id,
    formData.role,
    formData.school_id
  )

  if (!domainResult.success) {
    // Partial success: auth user and profile exist, but domain record failed.
    // Do NOT delete the auth user/profile — that would be destructive.
    // Report the error so the admin knows manual intervention may be needed.
    return { success: false, error: domainResult.error }
  }

  await logUserManagementAction(
    admin,
    inviteData.user.id,
    normalizedEmail,
    'invite_user',
    {},
    {
      full_name: formData.full_name,
      role: formData.role,
      school_id: formData.school_id,
      approval_status: formData.approval_status,
      redirect_to: redirectTo,
    },
    formData.school_id
  )

  return { success: true, data: { id: inviteData.user.id } }
}

export async function updateUserStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<ActionResult> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data
  const serviceClient = createServiceRoleClient()

  const userResult = await getManagedUser(serviceClient, admin, id)
  if (!userResult.success || !userResult.user) {
    return { success: false, error: userResult.error }
  }

  const oldValues = { approval_status: userResult.user.approval_status }
  const newValues = { approval_status: status }

  const { error } = await serviceClient
    .from('profiles')
    .update({
      approval_status: status,
      approved_by: status === 'approved' ? admin.userId : null,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  await logUserManagementAction(admin, id, userResult.user.email, 'update_status', oldValues, newValues, userResult.user.school_id)

  return { success: true }
}

export async function toggleUserDisabled(id: string, isDisabled: boolean): Promise<ActionResult> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data
  const serviceClient = createServiceRoleClient()

  const userResult = await getManagedUser(serviceClient, admin, id)
  if (!userResult.success || !userResult.user) {
    return { success: false, error: userResult.error }
  }

  const oldValues = { is_disabled: userResult.user.is_disabled }
  const newValues = { is_disabled: isDisabled }

  const { error } = await serviceClient
    .from('profiles')
    .update({ is_disabled: isDisabled })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  await logUserManagementAction(admin, id, userResult.user.email, isDisabled ? 'disable_user' : 'enable_user', oldValues, newValues, userResult.user.school_id)

  return { success: true }
}

export async function changeUserRole(id: string, role: AppRole): Promise<ActionResult> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data

  if (!isKnownRole(role) || !MANAGEABLE_ROLES.includes(role)) {
    return { success: false, error: 'Invalid role' }
  }

  const serviceClient = createServiceRoleClient()

  const userResult = await getManagedUser(serviceClient, admin, id)
  if (!userResult.success || !userResult.user) {
    return { success: false, error: userResult.error }
  }

  // School admins cannot promote users to admin or school_admin.
  if (!admin.isPlatformAdmin && (role === 'admin' || role === 'school_admin')) {
    return { success: false, error: 'School admins cannot assign administrator roles' }
  }

  const oldValues = { role: userResult.user.role }
  const newValues = { role }

  const { error: profileError } = await serviceClient
    .from('profiles')
    .update({ role })
    .eq('id', id)

  if (profileError) {
    return { success: false, error: profileError.message }
  }

  // Keep auth user metadata in sync.
  await serviceClient.auth.admin.updateUserById(id, {
    user_metadata: { role },
  })

  await logUserManagementAction(admin, id, userResult.user.email, 'change_role', oldValues, newValues, userResult.user.school_id)

  return { success: true }
}

export async function assignUserSchool(id: string, schoolId: string | null): Promise<ActionResult> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data

  if (!admin.isPlatformAdmin) {
    return { success: false, error: 'School admins cannot move users between schools' }
  }

  const serviceClient = createServiceRoleClient()

  const userResult = await getManagedUser(serviceClient, admin, id)
  if (!userResult.success || !userResult.user) {
    return { success: false, error: userResult.error }
  }

  const oldValues = { school_id: userResult.user.school_id }
  const newValues = { school_id: schoolId }

  const { error } = await serviceClient
    .from('profiles')
    .update({ school_id: schoolId })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  await logUserManagementAction(admin, id, userResult.user.email, 'assign_school', oldValues, newValues, schoolId)

  return { success: true }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data

  // Admins cannot delete their own account through this UI.
  if (id === admin.userId) {
    return { success: false, error: 'You cannot delete your own account' }
  }

  const serviceClient = createServiceRoleClient()

  const userResult = await getManagedUser(serviceClient, admin, id)
  if (!userResult.success || !userResult.user) {
    return { success: false, error: userResult.error }
  }

  // School admins cannot delete platform admins.
  if (!admin.isPlatformAdmin && userResult.user.role === 'admin') {
    return { success: false, error: 'School admins cannot delete platform administrators' }
  }

  const oldValues = {
    email: userResult.user.email,
    role: userResult.user.role,
    school_id: userResult.user.school_id,
    approval_status: userResult.user.approval_status,
    is_disabled: userResult.user.is_disabled,
  }

  // Delete the Auth user. The profiles table has `on delete cascade` to
  // auth.users, so the profile row and any cascade-linked operational records
  // are cleaned up automatically.
  const { error: deleteError } = await serviceClient.auth.admin.deleteUser(id)

  if (deleteError) {
    return { success: false, error: deleteError.message }
  }

  await logUserManagementAction(admin, id, userResult.user.email, 'delete_user', oldValues, {}, userResult.user.school_id)

  return { success: true }
}

export async function requirePasswordChange(id: string): Promise<ActionResult> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data
  const serviceClient = createServiceRoleClient()

  const userResult = await getManagedUser(serviceClient, admin, id)
  if (!userResult.success || !userResult.user) {
    return { success: false, error: userResult.error }
  }

  const oldValues = { requires_password_change: userResult.user.requires_password_change }
  const newValues = { requires_password_change: true }

  const { error } = await serviceClient
    .from('profiles')
    .update({ requires_password_change: true })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  await logUserManagementAction(admin, id, userResult.user.email, 'require_password_change', oldValues, newValues, userResult.user.school_id)

  return { success: true }
}

export async function resetUserPassword(id: string, newPassword: string): Promise<ActionResult> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data
  const serviceClient = createServiceRoleClient()

  const userResult = await getManagedUser(serviceClient, admin, id)
  if (!userResult.success || !userResult.user) {
    return { success: false, error: userResult.error }
  }

  if (newPassword.length < 8 || newPassword.length > 72) {
    return { success: false, error: 'Password must be between 8 and 72 characters' }
  }

  const { error } = await serviceClient.auth.admin.updateUserById(id, {
    password: newPassword,
    email_confirm: true,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Force password change on next login.
  await serviceClient.from('profiles').update({ requires_password_change: true }).eq('id', id)

  await logUserManagementAction(
    admin,
    id,
    userResult.user.email,
    'reset_password',
    { requires_password_change: userResult.user.requires_password_change },
    { requires_password_change: true },
    userResult.user.school_id
  )

  return { success: true }
}

// ─── Phase 7A Slice 4: Enrollment Management ──────────────────────────────────

export interface EnrollmentRecord {
  id: string
  student_id: string
  program_id: string
  program_name: string | null
  start_date: string
  expected_end_date: string | null
  status: 'active' | 'completed' | 'withdrawn' | 'on_hold'
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProgramOption {
  id: string
  name: string
  school_id: string
}

/**
 * Validates that a string is a valid UUID format.
 */
function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

/**
 * Resolve the canonical students.id from a profile ID.
 * Returns the student row if found, or an error if the Slice 3 domain record is missing.
 */
async function resolveStudentDomainRecord(
  serviceClient: ReturnType<typeof createServiceRoleClient>,
  profileId: string
): Promise<{ success: boolean; student?: { id: string; profile_id: string; school_id: string }; error?: string }> {
  if (!isValidUuid(profileId)) {
    return { success: false, error: 'Invalid student identifier format' }
  }

  const { data, error } = await serviceClient
    .from('students')
    .select('id, profile_id, school_id')
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return { success: false, error: 'Student domain record not found. The student may not have completed onboarding.' }
  }

  return {
    success: true,
    student: {
      id: String(data.id),
      profile_id: String(data.profile_id),
      school_id: String(data.school_id),
    },
  }
}

/**
 * Verify a program exists, is active, not deleted, and belongs to the expected school.
 */
async function validateProgram(
  serviceClient: ReturnType<typeof createServiceRoleClient>,
  programId: string,
  expectedSchoolId: string
): Promise<{ success: boolean; program?: { id: string; name: string; school_id: string }; error?: string }> {
  if (!isValidUuid(programId)) {
    return { success: false, error: 'Invalid program identifier format' }
  }

  const { data, error } = await serviceClient
    .from('programs')
    .select('id, name, school_id, is_active, deleted_at')
    .eq('id', programId)
    .single()

  if (error || !data) {
    return { success: false, error: 'Program not found' }
  }

  if (!data.is_active || data.deleted_at) {
    return { success: false, error: 'Program is no longer available' }
  }

  if (String(data.school_id) !== expectedSchoolId) {
    return { success: false, error: 'Program does not belong to the student\'s school' }
  }

  return {
    success: true,
    program: {
      id: String(data.id),
      name: String(data.name),
      school_id: String(data.school_id),
    },
  }
}

export async function enrollStudent(
  studentProfileId: string,
  programId: string,
  startDate?: string,
  expectedEndDate?: string,
  notes?: string
): Promise<ActionResult<{ enrollmentId: string }>> {
  // 1. Verify caller authorization
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }
  const admin = adminResult.data

  const serviceClient = createServiceRoleClient()

  // 2. Resolve canonical students.id from profile ID
  const studentResult = await resolveStudentDomainRecord(serviceClient, studentProfileId)
  if (!studentResult.success || !studentResult.student) {
    return { success: false, error: studentResult.error }
  }
  const student = studentResult.student

  // 3. Tenant boundary: school_admin can only enroll students in their own school
  if (!admin.isPlatformAdmin && student.school_id !== admin.schoolId) {
    return { success: false, error: 'Forbidden: student belongs to a different school' }
  }

  // 4. Validate program exists, is active, and belongs to the same school
  const programResult = await validateProgram(serviceClient, programId, student.school_id)
  if (!programResult.success || !programResult.program) {
    return { success: false, error: programResult.error }
  }

  // 5. Insert enrollment — UNIQUE(student_id, program_id) prevents duplicates
  const { data: enrollmentData, error: insertError } = await serviceClient
    .from('enrollments')
    .insert({
      student_id: student.id,
      program_id: programId,
      start_date: startDate || new Date().toISOString().split('T')[0],
      expected_end_date: expectedEndDate || null,
      status: 'active',
      notes: notes || null,
    })
    .select('id')
    .single()

  if (insertError) {
    // PostgreSQL 23505 = unique_violation → student already enrolled in this program
    if (insertError.code === '23505') {
      return { success: false, error: 'Student is already enrolled in this program' }
    }
    return { success: false, error: `Failed to create enrollment: ${insertError.message}` }
  }

  // 6. Audit log (non-blocking)
  await logUserManagementAction(
    admin,
    studentProfileId,
    '',
    'enroll_student',
    {},
    {
      student_id: student.id,
      program_id: programId,
      program_name: programResult.program.name,
      start_date: startDate || new Date().toISOString().split('T')[0],
      status: 'active',
    },
    student.school_id
  )

  return { success: true, data: { enrollmentId: String(enrollmentData.id) } }
}

export async function unenrollStudent(
  enrollmentId: string
): Promise<ActionResult> {
  // 1. Verify caller authorization
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }
  const admin = adminResult.data

  if (!isValidUuid(enrollmentId)) {
    return { success: false, error: 'Invalid enrollment identifier format' }
  }

  const serviceClient = createServiceRoleClient()

  // 2. Fetch the enrollment with student and program info for tenant verification
  const { data: enrollment, error: fetchError } = await serviceClient
    .from('enrollments')
    .select('id, student_id, program_id, status, is_active, students!inner(profile_id, school_id)')
    .eq('id', enrollmentId)
    .single()

  if (fetchError || !enrollment) {
    return { success: false, error: 'Enrollment not found' }
  }

  const studentInfo = enrollment.students as unknown as { profile_id: string; school_id: string }

  // 3. Tenant boundary: school_admin can only unenroll students in their own school
  if (!admin.isPlatformAdmin && String(studentInfo.school_id) !== admin.schoolId) {
    return { success: false, error: 'Forbidden: enrollment belongs to a different school' }
  }

  // 4. Check enrollment is currently active
  if (!enrollment.is_active || enrollment.status === 'withdrawn') {
    return { success: false, error: 'Enrollment is already withdrawn or inactive' }
  }

  // 5. Update enrollment to withdrawn status
  const { error: updateError } = await serviceClient
    .from('enrollments')
    .update({
      status: 'withdrawn',
      is_active: false,
    })
    .eq('id', enrollmentId)

  if (updateError) {
    return { success: false, error: `Failed to withdraw enrollment: ${updateError.message}` }
  }

  // 6. Audit log (non-blocking)
  await logUserManagementAction(
    admin,
    String(studentInfo.profile_id),
    '',
    'unenroll_student',
    { status: enrollment.status, is_active: enrollment.is_active },
    { status: 'withdrawn', is_active: false },
    String(studentInfo.school_id)
  )

  return { success: true }
}

export async function getStudentEnrollments(
  studentProfileId: string
): Promise<ActionResult<EnrollmentRecord[]>> {
  // 1. Verify caller authorization
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }
  const admin = adminResult.data

  const serviceClient = createServiceRoleClient()

  // 2. Resolve canonical students.id from profile ID
  const studentResult = await resolveStudentDomainRecord(serviceClient, studentProfileId)
  if (!studentResult.success || !studentResult.student) {
    return { success: false, error: studentResult.error }
  }
  const student = studentResult.student

  // 3. Tenant boundary: school_admin can only view enrollments for students in their own school
  if (!admin.isPlatformAdmin && student.school_id !== admin.schoolId) {
    return { success: false, error: 'Forbidden: student belongs to a different school' }
  }

  // 4. Fetch enrollments with program names
  const { data, error } = await serviceClient
    .from('enrollments')
    .select('id, student_id, program_id, start_date, expected_end_date, status, notes, is_active, created_at, updated_at, programs!inner(name)')
    .eq('student_id', student.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: `Failed to fetch enrollments: ${error.message}` }
  }

  const enrollments: EnrollmentRecord[] = (data ?? []).map((row: Record<string, unknown>) => {
    const program = row.programs as { name?: string } | null
    return {
      id: String(row.id),
      student_id: String(row.student_id),
      program_id: String(row.program_id),
      program_name: program?.name ?? null,
      start_date: String(row.start_date),
      expected_end_date: row.expected_end_date ? String(row.expected_end_date) : null,
      status: String(row.status) as EnrollmentRecord['status'],
      notes: row.notes ? String(row.notes) : null,
      is_active: Boolean(row.is_active),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }
  })

  return { success: true, data: enrollments }
}

export async function getSchoolPrograms(): Promise<ActionResult<ProgramOption[]>> {
  // 1. Verify caller authorization
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }
  const admin = adminResult.data

  const serviceClient = createServiceRoleClient()

  let query = serviceClient
    .from('programs')
    .select('id, name, school_id')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name')

  // School admins only see their own school's programs
  if (!admin.isPlatformAdmin && admin.schoolId) {
    query = query.eq('school_id', admin.schoolId)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, error: `Failed to fetch programs: ${error.message}` }
  }

  const programs: ProgramOption[] = (data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id),
    name: String(row.name),
    school_id: String(row.school_id),
  }))

  return { success: true, data: programs }
}

interface ManagedUser {
  id: string
  email: string
  role: AppRole
  school_id: string | null
  approval_status: 'pending' | 'approved' | 'rejected'
  is_disabled: boolean
  requires_password_change: boolean
}

async function getManagedUser(
  serviceClient: ReturnType<typeof createServiceRoleClient>,
  admin: AdminContext,
  id: string
): Promise<{ success: boolean; user?: ManagedUser; error?: string }> {
  const { data, error } = await serviceClient
    .from('profiles')
    .select('id, email, role, school_id, approval_status, is_disabled, requires_password_change')
    .eq('id', id)
    .single()

  if (error || !data) {
    return { success: false, error: error?.message || 'User not found' }
  }

  if (!admin.isPlatformAdmin && data.school_id !== admin.schoolId) {
    return { success: false, error: 'Forbidden' }
  }

  return {
    success: true,
    user: {
      id: String(data.id),
      email: String(data.email),
      role: String(data.role) as AppRole,
      school_id: data.school_id ? String(data.school_id) : null,
      approval_status: String(data.approval_status) as 'pending' | 'approved' | 'rejected',
      is_disabled: Boolean(data.is_disabled),
      requires_password_change: Boolean(data.requires_password_change),
    },
  }
}

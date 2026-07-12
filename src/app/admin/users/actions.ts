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

const MANAGEABLE_ROLES: AppRole[] = ['student', 'instructor', 'apprentice', 'admin', 'school_admin']

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

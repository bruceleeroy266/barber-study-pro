'use server'

import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import { logPermissionDenied } from '@/lib/security/audit-logger'

// ============================================================================
// TYPES
// ============================================================================

export interface ProgramListItem {
  id: string
  name: string
  description: string | null
  required_hours: number
  required_assessments: number
  required_practicals: number
  duration_weeks: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateProgramInput {
  name: string
  description?: string | null
  required_hours?: number
  required_assessments?: number
  required_practicals?: number
  duration_weeks?: number | null
}

export interface UpdateProgramInput {
  name?: string
  description?: string | null
  required_hours?: number
  required_assessments?: number
  required_practicals?: number
  duration_weeks?: number | null
}

export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

interface AdminContext {
  userId: string
  email: string
  role: string
  schoolId: string | null
  isPlatformAdmin: boolean
}

// ============================================================================
// AUTHORIZATION
// ============================================================================

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
      role: profile.role,
      schoolId: profile.school_id ?? null,
      isPlatformAdmin: isAdmin(profile.role),
    },
  }
}

function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

// ============================================================================
// GET PROGRAMS
// ============================================================================

/**
 * Returns all non-deleted programs for the caller's school.
 * Platform admins without a school_id see all programs (for platform management).
 * School admins are scoped to their own school.
 *
 * Tenant boundary: school_id is derived server-side from the caller's profile.
 * Never trusts client-provided school_id.
 */
export async function getPrograms(): Promise<ActionResult<ProgramListItem[]>> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data
  const serviceClient = createServiceRoleClient()

  let query = serviceClient
    .from('programs')
    .select('id, name, description, required_hours, required_assessments, required_practicals, duration_weeks, is_active, created_at, updated_at')
    .is('deleted_at', null)
    .order('name')

  // Tenant boundary: school_admin can only see their own school's programs.
  // Platform admin (school_id IS NULL) can see all programs.
  if (!admin.isPlatformAdmin && admin.schoolId) {
    query = query.eq('school_id', admin.schoolId)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, error: `Failed to fetch programs: ${error.message}` }
  }

  const programs: ProgramListItem[] = (data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    required_hours: Number(row.required_hours),
    required_assessments: Number(row.required_assessments),
    required_practicals: Number(row.required_practicals),
    duration_weeks: row.duration_weeks !== null ? Number(row.duration_weeks) : null,
    is_active: Boolean(row.is_active),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    deleted_at: null,
  }))

  return { success: true, data: programs }
}

// ============================================================================
// CREATE PROGRAM
// ============================================================================

/**
 * Creates a new program for the caller's school.
 *
 * Authorization: admin or school_admin only.
 * Tenant boundary: school_id is derived server-side from the caller's profile.
 * Duplicate prevention: UNIQUE(school_id, name) constraint enforces per-school uniqueness.
 * Lifecycle: created as active by default; deleted_at is null.
 *
 * Future compatibility: preserves schema compatibility for student clock-hour tracking
 * (required_hours field is the program-level requirement; per-student earned hours
 * will be tracked in a separate enrollment_hours or student_hours table in a future slice).
 */
export async function createProgram(
  input: CreateProgramInput
): Promise<ActionResult<{ id: string }>> {
  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data

  // Caller must be assigned to a school to create programs.
  if (!admin.schoolId) {
    return { success: false, error: 'You must be assigned to a school to create programs.' }
  }

  // Validate input
  const name = input.name?.trim()
  if (!name || name.length === 0) {
    return { success: false, error: 'Program name is required.' }
  }
  if (name.length > 200) {
    return { success: false, error: 'Program name must not exceed 200 characters.' }
  }

  const requiredHours = input.required_hours ?? 1500
  if (!Number.isFinite(requiredHours) || requiredHours < 0 || requiredHours > 99999) {
    return { success: false, error: 'Required hours must be between 0 and 99,999.' }
  }

  const requiredAssessments = input.required_assessments ?? 0
  if (!Number.isFinite(requiredAssessments) || requiredAssessments < 0 || requiredAssessments > 99999) {
    return { success: false, error: 'Required assessments must be between 0 and 99,999.' }
  }

  const requiredPracticals = input.required_practicals ?? 0
  if (!Number.isFinite(requiredPracticals) || requiredPracticals < 0 || requiredPracticals > 99999) {
    return { success: false, error: 'Required practicals must be between 0 and 99,999.' }
  }

  const durationWeeks = input.duration_weeks ?? null
  if (durationWeeks !== null && (!Number.isFinite(durationWeeks) || durationWeeks < 0 || durationWeeks > 520)) {
    return { success: false, error: 'Duration weeks must be between 0 and 520.' }
  }

  const description = input.description?.trim() ?? null
  if (description !== null && description.length > 2000) {
    return { success: false, error: 'Description must not exceed 2,000 characters.' }
  }

  const serviceClient = createServiceRoleClient()

  const { data, error } = await serviceClient
    .from('programs')
    .insert({
      school_id: admin.schoolId,
      name,
      description,
      required_hours: requiredHours,
      required_assessments: requiredAssessments,
      required_practicals: requiredPracticals,
      duration_weeks: durationWeeks,
      is_active: true,
      deleted_at: null,
    })
    .select('id')
    .single()

  if (error) {
    // PostgreSQL 23505 = unique_violation (duplicate name within school)
    if (error.code === '23505') {
      return { success: false, error: `A program named "${name}" already exists at this school.` }
    }
    return { success: false, error: `Failed to create program: ${error.message}` }
  }

  if (!data) {
    return { success: false, error: 'Program was created but no ID was returned.' }
  }

  return { success: true, data: { id: String(data.id) } }
}

// ============================================================================
// UPDATE PROGRAM
// ============================================================================

/**
 * Updates an existing program's fields.
 *
 * Authorization: admin or school_admin only.
 * Tenant boundary: verifies the program belongs to the caller's school before updating.
 * Duplicate prevention: UNIQUE(school_id, name) prevents renaming to an existing program name.
 * Lifecycle: cannot update a soft-deleted program.
 */
export async function updateProgram(
  programId: string,
  input: UpdateProgramInput
): Promise<ActionResult> {
  if (!isValidUUID(programId)) {
    return { success: false, error: 'Invalid program identifier format.' }
  }

  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data

  if (!admin.schoolId && !admin.isPlatformAdmin) {
    return { success: false, error: 'You must be assigned to a school to update programs.' }
  }

  const serviceClient = createServiceRoleClient()

  // Fetch the program to verify tenant boundary and that it's not deleted.
  const { data: program, error: fetchError } = await serviceClient
    .from('programs')
    .select('id, school_id, name, deleted_at')
    .eq('id', programId)
    .single()

  if (fetchError || !program) {
    return { success: false, error: 'Program not found.' }
  }

  // Tenant boundary: school_admin can only update programs in their own school.
  if (!admin.isPlatformAdmin && program.school_id !== admin.schoolId) {
    await logPermissionDenied('update_program', {
      userId: admin.userId,
      email: admin.email,
      role: admin.role,
      schoolId: admin.schoolId,
      resource: programId,
      action: 'update',
    })
    return { success: false, error: 'Forbidden: program belongs to a different school.' }
  }

  // Lifecycle: cannot update a soft-deleted program.
  if (program.deleted_at !== null) {
    return { success: false, error: 'Cannot update a deleted program.' }
  }

  // Build update payload — only include fields that were explicitly provided.
  const updatePayload: Record<string, unknown> = {}

  if (input.name !== undefined) {
    const name = input.name.trim()
    if (name.length === 0) {
      return { success: false, error: 'Program name cannot be empty.' }
    }
    if (name.length > 200) {
      return { success: false, error: 'Program name must not exceed 200 characters.' }
    }
    updatePayload.name = name
  }

  if (input.description !== undefined) {
    const description = input.description?.trim() ?? null
    if (description !== null && description.length > 2000) {
      return { success: false, error: 'Description must not exceed 2,000 characters.' }
    }
    updatePayload.description = description
  }

  if (input.required_hours !== undefined) {
    if (!Number.isFinite(input.required_hours) || input.required_hours < 0 || input.required_hours > 99999) {
      return { success: false, error: 'Required hours must be between 0 and 99,999.' }
    }
    updatePayload.required_hours = input.required_hours
  }

  if (input.required_assessments !== undefined) {
    if (!Number.isFinite(input.required_assessments) || input.required_assessments < 0 || input.required_assessments > 99999) {
      return { success: false, error: 'Required assessments must be between 0 and 99,999.' }
    }
    updatePayload.required_assessments = input.required_assessments
  }

  if (input.required_practicals !== undefined) {
    if (!Number.isFinite(input.required_practicals) || input.required_practicals < 0 || input.required_practicals > 99999) {
      return { success: false, error: 'Required practicals must be between 0 and 99,999.' }
    }
    updatePayload.required_practicals = input.required_practicals
  }

  if (input.duration_weeks !== undefined) {
    if (input.duration_weeks !== null && (!Number.isFinite(input.duration_weeks) || input.duration_weeks < 0 || input.duration_weeks > 520)) {
      return { success: false, error: 'Duration weeks must be between 0 and 520.' }
    }
    updatePayload.duration_weeks = input.duration_weeks
  }

  // If no fields were provided, return early.
  if (Object.keys(updatePayload).length === 0) {
    return { success: true }
  }

  const { error } = await serviceClient
    .from('programs')
    .update(updatePayload)
    .eq('id', programId)

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'A program with that name already exists at this school.' }
    }
    return { success: false, error: `Failed to update program: ${error.message}` }
  }

  return { success: true }
}

// ============================================================================
// DEACTIVATE PROGRAM
// ============================================================================

/**
 * Soft-deletes (deactivates) a program by setting deleted_at = now() and is_active = false.
 *
 * Authorization: admin or school_admin only.
 * Tenant boundary: verifies the program belongs to the caller's school.
 * Lifecycle: idempotent — calling deactivate on an already-deleted program succeeds.
 * Safety: soft-delete only; never hard-deletes to preserve enrollment history integrity.
 */
export async function deactivateProgram(programId: string): Promise<ActionResult> {
  if (!isValidUUID(programId)) {
    return { success: false, error: 'Invalid program identifier format.' }
  }

  const adminResult = await getCurrentAdmin()
  if (!adminResult.success || !adminResult.data) {
    return { success: false, error: adminResult.error }
  }

  const admin = adminResult.data

  if (!admin.schoolId && !admin.isPlatformAdmin) {
    return { success: false, error: 'You must be assigned to a school to deactivate programs.' }
  }

  const serviceClient = createServiceRoleClient()

  // Fetch the program to verify tenant boundary.
  const { data: program, error: fetchError } = await serviceClient
    .from('programs')
    .select('id, school_id, deleted_at')
    .eq('id', programId)
    .single()

  if (fetchError || !program) {
    return { success: false, error: 'Program not found.' }
  }

  // Tenant boundary
  if (!admin.isPlatformAdmin && program.school_id !== admin.schoolId) {
    await logPermissionDenied('deactivate_program', {
      userId: admin.userId,
      email: admin.email,
      role: admin.role,
      schoolId: admin.schoolId,
      resource: programId,
      action: 'deactivate',
    })
    return { success: false, error: 'Forbidden: program belongs to a different school.' }
  }

  // Idempotent: already deleted is a no-op success.
  if (program.deleted_at !== null) {
    return { success: true }
  }

  const { error } = await serviceClient
    .from('programs')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
    })
    .eq('id', programId)

  if (error) {
    return { success: false, error: `Failed to deactivate program: ${error.message}` }
  }

  return { success: true }
}

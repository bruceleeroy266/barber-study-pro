'use server'

import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { logPermissionDenied, logUnauthorizedAccess, logSecurityEvent } from '@/lib/security/audit-logger'

export interface StudentActionResult {
  success: boolean
  message: string
}

/**
 * Shared guard: verifies the caller is authenticated, has an instructor/admin
 * role, and that the target student belongs to the caller's school.
 * Returns the caller's profile and the target student on success, or an
 * error result on failure.
 */
async function verifyStudentManagementAccess(
  studentId: string,
  action: string
): Promise<
  | { error: StudentActionResult; profile: null; student: null }
  | { error: null; profile: { id: string; role: string; school_id: string | null; email?: string | null }; student: { id: string; school_id: string | null; role: string; email?: string | null; full_name?: string | null } }
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: { success: false, message: 'You must be signed in to manage students.' },
      profile: null,
      student: null,
    }
  }

  // Fetch caller profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, school_id, email')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    await logPermissionDenied('manage_students', {
      userId: user.id,
      email: user.email,
      role: profile?.role ?? null,
      schoolId: profile?.school_id ?? null,
      resource: 'student_management',
      action,
    })
    return {
      error: { success: false, message: 'Only instructors and admins can manage students.' },
      profile: null,
      student: null,
    }
  }

  if (!profile.school_id) {
    return {
      error: { success: false, message: 'You must be assigned to a school to manage students.' },
      profile: null,
      student: null,
    }
  }

  // Fetch target student — must be a student/apprentice in the same school
  const { data: student } = await supabase
    .from('profiles')
    .select('id, school_id, role, email, full_name')
    .eq('id', studentId)
    .in('role', ['student', 'apprentice'])
    .single()

  if (!student) {
    return {
      error: { success: false, message: 'Student not found.' },
      profile: null,
      student: null,
    }
  }

  if (student.school_id !== profile.school_id) {
    await logUnauthorizedAccess('student record', {
      userId: user.id,
      email: user.email,
      role: profile.role,
      schoolId: profile.school_id,
      resourceId: studentId,
      action,
      metadata: { studentSchoolId: student.school_id },
    })
    return {
      error: { success: false, message: 'You can only manage students in your school.' },
      profile: null,
      student: null,
    }
  }

  return { error: null, profile: { ...profile, email: user.email }, student }
}

/**
 * Approve a pending student.
 * Sets approval_status = 'approved', approved_by = caller id, approved_at = now.
 */
export async function approveStudent(studentId: string): Promise<StudentActionResult> {
  const { error, profile, student } = await verifyStudentManagementAccess(studentId, 'approve_student')
  if (error) return error

  const supabase = await createClient()
  const now = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      approval_status: 'approved',
      approved_by: profile!.id,
      approved_at: now,
      updated_at: now,
    })
    .eq('id', studentId)

  if (updateError) {
    return { success: false, message: updateError.message }
  }

  await logSecurityEvent('sensitive_config_change', 'success', `Student approved: ${student!.email ?? studentId}`, {
    userId: profile!.id,
    email: profile!.email,
    role: profile!.role,
    schoolId: profile!.school_id,
    resource: 'student_management',
    resourceId: studentId,
    action: 'approve_student',
    metadata: { studentEmail: student!.email, studentName: student!.full_name },
  })

  return { success: true, message: `${student!.full_name ?? 'Student'} has been approved.` }
}

/**
 * Reject a pending student.
 * Sets approval_status = 'rejected'.
 */
export async function rejectStudent(studentId: string): Promise<StudentActionResult> {
  const { error, profile, student } = await verifyStudentManagementAccess(studentId, 'reject_student')
  if (error) return error

  const supabase = await createClient()
  const now = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      approval_status: 'rejected',
      updated_at: now,
    })
    .eq('id', studentId)

  if (updateError) {
    return { success: false, message: updateError.message }
  }

  await logSecurityEvent('sensitive_config_change', 'success', `Student rejected: ${student!.email ?? studentId}`, {
    userId: profile!.id,
    email: profile!.email,
    role: profile!.role,
    schoolId: profile!.school_id,
    resource: 'student_management',
    resourceId: studentId,
    action: 'reject_student',
    metadata: { studentEmail: student!.email, studentName: student!.full_name },
  })

  return { success: true, message: `${student!.full_name ?? 'Student'} has been rejected.` }
}

/**
 * Disable a student account.
 * Sets is_disabled = true.
 */
export async function disableStudent(studentId: string): Promise<StudentActionResult> {
  const { error, profile, student } = await verifyStudentManagementAccess(studentId, 'disable_student')
  if (error) return error

  const supabase = await createClient()
  const now = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      is_disabled: true,
      updated_at: now,
    })
    .eq('id', studentId)

  if (updateError) {
    return { success: false, message: updateError.message }
  }

  await logSecurityEvent('sensitive_config_change', 'success', `Student disabled: ${student!.email ?? studentId}`, {
    userId: profile!.id,
    email: profile!.email,
    role: profile!.role,
    schoolId: profile!.school_id,
    resource: 'student_management',
    resourceId: studentId,
    action: 'disable_student',
    metadata: { studentEmail: student!.email, studentName: student!.full_name },
  })

  return { success: true, message: `${student!.full_name ?? 'Student'} has been disabled.` }
}

/**
 * Enable a previously disabled student account.
 * Sets is_disabled = false.
 */
export async function enableStudent(studentId: string): Promise<StudentActionResult> {
  const { error, profile, student } = await verifyStudentManagementAccess(studentId, 'enable_student')
  if (error) return error

  const supabase = await createClient()
  const now = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      is_disabled: false,
      updated_at: now,
    })
    .eq('id', studentId)

  if (updateError) {
    return { success: false, message: updateError.message }
  }

  await logSecurityEvent('sensitive_config_change', 'success', `Student enabled: ${student!.email ?? studentId}`, {
    userId: profile!.id,
    email: profile!.email,
    role: profile!.role,
    schoolId: profile!.school_id,
    resource: 'student_management',
    resourceId: studentId,
    action: 'enable_student',
    metadata: { studentEmail: student!.email, studentName: student!.full_name },
  })

  return { success: true, message: `${student!.full_name ?? 'Student'} has been enabled.` }
}

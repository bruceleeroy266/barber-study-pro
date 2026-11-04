'use server'

import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { logPermissionDenied, logUnauthorizedAccess } from '@/lib/security/audit-logger'
import { resolveSupportAccessContext, logSupportAction } from '@/lib/support-access'
import { Grade } from '@/types'
import {
  mapGradeFromDb,
  mapGradeToDb,
} from '@/lib/mappers/operational-data-mappers'

export interface SaveGradeResult {
  success: boolean
  message: string
  grade?: Grade
}

export async function saveGrade(
  grade: Omit<Grade, 'id'> & { id?: string }
): Promise<SaveGradeResult> {
  const supabase = await createClient()
  const context = await resolveSupportAccessContext()
  if (!context) {
    return { success: false, message: 'You must be signed in to save a grade.' }
  }

  const profile = context.effectiveProfile
  const user = { id: context.actorUserId, email: context.actorEmail }

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    await logPermissionDenied('manage_gradebook', {
      userId: user.id,
      email: user.email,
      role: profile?.role ?? null,
      schoolId: profile?.school_id ?? null,
      resource: 'grades',
      action: 'save',
    })
    return { success: false, message: 'Only instructors and admins can save grades.' }
  }

  if (!profile.school_id) {
    return { success: false, message: 'Your account is not assigned to a school.' }
  }

  if (profile.role === 'instructor') {
    const { data: assignment } = await supabase
      .from('student_instructor_assignments')
      .select('student_id')
      .eq('school_id', profile.school_id)
      .eq('instructor_id', profile.id)
      .eq('student_id', grade.studentId)
      .eq('is_active', true)
      .is('ended_at', null)
      .maybeSingle()

    if (!assignment) {
      return { success: false, message: 'This student is not assigned to the selected instructor.' }
    }
  }

  // Verify student belongs to actor's school
  const { data: student } = await supabase
    .from('profiles')
    .select('school_id')
    .eq('id', grade.studentId)
    .in('role', ['student', 'apprentice'])
    .single()

  if (!student || student.school_id !== profile.school_id) {
    await logUnauthorizedAccess('student record', {
      userId: user.id,
      email: user.email,
      role: profile.role,
      schoolId: profile.school_id,
      resourceId: grade.studentId,
      action: 'save_grade',
      metadata: { studentSchoolId: student?.school_id },
    })
    return { success: false, message: 'Student does not belong to your school.' }
  }

  // Verify grade category belongs to actor's school or is global
  const { data: category } = await supabase
    .from('grade_categories')
    .select('school_id')
    .eq('id', grade.categoryId)
    .single()

  if (!category) {
    return { success: false, message: 'Grade category not found.' }
  }

  if (category.school_id !== null && category.school_id !== profile.school_id) {
    await logUnauthorizedAccess('grade category', {
      userId: user.id,
      email: user.email,
      role: profile.role,
      schoolId: profile.school_id,
      resourceId: grade.categoryId,
      action: 'save_grade',
    })
    return { success: false, message: 'Grade category does not belong to your school.' }
  }

  const now = new Date().toISOString()
  const payload = {
    ...mapGradeToDb(grade),
    school_id: profile.school_id,
    instructor_id: profile.id,
    instructor_name: profile.full_name || profile.email || 'Instructor',
    date_modified: now,
  }

  try {
    if (grade.id) {
      const { data: existingGrade } = await supabase
        .from('grades')
        .select('id, student_id, school_id')
        .eq('id', grade.id)
        .eq('school_id', profile.school_id)
        .maybeSingle()

      if (!existingGrade || existingGrade.student_id !== grade.studentId) {
        return { success: false, message: 'Grade not found for this student and school.' }
      }

      const { data, error } = await supabase
        .from('grades')
        .update(payload)
        .eq('id', grade.id)
        .eq('school_id', profile.school_id)
        .select()
        .single()

      if (error) return { success: false, message: error.message }
      await logSupportAction(context, 'update_grade', 'grades', { gradeId: grade.id, studentId: grade.studentId, effectiveRole: profile.role })
      return { success: true, message: 'Grade updated.', grade: mapGradeFromDb(data) }
    }

    const { data, error } = await supabase
      .from('grades')
      .insert({ ...payload, date_entered: grade.dateEntered || now })
      .select()
      .single()

    if (error) return { success: false, message: error.message }
    await logSupportAction(context, 'create_grade', 'grades', { studentId: grade.studentId, effectiveRole: profile.role })
    return { success: true, message: 'Grade saved.', grade: mapGradeFromDb(data) }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to save grade.',
    }
  }
}

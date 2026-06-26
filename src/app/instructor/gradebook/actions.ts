'use server'

import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { logPermissionDenied, logUnauthorizedAccess } from '@/lib/security/audit-logger'
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
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'You must be signed in to save a grade.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, school_id')
    .eq('id', user.id)
    .single()

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
    instructor_id: user.id,
    instructor_name: profile.full_name || user.email || 'Instructor',
    date_modified: now,
  }

  try {
    if (grade.id) {
      const { data, error } = await supabase
        .from('grades')
        .update(payload)
        .eq('id', grade.id)
        .eq('school_id', profile.school_id)
        .select()
        .single()

      if (error) return { success: false, message: error.message }
      return { success: true, message: 'Grade updated.', grade: mapGradeFromDb(data) }
    }

    const { data, error } = await supabase
      .from('grades')
      .insert({ ...payload, date_entered: grade.dateEntered || now })
      .select()
      .single()

    if (error) return { success: false, message: error.message }
    return { success: true, message: 'Grade saved.', grade: mapGradeFromDb(data) }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to save grade.',
    }
  }
}

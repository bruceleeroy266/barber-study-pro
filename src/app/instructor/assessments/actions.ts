'use server'

import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { logPermissionDenied, logUnauthorizedAccess } from '@/lib/security/audit-logger'
import { Assessment } from '@/types'
import {
  mapAssessmentFromDb,
  mapAssessmentToDb,
} from '@/lib/mappers/operational-data-mappers'

export interface SaveAssessmentResult {
  success: boolean
  message: string
  assessment?: Assessment
}

export async function saveAssessment(
  assessment: Partial<Assessment> & { studentId: string; assessmentType: Assessment['assessmentType'] }
): Promise<SaveAssessmentResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'You must be signed in to save an assessment.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    await logPermissionDenied('manage_assessments', {
      userId: user.id,
      email: user.email,
      role: profile?.role ?? null,
      schoolId: profile?.school_id ?? null,
      resource: 'assessments',
      action: 'save',
    })
    return { success: false, message: 'Only instructors and admins can save assessments.' }
  }

  if (!profile.school_id) {
    return { success: false, message: 'Your account is not assigned to a school.' }
  }

  // Verify student belongs to actor's school
  const { data: student } = await supabase
    .from('profiles')
    .select('school_id')
    .eq('id', assessment.studentId)
    .in('role', ['student', 'apprentice'])
    .single()

  if (!student || student.school_id !== profile.school_id) {
    await logUnauthorizedAccess('student record', {
      userId: user.id,
      email: user.email,
      role: profile.role,
      schoolId: profile.school_id,
      resourceId: assessment.studentId,
      action: 'save_assessment',
      metadata: { studentSchoolId: student?.school_id },
    })
    return { success: false, message: 'Student does not belong to your school.' }
  }

  // Verify rubric belongs to actor's school or is global
  if (assessment.rubricId) {
    const { data: rubric } = await supabase
      .from('assessment_rubrics')
      .select('school_id')
      .eq('id', assessment.rubricId)
      .single()

    if (rubric && rubric.school_id !== null && rubric.school_id !== profile.school_id) {
      await logUnauthorizedAccess('assessment rubric', {
        userId: user.id,
        email: user.email,
        role: profile.role,
        schoolId: profile.school_id,
        resourceId: assessment.rubricId,
        action: 'save_assessment',
      })
      return { success: false, message: 'Rubric does not belong to your school.' }
    }
  }

  const now = new Date().toISOString()
  const payload = {
    ...mapAssessmentToDb(assessment),
    school_id: profile.school_id,
    evaluator_id: user.id,
    evaluator_name: profile.full_name || user.email || 'Instructor',
    updated_at: now,
  }

  try {
    if (assessment.id) {
      const { data, error } = await supabase
        .from('assessments')
        .update(payload)
        .eq('id', assessment.id)
        .eq('school_id', profile.school_id)
        .select()
        .single()

      if (error) return { success: false, message: error.message }
      return { success: true, message: 'Assessment updated.', assessment: mapAssessmentFromDb(data) }
    }

    const { data, error } = await supabase
      .from('assessments')
      .insert({ ...payload, created_at: now })
      .select()
      .single()

    if (error) return { success: false, message: error.message }
    return { success: true, message: 'Assessment saved.', assessment: mapAssessmentFromDb(data) }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to save assessment.',
    }
  }
}

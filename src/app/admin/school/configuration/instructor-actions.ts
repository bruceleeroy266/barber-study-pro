'use server'

import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { assignUserSchool, type ActionResult } from '@/app/admin/users/actions'

export interface InstructorAssignmentImpact {
  activeStudentCount: number
}

/**
 * Returns the number of active learner assignments attached to an instructor.
 * The caller still has to pass authorization through assignUserSchool before any
 * mutation occurs.
 */
export async function getInstructorAssignmentImpact(
  instructorId: string
): Promise<ActionResult<InstructorAssignmentImpact>> {
  const serviceClient = createServiceRoleClient()

  const { count, error } = await serviceClient
    .from('student_instructor_assignments')
    .select('student_id', { count: 'exact', head: true })
    .eq('instructor_id', instructorId)
    .eq('is_active', true)
    .is('ended_at', null)

  if (error) {
    return { success: false, error: error.message }
  }

  return {
    success: true,
    data: { activeStudentCount: count ?? 0 },
  }
}

/**
 * Moves an instructor to another school, or removes the instructor from the
 * current school when targetSchoolId is null. Active learner assignments block
 * the operation so the admin cannot orphan students.
 */
export async function guardedMoveInstructor(
  instructorId: string,
  targetSchoolId: string | null
): Promise<ActionResult> {
  const serviceClient = createServiceRoleClient()

  const { data: instructor, error: instructorError } = await serviceClient
    .from('profiles')
    .select('id, role')
    .eq('id', instructorId)
    .maybeSingle()

  if (instructorError || !instructor || instructor.role !== 'instructor') {
    return { success: false, error: 'Instructor not found' }
  }

  const impact = await getInstructorAssignmentImpact(instructorId)
  if (!impact.success || !impact.data) {
    return { success: false, error: impact.error || 'Failed to check instructor assignments' }
  }

  if (impact.data.activeStudentCount > 0) {
    return {
      success: false,
      error: `This instructor still has ${impact.data.activeStudentCount} active student assignment${impact.data.activeStudentCount === 1 ? '' : 's'}. Reassign those students before moving or removing the instructor.`,
    }
  }

  return assignUserSchool(instructorId, targetSchoolId)
}

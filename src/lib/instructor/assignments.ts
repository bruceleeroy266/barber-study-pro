import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * CANONICAL STUDENT ↔ INSTRUCTOR ASSIGNMENT HELPERS
 *
 * student_instructor_assignments is the single source of truth for which
 * students an instructor may treat as their roster. School/platform admins
 * retain school-wide oversight, but instructor-facing roster and detail paths
 * must resolve through this relationship.
 */

export interface ActiveStudentInstructorAssignment {
  school_id: string
  student_id: string
  instructor_id: string
  ended_at?: string | null
}

type SupabaseLike = Pick<SupabaseClient, 'from'>

export async function loadActiveStudentInstructorAssignments(
  supabase: SupabaseLike,
  schoolId: string,
  instructorId?: string | null
): Promise<ActiveStudentInstructorAssignment[]> {
  let query = supabase
    .from('student_instructor_assignments')
    .select('school_id, student_id, instructor_id, ended_at')
    .eq('school_id', schoolId)
    .eq('is_active', true)

  if (instructorId) {
    query = query.eq('instructor_id', instructorId)
  }

  const { data, error } = await query
  if (error || !Array.isArray(data)) return []

  return (data as ActiveStudentInstructorAssignment[]).filter(
    (row) =>
      row.school_id === schoolId &&
      row.ended_at == null &&
      typeof row.student_id === 'string' &&
      typeof row.instructor_id === 'string'
  )
}

export async function loadAssignedStudentIds(
  supabase: SupabaseLike,
  schoolId: string,
  instructorId: string
): Promise<string[]> {
  const assignments = await loadActiveStudentInstructorAssignments(
    supabase,
    schoolId,
    instructorId
  )
  return Array.from(new Set(assignments.map((row) => row.student_id)))
}

export async function isStudentAssignedToInstructor(
  supabase: SupabaseLike,
  schoolId: string,
  instructorId: string,
  studentId: string
): Promise<boolean> {
  const assignments = await loadActiveStudentInstructorAssignments(
    supabase,
    schoolId,
    instructorId
  )
  return assignments.some((row) => row.student_id === studentId)
}

export function buildInstructorAssignmentMap(
  assignments: ReadonlyArray<ActiveStudentInstructorAssignment>
): Map<string, Set<string>> {
  const result = new Map<string, Set<string>>()

  for (const assignment of assignments) {
    const existing = result.get(assignment.instructor_id) ?? new Set<string>()
    existing.add(assignment.student_id)
    result.set(assignment.instructor_id, existing)
  }

  return result
}

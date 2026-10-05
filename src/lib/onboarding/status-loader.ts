/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolveSchoolOnboardingStatus, type OnboardingSourceSnapshot, type SchoolOnboardingStatus } from './status-resolver'

type SupabaseLike = { from: (table: string) => any }

function pushError(errors: string[], label: string, error: unknown) {
  if (error) errors.push(label)
}

export async function loadSchoolOnboardingStatus(
  supabase: SupabaseLike,
  schoolId: string
): Promise<SchoolOnboardingStatus> {
  const sourceErrors: string[] = []

  const [
    schoolResult,
    settingsResult,
    programsResult,
    profilesResult,
    invitationsResult,
    studentsResult,
    assignmentsResult,
  ] = await Promise.all([
    supabase
      .from('schools')
      .select('id, name, is_active, deleted_at')
      .eq('id', schoolId)
      .maybeSingle(),
    supabase
      .from('school_settings')
      .select('school_id')
      .eq('school_id', schoolId)
      .maybeSingle(),
    supabase
      .from('programs')
      .select('id, name, is_active, deleted_at')
      .eq('school_id', schoolId),
    supabase
      .from('profiles')
      .select('id, role, approval_status, is_disabled')
      .eq('school_id', schoolId),
    supabase
      .from('school_onboarding_invitations')
      .select('role, status, expires_at')
      .eq('school_id', schoolId),
    supabase
      .from('students')
      .select('id, profile_id')
      .eq('school_id', schoolId),
    supabase
      .from('student_instructor_assignments')
      .select('student_id, instructor_id, is_active, ended_at')
      .eq('school_id', schoolId),
  ])

  pushError(sourceErrors, 'school', schoolResult.error)
  pushError(sourceErrors, 'school_settings', settingsResult.error)
  pushError(sourceErrors, 'programs', programsResult.error)
  pushError(sourceErrors, 'profiles', profilesResult.error)
  pushError(sourceErrors, 'invitations', invitationsResult.error)
  pushError(sourceErrors, 'students', studentsResult.error)
  pushError(sourceErrors, 'assignments', assignmentsResult.error)

  const studentRows: Array<{ id: string; profile_id: string }> = Array.isArray(studentsResult.data)
    ? studentsResult.data.map((row: any) => ({
        id: String(row.id),
        profile_id: String(row.profile_id),
      }))
    : []

  const canonicalStudentIds = studentRows.map((row) => row.id)
  let activeEnrollmentStudentIds: string[] = []

  if (canonicalStudentIds.length > 0) {
    const enrollmentResult = await supabase
      .from('enrollments')
      .select('student_id, status, is_active, deleted_at')
      .in('student_id', canonicalStudentIds)

    pushError(sourceErrors, 'enrollments', enrollmentResult.error)

    if (Array.isArray(enrollmentResult.data)) {
      activeEnrollmentStudentIds = Array.from(
        new Set(
          enrollmentResult.data
            .filter(
              (row: any) =>
                row?.status === 'active' &&
                row?.is_active !== false &&
                !row?.deleted_at &&
                row?.student_id
            )
            .map((row: any) => String(row.student_id))
        )
      )
    }
  }

  const snapshot: OnboardingSourceSnapshot = {
    school: schoolResult.data
      ? {
          id: String(schoolResult.data.id),
          name: schoolResult.data.name ? String(schoolResult.data.name) : null,
          is_active: schoolResult.data.is_active,
          deleted_at: schoolResult.data.deleted_at,
        }
      : null,
    hasSchoolSettings: Boolean(settingsResult.data?.school_id),
    activePrograms: Array.isArray(programsResult.data)
      ? programsResult.data
          .filter((row: any) => row?.is_active !== false && !row?.deleted_at)
          .map((row: any) => ({
            id: String(row.id),
            name: row.name ? String(row.name) : null,
          }))
      : [],
    profiles: Array.isArray(profilesResult.data)
      ? profilesResult.data.map((row: any) => ({
          id: String(row.id),
          role: String(row.role),
          approval_status: row.approval_status ? String(row.approval_status) : null,
          is_disabled: Boolean(row.is_disabled),
        }))
      : [],
    invitations: Array.isArray(invitationsResult.data)
      ? invitationsResult.data.map((row: any) => ({
          role: row.role ? String(row.role) : null,
          status: row.status ? String(row.status) : null,
          expires_at: row.expires_at ? String(row.expires_at) : null,
        }))
      : [],
    studentRows,
    activeEnrollmentStudentIds,
    activeAssignments: Array.isArray(assignmentsResult.data)
      ? assignmentsResult.data
          .filter(
            (row: any) =>
              row?.is_active === true &&
              row?.ended_at == null &&
              row?.student_id &&
              row?.instructor_id
          )
          .map((row: any) => ({
            student_id: String(row.student_id),
            instructor_id: String(row.instructor_id),
          }))
      : [],
    sourceErrors,
  }

  return resolveSchoolOnboardingStatus(snapshot)
}

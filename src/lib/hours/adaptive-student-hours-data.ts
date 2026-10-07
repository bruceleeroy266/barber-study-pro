/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ResolvedEnrollmentHourContract {
  enrollmentId: string | null
  priorCreditMinutes: number
  requirementOverrideMinutes: number | null
  contractVersion: number
}

export function emptyEnrollmentHourContract(): ResolvedEnrollmentHourContract {
  return {
    enrollmentId: null,
    priorCreditMinutes: 0,
    requirementOverrideMinutes: null,
    contractVersion: 0,
  }
}

type SupabaseLike = { from: (table: string) => any }

export async function loadEnrollmentHourContractsForStudents(
  supabase: SupabaseLike,
  schoolId: string,
  studentProfileIds: string[],
): Promise<Map<string, ResolvedEnrollmentHourContract>> {
  const result = new Map<string, ResolvedEnrollmentHourContract>()
  for (const profileId of studentProfileIds) {
    result.set(profileId, emptyEnrollmentHourContract())
  }
  if (!schoolId || studentProfileIds.length === 0) return result

  try {
    const { data: studentRows, error: studentError } = await supabase
      .from('students')
      .select('id, profile_id')
      .eq('school_id', schoolId)
      .in('profile_id', studentProfileIds)
      .eq('is_active', true)
      .is('deleted_at', null)

    if (studentError || !Array.isArray(studentRows) || studentRows.length === 0) {
      return result
    }

    const profileByStudentId = new Map<string, string>()
    for (const row of studentRows as Array<{ id: string; profile_id: string }>) {
      if (row?.id && row?.profile_id) profileByStudentId.set(row.id, row.profile_id)
    }

    const studentRowIds = [...profileByStudentId.keys()]
    if (studentRowIds.length === 0) return result

    const { data: enrollmentRows, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, student_id, created_at')
      .in('student_id', studentRowIds)
      .eq('status', 'active')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (enrollmentError || !Array.isArray(enrollmentRows) || enrollmentRows.length === 0) {
      return result
    }

    const activeEnrollmentByProfile = new Map<string, string>()
    for (const row of enrollmentRows as Array<{
      id: string
      student_id: string
      created_at: string | null
    }>) {
      const profileId = profileByStudentId.get(row.student_id)
      if (!profileId || activeEnrollmentByProfile.has(profileId)) continue
      activeEnrollmentByProfile.set(profileId, row.id)
    }

    const enrollmentIds = [...activeEnrollmentByProfile.values()]
    if (enrollmentIds.length === 0) return result

    const { data: contractRows, error: contractError } = await supabase
      .from('enrollment_hour_contracts')
      .select('enrollment_id, prior_credit_minutes, requirement_override_minutes, version')
      .in('enrollment_id', enrollmentIds)

    if (contractError) return result

    const contractByEnrollment = new Map<
      string,
      {
        prior_credit_minutes: number
        requirement_override_minutes: number | null
        version: number
      }
    >()
    for (const row of (contractRows ?? []) as Array<{
      enrollment_id: string
      prior_credit_minutes: number
      requirement_override_minutes: number | null
      version: number
    }>) {
      contractByEnrollment.set(row.enrollment_id, row)
    }

    for (const [profileId, enrollmentId] of activeEnrollmentByProfile) {
      const contract = contractByEnrollment.get(enrollmentId)
      result.set(profileId, {
        enrollmentId,
        priorCreditMinutes: contract?.prior_credit_minutes ?? 0,
        requirementOverrideMinutes: contract?.requirement_override_minutes ?? null,
        contractVersion: contract?.version ?? 0,
      })
    }
  } catch {
    // Soft-fail to the zero-credit/program-requirement contract.
  }

  return result
}

export async function loadEnrollmentHourContractForStudent(
  supabase: SupabaseLike,
  schoolId: string,
  studentProfileId: string,
): Promise<ResolvedEnrollmentHourContract> {
  const map = await loadEnrollmentHourContractsForStudents(
    supabase,
    schoolId,
    [studentProfileId],
  )
  return map.get(studentProfileId) ?? emptyEnrollmentHourContract()
}

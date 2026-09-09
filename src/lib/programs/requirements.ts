/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * PROGRAM REQUIREMENTS RESOLVER
 * ASCYN PRO / ASCYN PRO V2
 *
 * Resolves a school's program requirements (required_hours, etc.) from the
 * existing `programs` table instead of hard-coded assumptions, so instructor
 * and compliance surfaces work for schools in any state.
 *
 * Resolution chain (per student):
 *   1. The student's active enrollment's program (enrollments → programs)
 *   2. The school's first active program (deterministic: oldest created)
 *   3. DEFAULT_REQUIRED_HOURS fallback (matches the programs table schema
 *      default) with programName null and source 'default'
 *
 * No state licensing requirements are invented here: this module only reads
 * values the school itself configured. Missing data always falls back to the
 * chain above; query failures soft-fail to the next step.
 */

// Matches the `programs.required_hours` schema default
// (supabase/migrations/20250625010000_create_core_production_tables.sql).
export const DEFAULT_REQUIRED_HOURS = 1500

export type ProgramRequirementSource = 'enrollment' | 'school_program' | 'default'

export interface ResolvedProgramRequirements {
  programId: string | null
  programName: string | null
  requiredHours: number
  requiredAssessments: number | null
  requiredPracticals: number | null
  source: ProgramRequirementSource
}

export function defaultProgramRequirements(): ResolvedProgramRequirements {
  return {
    programId: null,
    programName: null,
    requiredHours: DEFAULT_REQUIRED_HOURS,
    requiredAssessments: null,
    requiredPracticals: null,
    source: 'default',
  }
}

// Minimal structural type so both the real Supabase client and the demo-mode
// mock query builder (src/lib/supabase-server.ts) satisfy the contract.
type SupabaseLike = { from: (table: string) => any }

interface ProgramRow {
  id: string
  name: string
  required_hours: number | null
  required_assessments: number | null
  required_practicals: number | null
  is_active: boolean | null
  deleted_at: string | null
  created_at: string | null
}

function toRequirements(row: ProgramRow, source: ProgramRequirementSource): ResolvedProgramRequirements {
  const hours = typeof row.required_hours === 'number' && row.required_hours > 0
    ? row.required_hours
    : DEFAULT_REQUIRED_HOURS
  return {
    programId: row.id,
    programName: row.name ?? null,
    requiredHours: hours,
    requiredAssessments: row.required_assessments ?? null,
    requiredPracticals: row.required_practicals ?? null,
    source,
  }
}

/** Active, non-deleted programs for a school, oldest first (deterministic). */
async function fetchSchoolPrograms(supabase: SupabaseLike, schoolId: string): Promise<ProgramRow[]> {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('id, name, required_hours, required_assessments, required_practicals, is_active, deleted_at, created_at')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: true })
    if (error || !Array.isArray(data)) return []
    return (data as ProgramRow[]).filter((p) => p.is_active !== false && !p.deleted_at)
  } catch {
    return []
  }
}

/** Map profile_id → students.id for a school's student rows. */
async function fetchStudentRowIds(
  supabase: SupabaseLike,
  schoolId: string,
  profileIds: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (profileIds.length === 0) return map
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id, profile_id')
      .eq('school_id', schoolId)
      .in('profile_id', profileIds)
    if (error || !Array.isArray(data)) return map
    for (const row of data as Array<{ id: string; profile_id: string }>) {
      if (row?.id && row?.profile_id) map.set(row.profile_id, row.id)
    }
  } catch {
    // soft-fail: callers fall back to school-level program
  }
  return map
}

/** Map students.id → program_id for active enrollments.
 *  A student with multiple active enrollments resolves to the most recently
 *  created one (deterministic ORDER BY created_at DESC; first row wins). */
async function fetchActiveEnrollmentProgramIds(
  supabase: SupabaseLike,
  studentRowIds: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (studentRowIds.length === 0) return map
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('student_id, program_id, status, is_active, deleted_at')
      .in('student_id', studentRowIds)
      .order('created_at', { ascending: false })
    if (error || !Array.isArray(data)) return map
    for (const row of data as Array<{ student_id: string; program_id: string; status: string | null; is_active: boolean | null; deleted_at: string | null }>) {
      if (!row?.student_id || !row?.program_id) continue
      if (row.status !== 'active' || row.is_active === false || row.deleted_at) continue
      if (!map.has(row.student_id)) map.set(row.student_id, row.program_id)
    }
  } catch {
    // soft-fail
  }
  return map
}

/**
 * Resolve program requirements for one student (by profile id) within a school.
 * Falls back per the chain documented at the top of this module.
 */
export async function resolveStudentProgramRequirements(
  supabase: SupabaseLike,
  schoolId: string,
  studentProfileId?: string | null
): Promise<ResolvedProgramRequirements> {
  const programs = await fetchSchoolPrograms(supabase, schoolId)
  const byId = new Map(programs.map((p) => [p.id, p]))

  if (studentProfileId) {
    const studentRows = await fetchStudentRowIds(supabase, schoolId, [studentProfileId])
    const studentRowId = studentRows.get(studentProfileId)
    if (studentRowId) {
      const enrolled = await fetchActiveEnrollmentProgramIds(supabase, [studentRowId])
      const programId = enrolled.get(studentRowId)
      const program = programId ? byId.get(programId) : undefined
      if (program) return toRequirements(program, 'enrollment')
    }
  }

  const schoolProgram = programs[0]
  if (schoolProgram) return toRequirements(schoolProgram, 'school_program')

  return defaultProgramRequirements()
}

/**
 * Batch resolve program requirements for many students (by profile ids).
 * Every requested id gets an entry; unresolved students fall back per the chain.
 */
export async function resolveProgramRequirementsForStudents(
  supabase: SupabaseLike,
  schoolId: string,
  studentProfileIds: string[]
): Promise<Map<string, ResolvedProgramRequirements>> {
  const result = new Map<string, ResolvedProgramRequirements>()
  const programs = await fetchSchoolPrograms(supabase, schoolId)
  const byId = new Map(programs.map((p) => [p.id, p]))
  const schoolProgram = programs[0]

  const studentRows = await fetchStudentRowIds(supabase, schoolId, studentProfileIds)
  const enrolled = await fetchActiveEnrollmentProgramIds(supabase, [...studentRows.values()])

  for (const profileId of studentProfileIds) {
    const rowId = studentRows.get(profileId)
    const programId = rowId ? enrolled.get(rowId) : undefined
    const program = programId ? byId.get(programId) : undefined
    if (program) {
      result.set(profileId, toRequirements(program, 'enrollment'))
    } else if (schoolProgram) {
      result.set(profileId, toRequirements(schoolProgram, 'school_program'))
    } else {
      result.set(profileId, defaultProgramRequirements())
    }
  }
  return result
}

/**
 * Resolve the school's configured state (schools.state), or null when missing.
 * Never guesses or imports external licensing data.
 */
export async function resolveSchoolState(
  supabase: SupabaseLike,
  schoolId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('state')
      .eq('id', schoolId)
      .maybeSingle()
    if (error || !data) return null
    const state = typeof data.state === 'string' ? data.state.trim() : ''
    return state.length > 0 ? state : null
  } catch {
    return null
  }
}

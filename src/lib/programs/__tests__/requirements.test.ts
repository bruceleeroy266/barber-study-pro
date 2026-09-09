/**
 * Program requirements resolver tests (founder directive 2026-09-08).
 *
 * Proves the resolution chain — active enrollment → school's oldest active
 * program → 1500 schema default — and, critically, that active-enrollment
 * selection is DETERMINISTIC: with multiple conflicting active enrollments,
 * the most recently created one wins regardless of the order rows come back
 * from the database.
 */

import { describe, it, expect } from 'vitest'
import {
  resolveStudentProgramRequirements,
  resolveProgramRequirementsForStudents,
  resolveSchoolState,
  DEFAULT_REQUIRED_HOURS,
} from '@/lib/programs/requirements'

type Row = Record<string, unknown>

interface MockQuery {
  select: () => MockQuery
  eq: (col: string, val: unknown) => MockQuery
  in: (col: string, vals: unknown[]) => MockQuery
  is: (col: string, val: unknown) => MockQuery
  order: (col: string, opts?: { ascending?: boolean }) => MockQuery
  maybeSingle: () => Promise<{ data: Row | null; error: null }>
  then: (resolve: (v: { data: Row[]; error: null }) => unknown) => unknown
}

function makeSupabase(db: { programs?: Row[]; students?: Row[]; enrollments?: Row[]; schools?: Row[] }) {
  return {
    from(table: string) {
      let rows: Row[] = [...((db as Record<string, Row[] | undefined>)[table] ?? [])]
      const api: MockQuery = {
        select: () => api,
        eq: (col, val) => {
          rows = rows.filter((r) => r[col] === val)
          return api
        },
        in: (col, vals) => {
          rows = rows.filter((r) => vals.includes(r[col]))
          return api
        },
        is: (col, val) => {
          rows = rows.filter((r) => r[col] === val)
          return api
        },
        order: (col, opts) => {
          const dir = opts?.ascending === false ? -1 : 1
          rows = [...rows].sort((a, b) => String(a[col] ?? '').localeCompare(String(b[col] ?? '')) * dir)
          return api
        },
        maybeSingle: async () => ({ data: rows[0] ?? null, error: null }),
        then: (resolve) => resolve({ data: rows, error: null }),
      }
      return api
    },
  }
}

const SCHOOL = 'school-1'
const PROFILE_ID = 'profile-1'

const PROGRAM_OLD = {
  id: 'prog-old',
  school_id: SCHOOL,
  name: 'Barbering Foundations',
  required_hours: 1000,
  required_assessments: null,
  required_practicals: null,
  is_active: true,
  deleted_at: null,
  created_at: '2026-01-01T00:00:00Z',
}
const PROGRAM_NEW = {
  id: 'prog-new',
  school_id: SCHOOL,
  name: 'Barbering',
  required_hours: 1200,
  required_assessments: null,
  required_practicals: null,
  is_active: true,
  deleted_at: null,
  created_at: '2026-06-01T00:00:00Z',
}
const STUDENT_ROW = { id: 'student-row-1', profile_id: PROFILE_ID, school_id: SCHOOL }

const ENROLLMENT_OLD = {
  student_id: STUDENT_ROW.id,
  program_id: PROGRAM_OLD.id,
  status: 'active',
  is_active: true,
  deleted_at: null,
  created_at: '2026-03-01T00:00:00Z',
}
const ENROLLMENT_NEW = {
  student_id: STUDENT_ROW.id,
  program_id: PROGRAM_NEW.id,
  status: 'active',
  is_active: true,
  deleted_at: null,
  created_at: '2026-09-01T00:00:00Z',
}

describe('resolveStudentProgramRequirements — deterministic active-enrollment selection', () => {
  it('picks the most recently created active enrollment (fixture order: new first)', async () => {
    const supabase = makeSupabase({
      programs: [PROGRAM_OLD, PROGRAM_NEW],
      students: [STUDENT_ROW],
      enrollments: [ENROLLMENT_NEW, ENROLLMENT_OLD],
    })
    const result = await resolveStudentProgramRequirements(supabase, SCHOOL, PROFILE_ID)
    expect(result.programId).toBe(PROGRAM_NEW.id)
    expect(result.requiredHours).toBe(1200)
    expect(result.source).toBe('enrollment')
  })

  it('picks the same program when the database returns rows in the opposite order', async () => {
    const supabase = makeSupabase({
      programs: [PROGRAM_OLD, PROGRAM_NEW],
      students: [STUDENT_ROW],
      enrollments: [ENROLLMENT_OLD, ENROLLMENT_NEW],
    })
    const result = await resolveStudentProgramRequirements(supabase, SCHOOL, PROFILE_ID)
    expect(result.programId).toBe(PROGRAM_NEW.id)
    expect(result.requiredHours).toBe(1200)
    expect(result.source).toBe('enrollment')
  })

  it.each(['completed', 'withdrawn', 'on_hold'])('ignores %s enrollments and falls back to the school program', async (status) => {
    const supabase = makeSupabase({
      programs: [PROGRAM_OLD, PROGRAM_NEW],
      students: [STUDENT_ROW],
      enrollments: [{ ...ENROLLMENT_NEW, status }],
    })
    const result = await resolveStudentProgramRequirements(supabase, SCHOOL, PROFILE_ID)
    expect(result.programId).toBe(PROGRAM_OLD.id)
    expect(result.requiredHours).toBe(1000)
    expect(result.source).toBe('school_program')
  })

  it.each([
    { is_active: false },
    { deleted_at: '2026-08-01T00:00:00Z' },
  ])('ignores inactive/deleted enrollments (%o)', async (override) => {
    const supabase = makeSupabase({
      programs: [PROGRAM_OLD, PROGRAM_NEW],
      students: [STUDENT_ROW],
      enrollments: [{ ...ENROLLMENT_NEW, ...override }],
    })
    const result = await resolveStudentProgramRequirements(supabase, SCHOOL, PROFILE_ID)
    expect(result.source).toBe('school_program')
    expect(result.requiredHours).toBe(1000)
  })
})

describe('resolveStudentProgramRequirements — fallback chain', () => {
  it('falls back to the school oldest active program when the student has no enrollments', async () => {
    const supabase = makeSupabase({
      programs: [PROGRAM_OLD, PROGRAM_NEW],
      students: [STUDENT_ROW],
      enrollments: [],
    })
    const result = await resolveStudentProgramRequirements(supabase, SCHOOL, PROFILE_ID)
    expect(result.programId).toBe(PROGRAM_OLD.id)
    expect(result.requiredHours).toBe(1000)
    expect(result.source).toBe('school_program')
  })

  it('falls back to the school program when the student row does not exist', async () => {
    const supabase = makeSupabase({ programs: [PROGRAM_OLD, PROGRAM_NEW], students: [], enrollments: [] })
    const result = await resolveStudentProgramRequirements(supabase, SCHOOL, PROFILE_ID)
    expect(result.source).toBe('school_program')
    expect(result.requiredHours).toBe(1000)
  })

  it('falls back to the schema default when the school has no programs', async () => {
    const supabase = makeSupabase({ programs: [], students: [], enrollments: [] })
    const result = await resolveStudentProgramRequirements(supabase, SCHOOL, PROFILE_ID)
    expect(result.programId).toBeNull()
    expect(result.programName).toBeNull()
    expect(result.requiredHours).toBe(DEFAULT_REQUIRED_HOURS)
    expect(result.requiredHours).toBe(1500)
    expect(result.source).toBe('default')
  })

  it('ignores soft-deleted and inactive programs in the school fallback', async () => {
    const supabase = makeSupabase({
      programs: [{ ...PROGRAM_OLD, deleted_at: '2026-07-01T00:00:00Z' }, PROGRAM_NEW],
      students: [],
      enrollments: [],
    })
    const result = await resolveStudentProgramRequirements(supabase, SCHOOL, PROFILE_ID)
    expect(result.programId).toBe(PROGRAM_NEW.id)
    expect(result.requiredHours).toBe(1200)
    expect(result.source).toBe('school_program')
  })
})

describe('resolveProgramRequirementsForStudents — batch', () => {
  it('resolves enrolled students by enrollment and unenrolled by school fallback', async () => {
    const PROFILE_2 = 'profile-2'
    const supabase = makeSupabase({
      programs: [PROGRAM_OLD, PROGRAM_NEW],
      students: [STUDENT_ROW, { id: 'student-row-2', profile_id: PROFILE_2, school_id: SCHOOL }],
      enrollments: [ENROLLMENT_NEW],
    })
    const result = await resolveProgramRequirementsForStudents(supabase, SCHOOL, [PROFILE_ID, PROFILE_2])
    expect(result.get(PROFILE_ID)?.programId).toBe(PROGRAM_NEW.id)
    expect(result.get(PROFILE_ID)?.source).toBe('enrollment')
    expect(result.get(PROFILE_2)?.programId).toBe(PROGRAM_OLD.id)
    expect(result.get(PROFILE_2)?.source).toBe('school_program')
  })
})

describe('resolveSchoolState', () => {
  it('returns the trimmed configured state', async () => {
    const supabase = makeSupabase({ schools: [{ id: SCHOOL, state: ' Oklahoma ' }] })
    expect(await resolveSchoolState(supabase, SCHOOL)).toBe('Oklahoma')
  })

  it.each([null, '', '   '])('returns null for missing/blank state (%s)', async (state) => {
    const supabase = makeSupabase({ schools: [{ id: SCHOOL, state }] })
    expect(await resolveSchoolState(supabase, SCHOOL)).toBeNull()
  })

  it('returns null when the school row is missing', async () => {
    const supabase = makeSupabase({ schools: [] })
    expect(await resolveSchoolState(supabase, SCHOOL)).toBeNull()
  })
})

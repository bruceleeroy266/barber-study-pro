/**
 * SEC-RELEASE-02B: school role boundaries under real authenticated RLS.
 * Explicitly confined to disposable local Supabase. Every negative query is
 * backed by a real target row and its after-state is checked by service role.
 */
import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment, cleanupTestEnvironment, createAuthenticatedClient,
  getServiceClient, resolveActorId,
} from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'

const school = (side: 'A' | 'B') => TEST_SCHOOLS[side === 'A' ? 'SCHOOL_A' : 'SCHOOL_B'].id
const student = (side: 'A' | 'B') => resolveActorId(side === 'A' ? 'STUDENT_A' : 'STUDENT_B')

let categories: Record<'A' | 'B', string>
let grades: Record<'A' | 'B', string>
let assessments: Record<'A' | 'B', string>
let progress: Record<'A' | 'B', string>

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
  const service = getServiceClient()
  categories = {} as typeof categories
  grades = {} as typeof grades
  assessments = {} as typeof assessments
  progress = {} as typeof progress
  for (const side of ['A', 'B'] as const) {
    const uid = student(side)
    const sid = school(side)
    const instructorId = resolveActorId(side === 'A' ? 'INSTRUCTOR_A' : 'INSTRUCTOR_B')
    const { data: cat, error: catError } = await service.from('grade_categories').insert({
      school_id: sid, name: '02B verified local category', type: 'QUIZ', weight: 0.1,
    }).select('id').single()
    expect(catError).toBeNull()
    categories[side] = cat!.id
    const { data: grade, error: gradeError } = await service.from('grades').insert({
      school_id: sid, student_id: uid, category_id: cat!.id, category_type: 'QUIZ',
      score: 80, max_score: 100, percentage: 80, weight: 0.1,
      instructor_id: instructorId, instructor_name: '02B local instructor',
    }).select('id').single()
    expect(gradeError).toBeNull()
    grades[side] = grade!.id
    const { data: assessment, error: assessmentError } = await service.from('assessments').insert({
      school_id: sid, student_id: uid, assessment_type: 'HAIRCUT',
      scoring_type: 'QUALITATIVE', qualitative_result: 'PASS',
      evaluator_id: instructorId, evaluator_name: '02B local instructor',
    }).select('id').single()
    expect(assessmentError).toBeNull()
    assessments[side] = assessment!.id
    const { data: prog, error: progressError } = await service.from('student_progress').insert({
      user_id: uid, chapter_id: 'ch-02b-role-boundaries', progress_percentage: 70,
    }).select('id').single()
    expect(progressError).toBeNull()
    progress[side] = prog!.id
  }
})
afterAll(async () => {
  await cleanupTestEnvironment()
})

describe('SEC-RELEASE-02B operational RLS', () => {
  const staffCases = [
    { role: 'INSTRUCTOR_A', own: 'A', foreign: 'B' },
    { role: 'INSTRUCTOR_B', own: 'B', foreign: 'A' },
    { role: 'SCHOOL_ADMIN_A', own: 'A', foreign: 'B' },
    { role: 'SCHOOL_ADMIN_B', own: 'B', foreign: 'A' },
  ] as const

  test.each(staffCases)('$role reads same-school diagnostics but no foreign student records', async ({ role, own, foreign }) => {
    const client = await createAuthenticatedClient(TEST_ACTORS[role])
    for (const [table, ownId, foreignId] of [
      ['student_progress', progress[own], progress[foreign]],
      ['grades', grades[own], grades[foreign]],
      ['assessments', assessments[own], assessments[foreign]],
    ] as const) {
      const { data: localRows, error: localError } = await client.from(table).select('id').eq('id', ownId)
      expect(localError, `${role} ${table} own-school query`).toBeNull()
      expect(localRows?.map(row => row.id)).toEqual([ownId])
      const { data: forbiddenRows, error: forbiddenError } = await client.from(table).select('id').eq('id', foreignId)
      // Missing table privilege is safe but not proof of authorized parity.
      if (forbiddenError) expect(forbiddenError.code).toBeTruthy()
      expect(forbiddenRows ?? [], `${role} disclosed foreign ${table}`).toEqual([])
    }
  })

  test.each(['STUDENT_A', 'STUDENT_B'] as const)('%s sees own progress, grade and assessment but not foreign data', async role => {
    const client = await createAuthenticatedClient(TEST_ACTORS[role])
    const own = role === 'STUDENT_A' ? 'A' : 'B'
    const foreign = own === 'A' ? 'B' : 'A'
    for (const [table, ownId, foreignId] of [
      ['student_progress', progress[own], progress[foreign]],
      ['grades', grades[own], grades[foreign]],
      ['assessments', assessments[own], assessments[foreign]],
    ] as const) {
      const { data: ownRows, error: ownError } = await client.from(table).select('id').eq('id', ownId)
      expect(ownError).toBeNull()
      expect(ownRows?.map(row => row.id)).toEqual([ownId])
      const { data: foreignRows, error: foreignError } = await client.from(table).select('id').eq('id', foreignId)
      if (foreignError) expect(foreignError.code).toBeTruthy()
      expect(foreignRows ?? []).toEqual([])
    }
  })

  test('student cannot forge grade or assessment; foreign staff cannot mutate grade', async () => {
    const studentClient = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
    const foreignClient = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
    const service = getServiceClient()
    const gradeAttempt = await studentClient.from('grades').insert({
      school_id: school('A'), student_id: student('A'), category_id: categories.A,
      category_type: 'QUIZ', score: 100, max_score: 100, percentage: 100,
      instructor_id: student('A'), instructor_name: 'forged',
    })
    expect(gradeAttempt.error, 'Student must not be able to author grades').not.toBeNull()
    const assessmentAttempt = await studentClient.from('assessments').insert({
      school_id: school('A'), student_id: student('A'), assessment_type: 'HAIRCUT',
      scoring_type: 'QUALITATIVE', qualitative_result: 'PASS',
      evaluator_id: student('A'), evaluator_name: 'forged',
    })
    expect(assessmentAttempt.error, 'Student must not be able to author assessments').not.toBeNull()

    const { data: before, error: beforeError } = await service.from('grades')
      .select('score,student_id,school_id').eq('id', grades.B).single()
    expect(beforeError).toBeNull()
    const changed = await foreignClient.from('grades').update({ score: 99 }).eq('id', grades.B)
    if (changed.error) expect(changed.error.code).toBeTruthy()
    const { data: after, error: afterError } = await service.from('grades')
      .select('score,student_id,school_id').eq('id', grades.B).single()
    expect(afterError).toBeNull()
    expect(after).toEqual(before)
  })

  test('student cannot promote own role or reassign school through direct profile update', async () => {
    const service = getServiceClient()
    const userId = student('A')
    const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
    const { data: before, error: readError } = await service.from('profiles')
      .select('role,school_id,approval_status,is_disabled').eq('id', userId).single()
    expect(readError).toBeNull()
    try {
      const attempted = await client.from('profiles').update({
        role: 'school_admin',
        school_id: school('B'),
        approval_status: 'approved',
        is_disabled: false,
      }).eq('id', userId)
      if (attempted.error) expect(attempted.error.code).toBeTruthy()
      const { data: after, error: verifyError } = await service.from('profiles')
        .select('role,school_id,approval_status,is_disabled').eq('id', userId).single()
      expect(verifyError).toBeNull()
      expect(after, 'Untrusted client changed privileged profile fields').toEqual(before)
    } finally {
      // Restore disposable fixture even when regression detects a vulnerable write.
      const { error } = await service.from('profiles').update(before!).eq('id', userId)
      expect(error).toBeNull()
    }
  })

  test('disabled instructor session cannot read same-school academic diagnostics', async () => {
    const service = getServiceClient()
    const uid = resolveActorId('INSTRUCTOR_A')
    const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
    const { error: disabledError } = await service.from('profiles').update({ is_disabled: true }).eq('id', uid)
    expect(disabledError).toBeNull()
    try {
      for (const [table, id] of [
        ['student_progress', progress.A], ['grades', grades.A], ['assessments', assessments.A],
      ] as const) {
        const { data, error } = await client.from(table).select('id').eq('id', id)
        if (error) expect(error.code).toBeTruthy()
        expect(data ?? [], `Disabled instructor still reads ${table}`).toEqual([])
      }
    } finally {
      const { error: restoreError } = await service.from('profiles').update({ is_disabled: false }).eq('id', uid)
      expect(restoreError).toBeNull()
    }
  })
})

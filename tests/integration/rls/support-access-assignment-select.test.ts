/** Authenticated RLS regression for ADMIN-SUPPORT-ACCESS-4K.
 * Must run ONLY against disposable local Supabase with all migrations applied.
 * Uses actual signed-in role JWTs, never service role for assertions.
 */
import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import { setupTestEnvironment, cleanupTestEnvironment, createAuthenticatedClient, createAnonClient, getServiceClient, resolveActorId } from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'

const rows: string[] = []
beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
  const service = getServiceClient()
  for (const letter of ['A', 'B'] as const) {
    const { data, error } = await service.from('student_instructor_assignments').insert({
      school_id: TEST_SCHOOLS[`SCHOOL_${letter}`].id,
      student_id: resolveActorId(`STUDENT_${letter}`),
      instructor_id: resolveActorId(`INSTRUCTOR_${letter}`),
      is_active: true,
    }).select('id').single()
    if (error || !data) throw new Error(`Cannot seed assignment ${letter}: ${error?.message}`)
    rows.push(data.id)
  }
})
afterAll(async () => {
  if (rows.length) await getServiceClient().from('student_instructor_assignments').delete().in('id', rows)
  await cleanupTestEnvironment()
})
const read = async (key: keyof typeof TEST_ACTORS) => {
  const client = await createAuthenticatedClient(TEST_ACTORS[key])
  const { data, error } = await client.from('student_instructor_assignments').select('id, school_id, student_id, instructor_id').in('id', rows)
  expect(error).toBeNull()
  return data ?? []
}
describe('support-access platform assignment SELECT policy', () => {
  test('platform admin sees both school A and B assignments', async () => {
    const data = await read('PLATFORM_ADMIN')
    expect(new Set(data.map(r => r.school_id))).toEqual(new Set([TEST_SCHOOLS.SCHOOL_A.id, TEST_SCHOOLS.SCHOOL_B.id]))
  })
  test('School A instructor sees only own assignment', async () => {
    const data = await read('INSTRUCTOR_A')
    expect(data).toHaveLength(1)
    expect(data[0].school_id).toBe(TEST_SCHOOLS.SCHOOL_A.id)
  })
  test('School B instructor sees only own assignment', async () => {
    const data = await read('INSTRUCTOR_B')
    expect(data).toHaveLength(1)
    expect(data[0].school_id).toBe(TEST_SCHOOLS.SCHOOL_B.id)
  })
  test('School A school admin sees no School B rows', async () => {
    const data = await read('SCHOOL_ADMIN_A')
    expect(data.map(r => r.school_id)).toEqual([TEST_SCHOOLS.SCHOOL_A.id])
  })
  test('School B school admin sees no School A rows', async () => {
    const data = await read('SCHOOL_ADMIN_B')
    expect(data.map(r => r.school_id)).toEqual([TEST_SCHOOLS.SCHOOL_B.id])
  })
  test('students do not gain cross-school assignment access', async () => {
    const [a,b] = await Promise.all([read('STUDENT_A'),read('STUDENT_B')])
    expect(a.every(r => r.school_id === TEST_SCHOOLS.SCHOOL_A.id)).toBe(true)
    expect(b.every(r => r.school_id === TEST_SCHOOLS.SCHOOL_B.id)).toBe(true)
  })
  test('unauthenticated client cannot see seeded assignments', async () => {
    const { data, error } = await createAnonClient().from('student_instructor_assignments').select('id').in('id', rows)
    expect(error === null ? data ?? [] : []).toHaveLength(0)
  })
})

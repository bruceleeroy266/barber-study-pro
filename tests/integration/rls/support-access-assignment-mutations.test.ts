/** Disposable authenticated cross-school mutation regression. Never run on production. */
import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import { setupTestEnvironment, cleanupTestEnvironment, createAuthenticatedClient, getServiceClient, resolveActorId } from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'

const seeded: string[] = []
beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
  const service = getServiceClient()
  for (const side of ['A', 'B'] as const) {
    const { data, error } = await service.from('student_instructor_assignments').insert({
      school_id: TEST_SCHOOLS[`SCHOOL_${side}`].id,
      student_id: resolveActorId(`STUDENT_${side}`),
      instructor_id: resolveActorId(`INSTRUCTOR_${side}`),
      is_active: true,
    }).select('id').single()
    if (error || !data) throw new Error(`seed ${side}: ${error?.message}`)
    seeded.push(data.id)
  }
})
afterAll(async () => {
  if (seeded.length) await getServiceClient().from('student_instructor_assignments').delete().in('id', seeded)
  await cleanupTestEnvironment()
})
describe('cross-school assignment mutation denial (authenticated)', () => {
  test.each(['INSTRUCTOR_A', 'SCHOOL_ADMIN_A'] as const)('%s cannot update or delete School B assignment', async (key) => {
    const client = await createAuthenticatedClient(TEST_ACTORS[key])
    const target = seeded[1]
    await client.from('student_instructor_assignments').update({ is_active: false }).eq('id', target)
    await client.from('student_instructor_assignments').delete().eq('id', target)
    const { data, error } = await getServiceClient().from('student_instructor_assignments').select('school_id,is_active').eq('id', target).single()
    expect(error).toBeNull()
    expect(data?.school_id).toBe(TEST_SCHOOLS.SCHOOL_B.id)
    expect(data?.is_active).toBe(true)
  })
  test('platform admin SELECT grant does not silently create cross-school write permission', async () => {
    const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
    const target = seeded[1]
    await client.from('student_instructor_assignments').update({ is_active: false }).eq('id', target)
    const { data, error } = await getServiceClient().from('student_instructor_assignments').select('is_active').eq('id', target).single()
    expect(error).toBeNull()
    expect(data?.is_active).toBe(true)
  })
})

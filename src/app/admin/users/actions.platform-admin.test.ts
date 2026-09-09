/**
 * @vitest-environment node
 *
 * Platform-admin canonical definition + school-attached-admin security
 * correction tests for /admin/users server actions.
 *
 * Covers:
 *  - Platform admin (role='admin', school_id IS NULL) reads users across
 *    schools with no forced tenant filter.
 *  - SECURITY CORRECTION: a school-attached 'admin' (school_id set) is now
 *    tenant-scoped — previously isAdmin(role) alone granted platform scope,
 *    which allowed cross-school reads and service-role mutations
 *    (assignUserSchool, changeUserRole) on any school's users.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const CALLER_ID = 'caller-admin-id'
const CALLER_EMAIL = 'admin@ascynpro.test'
const SCHOOL_A_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const SCHOOL_B_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
const TARGET_USER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc'

interface EqCall {
  table: string
  column: string
  value: unknown
}

/**
 * Builds a chainable/awaitable query builder mock that records eq() calls.
 * Terminal results depend on the table and select() arguments:
 *  - profiles + select('role, school_id') + .single() -> the caller profile
 *  - profiles + select('*', { head: true })           -> { count: 0 }
 *  - profiles + other selects (awaited)               -> { data: [] }
 *  - schools                                          -> both test schools
 */
function buildSessionClient(profile: { role: string; school_id: string | null }, eqLog: EqCall[]) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: CALLER_ID, email: CALLER_EMAIL } },
        error: null,
      }),
    },
    from: (table: string) => {
      let selectArgs: unknown[] = []
      const builder: Record<string, unknown> = {}
      builder.select = (...args: unknown[]) => {
        selectArgs = args
        return builder
      }
      builder.order = () => builder
      builder.eq = (column: string, value: unknown) => {
        eqLog.push({ table, column, value })
        return builder
      }
      builder.or = () => builder
      builder.range = () => builder
      builder.single = () => {
        if (table === 'profiles' && selectArgs[0] === 'role, school_id') {
          return Promise.resolve({ data: profile, error: null })
        }
        return Promise.resolve({ data: null, error: null })
      }
      builder.then = (onFulfilled: unknown, onRejected: unknown) => {
        let result: unknown
        if (table === 'schools') {
          result = {
            data: [
              { id: SCHOOL_A_ID, name: 'Test Academy Alpha' },
              { id: SCHOOL_B_ID, name: 'Test Academy Beta' },
            ],
            error: null,
          }
        } else if ((selectArgs[1] as { head?: boolean } | undefined)?.head) {
          result = { count: 0, error: null }
        } else {
          result = { data: [], error: null }
        }
        return Promise.resolve(result).then(
          onFulfilled as (value: unknown) => unknown,
          onRejected as (reason: unknown) => unknown
        )
      }
      return builder
    },
  }
}

function buildServiceClient() {
  const targetUser = {
    id: TARGET_USER_ID,
    email: 'target@school-a.test',
    role: 'student',
    school_id: SCHOOL_A_ID,
    approval_status: 'approved',
    is_disabled: false,
    requires_password_change: false,
  }
  return {
    auth: {
      admin: {
        updateUserById: vi.fn().mockResolvedValue({ error: null }),
      },
    },
    from: (table: string) => {
      const builder: Record<string, unknown> = {}
      builder.select = () => builder
      builder.eq = () => builder
      builder.single = () =>
        Promise.resolve(table === 'profiles' ? { data: targetUser, error: null } : { data: null, error: null })
      builder.update = () => builder
      builder.insert = () => Promise.resolve({ data: null, error: null })
      builder.then = (onFulfilled: unknown, onRejected: unknown) =>
        Promise.resolve({ data: null, error: null }).then(
          onFulfilled as (value: unknown) => unknown,
          onRejected as (reason: unknown) => unknown
        )
      return builder
    },
  }
}

function setupMocks(profile: { role: string; school_id: string | null }) {
  const eqLog: EqCall[] = []
  const sessionClient = buildSessionClient(profile, eqLog)
  const serviceClient = buildServiceClient()

  vi.doMock('@/lib/supabase-server', () => ({
    createClient: vi.fn().mockResolvedValue(sessionClient),
  }))
  vi.doMock('@/lib/supabase-service-role', () => ({
    createServiceRoleClient: vi.fn().mockReturnValue(serviceClient),
  }))

  return { eqLog, serviceClient }
}

describe('admin/users actions — platform admin vs school-attached admin', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('platform admin (admin + NULL school) reads users with no forced tenant filter', async () => {
    const { eqLog } = setupMocks({ role: 'admin', school_id: null })
    const { getUsers } = await import('./actions')

    const result = await getUsers({ limit: 50 })

    expect(result.success).toBe(true)
    expect(eqLog.filter((c) => c.table === 'profiles' && c.column === 'school_id')).toEqual([])
  })

  it('platform admin applies an explicit school filter when one is selected', async () => {
    const { eqLog } = setupMocks({ role: 'admin', school_id: null })
    const { getUsers } = await import('./actions')

    const result = await getUsers({ limit: 50, schoolId: SCHOOL_B_ID })

    expect(result.success).toBe(true)
    const schoolEqs = eqLog.filter((c) => c.table === 'profiles' && c.column === 'school_id')
    // count query + data query, both scoped to the SELECTED school only
    expect(schoolEqs).toHaveLength(2)
    expect(schoolEqs.every((c) => c.value === SCHOOL_B_ID)).toBe(true)
  })

  it('SECURITY CORRECTION: school-attached admin is tenant-scoped on user reads', async () => {
    const { eqLog } = setupMocks({ role: 'admin', school_id: SCHOOL_A_ID })
    const { getUsers } = await import('./actions')

    const result = await getUsers({ limit: 50 })

    expect(result.success).toBe(true)
    const schoolEqs = eqLog.filter((c) => c.table === 'profiles' && c.column === 'school_id')
    expect(schoolEqs.length).toBeGreaterThan(0)
    expect(schoolEqs.every((c) => c.value === SCHOOL_A_ID)).toBe(true)
  })

  it('platform admin sees all schools in the school selector', async () => {
    const { eqLog } = setupMocks({ role: 'admin', school_id: null })
    const { getSchools } = await import('./actions')

    const result = await getSchools()

    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(eqLog.filter((c) => c.table === 'schools' && c.column === 'id')).toEqual([])
  })

  it('school-attached admin sees only their own school in the selector', async () => {
    const { eqLog } = setupMocks({ role: 'admin', school_id: SCHOOL_A_ID })
    const { getSchools } = await import('./actions')

    await getSchools()

    const idEqs = eqLog.filter((c) => c.table === 'schools' && c.column === 'id')
    expect(idEqs).toHaveLength(1)
    expect(idEqs[0].value).toBe(SCHOOL_A_ID)
  })

  it('SECURITY CORRECTION: school-attached admin cannot move users between schools', async () => {
    setupMocks({ role: 'admin', school_id: SCHOOL_A_ID })
    const { assignUserSchool } = await import('./actions')

    const result = await assignUserSchool(TARGET_USER_ID, SCHOOL_B_ID)

    expect(result.success).toBe(false)
    expect(result.error).toBe('School admins cannot move users between schools')
  })

  it('platform admin can move a user to another school', async () => {
    setupMocks({ role: 'admin', school_id: null })
    const { assignUserSchool } = await import('./actions')

    const result = await assignUserSchool(TARGET_USER_ID, SCHOOL_B_ID)

    expect(result.success).toBe(true)
  })

  it('SECURITY CORRECTION: school-attached admin cannot assign administrator roles', async () => {
    setupMocks({ role: 'admin', school_id: SCHOOL_A_ID })
    const { changeUserRole } = await import('./actions')

    const result = await changeUserRole(TARGET_USER_ID, 'admin')

    expect(result.success).toBe(false)
    expect(result.error).toBe('School admins cannot assign administrator roles')
  })

  it('platform admin can assign administrator roles', async () => {
    setupMocks({ role: 'admin', school_id: null })
    const { changeUserRole } = await import('./actions')

    const result = await changeUserRole(TARGET_USER_ID, 'school_admin')

    expect(result.success).toBe(true)
  })

  it('school_admin remains tenant-scoped (no behavior change)', async () => {
    const { eqLog } = setupMocks({ role: 'school_admin', school_id: SCHOOL_A_ID })
    const { getUsers } = await import('./actions')

    const result = await getUsers({ limit: 50 })

    expect(result.success).toBe(true)
    const schoolEqs = eqLog.filter((c) => c.table === 'profiles' && c.column === 'school_id')
    expect(schoolEqs.length).toBeGreaterThan(0)
    expect(schoolEqs.every((c) => c.value === SCHOOL_A_ID)).toBe(true)
  })
})

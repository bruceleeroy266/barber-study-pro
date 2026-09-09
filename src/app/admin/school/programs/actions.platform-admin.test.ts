/**
 * @vitest-environment node
 *
 * Platform-admin canonical definition + school-attached-admin security
 * correction tests for /admin/school/programs server actions.
 *
 * getPrograms() reads through the service-role client (RLS bypassed), so the
 * application-level tenant filter is the ONLY cross-school protection.
 * Previously isPlatformAdmin = isAdmin(role) was true for a school-attached
 * 'admin', leaking ALL schools' programs. The canonical definition
 * (role='admin' AND school_id IS NULL) closes that.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const CALLER_ID = 'caller-admin-id'
const CALLER_EMAIL = 'admin@ascynpro.test'
const SCHOOL_A_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

interface EqCall {
  table: string
  column: string
  value: unknown
}

function buildSessionClient(profile: { role: string; school_id: string | null }) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: CALLER_ID, email: CALLER_EMAIL } },
        error: null,
      }),
    },
    from: (table: string) => {
      const builder: Record<string, unknown> = {}
      builder.select = () => builder
      builder.eq = () => builder
      builder.single = () =>
        Promise.resolve(table === 'profiles' ? { data: profile, error: null } : { data: null, error: null })
      return builder
    },
  }
}

function buildServiceClient(eqLog: EqCall[]) {
  return {
    from: (table: string) => {
      const builder: Record<string, unknown> = {}
      builder.select = () => builder
      builder.eq = (column: string, value: unknown) => {
        eqLog.push({ table, column, value })
        return builder
      }
      builder.is = () => builder
      builder.in = () => builder
      builder.order = () => builder
      builder.single = () => Promise.resolve({ data: null, error: null })
      builder.then = (onFulfilled: unknown, onRejected: unknown) =>
        Promise.resolve({ data: [], error: null }).then(
          onFulfilled as (value: unknown) => unknown,
          onRejected as (reason: unknown) => unknown
        )
      return builder
    },
  }
}

function setupMocks(profile: { role: string; school_id: string | null }) {
  const eqLog: EqCall[] = []
  vi.doMock('@/lib/supabase-server', () => ({
    createClient: vi.fn().mockResolvedValue(buildSessionClient(profile)),
  }))
  vi.doMock('@/lib/supabase-service-role', () => ({
    createServiceRoleClient: vi.fn().mockReturnValue(buildServiceClient(eqLog)),
  }))
  vi.doMock('@/lib/security/audit-logger', () => ({
    logPermissionDenied: vi.fn(),
    logSensitiveConfigChange: vi.fn(),
  }))
  return { eqLog }
}

describe('admin/school/programs actions — platform admin vs school-attached admin', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.doUnmock('@/lib/security/audit-logger')
    vi.restoreAllMocks()
  })

  it('platform admin (admin + NULL school) reads programs across all schools', async () => {
    const { eqLog } = setupMocks({ role: 'admin', school_id: null })
    const { getPrograms } = await import('./actions')

    const result = await getPrograms()

    expect(result.success).toBe(true)
    expect(eqLog.filter((c) => c.table === 'programs' && c.column === 'school_id')).toEqual([])
  })

  it('SECURITY CORRECTION: school-attached admin is tenant-scoped on program reads', async () => {
    const { eqLog } = setupMocks({ role: 'admin', school_id: SCHOOL_A_ID })
    const { getPrograms } = await import('./actions')

    const result = await getPrograms()

    expect(result.success).toBe(true)
    const schoolEqs = eqLog.filter((c) => c.table === 'programs' && c.column === 'school_id')
    expect(schoolEqs).toHaveLength(1)
    expect(schoolEqs[0].value).toBe(SCHOOL_A_ID)
  })

  it('school_admin remains tenant-scoped (no behavior change)', async () => {
    const { eqLog } = setupMocks({ role: 'school_admin', school_id: SCHOOL_A_ID })
    const { getPrograms } = await import('./actions')

    const result = await getPrograms()

    expect(result.success).toBe(true)
    const schoolEqs = eqLog.filter((c) => c.table === 'programs' && c.column === 'school_id')
    expect(schoolEqs).toHaveLength(1)
    expect(schoolEqs[0].value).toBe(SCHOOL_A_ID)
  })
})

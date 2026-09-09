/**
 * @vitest-environment node
 *
 * Platform-admin audit-log visibility tests.
 *
 *  - Platform admin (role='admin', school_id IS NULL) can view platform-wide
 *    security logs and optionally filter by any school.
 *  - School-attached admins remain forced to their own school, even when they
 *    pass a foreign schoolId filter (tenant isolation).
 *  - school_admin is not an /admin/audit role at all (Forbidden).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const CALLER_ID = 'caller-admin-id'
const CALLER_EMAIL = 'admin@ascynpro.test'
const SCHOOL_A_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const SCHOOL_B_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'

interface EqCall {
  table: string
  column: string
  value: unknown
}

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
      builder.eq = (column: string, value: unknown) => {
        if (table === 'profiles' && column === 'id') return builder // caller lookup, not a tenant filter
        eqLog.push({ table, column, value })
        return builder
      }
      builder.gte = () => builder
      builder.lte = () => builder
      builder.order = () => builder
      builder.range = () => builder
      builder.single = () =>
        Promise.resolve(table === 'profiles' ? { data: profile, error: null } : { data: null, error: null })
      builder.then = (onFulfilled: unknown, onRejected: unknown) => {
        const head = (selectArgs[1] as { head?: boolean } | undefined)?.head
        const result = head ? { count: 0, error: null } : { data: [], error: null }
        return Promise.resolve(result).then(
          onFulfilled as (value: unknown) => unknown,
          onRejected as (reason: unknown) => unknown
        )
      }
      return builder
    },
  }
}

function setupMocks(profile: { role: string; school_id: string | null }) {
  const eqLog: EqCall[] = []
  vi.doMock('@/lib/supabase-server', () => ({
    createClient: vi.fn().mockResolvedValue(buildSessionClient(profile, eqLog)),
  }))
  return { eqLog }
}

describe('getAuditHistory — platform admin vs school-attached admin', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.restoreAllMocks()
  })

  it('platform admin (admin + NULL school) views platform-wide logs with no forced school filter', async () => {
    const { eqLog } = setupMocks({ role: 'admin', school_id: null })
    const { getAuditHistory } = await import('./actions')

    const result = await getAuditHistory({})

    expect(result.error).toBeUndefined()
    expect(eqLog.filter((c) => c.table === 'security_logs' && c.column === 'school_id')).toEqual([])
  })

  it('platform admin can filter logs by any selected school', async () => {
    const { eqLog } = setupMocks({ role: 'admin', school_id: null })
    const { getAuditHistory } = await import('./actions')

    const result = await getAuditHistory({ schoolId: SCHOOL_B_ID })

    expect(result.error).toBeUndefined()
    const schoolEqs = eqLog.filter((c) => c.table === 'security_logs' && c.column === 'school_id')
    expect(schoolEqs.length).toBeGreaterThan(0)
    expect(schoolEqs.every((c) => c.value === SCHOOL_B_ID)).toBe(true)
  })

  it('TENANT ISOLATION: school-attached admin is forced to their own school even when filtering to another', async () => {
    const { eqLog } = setupMocks({ role: 'admin', school_id: SCHOOL_A_ID })
    const { getAuditHistory } = await import('./actions')

    const result = await getAuditHistory({ schoolId: SCHOOL_B_ID })

    expect(result.error).toBeUndefined()
    const schoolEqs = eqLog.filter((c) => c.table === 'security_logs' && c.column === 'school_id')
    expect(schoolEqs.length).toBeGreaterThan(0)
    expect(schoolEqs.every((c) => c.value === SCHOOL_A_ID)).toBe(true)
  })

  it('school_admin is forbidden from the audit surface', async () => {
    setupMocks({ role: 'school_admin', school_id: SCHOOL_A_ID })
    const { getAuditHistory } = await import('./actions')

    const result = await getAuditHistory({})

    expect(result.error).toBe('Forbidden')
    expect(result.logs).toEqual([])
  })
})

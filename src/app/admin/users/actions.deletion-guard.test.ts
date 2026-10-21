/** @vitest-environment node */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const SCHOOL_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const SCHOOL_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
const USER_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
const AUTH_DELETE = vi.fn()

function setup(role: string, schoolId: string | null, targetRole: string, targetSchool = SCHOOL_A) {
  AUTH_DELETE.mockResolvedValue({ error: null })
  vi.doMock('@/lib/supabase-server', () => ({
    createClient: vi.fn().mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'actor', email: 'actor@test.invalid' } } }) },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: { role, school_id: schoolId }, error: null }) }) }),
      }),
    }),
  }))
  vi.doMock('@/lib/supabase-service-role', () => ({
    createServiceRoleClient: vi.fn().mockReturnValue({
      auth: { admin: { deleteUser: AUTH_DELETE } },
      from: (table: string) => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: table === 'profiles'
                ? { id: USER_ID, email: 'learner@test.invalid', full_name: 'Disposable', role: targetRole, school_id: targetSchool, approval_status: 'approved', is_disabled: false }
                : null,
              error: null,
            }),
          }),
        }),
        insert: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
  }))
}

describe('SCHOOL-ADMIN-CRUD-3 permanent deletion denial', () => {
  beforeEach(() => { vi.resetModules(); AUTH_DELETE.mockReset() })
  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it.each(['student', 'apprentice', 'instructor'])('school admin cannot permanently delete %s', async (targetRole) => {
    setup('school_admin', SCHOOL_A, targetRole)
    const { deleteUser } = await import('./actions')
    expect((await deleteUser(USER_ID)).success).toBe(false)
    expect(AUTH_DELETE).not.toHaveBeenCalled()
  })

  it.each(['student', 'apprentice'])('platform admin cannot permanently delete %s before retention certification', async (targetRole) => {
    setup('admin', null, targetRole)
    const { deleteUser } = await import('./actions')
    const result = await deleteUser(USER_ID)
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/retention/i)
    expect(AUTH_DELETE).not.toHaveBeenCalled()
  })

  it('school-attached admin cannot permanently delete users', async () => {
    setup('admin', SCHOOL_A, 'instructor')
    const { deleteUser } = await import('./actions')
    expect((await deleteUser(USER_ID)).success).toBe(false)
    expect(AUTH_DELETE).not.toHaveBeenCalled()
  })

  it('cross-school target is never deleted by a school admin', async () => {
    setup('school_admin', SCHOOL_A, 'student', SCHOOL_B)
    const { deleteUser } = await import('./actions')
    expect((await deleteUser(USER_ID)).success).toBe(false)
    expect(AUTH_DELETE).not.toHaveBeenCalled()
  })
})

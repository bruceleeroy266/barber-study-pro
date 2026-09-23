/**
 * @vitest-environment node
 */

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

const ADMIN_ID = 'admin-user'
const SCHOOL_A = '11111111-1111-4111-8111-111111111111'
const SCHOOL_B = '22222222-2222-4222-8222-222222222222'
const USER_ID = '33333333-3333-4333-8333-333333333333'
const EMAIL = 'student@example.test'

function mockCaller(role = 'school_admin', schoolId: string | null = SCHOOL_A) {
  vi.doMock('@/lib/supabase-server', () => ({
    createClient: vi.fn().mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: ADMIN_ID, email: 'admin@example.test' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role, school_id: schoolId },
              error: null,
            }),
          }),
        }),
      }),
    }),
  }))
}

function makeServiceClient(existingProfile: {
  id?: string
  email?: string
  role?: string
  school_id?: string | null
  approval_status?: string
  is_disabled?: boolean
} = {}) {
  const profile = {
    id: USER_ID,
    email: EMAIL,
    role: 'student',
    school_id: SCHOOL_A,
    approval_status: 'approved',
    is_disabled: false,
    requires_password_change: false,
    ...existingProfile,
  }

  const resetPasswordForEmail = vi.fn().mockResolvedValue({ data: {}, error: null })
  const getUserById = vi.fn().mockResolvedValue({
    data: { user: { id: USER_ID, email: profile.email } },
    error: null,
  })
  const listUsers = vi.fn().mockResolvedValue({
    data: { users: [{ id: USER_ID, email: profile.email }] },
    error: null,
  })

  const serviceClient = {
    auth: {
      resetPasswordForEmail,
      admin: {
        getUserById,
        listUsers,
        inviteUserByEmail: vi.fn(),
      },
    },
    from: vi.fn((table: string) => {
      if (table === 'schools') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: SCHOOL_A, is_active: true, deleted_at: null },
                error: null,
              }),
            }),
          }),
        }
      }

      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: profile, error: null }),
            }),
          }),
        }
      }

      if (table === 'user_management_audit_logs') {
        return {
          insert: vi.fn().mockResolvedValue({ data: null, error: null }),
        }
      }

      if (table === 'school_onboarding_invitations') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          }),
          insert: vi.fn().mockResolvedValue({ data: null, error: null }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }
      }

      throw new Error(`Unexpected table: ${table}`)
    }),
  }

  vi.doMock('@/lib/supabase-service-role', () => ({
    createServiceRoleClient: vi.fn().mockReturnValue(serviceClient),
  }))

  return { serviceClient, resetPasswordForEmail, getUserById, listUsers }
}

describe('pilot invitation recovery', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
    mockCaller()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('turns a repeat same-school/same-role invitation into a fresh setup link', async () => {
    const { resetPasswordForEmail } = makeServiceClient()
    const { inviteUser } = await import('./actions')

    const result = await inviteUser({
      full_name: 'Student One',
      email: EMAIL,
      role: 'student',
      school_id: SCHOOL_A,
      approval_status: 'approved',
    })

    expect(result.success).toBe(true)
    expect(result.data).toEqual({ id: USER_ID, recoverySent: true })
    expect(resetPasswordForEmail).toHaveBeenCalledWith(
      EMAIL,
      { redirectTo: 'http://localhost:3000/auth/callback?type=recovery' }
    )
  })

  it('blocks recovery when the existing email belongs to another school', async () => {
    const { resetPasswordForEmail } = makeServiceClient({ school_id: SCHOOL_B })
    const { inviteUser } = await import('./actions')

    const result = await inviteUser({
      full_name: 'Student One',
      email: EMAIL,
      role: 'student',
      school_id: SCHOOL_A,
      approval_status: 'approved',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/different role or school/i)
    expect(resetPasswordForEmail).not.toHaveBeenCalled()
  })

  it('blocks recovery when the existing email belongs to another role', async () => {
    const { resetPasswordForEmail } = makeServiceClient({ role: 'instructor' })
    const { inviteUser } = await import('./actions')

    const result = await inviteUser({
      full_name: 'Student One',
      email: EMAIL,
      role: 'student',
      school_id: SCHOOL_A,
      approval_status: 'approved',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/different role or school/i)
    expect(resetPasswordForEmail).not.toHaveBeenCalled()
  })

  it('lets a school admin send a fresh setup link to a user in their own school', async () => {
    const { resetPasswordForEmail, getUserById } = makeServiceClient()
    const { resendUserSetupLink } = await import('./actions')

    const result = await resendUserSetupLink(USER_ID)

    expect(result.success).toBe(true)
    expect(getUserById).toHaveBeenCalledWith(USER_ID)
    expect(resetPasswordForEmail).toHaveBeenCalledWith(
      EMAIL,
      { redirectTo: 'http://localhost:3000/auth/callback?type=recovery' }
    )
  })

  it('does not send setup links to disabled accounts', async () => {
    const { resetPasswordForEmail } = makeServiceClient({ is_disabled: true })
    const { resendUserSetupLink } = await import('./actions')

    const result = await resendUserSetupLink(USER_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/disabled/i)
    expect(resetPasswordForEmail).not.toHaveBeenCalled()
  })
})

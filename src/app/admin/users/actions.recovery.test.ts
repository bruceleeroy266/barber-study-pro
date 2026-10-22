/**
 * @vitest-environment node
 */

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

const ADMIN_ID = 'admin-user'
const SCHOOL_A = '11111111-1111-4111-8111-111111111111'
const SCHOOL_B = '22222222-2222-4222-8222-222222222222'
const USER_ID = '33333333-3333-4333-8333-333333333333'
const EMAIL = 'student@example.test'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

function mockCaller(role = 'school_admin', schoolId: string | null = SCHOOL_A) {
  vi.doMock('@/lib/support-access', () => ({
    resolveSupportAccessContext: vi.fn().mockResolvedValue({
      actorUserId: ADMIN_ID,
      actorEmail: 'admin@example.test',
      actorProfile: { id: ADMIN_ID, role, school_id: schoolId },
      effectiveProfile: { id: ADMIN_ID, role, school_id: schoolId },
      supportActive: false,
      targetProfile: null,
    }),
    logSupportAction: vi.fn().mockResolvedValue(undefined),
  }))
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
} = {}, invitationStatus: 'pending' | 'accepted' | 'expired' | 'revoked' | null = null) {
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

  const invitationUpdate = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ data: null, error: null }),
  })
  const invitationInsert = vi.fn().mockResolvedValue({ data: null, error: null })

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
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: invitationStatus ? { id: 'invitation-1', status: invitationStatus } : null,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
          insert: invitationInsert,
          update: invitationUpdate,
        }
      }

      throw new Error(`Unexpected table: ${table}`)
    }),
  }

  vi.doMock('@/lib/supabase-service-role', () => ({
    createServiceRoleClient: vi.fn().mockReturnValue(serviceClient),
  }))

  return { serviceClient, resetPasswordForEmail, getUserById, listUsers, invitationUpdate, invitationInsert }
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
    vi.doUnmock('@/lib/support-access')
    vi.doUnmock('@/lib/auth-helpers')
    vi.restoreAllMocks()
  })

  it('treats a repeat same-school/same-role invitation as idempotent without sending recovery email', async () => {
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
    expect(result.data).toEqual({ id: USER_ID, alreadyInvited: true })
    expect(resetPasswordForEmail).not.toHaveBeenCalled()
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

  it('reopens an expired invitation to pending when a fresh setup link is sent', async () => {
    const { invitationUpdate } = makeServiceClient({}, 'expired')
    const { resendUserSetupLink } = await import('./actions')

    const result = await resendUserSetupLink(USER_ID)

    expect(result.success).toBe(true)
    expect(invitationUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        auth_user_id: USER_ID,
        status: 'pending',
        accepted_at: null,
        revoked_at: null,
        revoked_by: null,
      })
    )
  })

  it('does not send recovery email when invitation persistence fails', async () => {
    const { resetPasswordForEmail, invitationUpdate } = makeServiceClient({}, 'expired')
    invitationUpdate.mockImplementation(() => ({
      eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'disposable invitation write failure' } }),
    }))
    const { resendUserSetupLink } = await import('./actions')
    const result = await resendUserSetupLink(USER_ID)
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/disposable invitation write failure/)
    expect(resetPasswordForEmail).not.toHaveBeenCalled()
  })

  it('does not send setup links to disabled accounts', async () => {
    const { resetPasswordForEmail } = makeServiceClient({ is_disabled: true })
    const { resendUserSetupLink } = await import('./actions')

    const result = await resendUserSetupLink(USER_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/disabled/i)
    expect(resetPasswordForEmail).not.toHaveBeenCalled()
  })
  it.each(['student', 'instructor', 'school_admin'])('keeps %s identity stable when resending recovery link', async role => {
    const { resetPasswordForEmail, getUserById, serviceClient } = makeServiceClient({ role })
    const { resendUserSetupLink } = await import('./actions')
    const result = await resendUserSetupLink(USER_ID)
    expect(result.success).toBe(true)
    expect(getUserById).toHaveBeenCalledWith(USER_ID)
    expect(resetPasswordForEmail).toHaveBeenCalledTimes(1)
    expect(serviceClient.auth.admin.inviteUserByEmail).not.toHaveBeenCalled()
  })

  it('blocks School B administrator recovery of School A student', async () => {
    vi.resetModules()
    mockCaller('school_admin', SCHOOL_B)
    // Constrain this regression to the real, school-scoped actor rather than
    // allowing a stale/mocked platform-admin predicate to bypass school scope.
    vi.doMock('@/lib/auth-helpers', async (importOriginal) => ({
      ...await importOriginal<typeof import('@/lib/auth-helpers')>(),
      isPlatformAdminProfile: () => false,
    }))
    const { resetPasswordForEmail } = makeServiceClient({ school_id: SCHOOL_A })
    const { resendUserSetupLink } = await import('./actions')
    const result = await resendUserSetupLink(USER_ID)
    expect(result.success).toBe(false)
    expect(resetPasswordForEmail).not.toHaveBeenCalled()
  })

  it('blocks rejected user recovery without sending email', async () => {
    const { resetPasswordForEmail } = makeServiceClient({ approval_status: 'rejected' })
    const { resendUserSetupLink } = await import('./actions')
    const result = await resendUserSetupLink(USER_ID)
    expect(result.success).toBe(false)
    expect(resetPasswordForEmail).not.toHaveBeenCalled()
  })

})

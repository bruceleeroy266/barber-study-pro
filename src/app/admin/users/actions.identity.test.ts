/**
 * @vitest-environment node
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const ADMIN_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const USER_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
const SCHOOL_A = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
const SCHOOL_B = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

type Profile = {
  id: string
  email: string
  full_name: string
  role: string
  school_id: string | null
  approval_status: string
  is_disabled: boolean
  include_in_school_metrics: boolean
  requires_password_change: boolean
}

function mockCaller(role = 'admin', schoolId: string | null = null) {
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

function mockService(options: {
  profile?: Partial<Profile>
  authEmail?: string
  duplicateProfiles?: Array<{ id: string }>
  authLookupError?: { message: string } | null
  authUpdateErrors?: Array<{ message: string } | null>
  reconciliationError?: { message: string } | null
  duplicateLookupError?: { message: string } | null
} = {}) {
  const profile: Profile = {
    id: USER_ID,
    email: 'old@example.test',
    full_name: 'Old Name',
    role: 'student',
    school_id: SCHOOL_A,
    approval_status: 'approved',
    is_disabled: false,
    include_in_school_metrics: true,
    requires_password_change: false,
    ...options.profile,
  }

  const authUpdate = vi.fn()
  const authUpdateErrors = options.authUpdateErrors ?? [null]
  for (const error of authUpdateErrors) {
    authUpdate.mockResolvedValueOnce({ data: { user: {} }, error })
  }
  authUpdate.mockResolvedValue({ data: { user: {} }, error: null })

  const rpc = vi.fn().mockResolvedValue({
    data: { profile_updated: true, invitation_reconciled: true, invitation_status: 'pending' },
    error: options.reconciliationError ?? null,
  })
  const auditInsert = vi.fn().mockResolvedValue({ data: null, error: null })

  const serviceClient = {
    auth: {
      admin: {
        getUserById: vi.fn().mockResolvedValue({
          data: options.authLookupError
            ? { user: null }
            : {
                user: {
                  id: USER_ID,
                  email: options.authEmail ?? profile.email,
                  user_metadata: { full_name: profile.full_name, role: profile.role, keep: 'metadata' },
                },
              },
          error: options.authLookupError ?? null,
        }),
        updateUserById: authUpdate,
      },
    },
    rpc,
    from: vi.fn((table: string) => {
      if (table === 'profiles') {
        return {
          select: vi.fn((columns: string) => {
            if (columns === 'id') {
              return {
                ilike: vi.fn().mockReturnValue({
                  neq: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({
                      data: options.duplicateProfiles ?? [],
                      error: options.duplicateLookupError ?? null,
                    }),
                  }),
                }),
              }
            }

            return {
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: profile, error: null }),
              }),
            }
          }),
        }
      }

      if (table === 'user_management_audit_logs') {
        return { insert: auditInsert }
      }

      throw new Error(`Unexpected table: ${table}`)
    }),
  }

  vi.doMock('@/lib/supabase-service-role', () => ({
    createServiceRoleClient: vi.fn().mockReturnValue(serviceClient),
  }))

  return { profile, serviceClient, authUpdate, rpc, auditInsert }
}

describe('UM-H3.2/3 updateUserIdentity', () => {
  beforeEach(() => {
    vi.resetModules()
    mockCaller()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('updates Auth then transactionally reconciles profile + onboarding identity', async () => {
    const { authUpdate, rpc, auditInsert } = mockService()
    const { updateUserIdentity } = await import('./actions')

    const result = await updateUserIdentity(USER_ID, {
      full_name: '  Correct Name  ',
      email: '  CORRECT@Example.Test ',
    })

    expect(result).toEqual({
      success: true,
      data: {
        id: USER_ID,
        full_name: 'Correct Name',
        email: 'correct@example.test',
        changed: true,
      },
    })
    expect(authUpdate).toHaveBeenCalledWith(
      USER_ID,
      expect.objectContaining({
        email: 'correct@example.test',
        user_metadata: {
          full_name: 'Correct Name',
          role: 'student',
          keep: 'metadata',
        },
      })
    )
    expect(rpc).toHaveBeenCalledWith(
      'reconcile_user_identity_profile_and_invitation',
      {
        p_user_id: USER_ID,
        p_expected_old_email: 'old@example.test',
        p_new_email: 'correct@example.test',
        p_full_name: 'Correct Name',
      }
    )
    expect(auditInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        target_user_id: USER_ID,
        target_user_email: 'correct@example.test',
        action: 'update_user_identity',
        old_values: { full_name: 'Old Name', email: 'old@example.test' },
        new_values: { full_name: 'Correct Name', email: 'correct@example.test' },
      })
    )
  })

  it('allows a school admin to edit a user in the same school', async () => {
    vi.resetModules()
    mockCaller('school_admin', SCHOOL_A)
    mockService()
    const { updateUserIdentity } = await import('./actions')

    const result = await updateUserIdentity(USER_ID, {
      full_name: 'Correct Name',
      email: 'old@example.test',
    })

    expect(result.success).toBe(true)
  })

  it('blocks a school admin from editing another school', async () => {
    vi.resetModules()
    mockCaller('school_admin', SCHOOL_A)
    const { authUpdate, rpc } = mockService({ profile: { school_id: SCHOOL_B } })
    const { updateUserIdentity } = await import('./actions')

    const result = await updateUserIdentity(USER_ID, {
      full_name: 'Correct Name',
      email: 'new@example.test',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden/i)
    expect(authUpdate).not.toHaveBeenCalled()
    expect(rpc).not.toHaveBeenCalled()
  })

  it('rejects invalid email before mutating Auth', async () => {
    const { authUpdate, rpc } = mockService()
    const { updateUserIdentity } = await import('./actions')

    const result = await updateUserIdentity(USER_ID, {
      full_name: 'Correct Name',
      email: 'not-an-email',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/valid email/i)
    expect(authUpdate).not.toHaveBeenCalled()
    expect(rpc).not.toHaveBeenCalled()
  })

  it('rejects a duplicate profile email before mutating Auth', async () => {
    const { authUpdate, rpc } = mockService({ duplicateProfiles: [{ id: 'other-user' }] })
    const { updateUserIdentity } = await import('./actions')

    const result = await updateUserIdentity(USER_ID, {
      full_name: 'Correct Name',
      email: 'taken@example.test',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/already exists/i)
    expect(authUpdate).not.toHaveBeenCalled()
    expect(rpc).not.toHaveBeenCalled()
  })

  it('refuses to edit when Auth and profile email are already out of sync', async () => {
    const { authUpdate, rpc } = mockService({ authEmail: 'different@example.test' })
    const { updateUserIdentity } = await import('./actions')

    const result = await updateUserIdentity(USER_ID, {
      full_name: 'Correct Name',
      email: 'new@example.test',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/does not match/i)
    expect(authUpdate).not.toHaveBeenCalled()
    expect(rpc).not.toHaveBeenCalled()
  })

  it('does not reconcile database identity when Auth rejects the new email', async () => {
    const { authUpdate, rpc } = mockService({
      authUpdateErrors: [{ message: 'A user with this email already exists' }],
    })
    const { updateUserIdentity } = await import('./actions')

    const result = await updateUserIdentity(USER_ID, {
      full_name: 'Correct Name',
      email: 'taken@example.test',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/already exists/i)
    expect(authUpdate).toHaveBeenCalledTimes(1)
    expect(rpc).not.toHaveBeenCalled()
  })

  it('rolls Auth back when profile/invitation reconciliation fails', async () => {
    const { authUpdate, rpc } = mockService({
      reconciliationError: { message: 'invitation conflict' },
      authUpdateErrors: [null, null],
    })
    const { updateUserIdentity } = await import('./actions')

    const result = await updateUserIdentity(USER_ID, {
      full_name: 'Correct Name',
      email: 'new@example.test',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/rolled back/i)
    expect(rpc).toHaveBeenCalledTimes(1)
    expect(authUpdate).toHaveBeenCalledTimes(2)
    expect(authUpdate).toHaveBeenNthCalledWith(
      2,
      USER_ID,
      expect.objectContaining({
        email: 'old@example.test',
        user_metadata: {
          full_name: 'Old Name',
          role: 'student',
          keep: 'metadata',
        },
      })
    )
  })

  it('surfaces administrator-cleanup state when reconciliation and Auth rollback both fail', async () => {
    const { authUpdate } = mockService({
      reconciliationError: { message: 'database reconciliation failed' },
      authUpdateErrors: [null, { message: 'rollback failed' }],
    })
    const { updateUserIdentity } = await import('./actions')

    const result = await updateUserIdentity(USER_ID, {
      full_name: 'Correct Name',
      email: 'new@example.test',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/administrator cleanup is required/i)
    expect(authUpdate).toHaveBeenCalledTimes(2)
  })

  it('returns an idempotent no-op when normalized identity is unchanged', async () => {
    const { authUpdate, rpc } = mockService()
    const { updateUserIdentity } = await import('./actions')

    const result = await updateUserIdentity(USER_ID, {
      full_name: 'Old Name',
      email: ' OLD@EXAMPLE.TEST ',
    })

    expect(result).toEqual({
      success: true,
      data: {
        id: USER_ID,
        full_name: 'Old Name',
        email: 'old@example.test',
        changed: false,
      },
    })
    expect(authUpdate).not.toHaveBeenCalled()
    expect(rpc).not.toHaveBeenCalled()
  })
})

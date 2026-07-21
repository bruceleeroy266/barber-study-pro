/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { InviteUserFormData } from './actions'

const ADMIN_USER_ID = 'admin-user-id'
const ADMIN_EMAIL = 'admin@ascynpro.test'
const INVITED_USER_ID = 'invited-user-id'
const RISE_SCHOOL_ID = '12b09747-7391-4811-bc22-db7eebbb12c1'

type MockFn = ReturnType<typeof vi.fn>

interface ServiceClientOverrides {
  auth?: {
    admin?: Partial<{
      listUsers: MockFn
      inviteUserByEmail: MockFn
      deleteUser: MockFn
    }>
  }
  from?: Record<string, unknown>
}

function createMockServiceClient(overrides: ServiceClientOverrides = {}) {
  const authAdmin = {
    listUsers: vi.fn().mockResolvedValue({ data: { users: [] }, error: null }),
    inviteUserByEmail: vi
      .fn()
      .mockResolvedValue({
        data: { user: { id: INVITED_USER_ID, email: 'instructor@rise.test' } },
        error: null,
      }),
    deleteUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
    ...(overrides.auth?.admin || {}),
  }

  const fromHandlers: Record<string, unknown> = {
    schools: {
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: { id: RISE_SCHOOL_ID, is_active: true, deleted_at: null },
              error: null,
            }),
        }),
      }),
    },
    profiles: {
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: null,
              error: null,
            }),
        }),
      }),
      upsert: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    },
    user_management_audit_logs: {
      insert: () => Promise.resolve({ data: null, error: null }),
    },
    ...(overrides.from || {}),
  }

  return {
    auth: {
      admin: authAdmin,
    },
    from: (table: string) => {
      const handler = fromHandlers[table]
      if (!handler) {
        throw new Error(`Unexpected table in test: ${table}`)
      }
      return handler as { select: () => unknown; upsert: () => Promise<unknown> }
    },
  }
}

function setupMocks(serviceClientOverrides: ServiceClientOverrides = {}, role = 'admin') {
  const mockServiceClient = createMockServiceClient(serviceClientOverrides)

  vi.doMock('@/lib/supabase-server', () => ({
    createClient: vi.fn().mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: ADMIN_USER_ID, email: ADMIN_EMAIL } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role, school_id: RISE_SCHOOL_ID },
              error: null,
            }),
          }),
        }),
      }),
    }),
  }))

  vi.doMock('@/lib/supabase-service-role', () => ({
    createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient),
  }))

  return mockServiceClient
}

describe('inviteUser', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('sends an invitation and upserts the profile for a new instructor', async () => {
    const mockServiceClient = setupMocks()
    const { inviteUser: inviteUserAction } = await import('./actions')

    const formData: InviteUserFormData = {
      full_name: 'Tessa Myers',
      email: 'instructor@rise.test',
      role: 'instructor',
      school_id: RISE_SCHOOL_ID,
      approval_status: 'approved',
    }

    const result = await inviteUserAction(formData)

    expect(result.success).toBe(true)
    expect(result.data?.id).toBe(INVITED_USER_ID)
    expect(mockServiceClient.auth.admin.inviteUserByEmail).toHaveBeenCalledWith(
      'instructor@rise.test',
      expect.objectContaining({
        redirectTo: 'http://localhost:3000/auth/callback',
        data: expect.objectContaining({ full_name: 'Tessa Myers', role: 'instructor' }),
      })
    )
    expect(mockServiceClient.from('profiles').upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: INVITED_USER_ID,
        email: 'instructor@rise.test',
        full_name: 'Tessa Myers',
        role: 'instructor',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
        is_disabled: false,
        requires_password_change: false,
      }),
      { onConflict: 'id' }
    )
  })

  it('rejects when an auth user with the same email already exists', async () => {
    setupMocks({
      auth: {
        admin: {
          listUsers: vi.fn().mockResolvedValue({
            data: { users: [{ id: 'existing-user', email: 'instructor@rise.test' }] },
            error: null,
          }),
        },
      },
    })
    const { inviteUser: inviteUserAction } = await import('./actions')

    const result = await inviteUserAction({
      full_name: 'Tessa Myers',
      email: 'instructor@rise.test',
      role: 'instructor',
      school_id: RISE_SCHOOL_ID,
      approval_status: 'approved',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/already exists/i)
  })

  it('upserts a trigger-created profile without creating a duplicate', async () => {
    const upsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
    setupMocks({
      from: {
        profiles: {
          upsert: upsertSpy,
        },
      },
    })
    const { inviteUser: inviteUserAction } = await import('./actions')

    const result = await inviteUserAction({
      full_name: 'Tessa Myers',
      email: 'instructor@rise.test',
      role: 'instructor',
      school_id: RISE_SCHOOL_ID,
      approval_status: 'approved',
    })

    expect(result.success).toBe(true)
    expect(upsertSpy).toHaveBeenCalledTimes(1)
    expect(upsertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: INVITED_USER_ID,
        email: 'instructor@rise.test',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      }),
      { onConflict: 'id' }
    )
  })

  it('rejects when the admin is not authenticated', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      }),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { inviteUser: inviteUserAction } = await import('./actions')

    const result = await inviteUserAction({
      full_name: 'Tessa Myers',
      email: 'instructor@rise.test',
      role: 'instructor',
      school_id: RISE_SCHOOL_ID,
      approval_status: 'approved',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })

  it('rejects an invalid role', async () => {
    setupMocks()
    const { inviteUser: inviteUserAction } = await import('./actions')

    const result = await inviteUserAction({
      full_name: 'Tessa Myers',
      email: 'instructor@rise.test',
      // @ts-expect-error intentionally invalid role for test
      role: 'invalid_role',
      school_id: RISE_SCHOOL_ID,
      approval_status: 'approved',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/invalid role/i)
  })

  it('rejects an invalid or inactive school', async () => {
    setupMocks({
      from: {
        schools: {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: null,
                  error: { message: 'No rows found', code: 'PGRST116' },
                }),
            }),
          }),
        },
      },
    })
    const { inviteUser: inviteUserAction } = await import('./actions')

    const result = await inviteUserAction({
      full_name: 'Tessa Myers',
      email: 'instructor@rise.test',
      role: 'instructor',
      school_id: RISE_SCHOOL_ID,
      approval_status: 'approved',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/invalid school/i)
  })

  it('returns an error when the invitation email fails to send', async () => {
    setupMocks({
      auth: {
        admin: {
          inviteUserByEmail: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Email provider error' },
          }),
        },
      },
    })
    const { inviteUser: inviteUserAction } = await import('./actions')

    const result = await inviteUserAction({
      full_name: 'Tessa Myers',
      email: 'instructor@rise.test',
      role: 'instructor',
      school_id: RISE_SCHOOL_ID,
      approval_status: 'approved',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/email provider error|failed to send invitation/i)
  })

  it('deletes the invited auth user and returns an error when profile creation fails', async () => {
    const mockServiceClient = setupMocks({
      from: {
        profiles: {
          select: () => ({
            eq: () => Promise.resolve({ data: [], error: null }),
          }),
          upsert: () =>
            Promise.resolve({
              data: null,
              error: { message: 'profiles upsert failed' },
            }),
        },
      },
    })
    const { inviteUser: inviteUserAction } = await import('./actions')

    const result = await inviteUserAction({
      full_name: 'Tessa Myers',
      email: 'instructor@rise.test',
      role: 'instructor',
      school_id: RISE_SCHOOL_ID,
      approval_status: 'approved',
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/profiles upsert failed/i)
    expect(mockServiceClient.auth.admin.deleteUser).toHaveBeenCalledWith(INVITED_USER_ID)
  })
})

describe('deleteUser', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  const TARGET_USER_ID = 'target-user-id'

  function setupDeleteMocks(overrides: ServiceClientOverrides = {}, role = 'admin') {
    return setupMocks(
      {
        from: {
          profiles: {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      id: TARGET_USER_ID,
                      email: 'target@ascynpro.test',
                      role: 'instructor',
                      school_id: RISE_SCHOOL_ID,
                      approval_status: 'approved',
                      is_disabled: false,
                      requires_password_change: false,
                    },
                    error: null,
                  }),
              }),
            }),
            upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
          },
          ...(overrides.from || {}),
        },
        ...overrides,
      },
      role
    )
  }

  it('deletes the auth user and logs the action', async () => {
    const mockServiceClient = setupDeleteMocks()
    const { deleteUser: deleteUserAction } = await import('./actions')

    const result = await deleteUserAction(TARGET_USER_ID)

    expect(result.success).toBe(true)
    expect(mockServiceClient.auth.admin.deleteUser).toHaveBeenCalledWith(TARGET_USER_ID)
  })

  it('prevents admins from deleting themselves', async () => {
    const mockServiceClient = setupDeleteMocks()
    const { deleteUser: deleteUserAction } = await import('./actions')

    const result = await deleteUserAction(ADMIN_USER_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/cannot delete your own account/i)
    expect(mockServiceClient.auth.admin.deleteUser).not.toHaveBeenCalled()
  })

  it('rejects when the admin is not authenticated', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      }),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { deleteUser: deleteUserAction } = await import('./actions')

    const result = await deleteUserAction(TARGET_USER_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })

  it('prevents school admins from deleting platform admins', async () => {
    const mockServiceClient = setupDeleteMocks(
      {
        from: {
          profiles: {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      id: TARGET_USER_ID,
                      email: 'target@ascynpro.test',
                      role: 'admin',
                      school_id: RISE_SCHOOL_ID,
                      approval_status: 'approved',
                      is_disabled: false,
                      requires_password_change: false,
                    },
                    error: null,
                  }),
              }),
            }),
            upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
          },
        },
      },
      'school_admin'
    )
    const { deleteUser: deleteUserAction } = await import('./actions')

    const result = await deleteUserAction(TARGET_USER_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/cannot delete platform administrators/i)
    expect(mockServiceClient.auth.admin.deleteUser).not.toHaveBeenCalled()
  })

  it('prevents school admins from deleting users outside their school', async () => {
    const mockServiceClient = setupDeleteMocks(
      {
        from: {
          profiles: {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      id: TARGET_USER_ID,
                      email: 'target@ascynpro.test',
                      role: 'instructor',
                      school_id: 'other-school-id',
                      approval_status: 'approved',
                      is_disabled: false,
                      requires_password_change: false,
                    },
                    error: null,
                  }),
              }),
            }),
            upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
          },
        },
      },
      'school_admin'
    )
    const { deleteUser: deleteUserAction } = await import('./actions')

    const result = await deleteUserAction(TARGET_USER_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden/i)
    expect(mockServiceClient.auth.admin.deleteUser).not.toHaveBeenCalled()
  })

  it('returns an error when the auth delete fails', async () => {
    const mockServiceClient = setupDeleteMocks({
      auth: {
        admin: {
          deleteUser: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Auth delete failed' },
          }),
        },
      },
    })
    const { deleteUser: deleteUserAction } = await import('./actions')

    const result = await deleteUserAction(TARGET_USER_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/auth delete failed/i)
    expect(mockServiceClient.auth.admin.deleteUser).toHaveBeenCalledWith(TARGET_USER_ID)
  })
})

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
      createUser: MockFn
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
    createUser: vi
      .fn()
      .mockResolvedValue({
        data: { user: { id: INVITED_USER_ID, email: 'student@rise.test' } },
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
      insert: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
      upsert: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    },
    students: {
      insert: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    },
    instructors: {
      insert: vi.fn().mockResolvedValue({
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
      return handler as { select: () => unknown; upsert: () => Promise<unknown>; insert: () => Promise<unknown> }
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

describe('Phase 7A Slice 3: Domain Record Creation', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  describe('inviteUser() domain record creation', () => {
    it('creates a students record when inviting a student with school_id', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        role: 'student',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).toHaveBeenCalledTimes(1)
      expect(studentsInsertSpy).toHaveBeenCalledWith({
        profile_id: INVITED_USER_ID,
        school_id: RISE_SCHOOL_ID,
      })
    })

    it('creates an instructors record when inviting an instructor with school_id', async () => {
      const instructorsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          instructors: {
            insert: instructorsInsertSpy,
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
      expect(instructorsInsertSpy).toHaveBeenCalledTimes(1)
      expect(instructorsInsertSpy).toHaveBeenCalledWith({
        profile_id: INVITED_USER_ID,
        school_id: RISE_SCHOOL_ID,
      })
    })

    it('does NOT create an instructors record when inviting a student', async () => {
      const instructorsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        role: 'student',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(instructorsInsertSpy).not.toHaveBeenCalled()
    })

    it('does NOT create a students record when inviting an instructor', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
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
      expect(studentsInsertSpy).not.toHaveBeenCalled()
    })

    it('does NOT create any domain record when inviting a school_admin', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const instructorsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'School Admin',
        email: 'schooladmin@rise.test',
        role: 'school_admin',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).not.toHaveBeenCalled()
      expect(instructorsInsertSpy).not.toHaveBeenCalled()
    })

    it('does NOT create any domain record when inviting an admin', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const instructorsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Platform Admin',
        email: 'admin@ascynpro.test',
        role: 'admin',
        school_id: null,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).not.toHaveBeenCalled()
      expect(instructorsInsertSpy).not.toHaveBeenCalled()
    })

    it('does NOT create any domain record when inviting an apprentice', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const instructorsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Apprentice User',
        email: 'apprentice@rise.test',
        role: 'apprentice',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).not.toHaveBeenCalled()
      expect(instructorsInsertSpy).not.toHaveBeenCalled()
    })

    it('does NOT create a students record when school_id is null', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        role: 'student',
        school_id: null,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).not.toHaveBeenCalled()
    })

    it('does NOT create an instructors record when school_id is null', async () => {
      const instructorsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Tessa Myers',
        email: 'instructor@rise.test',
        role: 'instructor',
        school_id: null,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(instructorsInsertSpy).not.toHaveBeenCalled()
    })

    it('handles duplicate students record (23505) as idempotent success', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '23505', message: 'duplicate key value violates unique constraint' },
      })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        role: 'student',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).toHaveBeenCalledTimes(1)
    })

    it('handles duplicate instructors record (23505) as idempotent success', async () => {
      const instructorsInsertSpy = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '23505', message: 'duplicate key value violates unique constraint' },
      })
      const mockServiceClient = setupMocks({
        from: {
          instructors: {
            insert: instructorsInsertSpy,
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
      expect(instructorsInsertSpy).toHaveBeenCalledTimes(1)
    })

    it('surfaces non-23505 students INSERT failure as error', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '42501', message: 'permission denied for table students' },
      })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        role: 'student',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(false)
      expect(result.error).toMatch(/failed to create student record/i)
      // Auth user should NOT be deleted (partial success model)
      expect(mockServiceClient.auth.admin.deleteUser).not.toHaveBeenCalled()
    })

    it('surfaces non-23505 instructors INSERT failure as error', async () => {
      const instructorsInsertSpy = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '42501', message: 'permission denied for table instructors' },
      })
      const mockServiceClient = setupMocks({
        from: {
          instructors: {
            insert: instructorsInsertSpy,
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
      expect(result.error).toMatch(/failed to create instructor record/i)
      // Auth user should NOT be deleted (partial success model)
      expect(mockServiceClient.auth.admin.deleteUser).not.toHaveBeenCalled()
    })

    it('uses the correct profile_id from the invited auth user', async () => {
      const customUserId = 'custom-invited-user-id'
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        auth: {
          admin: {
            inviteUserByEmail: vi.fn().mockResolvedValue({
              data: { user: { id: customUserId, email: 'student@rise.test' } },
              error: null,
            }),
          },
        },
        from: {
          students: {
            insert: studentsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        role: 'student',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).toHaveBeenCalledWith({
        profile_id: customUserId,
        school_id: RISE_SCHOOL_ID,
      })
    })

    it('uses the authoritative school_id from the validated form data', async () => {
      const customSchoolId = 'custom-school-id-12345'
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          schools: {
            select: () => ({
              eq: () => ({
                single: () =>
                  Promise.resolve({
                    data: { id: customSchoolId, is_active: true, deleted_at: null },
                    error: null,
                  }),
              }),
            }),
          },
          students: {
            insert: studentsInsertSpy,
          },
        },
      })
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        role: 'student',
        school_id: customSchoolId,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).toHaveBeenCalledWith({
        profile_id: INVITED_USER_ID,
        school_id: customSchoolId,
      })
    })
  })

  describe('createUser() domain record creation', () => {
    it('creates a students record when creating a student with school_id', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
        },
      })
      const { createUser: createUserAction } = await import('./actions')

      const result = await createUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        password: 'temporary-password-123',
        role: 'student',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).toHaveBeenCalledTimes(1)
      expect(studentsInsertSpy).toHaveBeenCalledWith({
        profile_id: INVITED_USER_ID,
        school_id: RISE_SCHOOL_ID,
      })
    })

    it('creates an instructors record when creating an instructor with school_id', async () => {
      const instructorsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { createUser: createUserAction } = await import('./actions')

      const result = await createUserAction({
        full_name: 'Tessa Myers',
        email: 'instructor@rise.test',
        password: 'temporary-password-123',
        role: 'instructor',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(instructorsInsertSpy).toHaveBeenCalledTimes(1)
      expect(instructorsInsertSpy).toHaveBeenCalledWith({
        profile_id: INVITED_USER_ID,
        school_id: RISE_SCHOOL_ID,
      })
    })

    it('does NOT create an instructors record when creating a student', async () => {
      const instructorsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { createUser: createUserAction } = await import('./actions')

      const result = await createUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        password: 'temporary-password-123',
        role: 'student',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(instructorsInsertSpy).not.toHaveBeenCalled()
    })

    it('does NOT create a students record when creating an instructor', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
        },
      })
      const { createUser: createUserAction } = await import('./actions')

      const result = await createUserAction({
        full_name: 'Tessa Myers',
        email: 'instructor@rise.test',
        password: 'temporary-password-123',
        role: 'instructor',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).not.toHaveBeenCalled()
    })

    it('does NOT create any domain record when creating a school_admin', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const instructorsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { createUser: createUserAction } = await import('./actions')

      const result = await createUserAction({
        full_name: 'School Admin',
        email: 'schooladmin@rise.test',
        password: 'temporary-password-123',
        role: 'school_admin',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).not.toHaveBeenCalled()
      expect(instructorsInsertSpy).not.toHaveBeenCalled()
    })

    it('does NOT create any domain record when school_id is null', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const instructorsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { createUser: createUserAction } = await import('./actions')

      const result = await createUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        password: 'temporary-password-123',
        role: 'student',
        school_id: null,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).not.toHaveBeenCalled()
      expect(instructorsInsertSpy).not.toHaveBeenCalled()
    })

    it('handles duplicate students record (23505) as idempotent success', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '23505', message: 'duplicate key value violates unique constraint' },
      })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
        },
      })
      const { createUser: createUserAction } = await import('./actions')

      const result = await createUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        password: 'temporary-password-123',
        role: 'student',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).toHaveBeenCalledTimes(1)
    })

    it('handles duplicate instructors record (23505) as idempotent success', async () => {
      const instructorsInsertSpy = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '23505', message: 'duplicate key value violates unique constraint' },
      })
      const mockServiceClient = setupMocks({
        from: {
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { createUser: createUserAction } = await import('./actions')

      const result = await createUserAction({
        full_name: 'Tessa Myers',
        email: 'instructor@rise.test',
        password: 'temporary-password-123',
        role: 'instructor',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(instructorsInsertSpy).toHaveBeenCalledTimes(1)
    })

    it('surfaces non-23505 students INSERT failure as error', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '42501', message: 'permission denied for table students' },
      })
      const mockServiceClient = setupMocks({
        from: {
          students: {
            insert: studentsInsertSpy,
          },
        },
      })
      const { createUser: createUserAction } = await import('./actions')

      const result = await createUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        password: 'temporary-password-123',
        role: 'student',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(false)
      expect(result.error).toMatch(/failed to create student record/i)
      // Auth user should NOT be deleted (partial success model)
      expect(mockServiceClient.auth.admin.deleteUser).not.toHaveBeenCalled()
    })

    it('surfaces non-23505 instructors INSERT failure as error', async () => {
      const instructorsInsertSpy = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '42501', message: 'permission denied for table instructors' },
      })
      const mockServiceClient = setupMocks({
        from: {
          instructors: {
            insert: instructorsInsertSpy,
          },
        },
      })
      const { createUser: createUserAction } = await import('./actions')

      const result = await createUserAction({
        full_name: 'Tessa Myers',
        email: 'instructor@rise.test',
        password: 'temporary-password-123',
        role: 'instructor',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(false)
      expect(result.error).toMatch(/failed to create instructor record/i)
      // Auth user should NOT be deleted (partial success model)
      expect(mockServiceClient.auth.admin.deleteUser).not.toHaveBeenCalled()
    })
  })

  describe('Authorization and tenant boundary', () => {
    it('school_admin can only create students in their own school', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks(
        {
          from: {
            students: {
              insert: studentsInsertSpy,
            },
          },
        },
        'school_admin'
      )
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        role: 'student',
        school_id: RISE_SCHOOL_ID,
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).toHaveBeenCalledWith({
        profile_id: INVITED_USER_ID,
        school_id: RISE_SCHOOL_ID,
      })
    })

    it('school_admin cannot create students in a different school', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks(
        {
          from: {
            schools: {
              select: () => ({
                eq: () => ({
                  single: () =>
                    Promise.resolve({
                      data: { id: 'other-school-id', is_active: true, deleted_at: null },
                      error: null,
                    }),
                }),
              }),
            },
            students: {
              insert: studentsInsertSpy,
            },
          },
        },
        'school_admin'
      )
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        role: 'student',
        school_id: 'other-school-id',
        approval_status: 'approved',
      })

      expect(result.success).toBe(false)
      expect(result.error).toMatch(/cannot assign user to a different school/i)
      expect(studentsInsertSpy).not.toHaveBeenCalled()
    })

    it('platform admin can create students in any school', async () => {
      const studentsInsertSpy = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockServiceClient = setupMocks(
        {
          from: {
            schools: {
              select: () => ({
                eq: () => ({
                  single: () =>
                    Promise.resolve({
                      data: { id: 'any-school-id', is_active: true, deleted_at: null },
                      error: null,
                    }),
                }),
              }),
            },
            students: {
              insert: studentsInsertSpy,
            },
          },
        },
        'admin'
      )
      const { inviteUser: inviteUserAction } = await import('./actions')

      const result = await inviteUserAction({
        full_name: 'Patty Pineda',
        email: 'student@rise.test',
        role: 'student',
        school_id: 'any-school-id',
        approval_status: 'approved',
      })

      expect(result.success).toBe(true)
      expect(studentsInsertSpy).toHaveBeenCalledWith({
        profile_id: INVITED_USER_ID,
        school_id: 'any-school-id',
      })
    })
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

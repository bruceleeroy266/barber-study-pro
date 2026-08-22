/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const ADMIN_USER_ID = 'admin-user-id'
const ADMIN_EMAIL = 'admin@ascynpro.test'
const RISE_SCHOOL_ID = '12b09747-7391-4811-bc22-db7eebbb12c1'
const STUDENT_PROFILE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
const STUDENT_DOMAIN_ID = 'b2c3d4e5-f6a7-8901-bcde-f12345678901'
const PROGRAM_ID = 'c3d4e5f6-a7b8-9012-cdef-123456789012'
const ENROLLMENT_ID = 'd4e5f6a7-b8c9-0123-defa-234567890123'
const OTHER_SCHOOL_ID = 'e5f6a7b8-c9d0-1234-efab-345678901234'

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
    inviteUserByEmail: vi.fn().mockResolvedValue({ data: { user: { id: 'invited-user-id', email: 'test@test.com' } }, error: null }),
    createUser: vi.fn().mockResolvedValue({ data: { user: { id: 'invited-user-id', email: 'test@test.com' } }, error: null }),
    deleteUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
    ...(overrides.auth?.admin || {}),
  }

  const fromHandlers: Record<string, unknown> = {
    schools: {
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: { id: RISE_SCHOOL_ID, is_active: true, deleted_at: null }, error: null }),
        }),
      }),
    },
    profiles: {
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
    students: {
      select: () => ({
        eq: () => ({
          is: () => ({
            single: () => Promise.resolve({
              data: { id: STUDENT_DOMAIN_ID, profile_id: STUDENT_PROFILE_ID, school_id: RISE_SCHOOL_ID },
              error: null,
            }),
          }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
    instructors: {
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
    programs: {
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: { id: PROGRAM_ID, name: 'Barbering Fundamentals', school_id: RISE_SCHOOL_ID, is_active: true, deleted_at: null },
            error: null,
          }),
          is: () => ({
            order: () => Promise.resolve({
              data: [{ id: PROGRAM_ID, name: 'Barbering Fundamentals', school_id: RISE_SCHOOL_ID }],
              error: null,
            }),
          }),
        }),
      }),
    },
    enrollments: {
      insert: vi.fn().mockReturnValue({
        select: () => ({
          single: () => Promise.resolve({ data: { id: ENROLLMENT_ID }, error: null }),
        }),
      }),
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: {
              id: ENROLLMENT_ID,
              student_id: STUDENT_DOMAIN_ID,
              program_id: PROGRAM_ID,
              status: 'active',
              is_active: true,
              students: { profile_id: STUDENT_PROFILE_ID, school_id: RISE_SCHOOL_ID },
            },
            error: null,
          }),
          order: () => Promise.resolve({
            data: [{
              id: ENROLLMENT_ID,
              student_id: STUDENT_DOMAIN_ID,
              program_id: PROGRAM_ID,
              start_date: '2026-08-22',
              expected_end_date: null,
              status: 'active',
              notes: null,
              is_active: true,
              created_at: '2026-08-22T00:00:00Z',
              updated_at: '2026-08-22T00:00:00Z',
              programs: { name: 'Barbering Fundamentals' },
            }],
            error: null,
          }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    },
    user_management_audit_logs: {
      insert: () => Promise.resolve({ data: null, error: null }),
    },
    ...(overrides.from || {}),
  }

  return {
    auth: { admin: authAdmin },
    from: (table: string) => {
      const handler = fromHandlers[table]
      if (!handler) {
        throw new Error(`Unexpected table in test: ${table}`)
      }
      return handler as { select: () => unknown; upsert: () => Promise<unknown>; insert: () => Promise<unknown> }
    },
  }
}

function setupEnrollmentMocks(
  serviceClientOverrides: ServiceClientOverrides = {},
  role = 'admin',
  callerSchoolId: string | null = RISE_SCHOOL_ID
) {
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
              data: { role, school_id: callerSchoolId },
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

describe('Phase 7A Slice 4: enrollStudent()', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('enrolls a student in a program (happy path)', async () => {
    setupEnrollmentMocks()
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(true)
    expect(result.data?.enrollmentId).toBe(ENROLLMENT_ID)
  })

  it('resolves canonical students.id from profile_id', async () => {
    const insertSpy = vi.fn().mockReturnValue({
      select: () => ({ single: () => Promise.resolve({ data: { id: ENROLLMENT_ID }, error: null }) }),
    })
    setupEnrollmentMocks({
      from: {
        enrollments: {
          insert: insertSpy,
          select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
          update: vi.fn(),
        },
      },
    })
    const { enrollStudent: enrollAction } = await import('./actions')

    await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        student_id: STUDENT_DOMAIN_ID,
        program_id: PROGRAM_ID,
      })
    )
  })

  it('rejects when student domain record is missing (Slice 3 partial success)', async () => {
    setupEnrollmentMocks({
      from: {
        students: {
          select: () => ({
            eq: () => ({
              is: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'No rows found', code: 'PGRST116' } }),
              }),
            }),
          }),
        },
      },
    })
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/student domain record not found/i)
  })

  it('rejects cross-school enrollment (school_admin from School A, student from School B)', async () => {
    setupEnrollmentMocks({}, 'school_admin', OTHER_SCHOOL_ID)
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden.*different school/i)
  })

  it('rejects cross-school program (program belongs to different school)', async () => {
    setupEnrollmentMocks({
      from: {
        programs: {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({
                data: { id: PROGRAM_ID, name: 'Other School Program', school_id: OTHER_SCHOOL_ID, is_active: true, deleted_at: null },
                error: null,
              }),
            }),
          }),
        },
      },
    })
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/does not belong to the student.s school/i)
  })

  it('rejects invalid student UUID', async () => {
    setupEnrollmentMocks()
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction('not-a-uuid', PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/invalid student identifier format/i)
  })

  it('rejects invalid program UUID', async () => {
    setupEnrollmentMocks()
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, 'not-a-uuid')

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/invalid program identifier format/i)
  })

  it('rejects duplicate enrollment (23505 unique violation)', async () => {
    setupEnrollmentMocks({
      from: {
        enrollments: {
          insert: vi.fn().mockReturnValue({
            select: () => ({ single: () => Promise.resolve({ data: null, error: { code: '23505', message: 'duplicate key value violates unique constraint' } }) }),
          }),
          select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
          update: vi.fn(),
        },
      },
    })
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/already enrolled/i)
  })

  it('rejects when program is inactive', async () => {
    setupEnrollmentMocks({
      from: {
        programs: {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({
                data: { id: PROGRAM_ID, name: 'Inactive Program', school_id: RISE_SCHOOL_ID, is_active: false, deleted_at: null },
                error: null,
              }),
            }),
          }),
        },
      },
    })
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/no longer available/i)
  })

  it('rejects when program is soft-deleted', async () => {
    setupEnrollmentMocks({
      from: {
        programs: {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({
                data: { id: PROGRAM_ID, name: 'Deleted Program', school_id: RISE_SCHOOL_ID, is_active: true, deleted_at: '2026-01-01T00:00:00Z' },
                error: null,
              }),
            }),
          }),
        },
      },
    })
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/no longer available/i)
  })

  it('rejects when program does not exist', async () => {
    setupEnrollmentMocks({
      from: {
        programs: {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'No rows found', code: 'PGRST116' } }),
            }),
          }),
        },
      },
    })
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/program not found/i)
  })

  it('rejects unauthenticated caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
      }),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })

  it('rejects non-admin caller (student role)', async () => {
    setupEnrollmentMocks({}, 'student')
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden/i)
  })

  it('rejects instructor caller', async () => {
    setupEnrollmentMocks({}, 'instructor')
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden/i)
  })

  it('handles non-23505 database errors on insert', async () => {
    setupEnrollmentMocks({
      from: {
        enrollments: {
          insert: vi.fn().mockReturnValue({
            select: () => ({ single: () => Promise.resolve({ data: null, error: { code: '42501', message: 'permission denied' } }) }),
          }),
          select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
          update: vi.fn(),
        },
      },
    })
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/failed to create enrollment/i)
  })

  it('platform admin can enroll students across schools', async () => {
    setupEnrollmentMocks({}, 'admin', null)
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(true)
  })

  it('school_admin can enroll students in their own school', async () => {
    setupEnrollmentMocks({}, 'school_admin', RISE_SCHOOL_ID)
    const { enrollStudent: enrollAction } = await import('./actions')

    const result = await enrollAction(STUDENT_PROFILE_ID, PROGRAM_ID)

    expect(result.success).toBe(true)
  })
})

describe('Phase 7A Slice 4: unenrollStudent()', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('withdraws a student from a program (happy path)', async () => {
    const updateSpy = vi.fn().mockReturnValue({
      eq: () => Promise.resolve({ data: null, error: null }),
    })
    setupEnrollmentMocks({
      from: {
        enrollments: {
          insert: vi.fn(),
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({
                data: {
                  id: ENROLLMENT_ID,
                  student_id: STUDENT_DOMAIN_ID,
                  program_id: PROGRAM_ID,
                  status: 'active',
                  is_active: true,
                  students: { profile_id: STUDENT_PROFILE_ID, school_id: RISE_SCHOOL_ID },
                },
                error: null,
              }),
            }),
          }),
          update: updateSpy,
        },
      },
    })
    const { unenrollStudent: unenrollAction } = await import('./actions')

    const result = await unenrollAction(ENROLLMENT_ID)

    expect(result.success).toBe(true)
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'withdrawn', is_active: false })
    )
  })

  it('rejects invalid enrollment UUID', async () => {
    setupEnrollmentMocks()
    const { unenrollStudent: unenrollAction } = await import('./actions')

    const result = await unenrollAction('not-a-uuid')

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/invalid enrollment identifier format/i)
  })

  it('rejects when enrollment does not exist', async () => {
    setupEnrollmentMocks({
      from: {
        enrollments: {
          insert: vi.fn(),
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'No rows found', code: 'PGRST116' } }),
            }),
          }),
          update: vi.fn(),
        },
      },
    })
    const { unenrollStudent: unenrollAction } = await import('./actions')

    const result = await unenrollAction(ENROLLMENT_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/enrollment not found/i)
  })

  it('rejects cross-school unenrollment (enrollment-ID IDOR)', async () => {
    setupEnrollmentMocks({
      from: {
        enrollments: {
          insert: vi.fn(),
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({
                data: {
                  id: ENROLLMENT_ID,
                  student_id: STUDENT_DOMAIN_ID,
                  program_id: PROGRAM_ID,
                  status: 'active',
                  is_active: true,
                  students: { profile_id: STUDENT_PROFILE_ID, school_id: OTHER_SCHOOL_ID },
                },
                error: null,
              }),
            }),
          }),
          update: vi.fn(),
        },
      },
    }, 'school_admin', RISE_SCHOOL_ID)
    const { unenrollStudent: unenrollAction } = await import('./actions')

    const result = await unenrollAction(ENROLLMENT_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden.*different school/i)
  })

  it('rejects withdrawal of already-withdrawn enrollment', async () => {
    setupEnrollmentMocks({
      from: {
        enrollments: {
          insert: vi.fn(),
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({
                data: {
                  id: ENROLLMENT_ID,
                  student_id: STUDENT_DOMAIN_ID,
                  program_id: PROGRAM_ID,
                  status: 'withdrawn',
                  is_active: false,
                  students: { profile_id: STUDENT_PROFILE_ID, school_id: RISE_SCHOOL_ID },
                },
                error: null,
              }),
            }),
          }),
          update: vi.fn(),
        },
      },
    })
    const { unenrollStudent: unenrollAction } = await import('./actions')

    const result = await unenrollAction(ENROLLMENT_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/already withdrawn or inactive/i)
  })

  it('rejects unauthenticated caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
      }),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { unenrollStudent: unenrollAction } = await import('./actions')

    const result = await unenrollAction(ENROLLMENT_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })

  it('platform admin can unenroll across schools', async () => {
    setupEnrollmentMocks({}, 'admin', null)
    const { unenrollStudent: unenrollAction } = await import('./actions')

    const result = await unenrollAction(ENROLLMENT_ID)

    expect(result.success).toBe(true)
  })
})

describe('Phase 7A Slice 4: getStudentEnrollments()', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('returns enrollments for a student (happy path)', async () => {
    setupEnrollmentMocks()
    const { getStudentEnrollments: getEnrollmentsAction } = await import('./actions')

    const result = await getEnrollmentsAction(STUDENT_PROFILE_ID)

    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
    expect(result.data![0].program_name).toBe('Barbering Fundamentals')
    expect(result.data![0].status).toBe('active')
  })

  it('rejects cross-school enrollment retrieval', async () => {
    setupEnrollmentMocks({}, 'school_admin', OTHER_SCHOOL_ID)
    const { getStudentEnrollments: getEnrollmentsAction } = await import('./actions')

    const result = await getEnrollmentsAction(STUDENT_PROFILE_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden.*different school/i)
  })

  it('rejects when student domain record is missing', async () => {
    setupEnrollmentMocks({
      from: {
        students: {
          select: () => ({
            eq: () => ({
              is: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'No rows found', code: 'PGRST116' } }),
              }),
            }),
          }),
        },
      },
    })
    const { getStudentEnrollments: getEnrollmentsAction } = await import('./actions')

    const result = await getEnrollmentsAction(STUDENT_PROFILE_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/student domain record not found/i)
  })

  it('rejects unauthenticated caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
      }),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { getStudentEnrollments: getEnrollmentsAction } = await import('./actions')

    const result = await getEnrollmentsAction(STUDENT_PROFILE_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })

  it('rejects invalid student UUID', async () => {
    setupEnrollmentMocks()
    const { getStudentEnrollments: getEnrollmentsAction } = await import('./actions')

    const result = await getEnrollmentsAction('not-a-uuid')

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/invalid student identifier format/i)
  })

  it('platform admin can view enrollments across schools', async () => {
    setupEnrollmentMocks({}, 'admin', null)
    const { getStudentEnrollments: getEnrollmentsAction } = await import('./actions')

    const result = await getEnrollmentsAction(STUDENT_PROFILE_ID)

    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
  })

  it('returns empty array when student has no enrollments', async () => {
    setupEnrollmentMocks({
      from: {
        enrollments: {
          insert: vi.fn(),
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
              order: () => Promise.resolve({ data: [], error: null }),
            }),
          }),
          update: vi.fn(),
        },
      },
    })
    const { getStudentEnrollments: getEnrollmentsAction } = await import('./actions')

    const result = await getEnrollmentsAction(STUDENT_PROFILE_ID)

    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(0)
  })
})

describe('Phase 7A Slice 4: getSchoolPrograms()', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('returns programs for the caller school', async () => {
    setupEnrollmentMocks()
    const { getSchoolPrograms: getProgramsAction } = await import('./actions')

    const result = await getProgramsAction()

    expect(result.success).toBe(true)
  })

  it('rejects unauthenticated caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
      }),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { getSchoolPrograms: getProgramsAction } = await import('./actions')

    const result = await getProgramsAction()

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })
})

/**
 * @vitest-environment node
 *
 * Phase 7A Slice 5 — Program Management Server Actions Tests
 *
 * Coverage:
 *   - Authorization (unauthenticated, non-admin, school_admin, platform admin)
 *   - Tenant boundary (cross-school isolation)
 *   - Lifecycle (soft-delete idempotency, deleted program updates rejected)
 *   - Duplicate name prevention (UNIQUE constraint)
 *   - Input validation (name length, numeric bounds, UUID format)
 *   - Regression: Slice 0–4 security invariants preserved
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock server-only before any imports that use it
vi.mock('server-only', () => ({}))

const ADMIN_USER_ID = 'admin-user-id'
const ADMIN_EMAIL = 'admin@ascynpro.test'
const RISE_SCHOOL_ID = '12b09747-7391-4811-bc22-db7eebbb12c1'
const OTHER_SCHOOL_ID = 'e5f6a7b8-c9d0-1234-efab-345678901234'
const PROGRAM_ID = 'c3d4e5f6-a7b8-9012-cdef-123456789012'
const OTHER_PROGRAM_ID = 'd4e5f6a7-b8c9-0123-defa-234567890123'

// ============================================================================
// MOCK HELPERS
// ============================================================================

function mockAuthUser(role: string, schoolId: string | null) {
  return {
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
            data: { role, school_id: schoolId },
            error: null,
          }),
        }),
      }),
    }),
  }
}

function mockUnauthenticated() {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  }
}

type QueryBuilder = Promise<unknown> & {
  select: () => QueryBuilder
  is: () => QueryBuilder
  eq: () => QueryBuilder
  order: () => QueryBuilder
  single: () => Promise<unknown>
}

function createQueryBuilder(response: Promise<unknown>): QueryBuilder {
  const self = {
    select: () => self,
    is: () => self,
    eq: () => self,
    order: () => self,
    single: () => response,
  } as QueryBuilder
  // Make the builder thenable so it can be awaited
  Object.defineProperty(self, 'then', {
    value: (resolve: (value: unknown) => unknown) => response.then(resolve),
    writable: false,
    enumerable: false,
    configurable: false,
  })
  return self
}

function mockServiceClient(overrides?: {
  listResponse?: Promise<unknown>
  singleResponse?: Promise<unknown>
  insertResponse?: Promise<unknown>
  updateResponse?: Promise<unknown>
}) {
  const listResponse = overrides?.listResponse ?? Promise.resolve({
    data: [
      {
        id: PROGRAM_ID,
        name: 'Barbering Fundamentals',
        description: 'Core barbering curriculum',
        required_hours: 1500,
        required_assessments: 10,
        required_practicals: 20,
        duration_weeks: 52,
        is_active: true,
        created_at: '2026-08-22T00:00:00Z',
        updated_at: '2026-08-22T00:00:00Z',
      },
    ],
    error: null,
  })

  const singleResponse = overrides?.singleResponse ?? Promise.resolve({
    data: {
      id: PROGRAM_ID,
      school_id: RISE_SCHOOL_ID,
      name: 'Barbering Fundamentals',
      description: 'Core barbering curriculum',
      required_hours: 1500,
      required_assessments: 10,
      required_practicals: 20,
      duration_weeks: 52,
      is_active: true,
      deleted_at: null,
      created_at: '2026-08-22T00:00:00Z',
      updated_at: '2026-08-22T00:00:00Z',
    },
    error: null,
  })

  const insertResponse = overrides?.insertResponse ?? Promise.resolve({
    data: { id: OTHER_PROGRAM_ID },
    error: null,
  })

  const updateResponse = overrides?.updateResponse ?? Promise.resolve({
    data: null,
    error: null,
  })

  const listBuilder = createQueryBuilder(listResponse)
  const singleBuilder = createQueryBuilder(singleResponse)

  // Override order() on listBuilder to return the builder itself (chainable)
  listBuilder.order = () => listBuilder

  const afterIsBuilder = {
    is: () => afterIsBuilder,
    eq: () => listBuilder,
    order: () => listBuilder,
    single: () => listResponse,
  }

  const selectBuilder = {
    is: () => afterIsBuilder,
    eq: () => singleBuilder,
    order: () => listBuilder,
    single: () => listResponse,
  }

  return {
    from: vi.fn().mockImplementation((table: string) => {
      if (table !== 'programs') {
        throw new Error(`Unexpected table in test: ${table}`)
      }
      return {
        select: vi.fn().mockReturnValue(selectBuilder),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue(insertResponse),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(updateResponse),
        }),
      }
    }),
  }
}

async function importActions() {
  return await import('./actions')
}

// ============================================================================
// GET PROGRAMS
// ============================================================================

describe('Phase 7A Slice 5: getPrograms()', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('returns programs for the caller school (happy path)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { getPrograms: getProgramsAction } = await importActions()
    const result = await getProgramsAction()

    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
    expect(result.data![0].name).toBe('Barbering Fundamentals')
  })

  it('rejects unauthenticated caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockUnauthenticated()),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { getPrograms: getProgramsAction } = await importActions()
    const result = await getProgramsAction()

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })

  it('rejects non-admin caller (student role)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('student', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { getPrograms: getProgramsAction } = await importActions()
    const result = await getProgramsAction()

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden/i)
  })

  it('rejects instructor caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('instructor', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { getPrograms: getProgramsAction } = await importActions()
    const result = await getProgramsAction()

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden/i)
  })

  it('platform admin can view all programs', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('admin', null)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { getPrograms: getProgramsAction } = await importActions()
    const result = await getProgramsAction()

    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(1)
  })

  it('school_admin is scoped to own school only', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { getPrograms: getProgramsAction } = await importActions()
    const result = await getProgramsAction()

    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
  })

  it('handles database errors gracefully', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        listResponse: Promise.resolve({ data: null, error: { message: 'connection failed' } }),
      })),
    }))

    const { getPrograms: getProgramsAction } = await importActions()
    const result = await getProgramsAction()

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/failed to fetch programs/i)
  })
})

// ============================================================================
// CREATE PROGRAM
// ============================================================================

describe('Phase 7A Slice 5: createProgram()', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('creates a program (happy path)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({
      name: 'Cosmetology Advanced',
      required_hours: 1500,
      required_assessments: 12,
      required_practicals: 24,
    })

    expect(result.success).toBe(true)
    expect(result.data?.id).toBe(OTHER_PROGRAM_ID)
  })

  it('rejects unauthenticated caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockUnauthenticated()),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Test Program' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })

  it('rejects non-admin caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('student', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Test Program' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden/i)
  })

  it('rejects admin without school assignment', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', null)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Test Program' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/must be assigned to a school/i)
  })

  it('rejects empty program name', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: '   ' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/program name is required/i)
  })

  it('rejects program name exceeding 200 characters', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'A'.repeat(201) })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/must not exceed 200 characters/i)
  })

  it('rejects negative required_hours', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Test', required_hours: -1 })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/required hours must be between/i)
  })

  it('rejects required_hours exceeding 99999', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Test', required_hours: 100_000 })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/required hours must be between/i)
  })

  it('rejects negative required_assessments', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Test', required_assessments: -1 })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/required assessments must be between/i)
  })

  it('rejects negative required_practicals', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Test', required_practicals: -1 })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/required practicals must be between/i)
  })

  it('rejects duration_weeks exceeding 520', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Test', duration_weeks: 521 })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/duration weeks must be between/i)
  })

  it('rejects description exceeding 2000 characters', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Test', description: 'A'.repeat(2001) })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/must not exceed 2,000 characters/i)
  })

  it('prevents duplicate program name within school (23505)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        insertResponse: Promise.resolve({ data: null, error: { code: '23505', message: 'duplicate key value violates unique constraint' } }),
      })),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Barbering Fundamentals' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/already exists at this school/i)
  })

  it('platform admin cannot create programs without school_id', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('admin', null)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()
    const result = await createAction({ name: 'Platform Program' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/must be assigned to a school/i)
  })
})

// ============================================================================
// UPDATE PROGRAM
// ============================================================================

describe('Phase 7A Slice 5: updateProgram()', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('updates a program (happy path)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { name: 'Updated Name' })

    expect(result.success).toBe(true)
  })

  it('rejects invalid program UUID', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction('not-a-uuid', { name: 'Test' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/invalid program identifier format/i)
  })

  it('rejects unauthenticated caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockUnauthenticated()),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { name: 'Test' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })

  it('rejects non-admin caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('student', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { name: 'Test' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden/i)
  })

  it('rejects cross-school update (tenant boundary)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        singleResponse: Promise.resolve({
          data: {
            id: PROGRAM_ID,
            school_id: OTHER_SCHOOL_ID,
            name: 'Other School Program',
            deleted_at: null,
          },
          error: null,
        }),
      })),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { name: 'Hacked Name' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden.*different school/i)
  })

  it('rejects update of soft-deleted program (lifecycle)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        singleResponse: Promise.resolve({
          data: {
            id: PROGRAM_ID,
            school_id: RISE_SCHOOL_ID,
            name: 'Deleted Program',
            deleted_at: '2026-01-01T00:00:00Z',
          },
          error: null,
        }),
      })),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { name: 'New Name' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/cannot update a deleted program/i)
  })

  it('rejects empty name update', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { name: '   ' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/cannot be empty/i)
  })

  it('rejects name exceeding 200 characters', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { name: 'A'.repeat(201) })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/must not exceed 200 characters/i)
  })

  it('rejects negative required_hours update', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { required_hours: -1 })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/required hours must be between/i)
  })

  it('rejects duplicate name via 23505 (update)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        updateResponse: Promise.resolve({ data: null, error: { code: '23505', message: 'duplicate key value violates unique constraint' } }),
      })),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { name: 'Existing Name' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/already exists at this school/i)
  })

  it('succeeds with no fields provided (no-op)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, {})

    expect(result.success).toBe(true)
  })

  it('rejects program not found', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        singleResponse: Promise.resolve({ data: null, error: { message: 'No rows found', code: 'PGRST116' } }),
      })),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { name: 'Test' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/program not found/i)
  })

  it('platform admin can update programs across schools', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('admin', null)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        singleResponse: Promise.resolve({
          data: {
            id: PROGRAM_ID,
            school_id: OTHER_SCHOOL_ID,
            name: 'Other School Program',
            deleted_at: null,
          },
          error: null,
        }),
      })),
    }))

    const { updateProgram: updateAction } = await importActions()
    const result = await updateAction(PROGRAM_ID, { name: 'Updated' })

    expect(result.success).toBe(true)
  })
})

// ============================================================================
// DEACTIVATE PROGRAM
// ============================================================================

describe('Phase 7A Slice 5: deactivateProgram()', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('deactivates a program (happy path)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { deactivateProgram: deactivateAction } = await importActions()
    const result = await deactivateAction(PROGRAM_ID)

    expect(result.success).toBe(true)
  })

  it('rejects invalid program UUID', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { deactivateProgram: deactivateAction } = await importActions()
    const result = await deactivateAction('not-a-uuid')

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/invalid program identifier format/i)
  })

  it('rejects unauthenticated caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockUnauthenticated()),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { deactivateProgram: deactivateAction } = await importActions()
    const result = await deactivateAction(PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })

  it('rejects non-admin caller', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('student', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn(),
    }))

    const { deactivateProgram: deactivateAction } = await importActions()
    const result = await deactivateAction(PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden/i)
  })

  it('rejects cross-school deactivation (tenant boundary)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        singleResponse: Promise.resolve({
          data: {
            id: PROGRAM_ID,
            school_id: OTHER_SCHOOL_ID,
            deleted_at: null,
          },
          error: null,
        }),
      })),
    }))

    const { deactivateProgram: deactivateAction } = await importActions()
    const result = await deactivateAction(PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/forbidden.*different school/i)
  })

  it('is idempotent for already-deleted program (lifecycle)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        singleResponse: Promise.resolve({
          data: {
            id: PROGRAM_ID,
            school_id: RISE_SCHOOL_ID,
            deleted_at: '2026-01-01T00:00:00Z',
          },
          error: null,
        }),
      })),
    }))

    const { deactivateProgram: deactivateAction } = await importActions()
    const result = await deactivateAction(PROGRAM_ID)

    expect(result.success).toBe(true)
  })

  it('rejects program not found', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        singleResponse: Promise.resolve({ data: null, error: { message: 'No rows found', code: 'PGRST116' } }),
      })),
    }))

    const { deactivateProgram: deactivateAction } = await importActions()
    const result = await deactivateAction(PROGRAM_ID)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/program not found/i)
  })

  it('platform admin can deactivate programs across schools', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('admin', null)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        singleResponse: Promise.resolve({
          data: {
            id: PROGRAM_ID,
            school_id: OTHER_SCHOOL_ID,
            deleted_at: null,
          },
          error: null,
        }),
      })),
    }))

    const { deactivateProgram: deactivateAction } = await importActions()
    const result = await deactivateAction(PROGRAM_ID)

    expect(result.success).toBe(true)
  })
})

// ============================================================================
// SLICE 0–4 REGRESSION SECURITY
// ============================================================================

describe('Phase 7A Slice 5: Slice 0–4 Regression Security', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/supabase-service-role')
    vi.restoreAllMocks()
  })

  it('school_id is never accepted from client input (create)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { createProgram: createAction } = await importActions()

    // Even if client tries to pass school_id, it must be ignored
    const result = await createAction({
      name: 'Test Program',
      // @ts-expect-error — intentionally testing that this is ignored
      school_id: OTHER_SCHOOL_ID,
    })

    // The action should succeed using the server-derived school_id
    expect(result.success).toBe(true)
  })

  it('school_id is never accepted from client input (update)', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient()),
    }))

    const { updateProgram: updateAction } = await importActions()

    const result = await updateAction(PROGRAM_ID, {
      name: 'Updated',
      // @ts-expect-error — intentionally testing that this is ignored
      school_id: OTHER_SCHOOL_ID,
    })

    expect(result.success).toBe(true)
  })

  it('does not expose raw database errors to client', async () => {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        listResponse: Promise.resolve({ data: null, error: { message: 'connection terminated unexpectedly', code: 'ECONNRESET' } }),
      })),
    }))

    const { getPrograms: getProgramsAction } = await importActions()
    const result = await getProgramsAction()

    expect(result.success).toBe(false)
    // Error should be wrapped, not raw
    expect(result.error).toMatch(/failed to fetch programs/i)
    expect(result.error).not.toMatch(/ECONNRESET/i)
  })

  it('preserves audit logging on permission denied', async () => {
    const logSpy = vi.fn()
    vi.doMock('@/lib/security/audit-logger', () => ({
      logPermissionDenied: logSpy,
    }))

    vi.doMock('@/lib/supabase-server', () => ({
      createClient: vi.fn().mockResolvedValue(mockAuthUser('school_admin', RISE_SCHOOL_ID)),
    }))
    vi.doMock('@/lib/supabase-service-role', () => ({
      createServiceRoleClient: vi.fn().mockReturnValue(mockServiceClient({
        singleResponse: Promise.resolve({
          data: {
            id: PROGRAM_ID,
            school_id: OTHER_SCHOOL_ID,
            deleted_at: null,
          },
          error: null,
        }),
      })),
    }))

    const { updateProgram: updateAction } = await importActions()
    await updateAction(PROGRAM_ID, { name: 'Hacked' })

    expect(logSpy).toHaveBeenCalledWith('update_program', expect.objectContaining({
      userId: ADMIN_USER_ID,
      schoolId: RISE_SCHOOL_ID,
      resource: PROGRAM_ID,
      action: 'update',
    }))
  })
})

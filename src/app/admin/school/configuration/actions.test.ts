/**
 * @vitest-environment node
 *
 * Platform-admin school configuration tests.
 *
 *  - Platform admin (role='admin', school_id IS NULL) may save configuration
 *    for any ACTIVE school via a server-validated targetSchoolId.
 *  - School-attached admins (school_admin, or admin with a school) may ONLY
 *    save their own school's settings — a client-provided targetSchoolId is
 *    never trusted for them (tenant isolation preserved).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createDefaultSchoolConfiguration } from '@/lib/school-config/defaults'
import type { School } from '@/types'

const CALLER_ID = 'caller-admin-id'
const CALLER_EMAIL = 'admin@ascynpro.test'
const SCHOOL_A_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const SCHOOL_B_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'

function makeSchool(id: string, overrides: Record<string, unknown> = {}): School {
  return {
    id,
    name: `Test School ${id.slice(0, 4)}`,
    address: '1 Main St',
    city: 'Oklahoma City',
    state: 'OK',
    postal_code: '73102',
    contact_email: 'school@test.local',
    contact_phone: '405-555-0100',
    website: '',
    timezone: 'America/Chicago',
    license_number: '',
    accreditation: '',
    school_type: 'barber',
    ...overrides,
  } as unknown as School
}

/** Default config patched with valid hex branding (factory emits CSS vars, which the validator rejects). */
function makeValidConfig(schoolId: string) {
  const config = createDefaultSchoolConfiguration(makeSchool(schoolId))
  config.branding = { ...config.branding, primaryColor: '#D4AF37', secondaryColor: '#1F2937' }
  return config
}

interface UpsertCall {
  table: string
  payload: Record<string, unknown>
  options: unknown
}

interface UpdateEqCall {
  table: string
  column: string
  value: unknown
}

function buildSessionClient(
  profile: { role: string; school_id: string | null },
  opts: { targetSchoolActive?: boolean } = {}
) {
  const upsertCalls: UpsertCall[] = []
  const updateEqCalls: UpdateEqCall[] = []

  const client = {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: CALLER_ID, email: CALLER_EMAIL } },
        error: null,
      }),
    },
    from: (table: string) => {
      const builder: Record<string, unknown> = {}
      builder.select = () => builder
      builder.eq = () => {
        return builder
      }
      builder.single = () => {
        if (table === 'profiles') {
          return Promise.resolve({ data: profile, error: null })
        }
        if (table === 'schools') {
          const active = opts.targetSchoolActive !== false
          return Promise.resolve({
            data: active
              ? { id: SCHOOL_B_ID, is_active: true, deleted_at: null }
              : { id: SCHOOL_B_ID, is_active: false, deleted_at: null },
            error: null,
          })
        }
        return Promise.resolve({ data: null, error: null })
      }
      builder.maybeSingle = () => Promise.resolve({ data: null, error: null })
      builder.update = () => {
        const updateBuilder: Record<string, unknown> = {}
        updateBuilder.eq = (column: string, value: unknown) => {
          updateEqCalls.push({ table, column, value })
          return Promise.resolve({ error: null })
        }
        return updateBuilder
      }
      builder.upsert = (payload: Record<string, unknown>, options: unknown) => {
        upsertCalls.push({ table, payload, options })
        return Promise.resolve({ error: null })
      }
      return builder
    },
  }

  return { client, upsertCalls, updateEqCalls }
}

const logPermissionDenied = vi.fn()
const logSensitiveConfigChange = vi.fn()

function setupMocks(
  profile: { role: string; school_id: string | null },
  opts: { targetSchoolActive?: boolean } = {}
) {
  const { client, upsertCalls, updateEqCalls } = buildSessionClient(profile, opts)

  vi.doMock('@/lib/supabase-server', () => ({
    createClient: vi.fn().mockResolvedValue(client),
  }))
  vi.doMock('@/lib/security/audit-logger', () => ({
    logPermissionDenied,
    logSensitiveConfigChange,
  }))

  return { upsertCalls, updateEqCalls }
}

describe('saveSchoolConfiguration — platform admin target school', () => {
  beforeEach(() => {
    vi.resetModules()
    logPermissionDenied.mockClear()
    logSensitiveConfigChange.mockClear()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'x'.repeat(40)
    delete process.env.NEXT_PUBLIC_DEMO_MODE
  })

  afterEach(() => {
    vi.doUnmock('@/lib/supabase-server')
    vi.doUnmock('@/lib/security/audit-logger')
    vi.restoreAllMocks()
  })

  it('platform admin saves configuration for a valid active target school', async () => {
    const { upsertCalls, updateEqCalls } = setupMocks({ role: 'admin', school_id: null })
    const { saveSchoolConfiguration } = await import('./actions')
    const config = makeValidConfig(SCHOOL_B_ID)

    const result = await saveSchoolConfiguration(config, SCHOOL_B_ID)

    expect(result.success).toBe(true)
    const settingsUpsert = upsertCalls.find((c) => c.table === 'school_settings')
    expect(settingsUpsert?.payload.school_id).toBe(SCHOOL_B_ID)
    const schoolUpdate = updateEqCalls.find((c) => c.table === 'schools' && c.column === 'id')
    expect(schoolUpdate?.value).toBe(SCHOOL_B_ID)
  })

  it('platform admin without a target school is rejected', async () => {
    setupMocks({ role: 'admin', school_id: null })
    const { saveSchoolConfiguration } = await import('./actions')
    const config = makeValidConfig(SCHOOL_B_ID)

    const result = await saveSchoolConfiguration(config)

    expect(result.success).toBe(false)
    expect(result.message).toBe('A target school must be selected before saving.')
  })

  it('platform admin with a malformed target school id is rejected', async () => {
    setupMocks({ role: 'admin', school_id: null })
    const { saveSchoolConfiguration } = await import('./actions')
    const config = makeValidConfig(SCHOOL_B_ID)

    const result = await saveSchoolConfiguration(config, 'not-a-uuid')

    expect(result.success).toBe(false)
    expect(result.message).toBe('A target school must be selected before saving.')
  })

  it('platform admin targeting an inactive school is rejected and audit-logged', async () => {
    setupMocks({ role: 'admin', school_id: null }, { targetSchoolActive: false })
    const { saveSchoolConfiguration } = await import('./actions')
    const config = makeValidConfig(SCHOOL_B_ID)

    const result = await saveSchoolConfiguration(config, SCHOOL_B_ID)

    expect(result.success).toBe(false)
    expect(result.message).toBe('The selected school is not active or does not exist.')
    expect(logPermissionDenied).toHaveBeenCalled()
  })

  it('TENANT ISOLATION: school_admin passing a foreign targetSchoolId still saves to their OWN school', async () => {
    const { upsertCalls, updateEqCalls } = setupMocks({ role: 'school_admin', school_id: SCHOOL_A_ID })
    const { saveSchoolConfiguration } = await import('./actions')
    const config = makeValidConfig(SCHOOL_A_ID)

    const result = await saveSchoolConfiguration(config, SCHOOL_B_ID)

    expect(result.success).toBe(true)
    const settingsUpsert = upsertCalls.find((c) => c.table === 'school_settings')
    expect(settingsUpsert?.payload.school_id).toBe(SCHOOL_A_ID)
    const schoolUpdate = updateEqCalls.find((c) => c.table === 'schools' && c.column === 'id')
    expect(schoolUpdate?.value).toBe(SCHOOL_A_ID)
  })

  it('school-attached admin (role=admin with a school) saves to their own school without a target', async () => {
    const { upsertCalls } = setupMocks({ role: 'admin', school_id: SCHOOL_A_ID })
    const { saveSchoolConfiguration } = await import('./actions')
    const config = makeValidConfig(SCHOOL_A_ID)

    const result = await saveSchoolConfiguration(config)

    expect(result.success).toBe(true)
    const settingsUpsert = upsertCalls.find((c) => c.table === 'school_settings')
    expect(settingsUpsert?.payload.school_id).toBe(SCHOOL_A_ID)
  })

  it('school_admin without a school assignment is rejected (existing behavior preserved)', async () => {
    setupMocks({ role: 'school_admin', school_id: null })
    const { saveSchoolConfiguration } = await import('./actions')
    const config = makeValidConfig(SCHOOL_A_ID)

    const result = await saveSchoolConfiguration(config)

    expect(result.success).toBe(false)
    expect(result.message).toBe('You must be assigned to a school before you can save school settings.')
  })

  it('non-admin roles are rejected', async () => {
    setupMocks({ role: 'instructor', school_id: SCHOOL_A_ID })
    const { saveSchoolConfiguration } = await import('./actions')
    const config = makeValidConfig(SCHOOL_A_ID)

    const result = await saveSchoolConfiguration(config)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Only administrators can save school settings.')
  })
})

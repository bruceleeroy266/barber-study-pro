/**
 * SEC-RELEASE-02C: privileged instructor-assignment server actions must
 * authenticate and check a live, approved, enabled profile before calling
 * the service-role client. No real DB writes or network calls.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

const SCHOOL_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const SCHOOL_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
const INSTRUCTOR = '02c-instructor-id'
const ACTOR = '02c-admin-id'

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  createServiceRoleClient: vi.fn(),
  assignUserSchool: vi.fn(),
}))
vi.mock('@/lib/supabase-server', () => ({ createClient: mocks.createClient }))
vi.mock('@/lib/supabase-service-role', () => ({ createServiceRoleClient: mocks.createServiceRoleClient }))
vi.mock('@/app/admin/users/actions', () => ({ assignUserSchool: mocks.assignUserSchool }))

import { getInstructorAssignmentImpact, guardedMoveInstructor } from './instructor-actions'

function session(
  actor: { role: string; school_id: string | null; approval_status: string; is_disabled: boolean },
  instructorSchool: string = SCHOOL_A,
) {
  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: ACTOR } }, error: null }) },
    from: vi.fn((table: string) => {
      expect(table).toBe('profiles')
      const builder = {
        select: vi.fn(),
        eq: vi.fn(),
        maybeSingle: vi.fn(),
      }
      builder.select.mockReturnValue(builder)
      builder.eq.mockImplementation((_field: string, id: string) => {
        builder.maybeSingle.mockResolvedValue({
          data: id === ACTOR ? actor : { role: 'instructor', school_id: instructorSchool },
          error: null,
        })
        return builder
      })
      return builder
    }),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  const read = {
    select: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
  }
  read.select.mockReturnValue(read)
  read.eq.mockReturnValue(read)
  read.is.mockResolvedValue({ count: 2, error: null })
  mocks.createServiceRoleClient.mockReturnValue({
    from: vi.fn(() => read),
  })
  mocks.assignUserSchool.mockResolvedValue({ success: true })
})

describe('SEC-RELEASE-02C instructor privileged server actions', () => {
  it.each([
    ['disabled school administrator', { role: 'school_admin', school_id: SCHOOL_A, approval_status: 'approved', is_disabled: true }],
    ['unapproved school administrator', { role: 'school_admin', school_id: SCHOOL_A, approval_status: 'pending', is_disabled: false }],
    ['disabled platform administrator', { role: 'admin', school_id: null, approval_status: 'approved', is_disabled: true }],
    ['student role', { role: 'student', school_id: SCHOOL_A, approval_status: 'approved', is_disabled: false }],
    ['cross-school administrator', { role: 'school_admin', school_id: SCHOOL_B, approval_status: 'approved', is_disabled: false }],
  ])('%s cannot invoke service-role impact or move before authorization', async (_label, actor) => {
    mocks.createClient.mockResolvedValue(session(actor))
    const impact = await getInstructorAssignmentImpact(INSTRUCTOR)
    const move = await guardedMoveInstructor(INSTRUCTOR, SCHOOL_B)
    expect(impact.success).toBe(false)
    expect(move.success).toBe(false)
    expect(mocks.createServiceRoleClient).not.toHaveBeenCalled()
    expect(mocks.assignUserSchool).not.toHaveBeenCalled()
  })

  it.each([
    ['authorized same-school administrator', { role: 'school_admin', school_id: SCHOOL_A, approval_status: 'approved', is_disabled: false }],
    ['authorized platform administrator', { role: 'admin', school_id: null, approval_status: 'approved', is_disabled: false }],
  ])('%s may preview legitimate instructor impact', async (_label, actor) => {
    mocks.createClient.mockResolvedValue(session(actor))
    const result = await getInstructorAssignmentImpact(INSTRUCTOR)
    expect(result).toEqual({ success: true, data: { activeStudentCount: 2 } })
    expect(mocks.createServiceRoleClient).toHaveBeenCalledTimes(1)
  })
})

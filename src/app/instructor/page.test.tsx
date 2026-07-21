import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import InstructorPage from './page'

const mocks = vi.hoisted(() => {
  const mockGetUser = vi.fn()
  const capturedEqCalls: Array<{ table: string; column: string; value: unknown }> = []

  function createChain(table: string) {
    const eq = vi.fn().mockImplementation((column: string, value: unknown) => {
      capturedEqCalls.push({ table, column, value })
      return chain
    })

    const chain: Record<string, ReturnType<typeof vi.fn>> = {
      select: vi.fn().mockReturnThis(),
      eq,
      in: vi.fn().mockResolvedValue({ data: [], error: null }),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }

    return chain
  }

  const mockSupabase = {
    auth: { getUser: mockGetUser },
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'profiles') {
        const chain = createChain(table)
        // First profiles query is the instructor lookup; single() should return the instructor.
        chain.single = vi.fn().mockResolvedValue({
          data: {
            id: 'instructor-1',
            role: 'instructor',
            school_id: 'school-1',
            full_name: 'Test Instructor',
            email: 'instructor@ascyn-smoke.test',
            schools: { name: 'Test School' },
          },
          error: null,
        })
        // Second profiles query uses in() to fetch school-scoped students.
        chain.in = vi.fn().mockResolvedValue({
          data: [
            {
              id: 'student-1',
              email: 'student@ascyn-smoke.test',
              full_name: 'Smoke Test Student',
              role: 'student',
              school_id: 'school-1',
              approval_status: 'approved',
            },
          ],
          error: null,
        })
        return chain
      }
      return createChain(table)
    }),
  }

  return {
    mockGetUser,
    mockSupabase,
    capturedEqCalls,
  }
})

vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn().mockResolvedValue(mocks.mockSupabase),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('InstructorPage school scoping and identity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.capturedEqCalls.length = 0
    mocks.mockGetUser.mockResolvedValue({
      data: { user: { id: 'instructor-1' } },
      error: null,
    })
  })

  it('queries the profiles table and filters students by the instructor school_id', async () => {
    await InstructorPage({ searchParams: Promise.resolve({}) })

    expect(mocks.mockSupabase.from).toHaveBeenCalledWith('profiles')

    const schoolFilter = mocks.capturedEqCalls.find(
      (call) => call.table === 'profiles' && call.column === 'school_id' && call.value === 'school-1'
    )
    expect(schoolFilter).toBeDefined()
  })

  it('renders the canonical student identity from the school-scoped roster', async () => {
    const page = await InstructorPage({ searchParams: Promise.resolve({}) })
    render(page)

    expect(screen.getAllByText('Smoke Test Student').length).toBeGreaterThan(0)
    expect(screen.getAllByText('student@ascyn-smoke.test').length).toBeGreaterThan(0)
  })
})

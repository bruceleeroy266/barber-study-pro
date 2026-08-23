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

// Mock demo-helpers so we can control isDemoDataAllowed per test
vi.mock('@/lib/demo-helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/demo-helpers')>()
  return {
    ...actual,
    isDemoDataAllowed: vi.fn(),
  }
})

import { isDemoDataAllowed } from '@/lib/demo-helpers'
const mockIsDemoDataAllowed = vi.mocked(isDemoDataAllowed)

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

  it('does NOT show demo indicator when real student data is displayed', async () => {
    mockIsDemoDataAllowed.mockReturnValue(false)
    const page = await InstructorPage({ searchParams: Promise.resolve({}) })
    render(page)

    expect(screen.queryByTestId('demo-data-banner')).toBeNull()
    expect(screen.queryByText(/DEMO DATA/)).toBeNull()
  })

  it('distinguishes learning metrics from Gradebook metrics and does not treat ungraded students as 0%', async () => {
    mockIsDemoDataAllowed.mockReturnValue(false)
    const page = await InstructorPage({ searchParams: Promise.resolve({}) })
    render(page)

    expect(screen.getByText('Curriculum Progress')).toBeInTheDocument()
    expect(screen.getByText('Quiz Attempt Average')).toBeInTheDocument()
    expect(screen.getByText('Learning Support Flags')).toBeInTheDocument()
    expect(screen.getByText('Gradebook At Risk')).toBeInTheDocument()

    const gradeAverageCard = screen.getByText('Graded Student Average').parentElement
    expect(gradeAverageCard).toHaveTextContent('—')
    expect(gradeAverageCard).not.toHaveTextContent('0%')
  })
})

describe('InstructorPage — Phase 6B-1 R-3 demo data safeguards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.capturedEqCalls.length = 0
    mocks.mockGetUser.mockResolvedValue({
      data: { user: { id: 'instructor-1' } },
      error: null,
    })
  })

  function setupEmptyRosterMock() {
    // Reconfigure the profiles mock to return empty student list
    // Use 'demo-school' as school_id so demo students match the filter
    mocks.mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        const chain: Record<string, ReturnType<typeof vi.fn>> = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockResolvedValue({ data: [], error: null }),
          or: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'instructor-1',
              role: 'instructor',
              school_id: 'demo-school',
              full_name: 'Test Instructor',
              email: 'instructor@ascyn-smoke.test',
              schools: { name: 'Demo School' },
            },
            error: null,
          }),
        }
        return chain
      }
      const chain: Record<string, ReturnType<typeof vi.fn>> = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: [], error: null }),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      return chain
    })
  }

  it('development/demo mode + empty real data → demo data displays with visible demo indicator', async () => {
    mockIsDemoDataAllowed.mockReturnValue(true)
    setupEmptyRosterMock()

    const page = await InstructorPage({ searchParams: Promise.resolve({}) })
    render(page)

    // Demo banner should be visible
    expect(screen.getByTestId('demo-data-banner')).toBeTruthy()
    expect(screen.getByText(/DEMO DATA — Fictional student information/)).toBeTruthy()
  })

  it('production + empty real data → no demo data, no demo indicator', async () => {
    // In production, isDemoDataAllowed returns false even if NEXT_PUBLIC_DEMO_MODE=true
    mockIsDemoDataAllowed.mockReturnValue(false)
    setupEmptyRosterMock()

    const page = await InstructorPage({ searchParams: Promise.resolve({}) })
    render(page)

    // No demo banner
    expect(screen.queryByTestId('demo-data-banner')).toBeNull()
    // Should show empty state message
    expect(screen.getByText(/No students found in your school yet/)).toBeTruthy()
  })

  it('production + real data → real data displays normally without demo indicator', async () => {
    mockIsDemoDataAllowed.mockReturnValue(false)
    // Default mock already has real student data — restore it
    mocks.mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        const chain: Record<string, ReturnType<typeof vi.fn>> = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockResolvedValue({
            data: [{
              id: 'student-1',
              email: 'student@ascyn-smoke.test',
              full_name: 'Real Student',
              role: 'student',
              school_id: 'school-1',
              approval_status: 'approved',
            }],
            error: null,
          }),
          or: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'instructor-1',
              role: 'instructor',
              school_id: 'school-1',
              full_name: 'Test Instructor',
              email: 'instructor@ascyn-smoke.test',
              schools: { name: 'Test School' },
            },
            error: null,
          }),
        }
        return chain
      }
      const chain: Record<string, ReturnType<typeof vi.fn>> = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: [], error: null }),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      return chain
    })

    const page = await InstructorPage({ searchParams: Promise.resolve({}) })
    render(page)

    // Real student data should be displayed
    expect(screen.getAllByText('Real Student').length).toBeGreaterThan(0)
    // No demo banner
    expect(screen.queryByTestId('demo-data-banner')).toBeNull()
  })

  it('demo indicator never labels real data as demo data', async () => {
    // Even with demo mode allowed, if real data exists, no demo banner
    mockIsDemoDataAllowed.mockReturnValue(true)
    // Default mock has real student data — restore it
    mocks.mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        const chain: Record<string, ReturnType<typeof vi.fn>> = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockResolvedValue({
            data: [{
              id: 'student-1',
              email: 'student@ascyn-smoke.test',
              full_name: 'Real Student Not Demo',
              role: 'student',
              school_id: 'school-1',
              approval_status: 'approved',
            }],
            error: null,
          }),
          or: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'instructor-1',
              role: 'instructor',
              school_id: 'school-1',
              full_name: 'Test Instructor',
              email: 'instructor@ascyn-smoke.test',
              schools: { name: 'Test School' },
            },
            error: null,
          }),
        }
        return chain
      }
      const chain: Record<string, ReturnType<typeof vi.fn>> = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: [], error: null }),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      return chain
    })

    const page = await InstructorPage({ searchParams: Promise.resolve({}) })
    render(page)

    // Real student displayed
    expect(screen.getAllByText('Real Student Not Demo').length).toBeGreaterThan(0)
    // No demo banner — real data must never be labeled as demo
    expect(screen.queryByTestId('demo-data-banner')).toBeNull()
  })
})

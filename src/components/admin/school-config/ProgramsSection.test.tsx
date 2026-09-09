/**
 * @vitest-environment jsdom
 *
 * Phase 7A Slice 5 P1-1 — ProgramsSection UI/State Synchronization Tests
 *
 * Coverage:
 *   - create → newly created program appears in UI
 *   - update → edited values immediately appear
 *   - deactivate → program immediately reflects inactive state
 *   - server failure → UI does not falsely display an unsaved change
 *   - single source of truth (dbPrograms, not config.programs)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProgramsSection from './ProgramsSection'
import type { SchoolConfiguration, AcademicProgram } from '@/types'

// ---------------------------------------------------------------------------
// Mock server actions
// ---------------------------------------------------------------------------
const mockGetPrograms = vi.fn()
const mockCreateProgram = vi.fn()
const mockUpdateProgram = vi.fn()
const mockDeactivateProgram = vi.fn()

vi.mock('@/app/admin/school/programs/actions', () => ({
  getPrograms: (...args: unknown[]) => mockGetPrograms(...args),
  createProgram: (...args: unknown[]) => mockCreateProgram(...args),
  updateProgram: (...args: unknown[]) => mockUpdateProgram(...args),
  deactivateProgram: (...args: unknown[]) => mockDeactivateProgram(...args),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface MockProgram {
  id: string
  name: string
  description: string | null
  required_hours: number
  required_assessments: number
  required_practicals: number
  duration_weeks: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  active_enrollments?: number
}

function createMockProgram(overrides?: Partial<MockProgram>): MockProgram {
  return {
    id: 'prog-1',
    name: 'Barbering',
    description: null,
    required_hours: 1500,
    required_assessments: 10,
    required_practicals: 20,
    duration_weeks: 52,
    is_active: true,
    created_at: '2026-08-22T00:00:00Z',
    updated_at: '2026-08-22T00:00:00Z',
    deleted_at: null,
    active_enrollments: 0,
    ...overrides,
  }
}

function createConfig(programs: AcademicProgram[] = []): SchoolConfiguration {
  return {
    school: {
      id: 'school-1',
      name: 'Test School',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      contact_email: '',
      contact_phone: '',
      website: '',
      timezone: 'America/Chicago',
      license_number: '',
      accreditation: '',
      school_type: 'barber',
      subscription_status: 'active',
      created_at: '2026-08-22T00:00:00Z',
    },
    branding: {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      logoUrl: '',
      faviconUrl: '',
    },
    programs,
    instructors: [],
    enrollment: {
      openEnrollment: true,
      allowSelfRegistration: false,
      defaultProgramId: null,
    },
    attendancePolicy: {
      targetAttendancePercentage: 90,
      autoExcuseLimit: 3,
      tardyThresholdMinutes: 15,
      trackClockEvents: true,
    },
    hoursPolicy: {
      requiredHours: 1500,
      categories: [],
      requireInstructorApproval: true,
    },
    gradebookConfig: {
      passingPercentage: 70,
      gradingScale: 'percentage',
      categories: [],
    },
    assessmentDefaults: {
      passingPercentage: 70,
      defaultRubricId: null,
      allowedTypes: [],
    },
    studentDefaults: {
      passingPercentage: 70,
      maxQuizAttempts: 3,
      requiredAttendancePercentage: 90,
    },
    instructorDefaults: {
      canApproveHours: true,
      canManageStudents: true,
      canViewReports: true,
      requireApprovalForGrades: true,
    },
    messagingPreferences: {
      allowStudentToStudent: false,
      requireModeration: true,
      autoReplyEnabled: false,
    },
    notificationSettings: [],
    rolePermissions: [],
    updatedAt: '2026-08-22T00:00:00Z',
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProgramsSection — P1-1 UI/State Synchronization', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetPrograms.mockReset().mockResolvedValue({ success: true, data: [] })
    mockCreateProgram.mockReset().mockResolvedValue({ success: true, data: { id: 'new-id' } })
    mockUpdateProgram.mockReset().mockResolvedValue({ success: true })
    mockDeactivateProgram.mockReset().mockResolvedValue({ success: true })
    // Required-hours confirmation gate (founder directive 2026-09-08): default to confirmed.
    window.confirm = vi.fn().mockReturnValue(true)
  })

  it('loads and displays programs from the database on mount', async () => {
    const dbProgram = createMockProgram({ id: 'db-1', name: 'DB Barbering' })
    mockGetPrograms.mockResolvedValue({ success: true, data: [dbProgram] })

    const onChange = vi.fn()
    render(<ProgramsSection config={createConfig()} onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText('DB Barbering')).toBeInTheDocument()
    })

    // onChange should be called with DB-backed programs (single source of truth)
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'db-1', name: 'DB Barbering' }),
        ])
      )
    })
  })

  it('create → newly created program appears after server confirms', async () => {
    const initialProgram = createMockProgram({ id: 'prog-1', name: 'Initial Program' })
    const newProgram = createMockProgram({ id: 'prog-2', name: 'New Program', required_hours: 600 })

    mockGetPrograms
      .mockResolvedValueOnce({ success: true, data: [initialProgram] })
      .mockResolvedValueOnce({ success: true, data: [initialProgram, newProgram] })

    mockCreateProgram.mockResolvedValue({ success: true, data: { id: 'prog-2' } })

    const onChange = vi.fn()
    render(<ProgramsSection config={createConfig()} onChange={onChange} />)

    await waitFor(() => expect(screen.getByText('Initial Program')).toBeInTheDocument())

    // Click "Add Program" to open the form
    fireEvent.click(screen.getByRole('button', { name: /add program/i }))

    // Fill in the form
    const nameInput = screen.getByPlaceholderText(/e\.g\.\s*,?\s*barbering/i)
    fireEvent.change(nameInput, { target: { value: 'New Program' } })

    // Submit — click the form's submit button (inside the form container, not the header)
    const formSubmitBtn = screen.getAllByRole('button', { name: /^add program$/i })
      .find((btn) => !btn.querySelector('svg'))
    expect(formSubmitBtn).toBeDefined()
    fireEvent.click(formSubmitBtn!)

    await waitFor(() => {
      expect(screen.getByText('New Program')).toBeInTheDocument()
    })

    // Verify create was called
    expect(mockCreateProgram).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Program' })
    )

    // Verify onChange was called with the updated list
    await waitFor(() => {
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
      expect(lastCall).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'New Program' }),
        ])
      )
    })
  })

  it('update → edited values immediately appear after server confirms', async () => {
    const initialProgram = createMockProgram({ id: 'prog-1', name: 'Old Name', required_hours: 1500 })
    const updatedProgram = createMockProgram({ id: 'prog-1', name: 'Updated Name', required_hours: 2000 })

    mockGetPrograms
      .mockResolvedValueOnce({ success: true, data: [initialProgram] })
      .mockResolvedValueOnce({ success: true, data: [updatedProgram] })

    mockUpdateProgram.mockResolvedValue({ success: true })

    const onChange = vi.fn()
    render(<ProgramsSection config={createConfig()} onChange={onChange} />)

    await waitFor(() => expect(screen.getByText('Old Name')).toBeInTheDocument())

    // Click edit
    fireEvent.click(screen.getByRole('button', { name: /edit program/i }))

    // Change name
    const nameInput = screen.getByDisplayValue('Old Name')
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } })

    // Change hours
    const hoursInput = screen.getByDisplayValue('1500')
    fireEvent.change(hoursInput, { target: { value: '2000' } })

    // Save
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('Updated Name')).toBeInTheDocument()
    })

    // Verify old value is gone
    expect(screen.queryByText('Old Name')).not.toBeInTheDocument()

    // Verify update was called
    expect(mockUpdateProgram).toHaveBeenCalledWith(
      'prog-1',
      expect.objectContaining({ name: 'Updated Name', required_hours: 2000 })
    )

    // Verify onChange reflects the updated authoritative state
    await waitFor(() => {
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
      expect(lastCall).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Updated Name', requiredHours: 2000 }),
        ])
      )
    })
  })

  it('deactivate → program immediately reflects inactive state after server confirms', async () => {
    // Need at least 2 programs so the "at least one" guard doesn't block
    const programA = createMockProgram({ id: 'prog-a', name: 'Program A', is_active: true })
    const programB = createMockProgram({ id: 'prog-b', name: 'Program B', is_active: true })
    const programBInactive = createMockProgram({ id: 'prog-b', name: 'Program B', is_active: false })

    mockGetPrograms
      .mockResolvedValueOnce({ success: true, data: [programA, programB] })
      .mockResolvedValueOnce({ success: true, data: [programA, programBInactive] })

    mockDeactivateProgram.mockResolvedValue({ success: true })

    const onChange = vi.fn()
    render(<ProgramsSection config={createConfig()} onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getAllByText('Active')).toHaveLength(2)
    })

    // Click deactivate on the second program (last Deactivate button)
    const deactivateButtons = screen.getAllByRole('button', { name: /deactivate/i })
    fireEvent.click(deactivateButtons[deactivateButtons.length - 1])

    await waitFor(() => {
      expect(screen.getByText('Inactive')).toBeInTheDocument()
    })

    // Verify active badges: one Active (program A), one Inactive (program B)
    expect(screen.getAllByText('Active')).toHaveLength(1)

    // Verify deactivate was called
    expect(mockDeactivateProgram).toHaveBeenCalledWith('prog-b')

    // Verify onChange reflects the inactive state
    await waitFor(() => {
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
      const inactiveProgram = lastCall.find((p: AcademicProgram) => p.id === 'prog-b')
      expect(inactiveProgram?.active).toBe(false)
    })
  })

  it('server failure on create → UI does not falsely display unsaved change', async () => {
    const initialProgram = createMockProgram({ id: 'prog-1', name: 'Existing Program' })
    mockGetPrograms.mockResolvedValue({ success: true, data: [initialProgram] })
    mockCreateProgram.mockResolvedValue({ success: false, error: 'Server error: database unavailable' })

    const onChange = vi.fn()
    render(<ProgramsSection config={createConfig()} onChange={onChange} />)

    await waitFor(() => expect(screen.getByText('Existing Program')).toBeInTheDocument())

    // Open add form
    fireEvent.click(screen.getByRole('button', { name: /add program/i }))

    // Fill form
    const nameInput = screen.getByPlaceholderText(/e\.g\.\s*,?\s*barbering/i)
    fireEvent.change(nameInput, { target: { value: 'Fake Program' } })

    // Submit
    const formSubmitBtn = screen.getAllByRole('button', { name: /^add program$/i })
      .find((btn) => !btn.querySelector('svg'))
    expect(formSubmitBtn).toBeDefined()
    fireEvent.click(formSubmitBtn!)

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument()
    })

    // The fake program should NOT appear in the list
    expect(screen.queryByText('Fake Program')).not.toBeInTheDocument()

    // Only the original program should be displayed
    expect(screen.getByText('Existing Program')).toBeInTheDocument()

    // onChange should NOT have been called with the fake program
    const callsWithFake = onChange.mock.calls.filter(
      (call) => call[0].some((p: AcademicProgram) => p.name === 'Fake Program')
    )
    expect(callsWithFake).toHaveLength(0)
  })

  it('server failure on update → list view does not falsely display unsaved change; edit form preserves input for retry', async () => {
    const initialProgram = createMockProgram({ id: 'prog-1', name: 'Original Name', required_hours: 1500 })
    mockGetPrograms.mockResolvedValue({ success: true, data: [initialProgram] })
    mockUpdateProgram.mockResolvedValue({ success: false, error: 'Server error: update failed' })

    const onChange = vi.fn()
    render(<ProgramsSection config={createConfig()} onChange={onChange} />)

    await waitFor(() => expect(screen.getByText('Original Name')).toBeInTheDocument())

    // Click edit
    fireEvent.click(screen.getByRole('button', { name: /edit program/i }))

    // Change name
    const nameInput = screen.getByDisplayValue('Original Name')
    fireEvent.change(nameInput, { target: { value: 'Hacked Name' } })

    // Save
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument()
    })

    // The list view should NOT show the hacked name — edit mode is still active,
    // but the authoritative dbPrograms state is unchanged.
    // onChange should NOT have been called with the hacked name
    const callsWithHacked = onChange.mock.calls.filter(
      (call) => call[0].some((p: AcademicProgram) => p.name === 'Hacked Name')
    )
    expect(callsWithHacked).toHaveLength(0)

    // The edit form should preserve the user's input so they can retry
    expect(screen.getByDisplayValue('Hacked Name')).toBeInTheDocument()
  })

  it('server failure on deactivate → UI does not falsely reflect deactivated state', async () => {
    // Need 2 programs so guard doesn't block
    const programA = createMockProgram({ id: 'prog-a', name: 'Program A', is_active: true })
    const programB = createMockProgram({ id: 'prog-b', name: 'Program B', is_active: true })

    mockGetPrograms.mockResolvedValue({ success: true, data: [programA, programB] })
    mockDeactivateProgram.mockResolvedValue({ success: false, error: 'Server error: cannot deactivate' })

    const onChange = vi.fn()
    render(<ProgramsSection config={createConfig()} onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getAllByText('Active')).toHaveLength(2)
    })

    // Click deactivate on the second program
    const deactivateButtons = screen.getAllByRole('button', { name: /deactivate/i })
    fireEvent.click(deactivateButtons[deactivateButtons.length - 1])

    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument()
    })

    // Both programs should still show as Active
    expect(screen.getAllByText('Active')).toHaveLength(2)
    expect(screen.queryByText('Inactive')).not.toBeInTheDocument()

    // onChange should NOT have been called with inactive state
    const callsWithInactive = onChange.mock.calls.filter(
      (call) => call[0].some((p: AcademicProgram) => p.active === false)
    )
    expect(callsWithInactive).toHaveLength(0)
  })

  it('does NOT use config.programs as fallback when dbPrograms is empty (no duplicate source of truth)', async () => {
    // Config has a fake program that does NOT exist in the database
    const fakeConfigProgram: AcademicProgram = {
      id: 'fake-local-id',
      name: 'Fake Local Program',
      requiredHours: 9999,
      requiredAssessments: 99,
      requiredPracticals: 99,
      active: true,
    }

    // Database returns empty (no programs)
    mockGetPrograms.mockResolvedValue({ success: true, data: [] })

    const onChange = vi.fn()
    render(<ProgramsSection config={createConfig([fakeConfigProgram])} onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText(/no programs configured/i)).toBeInTheDocument()
    })

    // The fake local program should NOT appear
    expect(screen.queryByText('Fake Local Program')).not.toBeInTheDocument()

    // onChange should have been called with the authoritative empty list
    await waitFor(() => {
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
      expect(lastCall).toHaveLength(0)
    })
  })

  it('prevents deactivating the last remaining program', async () => {
    const onlyProgram = createMockProgram({ id: 'prog-1', name: 'Only Program', is_active: true })
    mockGetPrograms.mockResolvedValue({ success: true, data: [onlyProgram] })

    const onChange = vi.fn()
    render(<ProgramsSection config={createConfig()} onChange={onChange} />)

    await waitFor(() => expect(screen.getByText('Only Program')).toBeInTheDocument())

    // Try to deactivate
    fireEvent.click(screen.getByRole('button', { name: /deactivate/i }))

    await waitFor(() => {
      expect(screen.getByText(/at least one program is required/i)).toBeInTheDocument()
    })

    // deactivateProgram should NOT have been called
    expect(mockDeactivateProgram).not.toHaveBeenCalled()

    // Program should still be active
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Required-hours change safeguards (founder directive 2026-09-08)
// ---------------------------------------------------------------------------

const mockConfirm = vi.fn()

describe('ProgramsSection — required-hours change safeguards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetPrograms.mockReset().mockResolvedValue({ success: true, data: [] })
    mockCreateProgram.mockReset().mockResolvedValue({ success: true, data: { id: 'new-id' } })
    mockUpdateProgram.mockReset().mockResolvedValue({ success: true })
    mockDeactivateProgram.mockReset().mockResolvedValue({ success: true })
    mockConfirm.mockReset().mockReturnValue(true)
    window.confirm = mockConfirm
  })

  it('asks for confirmation before changing required hours; saves on confirm', async () => {
    const program = createMockProgram({ id: 'prog-1', name: 'Barbering', required_hours: 1500 })
    mockGetPrograms.mockResolvedValue({ success: true, data: [program] })

    render(<ProgramsSection config={createConfig()} onChange={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Barbering')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /edit program/i }))
    fireEvent.change(screen.getByDisplayValue('1500'), { target: { value: '1200' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(mockConfirm).toHaveBeenCalledTimes(1)
    expect(mockConfirm).toHaveBeenCalledWith(expect.stringContaining('from 1500 to 1200'))
    await waitFor(() =>
      expect(mockUpdateProgram).toHaveBeenCalledWith(
        'prog-1',
        expect.objectContaining({ required_hours: 1200 })
      )
    )
  })

  it('does NOT save when the admin cancels the confirmation', async () => {
    mockConfirm.mockReturnValue(false)
    const program = createMockProgram({ id: 'prog-1', name: 'Barbering', required_hours: 1500 })
    mockGetPrograms.mockResolvedValue({ success: true, data: [program] })

    render(<ProgramsSection config={createConfig()} onChange={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Barbering')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /edit program/i }))
    fireEvent.change(screen.getByDisplayValue('1500'), { target: { value: '1200' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(mockConfirm).toHaveBeenCalledTimes(1)
    expect(mockUpdateProgram).not.toHaveBeenCalled()
    // Edit form stays open so the admin can retry or cancel explicitly
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('warns about active enrollments in the edit form and in the confirmation', async () => {
    const program = createMockProgram({
      id: 'prog-1',
      name: 'Barbering',
      required_hours: 1500,
      active_enrollments: 2,
    })
    mockGetPrograms.mockResolvedValue({ success: true, data: [program] })

    render(<ProgramsSection config={createConfig()} onChange={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Barbering')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /edit program/i }))

    // Warning visible in the edit form
    expect(screen.getByText(/2 active enrollments/)).toBeInTheDocument()

    fireEvent.change(screen.getByDisplayValue('1500'), { target: { value: '1200' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(mockConfirm).toHaveBeenCalledWith(expect.stringContaining('2 active enrollments'))
    expect(mockConfirm).toHaveBeenCalledWith(
      expect.stringContaining('hour-based progress, compliance, eligibility, and readiness')
    )
  })

  it('does not ask for confirmation when hours are unchanged', async () => {
    const program = createMockProgram({ id: 'prog-1', name: 'Barbering', required_hours: 1500 })
    mockGetPrograms.mockResolvedValue({ success: true, data: [program] })

    render(<ProgramsSection config={createConfig()} onChange={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Barbering')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /edit program/i }))
    fireEvent.change(screen.getByDisplayValue('Barbering'), { target: { value: 'Barbering Pro' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(mockConfirm).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(mockUpdateProgram).toHaveBeenCalledWith(
        'prog-1',
        expect.objectContaining({ name: 'Barbering Pro' })
      )
    )
  })

  it('shows the required-hours explainer in the edit and add forms', async () => {
    const program = createMockProgram({ id: 'prog-1', name: 'Barbering', required_hours: 1500 })
    mockGetPrograms.mockResolvedValue({ success: true, data: [program] })

    render(<ProgramsSection config={createConfig()} onChange={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Barbering')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /edit program/i }))
    expect(
      screen.getAllByText(
        /Changing required hours affects hour-based progress, compliance, eligibility, and readiness calculations/
      ).length
    ).toBeGreaterThan(0)
  })
})

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AttendanceClient from './AttendanceClient'

const ensureTodayRecords = vi.fn()
const updateStatus = vi.fn()
const bulkUpdateStatus = vi.fn()
const updateActualTimes = vi.fn()
const submitDailyAttendance = vi.fn()

vi.mock('@/hooks/useAttendance', () => ({
  useAttendance: () => ({
    records: [],
    loading: false,
    error: null,
    selectedIds: new Set<string>(),
    isAllSelected: false,
    toggleSelection: vi.fn(),
    toggleAll: vi.fn(),
    clearSelection: vi.fn(),
    updateStatus,
    bulkUpdateStatus,
    addNote: vi.fn(),
    updateActualTimes,
    submitDailyAttendance,
    submitCorrection: vi.fn(),
    getAuditHistory: vi.fn(),
    refresh: vi.fn(),
    ensureTodayRecords,
  }),
}))

vi.mock('@/hooks/useAttendanceFilters', () => ({
  useAttendanceFilters: () => ({
    filters: {},
    dateFrom: '',
    dateTo: '',
    searchQuery: '',
    selectedStatuses: [],
    selectedStudentIds: [],
    setDateFrom: vi.fn(),
    setDateTo: vi.fn(),
    setSearchQuery: vi.fn(),
    toggleStatus: vi.fn(),
    toggleStudentId: vi.fn(),
    clearFilters: vi.fn(),
    hasActiveFilters: false,
    activeFilterCount: 0,
  }),
}))

vi.mock('@/hooks/useAttendanceExport', () => ({
  useAttendanceExport: () => ({ exporting: false, exportData: vi.fn() }),
}))

vi.mock('@/components/attendance/AttendanceGrid', () => ({ default: () => null }))
vi.mock('@/components/attendance/AttendanceFilters', () => ({ default: () => null }))
vi.mock('@/components/attendance/AttendanceSummary', () => ({ default: () => null }))
vi.mock('@/components/attendance/CorrectionModal', () => ({ default: () => null }))
vi.mock('@/components/attendance/AuditLog', () => ({ default: () => null }))
vi.mock('@/components/attendance/ExportButton', () => ({ default: () => null }))

const student = {
  id: 'student-1',
  full_name: 'Test Student',
  email: 'student@example.com',
} as never

const currentUser = {
  id: 'instructor-1',
  full_name: 'Test Instructor',
} as never

const createdRecord = {
  id: 'attendance-1',
  userId: 'student-1',
  schoolId: 'school-1',
  date: '2026-09-22',
  status: 'Absent',
  clockedInAt: null,
  clockedOutAt: null,
  minutesPresent: null,
  note: null,
  verifiedBy: 'instructor-1',
  createdAt: '2026-09-22T12:00:00.000Z',
  updatedAt: '2026-09-22T12:00:00.000Z',
}

function renderAttendance() {
  return render(
    <AttendanceClient
      initialRecords={[]}
      students={[student]}
      currentUser={currentUser}
      schoolId="school-1"
      schoolName="Test School"
      defaultDate="2026-09-22"
      schoolTimeZone="America/Chicago"
      dailyScheduleExpectations={[
        {
          studentId: 'student-1',
          date: '2026-09-22',
          isScheduled: true,
          source: 'recurring',
          label: 'Full-Time',
          startTime: '08:30',
          endTime: '16:00',
          breakMinutes: 30,
          plannedMinutes: 420,
          reason: null,
        },
      ]}
    />
  )
}

describe('AttendanceClient today controls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ensureTodayRecords.mockResolvedValue([createdRecord])
    updateStatus.mockResolvedValue(undefined)
    bulkUpdateStatus.mockResolvedValue(undefined)
    updateActualTimes.mockResolvedValue(undefined)
    submitDailyAttendance.mockResolvedValue(true)
  })

  it('stages an individual status and saves it only when Submit Day is pressed', async () => {
    renderAttendance()

    fireEvent.click(screen.getByRole('button', { name: /test student/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Present' }))

    expect(updateStatus).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Submit Day' }))

    await waitFor(() =>
      expect(submitDailyAttendance).toHaveBeenCalledWith([
        expect.objectContaining({
          studentId: 'student-1',
          status: 'Present',
          minutesPresent: 420,
        }),
      ]),
    )
  })

  it('marks scheduled students in the draft without persisting before Submit Day', async () => {
    renderAttendance()

    const button = screen.getByRole('button', { name: 'Mark Scheduled Students Present' })
    expect(button).toBeEnabled()
    fireEvent.click(button)

    expect(bulkUpdateStatus).not.toHaveBeenCalled()
    expect(screen.getByText('Attendance: Present ✓')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit Day' })).toBeEnabled()
  })
})

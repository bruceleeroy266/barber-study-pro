import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { calculateAttendanceSummary } from '@/lib/attendance'
import type { AttendanceRecord } from '@/types'

const root = process.cwd()
const page = readFileSync(
  join(root, 'src/app/(dashboard)/dashboard/hours/page.tsx'),
  'utf-8',
)

describe('E7 student attendance summary', () => {
  it('shows attendance percentage and status counts', () => {
    expect(page).toContain('Attendance Summary')
    expect(page).toContain('attendanceSummary.attendancePercentage')
    expect(page).toContain('attendanceSummary.presentDays')
    expect(page).toContain('attendanceSummary.tardyDays')
    expect(page).toContain('attendanceSummary.absentDays')
    expect(page).toContain('attendanceSummary.excusedDays')
  })

  it('reuses the shared attendance summary rules', () => {
    expect(page).toContain('calculateAttendanceSummary(user.id, attendanceRecords)')
    expect(page).toContain('Excused days are excluded from the denominator')
  })

  it('shows today status when available and otherwise the latest recorded status', () => {
    expect(page).toContain('const currentAttendanceStatus = todayStatus ?? attendanceSummary.currentStatus')
    expect(page).toContain('Current Status')
    expect(page).toContain('Latest recorded:')
  })

  it('matches current attendance calculations for present, tardy, absent, and excused days', () => {
    const records: AttendanceRecord[] = [
      {
        id: 'p',
        userId: 's',
        schoolId: 'school',
        date: '2026-09-22',
        status: 'Present',
        clockedInAt: null,
        clockedOutAt: null,
        minutesPresent: 480,
        note: null,
        verifiedBy: null,
        createdAt: '2026-09-22T00:00:00Z',
        updatedAt: '2026-09-22T00:00:00Z',
      },
      {
        id: 't',
        userId: 's',
        schoolId: 'school',
        date: '2026-09-23',
        status: 'Tardy',
        clockedInAt: null,
        clockedOutAt: null,
        minutesPresent: 450,
        note: null,
        verifiedBy: null,
        createdAt: '2026-09-23T00:00:00Z',
        updatedAt: '2026-09-23T00:00:00Z',
      },
      {
        id: 'a',
        userId: 's',
        schoolId: 'school',
        date: '2026-09-24',
        status: 'Absent',
        clockedInAt: null,
        clockedOutAt: null,
        minutesPresent: 0,
        note: null,
        verifiedBy: null,
        createdAt: '2026-09-24T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z',
      },
      {
        id: 'e',
        userId: 's',
        schoolId: 'school',
        date: '2026-09-25',
        status: 'Excused',
        clockedInAt: null,
        clockedOutAt: null,
        minutesPresent: 0,
        note: null,
        verifiedBy: null,
        createdAt: '2026-09-25T00:00:00Z',
        updatedAt: '2026-09-25T00:00:00Z',
      },
    ]

    const summary = calculateAttendanceSummary('s', records)
    expect(summary.presentDays).toBe(1)
    expect(summary.tardyDays).toBe(1)
    expect(summary.absentDays).toBe(1)
    expect(summary.excusedDays).toBe(1)
    expect(summary.attendancePercentage).toBe(33)
    expect(summary.currentStatus).toBe('Excused')
  })

  it('remains read-only for students', () => {
    expect(page).not.toContain('<form')
    expect(page).not.toContain('.insert(')
    expect(page).not.toContain('.update(')
    expect(page).not.toContain('.delete(')
  })
})

import { describe, expect, it } from 'vitest'
import type { HourLog, Profile } from '@/types'
import {
  buildSchoolOverviewMetrics,
  buildStudentPerformanceRows,
  generateSchoolReport,
  type SchoolAnalyticsInputs,
} from '@/lib/school-owner/school-analytics'

function student(id: string): Profile {
  return {
    id,
    email: `${id}@example.com`,
    full_name: `Student ${id}`,
    role: 'student',
    school_id: 'school-1',
    barber_shop_name: null,
    mentor_name: null,
    avatar_url: null,
    approval_status: 'approved',
    is_disabled: false,
    approved_by: null,
    approved_at: null,
    requires_password_change: false,
    created_at: '2026-10-03T00:00:00Z',
    updated_at: '2026-10-03T00:00:00Z',
  }
}

function hours(userId: string, approvedHours: number): HourLog {
  return {
    id: `hours-${userId}`,
    user_id: userId,
    date: '2026-10-03',
    category: 'Clinic',
    minutes: approvedHours * 60,
    effective_minutes: approvedHours * 60,
    integrity_status: 'valid_unadjusted',
    status: 'approved',
    notes: null,
    created_at: '2026-10-03T00:00:00Z',
    updated_at: '2026-10-03T00:00:00Z',
  }
}

function inputs(overrides: Partial<SchoolAnalyticsInputs>): SchoolAnalyticsInputs {
  return {
    students: [],
    instructors: [],
    attendanceRecords: [],
    hourLogs: [],
    quizAttempts: [],
    progress: [],
    grades: [],
    gradeCategories: [],
    assessments: [],
    notifications: [],
    ...overrides,
  }
}

describe('ADM-1E school aggregate hour parity', () => {
  it('does not let one over-complete student erase another student remaining hours', () => {
    const data = inputs({
      students: [student('s1'), student('s2')],
      hourLogs: [hours('s1', 1300), hours('s2', 1100)],
      requiredHoursByStudentId: { s1: 1200, s2: 1200 },
    })

    const metrics = buildSchoolOverviewMetrics(data)
    expect(metrics.completedHours).toBe(2400)
    expect(metrics.remainingHours).toBe(100)
  })

  it('keeps school hours report remaining values aligned with canonical per-student math', () => {
    const data = inputs({
      students: [student('s1')],
      hourLogs: [hours('s1', 1300)],
      requiredHoursByStudentId: { s1: 1200 },
    })

    const row = buildStudentPerformanceRows(data)[0]
    const report = generateSchoolReport('hours', data)

    expect(row.completedHours).toBe(1300)
    expect(report.rows[0]?.Completed).toBe(1300)
    expect(report.rows[0]?.Required).toBe(1200)
    expect(report.rows[0]?.Remaining).toBe(0)
  })
})

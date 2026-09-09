/**
 * Program-driven school-owner analytics (nationwide hardening, 2026-09-08).
 *
 * Proves that school-owner analytics/reporting use the applicable configured
 * program required_hours (SchoolAnalyticsInputs.requiredHours) instead of the
 * historical hard-coded REQUIRED_HOURS = 1500, and that missing/invalid
 * values preserve the default fallback behavior.
 */

import { describe, it, expect } from 'vitest'
import {
  buildSchoolOverviewMetrics,
  buildStudentPerformanceRows,
  buildSchoolHealthScore,
  buildSchoolAlerts,
  generateSchoolReport,
  SchoolAnalyticsInputs,
} from '@/lib/school-owner/school-analytics'
import { DEFAULT_REQUIRED_HOURS } from '@/lib/programs/requirements'
import { Profile, HourLog, HourStatus } from '@/types'

function makeStudent(id: string): Profile {
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
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }
}

function makeHourLog(userId: string, minutes: number, status: HourStatus): HourLog {
  return {
    id: `log-${userId}-${status}-${minutes}`,
    user_id: userId,
    date: '2026-09-01',
    category: 'Clinic',
    minutes,
    status,
    notes: null,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  }
}

function makeInputs(overrides: Partial<SchoolAnalyticsInputs>): SchoolAnalyticsInputs {
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

describe('school analytics with configured program required_hours (1000h program)', () => {
  it('student performance rows report the program requiredHours', () => {
    const inputs = makeInputs({ students: [makeStudent('s1')], requiredHours: 1000 })
    const rows = buildStudentPerformanceRows(inputs)
    expect(rows[0]?.requiredHours).toBe(1000)
  })

  it('overview remainingHours scales with the program requirement', () => {
    // 2 students, 600 completed hours total.
    const inputs = makeInputs({
      students: [makeStudent('s1'), makeStudent('s2')],
      hourLogs: [makeHourLog('s1', 600 * 60, 'approved')],
      requiredHours: 1000,
    })
    const metrics = buildSchoolOverviewMetrics(inputs)
    expect(metrics.remainingHours).toBe(2 * 1000 - 600)

    const defaultMetrics = buildSchoolOverviewMetrics({ ...inputs, requiredHours: undefined })
    expect(defaultMetrics.remainingHours).toBe(2 * 1500 - 600)
  })

  it('health score hours component uses the program requirement', () => {
    // 1 student with 500 approved hours: 50% of 1000h, 33% of 1500h.
    const inputs = makeInputs({
      students: [makeStudent('s1')],
      hourLogs: [makeHourLog('s1', 500 * 60, 'approved')],
      requiredHours: 1000,
    })
    const health = buildSchoolHealthScore(inputs)
    expect(health.componentScores.hoursCompletion).toBe(50)

    const defaultHealth = buildSchoolHealthScore({ ...inputs, requiredHours: undefined })
    expect(defaultHealth.componentScores.hoursCompletion).toBe(33)
  })

  it('missing-hours alert respects the program pace threshold', () => {
    // 600 approved hours: on pace for 1000h (>= 50%), behind for 1500h (< 50%).
    const inputs = makeInputs({
      students: [makeStudent('s1')],
      hourLogs: [makeHourLog('s1', 600 * 60, 'approved')],
      requiredHours: 1000,
    })
    const alerts = buildSchoolAlerts(inputs)
    expect(alerts.filter((a) => a.type === 'missing_hours')).toHaveLength(0)

    const defaultAlerts = buildSchoolAlerts({ ...inputs, requiredHours: undefined })
    const missing = defaultAlerts.filter((a) => a.type === 'missing_hours')
    expect(missing).toHaveLength(1)
    expect(missing[0]?.description).toContain('of 1500 hours')
  })

  it('missing-hours alert text cites the program requirement when behind', () => {
    const inputs = makeInputs({
      students: [makeStudent('s1')],
      hourLogs: [makeHourLog('s1', 400 * 60, 'approved')],
      requiredHours: 1000,
    })
    const missing = buildSchoolAlerts(inputs).filter((a) => a.type === 'missing_hours')
    expect(missing).toHaveLength(1)
    expect(missing[0]?.description).toBe('Student s1: 400 of 1000 hours completed')
  })

  it('hours report renders per-student program required hours', () => {
    const inputs = makeInputs({
      students: [makeStudent('s1')],
      hourLogs: [makeHourLog('s1', 600 * 60, 'approved')],
      requiredHours: 1000,
    })
    const report = generateSchoolReport('hours', inputs)
    expect(report.rows[0]?.Required).toBe(1000)
    expect(report.rows[0]?.Remaining).toBe(400)
  })
})

describe('school analytics fallback behavior', () => {
  it.each([undefined, null, 0, -100, NaN])('falls back to the 1500 schema default for %s', (value) => {
    const inputs = makeInputs({ students: [makeStudent('s1')], requiredHours: value })
    expect(buildStudentPerformanceRows(inputs)[0]?.requiredHours).toBe(DEFAULT_REQUIRED_HOURS)
    expect(DEFAULT_REQUIRED_HOURS).toBe(1500)
  })
})

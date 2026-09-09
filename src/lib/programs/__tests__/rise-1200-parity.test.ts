/**
 * RISE 1200-hour parity proof (founder directive 2026-09-08).
 *
 * RISE Program's production configuration: active Barbering program with
 * programs.required_hours = 1200. This suite proves that student-facing,
 * instructor-facing, and school-owner-facing calculations all agree on that
 * configured value — and that the legacy default (1500) would disagree,
 * proving the configured value is what actually flows.
 */

import { describe, it, expect } from 'vitest'
import {
  buildStudentCompliance,
  generateComplianceReport,
  thresholdsWithRequiredHours,
  ComplianceRuleThresholds,
} from '@/lib/compliance'
import {
  buildStudentPerformanceRows,
  buildSchoolOverviewMetrics,
  buildSchoolHealthScore,
  buildSchoolAlerts,
  SchoolAnalyticsInputs,
} from '@/lib/school-owner/school-analytics'
import { generateNotificationsFromHours } from '@/lib/messaging/notification-engine'
import { Profile, HourLog, HourStatus } from '@/types'

const RISE_REQUIRED_HOURS = 1200
const COMPLETED_HOURS = 900 // 75% of 1200 (60% of the legacy 1500 default)

function makeStudent(id: string): Profile {
  return {
    id,
    email: `${id}@example.com`,
    full_name: `Student ${id}`,
    role: 'student',
    school_id: 'rise-school',
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

const riseThresholds: ComplianceRuleThresholds = thresholdsWithRequiredHours(RISE_REQUIRED_HOURS)
const hourLogs900 = [makeHourLog('s1', COMPLETED_HOURS * 60, 'approved')]

const complianceInputs = {
  student: makeStudent('s1'),
  attendanceRecords: [],
  hourLogs: hourLogs900,
  quizAttempts: [],
  progress: [],
  grades: [],
  gradeCategories: [],
  assessments: [],
}

describe('RISE 1200-hour program: student / instructor / school-owner agreement', () => {
  it('student-facing compliance resolves 1200 (75% hours at 900 completed)', () => {
    // This is the calculation the student compliance dashboard uses after the
    // parity fix: buildStudentCompliance with the student's program thresholds.
    const result = buildStudentCompliance({ ...complianceInputs, thresholds: riseThresholds })
    expect(result.graduationReadiness.requiredHours).toBe(1200)
    expect(result.complianceScore.requirements.find((r) => r.id === 'hours')?.requiredValue).toBe(1200)
    expect(result.complianceScore.componentScores.hours).toBe(75)
    expect(result.graduationReadiness.remainingItems.some((r) => r.includes('300'))).toBe(true)
  })

  it('instructor-facing compliance and reports render the same 1200 basis', () => {
    const report = generateComplianceReport(
      'student_compliance',
      {
        students: [makeStudent('s1')],
        attendanceRecords: [],
        hourLogs: hourLogs900,
        quizAttempts: [],
        progress: [],
        grades: [],
        gradeCategories: [],
        assessments: [],
      },
      new Map([['s1', riseThresholds]])
    )
    expect(report.rows[0]?.Hours).toBe('900/1200')
  })

  it('school-owner analytics resolve 1200 across rows, overview, health, and alerts', () => {
    const inputs = makeInputs({
      students: [makeStudent('s1')],
      hourLogs: hourLogs900,
      requiredHours: RISE_REQUIRED_HOURS,
    })

    const rows = buildStudentPerformanceRows(inputs)
    expect(rows[0]?.requiredHours).toBe(1200)
    expect(rows[0]?.completedHours).toBe(900)

    const overview = buildSchoolOverviewMetrics(inputs)
    expect(overview.remainingHours).toBe(1200 - 900)

    const health = buildSchoolHealthScore(inputs)
    expect(health.componentScores.hoursCompletion).toBe(75)

    // 75% ≥ 50% pace threshold → no missing-hours alert
    expect(buildSchoolAlerts(inputs).filter((a) => a.type === 'missing_hours')).toHaveLength(0)
  })

  it('hour-pace notifications agree: no missing-hours flag at 75% of 1200', () => {
    const notifications = generateNotificationsFromHours('s1', hourLogs900, RISE_REQUIRED_HOURS)
    expect(notifications.filter((n) => n.title === 'Missing Hours')).toHaveLength(0)
  })

  it('all surfaces report the same hours completion (75%) — and the legacy default would disagree', () => {
    const studentView = buildStudentCompliance({ ...complianceInputs, thresholds: riseThresholds })
    const schoolHealth = buildSchoolHealthScore(
      makeInputs({ students: [makeStudent('s1')], hourLogs: hourLogs900, requiredHours: RISE_REQUIRED_HOURS })
    )
    expect(studentView.complianceScore.componentScores.hours).toBe(75)
    expect(schoolHealth.componentScores.hoursCompletion).toBe(75)

    // Contrast: under the legacy 1500 default the same student reads 60%,
    // and a 600-hour student (50% of 1200) is on pace but flagged under 1500.
    const legacyView = buildStudentCompliance(complianceInputs)
    expect(legacyView.complianceScore.componentScores.hours).toBe(60)
    expect(legacyView.graduationReadiness.requiredHours).toBe(1500)

    const hourLogs600 = [makeHourLog('s1', 600 * 60, 'approved')]
    expect(
      generateNotificationsFromHours('s1', hourLogs600, RISE_REQUIRED_HOURS).filter((n) => n.title === 'Missing Hours')
    ).toHaveLength(0)
    expect(
      generateNotificationsFromHours('s1', hourLogs600).filter((n) => n.title === 'Missing Hours')
    ).toHaveLength(1)
  })
})

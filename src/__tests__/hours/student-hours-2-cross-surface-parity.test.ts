import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { calculateAdaptiveStudentHours } from '@/lib/hours/adaptive-student-hours'
import { buildStudentCompliance } from '@/lib/compliance/compliance-engine'
import { buildStudentPerformanceRows, type SchoolAnalyticsInputs } from '@/lib/school-owner/school-analytics'
import { thresholdsWithRequiredHours } from '@/lib/compliance/compliance-rules'
import type { HourLog, Profile } from '@/types'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

const studentHoursPage = read('src/app/(dashboard)/dashboard/hours/page.tsx')
const instructorDetail = read('src/app/instructor/student/[studentId]/page.tsx')
const staffManager = read('src/components/hours/StaffHoursManager.tsx')
const pdf = read('src/lib/hours/export-pdf.ts')
const compliance = read('src/lib/compliance/compliance-engine.ts')
const analytics = read('src/lib/school-owner/school-analytics.ts')
const notifications = read('src/lib/messaging/notification-engine.ts')

const student = {
  id: 'student-1',
  full_name: 'Transfer Student',
  email: 'student@example.com',
  role: 'student',
  school_id: 'school-1',
  include_in_school_metrics: true,
} as Profile

const hours: HourLog[] = [
  {
    id: 'hour-1',
    school_id: 'school-1',
    user_id: student.id,
    date: '2026-10-01',
    category: 'Clinic',
    minutes: 120 * 60,
    status: 'approved',
    notes: null,
    submitted_by: 'instructor-1',
    reviewed_by: 'admin-1',
    reviewed_at: '2026-10-01T18:00:00Z',
    created_at: '2026-10-01T12:00:00Z',
    effective_minutes: 120 * 60,
    integrity_status: 'valid_unadjusted',
  } as HourLog,
]

describe('STUDENT-HOURS-2 cross-surface adaptive parity', () => {
  it('routes every hour-progress surface through the adaptive calculator', () => {
    for (const source of [
      studentHoursPage,
      instructorDetail,
      staffManager,
      pdf,
      compliance,
      analytics,
      notifications,
    ]) {
      expect(source).toContain('calculateAdaptiveStudentHours')
    }
  })

  it('produces the same counted total and effective requirement in compliance and school analytics', () => {
    const adaptive = calculateAdaptiveStudentHours(hours, {
      programRequiredHours: 1250,
      priorCreditMinutes: 600 * 60,
      requirementOverrideMinutes: 900 * 60,
    })

    const complianceResult = buildStudentCompliance({
      student,
      attendanceRecords: [],
      hourLogs: hours,
      quizAttempts: [],
      progress: [],
      grades: [],
      gradeCategories: [],
      assessments: [],
      thresholds: thresholdsWithRequiredHours(1250),
      priorCreditMinutes: 600 * 60,
      requirementOverrideMinutes: 900 * 60,
    })

    const analyticsInputs: SchoolAnalyticsInputs = {
      students: [student],
      instructors: [],
      attendanceRecords: [],
      hourLogs: hours,
      quizAttempts: [],
      progress: [],
      grades: [],
      gradeCategories: [],
      assessments: [],
      notifications: [],
      requiredHoursByStudentId: { [student.id]: 1250 },
      priorCreditMinutesByStudentId: { [student.id]: 600 * 60 },
      requirementOverrideMinutesByStudentId: { [student.id]: 900 * 60 },
    }

    const analyticsRow = buildStudentPerformanceRows(analyticsInputs)[0]

    expect(adaptive.creditedAndEarnedMinutes / 60).toBe(720)
    expect(adaptive.effectiveRequiredHours).toBe(900)
    expect(adaptive.remainingMinutes / 60).toBe(180)

    expect(complianceResult.completedHours).toBe(720)
    expect(complianceResult.graduationReadiness.requiredHours).toBe(900)
    expect(complianceResult.priorCreditHours).toBe(600)
    expect(complianceResult.earnedHours).toBe(120)

    expect(analyticsRow.completedHours).toBe(720)
    expect(analyticsRow.requiredHours).toBe(900)
  })

  it('keeps prior credit separate from earned-here evidence in reports', () => {
    expect(pdf).toContain("'Earned Here'")
    expect(pdf).toContain("'Prior Credit'")
    expect(pdf).toContain("'Counted Total'")
    expect(pdf).toContain('adaptive.earnedApprovedMinutes')
    expect(pdf).toContain('adaptive.priorCreditMinutes')
    expect(pdf).toContain('adaptive.creditedAndEarnedMinutes')
  })
})

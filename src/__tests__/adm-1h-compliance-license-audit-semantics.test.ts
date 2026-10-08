import { describe, expect, it } from 'vitest'
import {
  calculateComplianceScore,
  calculateGraduationReadiness,
  determineBoardEligibility,
  generateComplianceReport,
  buildComplianceAlerts,
  DEFAULT_COMPLIANCE_THRESHOLDS,
  type ComplianceRuleThresholds,
} from '@/lib/compliance'
import type { HourLog, Profile } from '@/types'

const baseInputs = {
  attendancePercentage: 100,
  completedHours: 1200,
  assessmentPassRate: 0,
  practicalPassRate: 0,
  readinessScore: 100,
  overallGrade: 100,
  completedAssessments: 0,
  completedPracticals: 0,
}

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


function hourLog(userId: string, hours: number): HourLog {
  return {
    id: `hours-${userId}`,
    user_id: userId,
    date: '2026-10-03',
    category: 'Clinic',
    minutes: hours * 60,
    status: 'approved',
    notes: null,
    created_at: '2026-10-03T00:00:00Z',
    updated_at: '2026-10-03T00:00:00Z',
  }
}

const emptyInputs = {
  attendanceRecords: [],
  hourLogs: [],
  quizAttempts: [],
  progress: [],
  grades: [],
  gradeCategories: [],
  assessments: [],
}

describe('ADM-1H compliance/license/audit-center semantics', () => {
  it('does not invent assessment or practical completion counts when no program value exists', () => {
    expect(DEFAULT_COMPLIANCE_THRESHOLDS.requiredAssessments).toBe(0)
    expect(DEFAULT_COMPLIANCE_THRESHOLDS.requiredPracticals).toBe(0)
  })

  it('treats zero configured assessment/practical counts as not applicable', () => {
    const score = calculateComplianceScore(baseInputs)
    expect(score.requirements.find((r) => r.id === 'assessments')?.status).toBe('met')
    expect(score.requirements.find((r) => r.id === 'practicals')?.status).toBe('met')

    const completion = calculateGraduationReadiness({
      studentId: 's1',
      fullName: 'Student s1',
      ...baseInputs,
    })
    expect(Number.isFinite(completion.percentage)).toBe(true)
    expect(completion.remainingItems.some((item) => item.includes('assessments remaining'))).toBe(false)
    expect(completion.remainingItems.some((item) => item.includes('practicals remaining'))).toBe(false)

    const check = determineBoardEligibility(baseInputs)
    expect(check.status).toBe('eligible')
    expect(check.label).toBe('Tracked Requirements Met')
    expect(check.reasons.join(' ')).not.toMatch(/state board/i)
  })

  it('requires completion count as well as pass rate when assessments are configured', () => {
    const thresholds: ComplianceRuleThresholds = {
      ...DEFAULT_COMPLIANCE_THRESHOLDS,
      requiredAssessments: 2,
      minimumAssessmentPassRate: 80,
    }
    const inputs = {
      ...baseInputs,
      completedAssessments: 1,
      assessmentPassRate: 100,
    }

    const score = calculateComplianceScore(inputs, thresholds)
    expect(score.requirements.find((r) => r.id === 'assessments')?.status).toBe('missing')

    const check = determineBoardEligibility(inputs, thresholds)
    expect(check.status).not.toBe('eligible')
    expect(check.missingRequirements).toContain('Assessments completed: 1/2')
  })

  it('NZD-1: emits no compliance alerts when a new student has zero evidence', () => {
    const alerts = buildComplianceAlerts({
      student: student('nzd-empty'),
      ...emptyInputs,
      thresholds: {
        ...DEFAULT_COMPLIANCE_THRESHOLDS,
        requiredAssessments: 10,
        requiredPracticals: 10,
      },
    })

    expect(alerts).toEqual([])
  })

  it('NZD-1: preserves legitimate missing-hours and graduation-risk alerts once hour evidence exists', () => {
    const alerts = buildComplianceAlerts({
      student: student('nzd-hours'),
      ...emptyInputs,
      hourLogs: [hourLog('nzd-hours', 100)],
    })

    expect(alerts.some((alert) => alert.type === 'missing_hours')).toBe(true)
    expect(alerts.some((alert) => alert.type === 'graduation_risk')).toBe(true)
  })

  it('uses evidence-aware no-data language in internal tracking reports', () => {
    const report = generateComplianceReport(
      'student_compliance',
      { students: [student('s1')], ...emptyInputs },
    )
    const row = report.rows[0]

    expect(report.title).toBe('Student Requirement Tracking Report')
    expect(row?.['Tracking Score']).toBe('Not enough data yet')
    expect(row?.Status).toBe('Not enough data yet')
    expect(row?.Attendance).toBe('No Attendance Data')
    expect(row?.Hours).toBe('No Hours Data')
    expect(row?.['Assessment Pass Rate']).toBe('Not Required')
    expect(row?.['Practical Pass Rate']).toBe('Not Required')
    expect(row?.Readiness).toBe('No Data')
    expect(row?.Grade).toBe('No Grade')
  })

  it('preserves a legitimate tracking score once real tracked evidence exists', () => {
    const report = generateComplianceReport(
      'student_compliance',
      {
        students: [student('s1')],
        ...emptyInputs,
        hourLogs: [hourLog('s1', 300)],
      },
    )
    const row = report.rows[0]

    expect(typeof row?.['Tracking Score']).toBe('number')
    expect(row?.['Tracking Score']).toBe(41)
    expect(row?.Status).toBe('Critical')
  })

  it('keeps school-level tracking aggregates in no-data state until evidence exists', () => {
    const report = generateComplianceReport(
      'school_compliance',
      { students: [student('s1'), student('s2')], ...emptyInputs },
    )

    expect(report.summary).toBe('Average ASCYN tracking score: Not enough data yet')
    expect(report.rows.find((row) => row.Metric === 'Average Tracking Score')?.Value).toBe('Not enough data yet')
    expect(report.rows.find((row) => row.Metric === 'Needs Attention')?.Value).toBe(0)
  })

  it('uses only students with real evidence in school-level tracking aggregates', () => {
    const report = generateComplianceReport(
      'school_compliance',
      {
        students: [student('s1'), student('s2')],
        ...emptyInputs,
        hourLogs: [hourLog('s1', 300)],
      },
    )

    expect(report.rows.find((row) => row.Metric === 'Average Tracking Score')?.Value).toBe(41)
    expect(report.rows.find((row) => row.Metric === 'Needs Attention')?.Value).toBe(1)
  })

  it('NZD-2: keeps program-completion readiness neutral with zero evidence', () => {
    const report = generateComplianceReport(
      'graduation_readiness',
      { students: [student('s1')], ...emptyInputs },
    )
    const row = report.rows[0]

    expect(report.summary).toBe('Program completion readiness: Not enough data yet')
    expect(row?.['Readiness %']).toBe('Not enough data yet')
    expect(row?.['Hours Complete']).toBe('No Hours Data')
    expect(row?.Ready).toBe('Not enough data yet')
    expect(row?.['Remaining Items']).toBe('Not enough data yet')
  })

  it('NZD-2: keeps tracked-requirements check neutral with zero evidence', () => {
    const report = generateComplianceReport(
      'board_eligibility',
      { students: [student('s1')], ...emptyInputs },
    )
    const row = report.rows[0]

    expect(report.summary).toBe('Tracked requirements: Not enough data yet')
    expect(row?.Status).toBe('Not enough data yet')
    expect(row?.['Missing Requirements']).toBe('Not enough data yet')
  })

  it('NZD-2: keeps instructor requirement report neutral with zero evidence', () => {
    const report = generateComplianceReport(
      'instructor_compliance',
      { students: [student('s1')], ...emptyInputs },
    )
    const row = report.rows[0]

    expect(report.summary).toBe('Requirement tracking summary: Not enough data yet')
    expect(row?.['Tracking Score']).toBe('Not enough data yet')
    expect(row?.['Tracked Requirements Met']).toBe('Not enough data yet')
    expect(row?.['At Risk']).toBe('Not enough data yet')
  })

  it('NZD-2: preserves legitimate negative compliance-report statuses once evidence exists', () => {
    const data = {
      students: [student('s1')],
      ...emptyInputs,
      hourLogs: [hourLog('s1', 100)],
    }

    const completion = generateComplianceReport('graduation_readiness', data)
    const tracked = generateComplianceReport('board_eligibility', data)
    const instructor = generateComplianceReport('instructor_compliance', data)

    expect(completion.rows[0]?.Ready).toBe('No')
    expect(completion.rows[0]?.['Hours Complete']).toBe('100/1200')
    expect(tracked.rows[0]?.Status).not.toBe('Not enough data yet')
    expect(instructor.rows[0]?.['At Risk']).toBe('Yes')
  })

  it('does not present the internal requirements report as a licensing determination', () => {
    const report = generateComplianceReport(
      'board_eligibility',
      { students: [student('s1')], ...emptyInputs },
    )

    expect(report.title).toBe('Tracked Requirements Check')
    expect(report.title).not.toMatch(/board eligibility/i)
    expect(report.summary).not.toMatch(/eligible students/i)
  })
})

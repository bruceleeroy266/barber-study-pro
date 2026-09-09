/**
 * Program-driven compliance thresholds (nationwide pilot, 2026-09-08).
 *
 * Verifies that a school-configured programs.required_hours value flows through
 * the compliance stack instead of the historical hard-coded 1500, and that
 * missing values preserve the default fallback.
 */

import { describe, it, expect } from 'vitest'
import {
  thresholdsWithRequiredHours,
  DEFAULT_COMPLIANCE_THRESHOLDS,
  calculateComplianceScore,
  determineBoardEligibility,
  calculateGraduationReadiness,
  generateComplianceReport,
  ComplianceRuleThresholds,
} from '@/lib/compliance'
import { defaultProgramRequirements, DEFAULT_REQUIRED_HOURS } from '@/lib/programs/requirements'
import { Profile } from '@/types'

const baseInputs = {
  attendancePercentage: 100,
  completedHours: 1200,
  assessmentPassRate: 100,
  practicalPassRate: 100,
  readinessScore: 100,
  overallGrade: 100,
  completedAssessments: 99,
  completedPracticals: 99,
}

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

const emptyReportInputs = {
  attendanceRecords: [],
  hourLogs: [],
  quizAttempts: [],
  progress: [],
  grades: [],
  gradeCategories: [],
  assessments: [],
}

describe('thresholdsWithRequiredHours', () => {
  it('overrides only requiredHours when given a valid program value', () => {
    const t = thresholdsWithRequiredHours(1000)
    expect(t.requiredHours).toBe(1000)
    expect(t.minimumAttendancePercentage).toBe(DEFAULT_COMPLIANCE_THRESHOLDS.minimumAttendancePercentage)
    expect(t.requiredAssessments).toBe(DEFAULT_COMPLIANCE_THRESHOLDS.requiredAssessments)
  })

  it.each([undefined, null, 0, -5, NaN])('falls back to defaults for %s', (value) => {
    expect(thresholdsWithRequiredHours(value)).toEqual(DEFAULT_COMPLIANCE_THRESHOLDS)
  })
})

describe('defaultProgramRequirements', () => {
  it('uses the schema default with no program identity', () => {
    const d = defaultProgramRequirements()
    expect(d.requiredHours).toBe(DEFAULT_REQUIRED_HOURS)
    expect(d.requiredHours).toBe(1500)
    expect(d.programName).toBeNull()
    expect(d.source).toBe('default')
  })
})

describe('per-program requiredHours through the compliance stack', () => {
  const programThresholds = thresholdsWithRequiredHours(1000)

  it('compliance score treats 1200h as complete under a 1000h program', () => {
    const score = calculateComplianceScore(baseInputs, programThresholds)
    const hoursReq = score.requirements.find((r) => r.id === 'hours')
    expect(hoursReq?.requiredValue).toBe(1000)
    expect(hoursReq?.status).toBe('met')
    expect(score.componentScores.hours).toBe(100)

    const defaultScore = calculateComplianceScore(baseInputs)
    expect(defaultScore.requirements.find((r) => r.id === 'hours')?.status).toBe('partial')
  })

  it('board eligibility uses the program hours requirement', () => {
    const result = determineBoardEligibility(baseInputs, programThresholds)
    expect(result.status).toBe('eligible')

    const defaultResult = determineBoardEligibility(baseInputs)
    expect(defaultResult.missingRequirements.some((m) => m.startsWith('Hours:'))).toBe(true)
  })

  it('graduation readiness reports the program requiredHours', () => {
    const result = calculateGraduationReadiness(
      { studentId: 's1', fullName: 'S One', ...baseInputs },
      programThresholds
    )
    expect(result.requiredHours).toBe(1000)
    expect(result.remainingItems.some((r) => r.includes('hours remaining'))).toBe(false)
  })

  it('compliance reports render per-student required hours', () => {
    const students = [makeStudent('s1'), makeStudent('s2')]
    const map = new Map<string, ComplianceRuleThresholds>([
      ['s1', thresholdsWithRequiredHours(1000)],
      // s2 intentionally unmapped → default fallback
    ])
    const report = generateComplianceReport(
      'student_compliance',
      { students, ...emptyReportInputs },
      map
    )
    const row1 = report.rows.find((r) => r.Student === 'Student s1')
    const row2 = report.rows.find((r) => r.Student === 'Student s2')
    expect(row1?.Hours).toBe('0/1000')
    expect(row2?.Hours).toBe('0/1500')
  })

  it('omitting the thresholds map preserves prior hard-coded behavior', () => {
    const students = [makeStudent('s1')]
    const report = generateComplianceReport('student_compliance', { students, ...emptyReportInputs })
    expect(report.rows[0]?.Hours).toBe('0/1500')
  })
})

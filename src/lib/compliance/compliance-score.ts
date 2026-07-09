/**
 * COMPLIANCE SCORE CALCULATOR
 * ASCYN PRO / ASCYN PRO V2
 *
 * Computes a 0–100 compliance score from attendance, hours, assessments,
 * practicals, readiness, and grade performance.
 */

import { ComplianceScore, ComplianceRequirement } from '@/types'
import {
  DEFAULT_COMPLIANCE_THRESHOLDS,
  COMPLIANCE_WEIGHTS,
  getStatusForThreshold,
  getComplianceLabel,
} from './compliance-rules'

export interface ComplianceScoreInputs {
  attendancePercentage: number
  completedHours: number
  assessmentPassRate: number
  practicalPassRate: number
  readinessScore: number
  overallGrade: number
  completedAssessments: number
  completedPracticals: number
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value))
}

export function calculateComplianceScore(inputs: ComplianceScoreInputs): ComplianceScore {
  const thresholds = DEFAULT_COMPLIANCE_THRESHOLDS

  const attendanceStatus = getStatusForThreshold(inputs.attendancePercentage, thresholds.minimumAttendancePercentage)
  const attendanceScore = clamp(inputs.attendancePercentage)

  const hoursStatus = getStatusForThreshold(inputs.completedHours, thresholds.requiredHours)
  const hoursScore = clamp((inputs.completedHours / thresholds.requiredHours) * 100)

  const assessmentStatus = getStatusForThreshold(inputs.assessmentPassRate, thresholds.minimumAssessmentPassRate)
  const assessmentScore = clamp(inputs.assessmentPassRate)

  const practicalStatus = getStatusForThreshold(inputs.practicalPassRate, thresholds.minimumPracticalPassRate)
  const practicalScore = clamp(inputs.practicalPassRate)

  const readinessStatus = getStatusForThreshold(inputs.readinessScore, thresholds.minimumReadinessScore)
  const readinessScore = clamp(inputs.readinessScore)

  const gradeStatus = getStatusForThreshold(inputs.overallGrade, thresholds.minimumOverallGrade)
  const gradeScore = clamp(inputs.overallGrade)

  const requirements: ComplianceRequirement[] = [
    {
      id: 'attendance',
      name: 'Minimum Attendance',
      category: 'attendance',
      requiredValue: thresholds.minimumAttendancePercentage,
      actualValue: clamp(inputs.attendancePercentage),
      unit: '%',
      status: attendanceStatus,
      weight: COMPLIANCE_WEIGHTS.attendance,
      description: `Maintain at least ${thresholds.minimumAttendancePercentage}% attendance`,
    },
    {
      id: 'hours',
      name: 'Required Hours',
      category: 'hours',
      requiredValue: thresholds.requiredHours,
      actualValue: inputs.completedHours,
      unit: 'hours',
      status: hoursStatus,
      weight: COMPLIANCE_WEIGHTS.hours,
      description: `Complete ${thresholds.requiredHours} program hours`,
    },
    {
      id: 'assessments',
      name: 'Assessment Pass Rate',
      category: 'assessments',
      requiredValue: thresholds.minimumAssessmentPassRate,
      actualValue: clamp(inputs.assessmentPassRate),
      unit: '%',
      status: assessmentStatus,
      weight: COMPLIANCE_WEIGHTS.assessments,
      description: `Achieve at least ${thresholds.minimumAssessmentPassRate}% on assessments`,
    },
    {
      id: 'practicals',
      name: 'Practical Pass Rate',
      category: 'practicals',
      requiredValue: thresholds.minimumPracticalPassRate,
      actualValue: clamp(inputs.practicalPassRate),
      unit: '%',
      status: practicalStatus,
      weight: COMPLIANCE_WEIGHTS.practicals,
      description: `Achieve at least ${thresholds.minimumPracticalPassRate}% on practicals`,
    },
    {
      id: 'readiness',
      name: 'Board Readiness',
      category: 'readiness',
      requiredValue: thresholds.minimumReadinessScore,
      actualValue: clamp(inputs.readinessScore),
      unit: 'score',
      status: readinessStatus,
      weight: COMPLIANCE_WEIGHTS.readiness,
      description: `Reach ${thresholds.minimumReadinessScore}+ board readiness score`,
    },
    {
      id: 'grades',
      name: 'Overall Grade',
      category: 'grades',
      requiredValue: thresholds.minimumOverallGrade,
      actualValue: clamp(inputs.overallGrade),
      unit: '%',
      status: gradeStatus,
      weight: COMPLIANCE_WEIGHTS.grades,
      description: `Maintain at least ${thresholds.minimumOverallGrade}% overall grade`,
    },
  ]

  const componentScores = {
    attendance: attendanceScore,
    hours: hoursScore,
    assessments: assessmentScore,
    practicals: practicalScore,
    readiness: readinessScore,
    grades: gradeScore,
  }

  const score = Math.round(
    componentScores.attendance * COMPLIANCE_WEIGHTS.attendance +
      componentScores.hours * COMPLIANCE_WEIGHTS.hours +
      componentScores.assessments * COMPLIANCE_WEIGHTS.assessments +
      componentScores.practicals * COMPLIANCE_WEIGHTS.practicals +
      componentScores.readiness * COMPLIANCE_WEIGHTS.readiness +
      componentScores.grades * COMPLIANCE_WEIGHTS.grades
  )

  const { label, colorClass } = getComplianceLabel(score)

  return {
    score,
    label,
    colorClass,
    requirements,
    componentScores,
  }
}

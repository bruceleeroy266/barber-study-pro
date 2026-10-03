/**
 * COMPLIANCE SCORE CALCULATOR
 * ASCYN PRO / ASCYN PRO V2
 *
 * Computes a 0–100 compliance score from attendance, hours, assessments,
 * practicals, readiness, and grade performance.
 */

import { ComplianceScore, ComplianceRequirement } from '@/types'
import {
  ComplianceRuleThresholds,
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

export function calculateComplianceScore(
  inputs: ComplianceScoreInputs,
  thresholds: ComplianceRuleThresholds = DEFAULT_COMPLIANCE_THRESHOLDS
): ComplianceScore {
  const attendanceStatus = getStatusForThreshold(inputs.attendancePercentage, thresholds.minimumAttendancePercentage)
  const attendanceScore = clamp(inputs.attendancePercentage)

  const hoursStatus = getStatusForThreshold(inputs.completedHours, thresholds.requiredHours)
  const hoursScore = clamp((inputs.completedHours / thresholds.requiredHours) * 100)

  const assessmentsRequired = thresholds.requiredAssessments > 0
  const practicalsRequired = thresholds.requiredPracticals > 0

  const assessmentStatus = !assessmentsRequired
    ? 'met'
    : inputs.completedAssessments < thresholds.requiredAssessments
      ? 'missing'
      : getStatusForThreshold(inputs.assessmentPassRate, thresholds.minimumAssessmentPassRate)
  const assessmentScore = assessmentsRequired ? clamp(inputs.assessmentPassRate) : 100

  const practicalStatus = !practicalsRequired
    ? 'met'
    : inputs.completedPracticals < thresholds.requiredPracticals
      ? 'missing'
      : getStatusForThreshold(inputs.practicalPassRate, thresholds.minimumPracticalPassRate)
  const practicalScore = practicalsRequired ? clamp(inputs.practicalPassRate) : 100

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
      requiredValue: assessmentsRequired ? thresholds.minimumAssessmentPassRate : 0,
      actualValue: assessmentsRequired ? clamp(inputs.assessmentPassRate) : 0,
      unit: '%',
      status: assessmentStatus,
      weight: COMPLIANCE_WEIGHTS.assessments,
      description: assessmentsRequired
        ? `Complete ${thresholds.requiredAssessments} assessments and achieve at least ${thresholds.minimumAssessmentPassRate}% pass rate`
        : 'No assessment requirement configured for this program',
    },
    {
      id: 'practicals',
      name: 'Practical Pass Rate',
      category: 'practicals',
      requiredValue: practicalsRequired ? thresholds.minimumPracticalPassRate : 0,
      actualValue: practicalsRequired ? clamp(inputs.practicalPassRate) : 0,
      unit: '%',
      status: practicalStatus,
      weight: COMPLIANCE_WEIGHTS.practicals,
      description: practicalsRequired
        ? `Complete ${thresholds.requiredPracticals} practicals and achieve at least ${thresholds.minimumPracticalPassRate}% pass rate`
        : 'No practical requirement configured for this program',
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

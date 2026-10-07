import type { Profile, QuizAttempt, StudentProgress } from '@/types'
import { calculateCanonicalStudentLearningMetrics } from '@/lib/student-level/metrics'
import { localChapters } from '@/lib/local-data'

export type PilotCheckpointType = 'baseline' | 'day_30' | 'day_60' | 'day_90'

export interface PilotCheckpointWindow {
  type: PilotCheckpointType
  targetDate: string
  windowStart: string
  cutoffAt: string
}

export interface PilotStudyActivityRow {
  user_id: string
  study_date: string
  active_seconds: number
  last_active_at: string | null
}

export interface PilotExamAttemptRow {
  id: string
  user_id: string
  status: string
  started_at: string
  completed_at: string | null
  attempt_number: number
  percentage: number | null
  passed: boolean | null
  domain_breakdown: Record<string, { correct: number; total: number; percentage: number }> | null
  elapsed_seconds: number | null
  unanswered_at_submit: number | null
}

export interface PilotRemediationRow {
  user_id: string
  status: string
  outcome?: string | null
  created_at: string
}

export interface PilotMeasurementInputs {
  schoolId: string
  students: Profile[]
  progress: StudentProgress[]
  quizAttempts: QuizAttempt[]
  studyActivity: PilotStudyActivityRow[]
  examAttempts: PilotExamAttemptRow[]
  remediation: PilotRemediationRow[]
  window: PilotCheckpointWindow
  /** Optional instructor authorization scope. Omit for school/admin aggregation. */
  allowedStudentIds?: ReadonlySet<string>
}

export interface PilotCoverageMetric {
  measured: number
  total: number
}

export interface PilotLearnerMeasurement {
  studentId: string
  fullName: string
  includedInAggregate: boolean
  activeStudySeconds: number
  qualifyingStudyDays: number
  latestLearningAt: string | null
  latestExam: PilotExamAttemptRow | null
  overallProgress: number | null
  readinessScore: number | null
  needsAttention: boolean
  activeRemediationCount: number
}

export interface PilotMeasurementSnapshot {
  schoolId: string
  checkpoint: PilotCheckpointType
  targetDate: string
  windowStart: string
  cutoffAt: string
  includedStudentCount: number
  excludedStudentCount: number
  coverage: {
    activity: PilotCoverageMetric
    examReady: PilotCoverageMetric
    chapterQuiz: PilotCoverageMetric
    readiness: PilotCoverageMetric
  }
  metrics: {
    totalActiveStudySeconds: number
    averageActiveStudySeconds: number | null
    activeLearnerCount: number
    noActivityLearnerCount: number
    averageLatestExamPercentage: number | null
    examPassingRate: number | null
    averageExamElapsedSeconds: number | null
    averageExamUnanswered: number | null
    examDomainPercentages: Record<string, number | null>
    averageOverallProgress: number | null
    averageReadinessScore: number | null
    needsAttentionCount: number
    activeRemediationLearnerCount: number
  }
  learners: PilotLearnerMeasurement[]
}

function inWindow(value: string | null | undefined, start: string, cutoff: string): boolean {
  if (!value) return false
  const time = new Date(value).getTime()
  return time >= new Date(start).getTime() && time <= new Date(cutoff).getTime()
}

function atOrBefore(value: string | null | undefined, cutoff: string): boolean {
  if (!value) return false
  return new Date(value).getTime() <= new Date(cutoff).getTime()
}

function averageOrNull(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10
}

function latestBy<T>(rows: T[], getDate: (row: T) => string | null): T | null {
  if (rows.length === 0) return null
  return [...rows].sort((a, b) =>
    new Date(getDate(b) ?? 0).getTime() - new Date(getDate(a) ?? 0).getTime()
  )[0] ?? null
}

function isLearner(profile: Profile): boolean {
  return profile.role === 'student' || profile.role === 'apprentice'
}

function hasActiveRemediation(row: PilotRemediationRow): boolean {
  return !['evaluated', 'auto_cleared', 'expired'].includes(row.status)
}

export function resolvePilotMeasurement(inputs: PilotMeasurementInputs): PilotMeasurementSnapshot {
  const { schoolId, window } = inputs
  const authorizedStudents = inputs.students.filter((student) =>
    student.school_id === schoolId &&
    isLearner(student) &&
    (!inputs.allowedStudentIds || inputs.allowedStudentIds.has(student.id))
  )

  const included = authorizedStudents.filter((student) =>
    student.include_in_school_metrics !== false && !student.is_disabled
  )
  const includedIds = new Set(included.map((student) => student.id))

  const learners: PilotLearnerMeasurement[] = authorizedStudents.map((student) => {
    const activityRows = inputs.studyActivity.filter((row) =>
      row.user_id === student.id && inWindow(row.last_active_at ?? row.study_date, window.windowStart, window.cutoffAt)
    )
    const activeStudySeconds = activityRows.reduce(
      (sum, row) => sum + Math.max(0, row.active_seconds || 0),
      0
    )
    const qualifyingStudyDays = new Set(activityRows.map((row) => row.study_date)).size
    const latestLearningAt = latestBy(activityRows, (row) => row.last_active_at)?.last_active_at ?? null

    const completedExams = inputs.examAttempts.filter((row) =>
      row.user_id === student.id &&
      row.status !== 'active' &&
      row.percentage !== null &&
      atOrBefore(row.completed_at ?? row.started_at, window.cutoffAt)
    )
    const latestExam = latestBy(completedExams, (row) => row.completed_at ?? row.started_at)

    const progress = inputs.progress.filter((row) =>
      row.user_id === student.id &&
      (!row.last_studied_at || atOrBefore(row.last_studied_at, window.cutoffAt))
    )
    const quizAttempts = inputs.quizAttempts.filter((row) =>
      row.user_id === student.id && atOrBefore(row.completed_at, window.cutoffAt)
    )
    const canonical = calculateCanonicalStudentLearningMetrics({
      userId: student.id,
      progress,
      attempts: quizAttempts,
      totalChapters: localChapters.length,
    })

    const remediation = inputs.remediation.filter((row) =>
      row.user_id === student.id && atOrBefore(row.created_at, window.cutoffAt)
    )
    const activeRemediationCount = remediation.filter(hasActiveRemediation).length

    return {
      studentId: student.id,
      fullName: student.full_name,
      includedInAggregate: student.include_in_school_metrics !== false && !student.is_disabled,
      activeStudySeconds,
      qualifyingStudyDays,
      latestLearningAt,
      latestExam,
      overallProgress: canonical.hasProgressEvidence ? canonical.overallProgress : null,
      readinessScore: canonical.hasReadinessEvidence ? canonical.readiness.score : null,
      needsAttention:
        (canonical.hasReadinessEvidence && canonical.readiness.score < 70) ||
        activeRemediationCount > 0,
      activeRemediationCount,
    }
  })

  const aggregateLearners = learners.filter((learner) => includedIds.has(learner.studentId))
  const examLearners = aggregateLearners.filter((learner) => typeof learner.latestExam?.percentage === 'number')
  const progressLearners = aggregateLearners.filter((learner) => learner.overallProgress !== null)
  const readinessLearners = aggregateLearners.filter((learner) => learner.readinessScore !== null)
  const activityLearners = aggregateLearners.filter((learner) => learner.activeStudySeconds > 0)

  const totalActiveStudySeconds = aggregateLearners.reduce(
    (sum, learner) => sum + learner.activeStudySeconds,
    0
  )

  const domainKeys = new Set<string>()
  examLearners.forEach((learner) => {
    Object.keys(learner.latestExam?.domain_breakdown ?? {}).forEach((key) => domainKeys.add(key))
  })
  const examDomainPercentages: Record<string, number | null> = {}
  for (const domain of domainKeys) {
    examDomainPercentages[domain] = averageOrNull(
      examLearners
        .map((learner) => learner.latestExam?.domain_breakdown?.[domain]?.percentage)
        .filter((value): value is number => typeof value === 'number')
    )
  }

  const examPercentages = examLearners
    .map((learner) => learner.latestExam?.percentage)
    .filter((value): value is number => typeof value === 'number')
  const examElapsed = examLearners
    .map((learner) => learner.latestExam?.elapsed_seconds)
    .filter((value): value is number => typeof value === 'number')
  const examUnanswered = examLearners
    .map((learner) => learner.latestExam?.unanswered_at_submit)
    .filter((value): value is number => typeof value === 'number')
  const passedCount = examLearners.filter((learner) => learner.latestExam?.passed === true).length

  const chapterQuizMeasured = included.filter((student) =>
    inputs.quizAttempts.some((attempt) =>
      attempt.user_id === student.id && atOrBefore(attempt.completed_at, window.cutoffAt)
    )
  ).length

  return {
    schoolId,
    checkpoint: window.type,
    targetDate: window.targetDate,
    windowStart: window.windowStart,
    cutoffAt: window.cutoffAt,
    includedStudentCount: included.length,
    excludedStudentCount: authorizedStudents.length - included.length,
    coverage: {
      activity: { measured: activityLearners.length, total: included.length },
      examReady: { measured: examLearners.length, total: included.length },
      chapterQuiz: { measured: chapterQuizMeasured, total: included.length },
      readiness: { measured: readinessLearners.length, total: included.length },
    },
    metrics: {
      totalActiveStudySeconds,
      averageActiveStudySeconds:
        included.length > 0 ? Math.round(totalActiveStudySeconds / included.length) : null,
      activeLearnerCount: activityLearners.length,
      noActivityLearnerCount: Math.max(0, included.length - activityLearners.length),
      averageLatestExamPercentage: averageOrNull(examPercentages),
      examPassingRate:
        examLearners.length > 0 ? Math.round((passedCount / examLearners.length) * 1000) / 10 : null,
      averageExamElapsedSeconds: averageOrNull(examElapsed),
      averageExamUnanswered: averageOrNull(examUnanswered),
      examDomainPercentages,
      averageOverallProgress: averageOrNull(
        progressLearners
          .map((learner) => learner.overallProgress)
          .filter((value): value is number => value !== null)
      ),
      averageReadinessScore: averageOrNull(
        readinessLearners
          .map((learner) => learner.readinessScore)
          .filter((value): value is number => value !== null)
      ),
      needsAttentionCount: aggregateLearners.filter((learner) => learner.needsAttention).length,
      activeRemediationLearnerCount: aggregateLearners.filter(
        (learner) => learner.activeRemediationCount > 0
      ).length,
    },
    learners,
  }
}

function addDateOnlyDays(dateText: string, days: number): string {
  const [year, month, day] = dateText.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (Number.isNaN(date.getTime())) throw new Error('Invalid pilot date')
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function zonedMidnightToUtc(dateText: string, timeZone: string): Date {
  const [year, month, day] = dateText.split('-').map(Number)
  const targetWallClock = Date.UTC(year, month - 1, day, 0, 0, 0)
  let candidate = targetWallClock
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })

  for (let i = 0; i < 3; i += 1) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(candidate))
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, part.value])
    )
    const represented = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    )
    const delta = represented - targetWallClock
    if (delta === 0) break
    candidate -= delta
  }

  return new Date(candidate)
}

export function endOfPilotLocalDate(dateText: string, timeZone: string): string {
  const nextDate = addDateOnlyDays(dateText, 1)
  return new Date(zonedMidnightToUtc(nextDate, timeZone).getTime() - 1).toISOString()
}

export function checkpointForPilotInstant(
  pilotStartDate: string,
  instant: Date,
  timeZone: string,
): PilotCheckpointType {
  const localDate = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant)
  const startMs = Date.parse(`${pilotStartDate}T00:00:00.000Z`)
  const localMs = Date.parse(`${localDate}T00:00:00.000Z`)
  const elapsed = Math.max(0, Math.floor((localMs - startMs) / 86_400_000))
  if (elapsed >= 90) return 'day_90'
  if (elapsed >= 60) return 'day_60'
  if (elapsed >= 30) return 'day_30'
  return 'baseline'
}

export function buildPilotCheckpointWindow(
  pilotStartDate: string,
  type: PilotCheckpointType,
  cutoffAt?: string,
  timeZone = 'UTC',
): PilotCheckpointWindow {
  const offsetDays: Record<PilotCheckpointType, number> = {
    baseline: 0,
    day_30: 30,
    day_60: 60,
    day_90: 90,
  }
  const targetDate = addDateOnlyDays(pilotStartDate, offsetDays[type])

  return {
    type,
    targetDate,
    windowStart: zonedMidnightToUtc(pilotStartDate, timeZone).toISOString(),
    cutoffAt: cutoffAt ?? endOfPilotLocalDate(targetDate, timeZone),
  }
}

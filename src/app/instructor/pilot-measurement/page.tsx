import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { loadAssignedStudentIds } from '@/lib/instructor/assignments'
import {
  buildPilotCheckpointWindow,
  resolvePilotMeasurement,
  type PilotCheckpointType,
  type PilotExamAttemptRow,
  type PilotRemediationRow,
  type PilotStudyActivityRow,
} from '@/lib/pilot-measurement/resolver'
import type { Profile, QuizAttempt, StudentProgress } from '@/types'

export const dynamic = 'force-dynamic'

function formatSeconds(seconds: number | null): string {
  if (seconds === null) return 'No evidence'
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

function formatPercent(value: number | null): string {
  return value === null ? 'No evidence' : `${Math.round(value)}%`
}

function checkpointForDate(startDate: string, now: Date): PilotCheckpointType {
  const start = new Date(`${startDate}T00:00:00.000Z`)
  const elapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86_400_000))
  if (elapsed >= 90) return 'day_90'
  if (elapsed >= 60) return 'day_60'
  if (elapsed >= 30) return 'day_30'
  return 'baseline'
}

function checkpointLabel(type: PilotCheckpointType): string {
  if (type === 'baseline') return 'Baseline'
  if (type === 'day_30') return 'Day 30'
  if (type === 'day_60') return 'Day 60'
  return 'Day 90'
}

export default async function InstructorPilotMeasurementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, school_id, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) redirect('/dashboard')
  if (!profile.school_id) redirect('/dashboard')

  const schoolId = profile.school_id
  const assignedStudentIds = profile.role === 'instructor'
    ? await loadAssignedStudentIds(supabase, schoolId, user.id)
    : null

  const { data: period } = await supabase
    .from('pilot_measurement_periods')
    .select('id, school_id, status, pilot_start_date, pilot_end_date, timezone')
    .eq('school_id', schoolId)
    .eq('status', 'active')
    .maybeSingle()

  if (!period) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Pilot Measurement</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">
            No active pilot measurement period is configured for this school.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-6">
          <p className="text-[var(--color-text-secondary)]">
            Pilot measurement becomes available after an authorized admin activates the school&apos;s official pilot period.
          </p>
        </div>
      </div>
    )
  }

  let studentQuery = supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])

  if (assignedStudentIds) {
    studentQuery = studentQuery.in(
      'id',
      assignedStudentIds.length > 0 ? assignedStudentIds : ['__none__']
    )
  }

  const { data: studentRows } = await studentQuery
  const students = (studentRows ?? []) as Profile[]
  const studentIds = students.map((student) => student.id)
  const ids = studentIds.length > 0 ? studentIds : ['__none__']

  const [
    progressResult,
    quizResult,
    activityResult,
    examResult,
    remediationResult,
  ] = await Promise.all([
    supabase.from('student_progress').select('*').in('user_id', ids),
    supabase.from('quiz_attempts').select('*').in('user_id', ids),
    supabase
      .from('trusted_study_activity_days')
      .select('user_id, study_date, active_seconds, last_active_at')
      .in('user_id', ids),
    supabase
      .from('comprehensive_exam_attempts')
      .select('id,user_id,status,started_at,completed_at,attempt_number,percentage,passed,domain_breakdown,elapsed_seconds,unanswered_at_submit')
      .eq('school_id', schoolId)
      .in('user_id', ids),
    supabase
      .from('remediation_cycles')
      .select('user_id,status,outcome,created_at')
      .in('user_id', ids),
  ])

  const now = new Date()
  const currentCheckpoint = checkpointForDate(period.pilot_start_date, now)
  const window = buildPilotCheckpointWindow(
    period.pilot_start_date,
    currentCheckpoint,
    now.toISOString()
  )

  const snapshot = resolvePilotMeasurement({
    schoolId,
    students,
    progress: (progressResult.data ?? []) as StudentProgress[],
    quizAttempts: (quizResult.data ?? []) as QuizAttempt[],
    studyActivity: (activityResult.data ?? []) as PilotStudyActivityRow[],
    examAttempts: (examResult.data ?? []) as PilotExamAttemptRow[],
    remediation: (remediationResult.data ?? []) as PilotRemediationRow[],
    window,
    allowedStudentIds: assignedStudentIds ? new Set(assignedStudentIds) : undefined,
  })

  const needsAttention = snapshot.learners
    .filter((learner) => learner.includedInAggregate && learner.needsAttention)
    .sort((a, b) => a.fullName.localeCompare(b.fullName))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Pilot Measurement</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {checkpointLabel(currentCheckpoint)} live view · {period.pilot_start_date} to {period.pilot_end_date}
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          ASCYN PRO activity is learning telemetry, not attendance or earned school hours.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Included learners" value={String(snapshot.includedStudentCount)} />
        <MetricCard label="Excluded learners" value={String(snapshot.excludedStudentCount)} />
        <MetricCard label="Active learners" value={String(snapshot.metrics.activeLearnerCount)} />
        <MetricCard label="Avg Exam Ready" value={formatPercent(snapshot.metrics.averageLatestExamPercentage)} />
        <MetricCard label="Avg readiness" value={formatPercent(snapshot.metrics.averageReadinessScore)} />
      </div>

      <section className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
        <h2 className="text-xl font-semibold text-white">Evidence coverage</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Coverage label="Study activity" measured={snapshot.coverage.activity.measured} total={snapshot.coverage.activity.total} />
          <Coverage label="Exam Ready" measured={snapshot.coverage.examReady.measured} total={snapshot.coverage.examReady.total} />
          <Coverage label="Chapter quizzes" measured={snapshot.coverage.chapterQuiz.measured} total={snapshot.coverage.chapterQuiz.total} />
          <Coverage label="Readiness" measured={snapshot.coverage.readiness.measured} total={snapshot.coverage.readiness.total} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <MetricCard label="Total active study time" value={formatSeconds(snapshot.metrics.totalActiveStudySeconds)} />
        <MetricCard label="Avg study time / included learner" value={formatSeconds(snapshot.metrics.averageActiveStudySeconds)} />
        <MetricCard label="Exam Ready passing rate" value={formatPercent(snapshot.metrics.examPassingRate)} />
        <MetricCard label="Needs attention" value={String(snapshot.metrics.needsAttentionCount)} />
      </section>

      <section className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
        <h2 className="text-xl font-semibold text-white">Exam Ready domains</h2>
        {Object.keys(snapshot.metrics.examDomainPercentages).length === 0 ? (
          <p className="mt-3 text-[var(--color-text-muted)]">No completed Exam Ready domain evidence yet.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(snapshot.metrics.examDomainPercentages).map(([domain, percentage]) => (
              <div key={domain} className="rounded-lg border border-[var(--color-border-primary)] p-4">
                <p className="text-sm text-[var(--color-text-muted)]">{domain}</p>
                <p className="mt-1 text-xl font-semibold text-white">{formatPercent(percentage)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
        <h2 className="text-xl font-semibold text-white">Students needing attention</h2>
        {needsAttention.length === 0 ? (
          <p className="mt-3 text-[var(--color-text-muted)]">No included learners currently meet the pilot attention rules.</p>
        ) : (
          <div className="mt-4 divide-y divide-[var(--color-border-primary)]">
            {needsAttention.map((learner) => (
              <div key={learner.studentId} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">{learner.fullName}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Readiness {formatPercent(learner.readinessScore)} · Exam Ready {formatPercent(learner.latestExam?.percentage ?? null)} · {learner.activeRemediationCount} active remediation
                  </p>
                </div>
                <Link
                  href={`/instructor/student/${learner.studentId}`}
                  className="text-sm font-medium text-[var(--color-brand-gold)] hover:underline"
                >
                  View student
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
        <h2 className="text-xl font-semibold text-white">Official checkpoint reports</h2>
        <p className="mt-3 text-[var(--color-text-muted)]">
          Official school-wide Baseline, Day 30, Day 60, and Day 90 checkpoint snapshots are limited to school administrators and ASCYN PRO platform administrators. This instructor view remains scoped to your assigned learners.
        </p>
      </section>

      <section className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
        <h2 className="text-xl font-semibold text-white">Assigned learner detail</h2>
        <div className="mt-4 grid gap-3">
          {snapshot.learners.map((learner) => (
            <Link
              key={learner.studentId}
              href={`/instructor/student/${learner.studentId}`}
              className="rounded-lg border border-[var(--color-border-primary)] p-4 hover:border-[var(--color-brand-gold)]/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-white">{learner.fullName}</span>
                <span className={learner.includedInAggregate ? 'text-xs text-[var(--color-brand-gold)]' : 'text-xs text-[var(--color-text-muted)]'}>
                  {learner.includedInAggregate ? 'Included in pilot metrics' : 'Excluded from aggregate pilot metrics'}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Study {formatSeconds(learner.activeStudySeconds)} · Exam Ready {formatPercent(learner.latestExam?.percentage ?? null)} · Progress {formatPercent(learner.overallProgress)} · Readiness {formatPercent(learner.readinessScore)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

function Coverage({ label, measured, total }: { label: string; measured: number; total: number }) {
  return (
    <div className="rounded-lg border border-[var(--color-border-primary)] p-4">
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 font-semibold text-white">{measured} of {total} learners measured</p>
    </div>
  )
}

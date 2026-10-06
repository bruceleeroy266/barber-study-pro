import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import {
  buildPilotCheckpointWindow,
  resolvePilotMeasurement,
  type PilotCheckpointType,
  type PilotExamAttemptRow,
  type PilotRemediationRow,
  type PilotStudyActivityRow,
} from '@/lib/pilot-measurement/resolver'
import type { Profile, QuizAttempt, StudentProgress } from '@/types'

interface StaffPilotMeasurementViewProps {
  schoolId: string
  viewer: 'school_admin' | 'platform_admin'
}

interface FinalizedCheckpointRow {
  id: string
  checkpoint_type: PilotCheckpointType
  target_date: string
  cutoff_at: string
  generated_at: string
  finalized_at: string | null
  included_student_count: number
  excluded_student_count: number
  coverage: Record<string, unknown>
  metrics: Record<string, unknown>
}

function formatPercent(value: number | null): string {
  return value === null ? 'No evidence' : `${Math.round(value)}%`
}

function formatSeconds(seconds: number | null): string {
  if (seconds === null) return 'No evidence'
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

function checkpointLabel(type: PilotCheckpointType): string {
  switch (type) {
    case 'baseline': return 'Baseline'
    case 'day_30': return 'Day 30'
    case 'day_60': return 'Day 60'
    case 'day_90': return 'Day 90'
  }
}

function checkpointForDate(startDate: string, now: Date): PilotCheckpointType {
  const start = new Date(`${startDate}T00:00:00.000Z`)
  const elapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86_400_000))
  if (elapsed >= 90) return 'day_90'
  if (elapsed >= 60) return 'day_60'
  if (elapsed >= 30) return 'day_30'
  return 'baseline'
}

export default async function StaffPilotMeasurementView({
  schoolId,
  viewer,
}: StaffPilotMeasurementViewProps) {
  const supabase = await createClient()

  const [{ data: school }, { data: period }] = await Promise.all([
    supabase.from('schools').select('id,name').eq('id', schoolId).single(),
    supabase
      .from('pilot_measurement_periods')
      .select('id,school_id,status,pilot_start_date,pilot_end_date,timezone,activated_at,completed_at')
      .eq('school_id', schoolId)
      .in('status', ['active', 'completed'])
      .order('pilot_start_date', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (!school) {
    return (
      <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
        School measurement data is unavailable.
      </div>
    )
  }

  if (!period) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-white">Pilot Measurement</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">{school.name}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-6">
          <h2 className="text-lg font-semibold text-white">No pilot period yet</h2>
          <p className="mt-2 text-[var(--color-text-muted)]">
            An official pilot measurement period must be activated before Baseline, Day 30, Day 60, and Day 90 evidence can be tracked.
          </p>
          {viewer === 'school_admin' && (
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Contact the ASCYN PRO platform administrator to activate the official pilot period.
            </p>
          )}
        </div>
      </div>
    )
  }

  const { data: studentRows } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])

  const students = (studentRows ?? []) as Profile[]
  const studentIds = students.map((student) => student.id)
  const ids = studentIds.length > 0 ? studentIds : ['__none__']

  const [
    progressResult,
    quizResult,
    activityResult,
    examResult,
    remediationResult,
    checkpointsResult,
  ] = await Promise.all([
    supabase.from('student_progress').select('*').in('user_id', ids),
    supabase.from('quiz_attempts').select('*').in('user_id', ids),
    supabase
      .from('trusted_study_activity_days')
      .select('user_id,study_date,active_seconds,last_active_at')
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
    supabase
      .from('pilot_measurement_checkpoints')
      .select('id,checkpoint_type,target_date,cutoff_at,generated_at,finalized_at,included_student_count,excluded_student_count,coverage,metrics')
      .eq('pilot_period_id', period.id)
      .eq('status', 'finalized')
      .order('target_date', { ascending: true }),
  ])

  const now = new Date()
  const liveCheckpoint = period.status === 'completed'
    ? 'day_90'
    : checkpointForDate(period.pilot_start_date, now)
  const liveCutoff = period.status === 'completed'
    ? `${period.pilot_end_date}T23:59:59.999Z`
    : now.toISOString()

  const snapshot = resolvePilotMeasurement({
    schoolId,
    students,
    progress: (progressResult.data ?? []) as StudentProgress[],
    quizAttempts: (quizResult.data ?? []) as QuizAttempt[],
    studyActivity: (activityResult.data ?? []) as PilotStudyActivityRow[],
    examAttempts: (examResult.data ?? []) as PilotExamAttemptRow[],
    remediation: (remediationResult.data ?? []) as PilotRemediationRow[],
    window: buildPilotCheckpointWindow(period.pilot_start_date, liveCheckpoint, liveCutoff),
  })

  const finalized = (checkpointsResult.data ?? []) as FinalizedCheckpointRow[]
  const includedLearners = snapshot.learners.filter((learner) => learner.includedInAggregate)
  const excludedLearners = snapshot.learners.filter((learner) => !learner.includedInAggregate)
  const attentionLearners = includedLearners
    .filter((learner) => learner.needsAttention)
    .sort((a, b) => a.fullName.localeCompare(b.fullName))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Pilot Measurement</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">
            {school.name} · {period.pilot_start_date} to {period.pilot_end_date}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Live {checkpointLabel(liveCheckpoint)} evidence. ASCYN PRO study activity is learning telemetry, not attendance or earned school hours.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] px-4 py-3 text-sm">
          <p className="text-[var(--color-text-muted)]">Pilot status</p>
          <p className="mt-1 font-semibold capitalize text-white">{period.status}</p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Metric label="Included learners" value={String(snapshot.includedStudentCount)} />
        <Metric label="Excluded learners" value={String(snapshot.excludedStudentCount)} />
        <Metric label="Active learners" value={String(snapshot.metrics.activeLearnerCount)} />
        <Metric label="Avg Exam Ready" value={formatPercent(snapshot.metrics.averageLatestExamPercentage)} />
        <Metric label="Exam Ready passing" value={formatPercent(snapshot.metrics.examPassingRate)} />
        <Metric label="Avg readiness" value={formatPercent(snapshot.metrics.averageReadinessScore)} />
      </section>

      <section className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
        <h2 className="text-xl font-semibold text-white">Evidence coverage</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Missing evidence stays missing; it is not converted to a false 0%.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Coverage label="Study activity" measured={snapshot.coverage.activity.measured} total={snapshot.coverage.activity.total} />
          <Coverage label="Exam Ready" measured={snapshot.coverage.examReady.measured} total={snapshot.coverage.examReady.total} />
          <Coverage label="Chapter quizzes" measured={snapshot.coverage.chapterQuiz.measured} total={snapshot.coverage.chapterQuiz.total} />
          <Coverage label="Readiness" measured={snapshot.coverage.readiness.measured} total={snapshot.coverage.readiness.total} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total active study time" value={formatSeconds(snapshot.metrics.totalActiveStudySeconds)} />
        <Metric label="Avg study time / included learner" value={formatSeconds(snapshot.metrics.averageActiveStudySeconds)} />
        <Metric label="Needs attention" value={String(snapshot.metrics.needsAttentionCount)} />
        <Metric label="Active remediation learners" value={String(snapshot.metrics.activeRemediationLearnerCount)} />
      </section>

      <section className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
        <h2 className="text-xl font-semibold text-white">Exam Ready domains</h2>
        {Object.keys(snapshot.metrics.examDomainPercentages).length === 0 ? (
          <p className="mt-3 text-[var(--color-text-muted)]">No completed Exam Ready domain evidence yet.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(snapshot.metrics.examDomainPercentages).map(([domain, value]) => (
              <div key={domain} className="rounded-lg border border-[var(--color-border-primary)] p-4">
                <p className="text-sm text-[var(--color-text-muted)]">{domain}</p>
                <p className="mt-1 text-xl font-semibold text-white">{formatPercent(value)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
        <h2 className="text-xl font-semibold text-white">Official checkpoint timeline</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {(['baseline', 'day_30', 'day_60', 'day_90'] as PilotCheckpointType[]).map((type) => {
            const row = finalized.find((checkpoint) => checkpoint.checkpoint_type === type)
            return (
              <div key={type} className="rounded-lg border border-[var(--color-border-primary)] p-4">
                <p className="font-medium text-white">{checkpointLabel(type)}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {row ? `Finalized ${row.finalized_at ? new Date(row.finalized_at).toLocaleDateString('en-US') : ''}` : 'Not finalized'}
                </p>
                {row && (
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    {row.included_student_count} included · {row.excluded_student_count} excluded
                  </p>
                )}
              </div>
            )
          })}
        </div>
        {viewer === 'platform_admin' && (
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            Official checkpoint creation/finalization controls are intentionally separate from this read-only evidence view and remain platform-admin only.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
        <h2 className="text-xl font-semibold text-white">Learners needing attention</h2>
        {attentionLearners.length === 0 ? (
          <p className="mt-3 text-[var(--color-text-muted)]">No included learners currently meet the pilot attention rules.</p>
        ) : (
          <div className="mt-4 divide-y divide-[var(--color-border-primary)]">
            {attentionLearners.map((learner) => (
              <div key={learner.studentId} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">{learner.fullName}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Exam Ready {formatPercent(learner.latestExam?.percentage ?? null)} · Progress {formatPercent(learner.overallProgress)} · Readiness {formatPercent(learner.readinessScore)}
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
        <h2 className="text-xl font-semibold text-white">Cohort membership</h2>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div>
            <h3 className="font-medium text-white">Included in aggregate pilot metrics ({includedLearners.length})</h3>
            <div className="mt-2 space-y-2">
              {includedLearners.map((learner) => (
                <div key={learner.studentId} className="rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                  {learner.fullName}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-white">Excluded from aggregate pilot metrics ({excludedLearners.length})</h3>
            <div className="mt-2 space-y-2">
              {excludedLearners.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">No excluded learners.</p>
              ) : excludedLearners.map((learner) => (
                <div key={learner.studentId} className="rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                  {learner.fullName}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
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

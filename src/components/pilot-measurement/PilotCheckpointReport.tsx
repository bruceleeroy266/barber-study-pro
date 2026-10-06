import {
  comparePilotCheckpoints,
  previousCheckpointType,
  type FinalizedPilotCheckpoint,
  type PilotCheckpointDelta,
} from '@/lib/pilot-measurement/report-comparisons'
import type { PilotCheckpointType } from '@/lib/pilot-measurement/resolver'
import PilotReportPrintButton from '@/components/pilot-measurement/PilotReportPrintButton'
import { createClient } from '@/lib/supabase-server'

interface PilotCheckpointReportProps {
  schoolId: string
  checkpointType: PilotCheckpointType
}

function label(type: PilotCheckpointType): string {
  if (type === 'baseline') return 'Baseline'
  if (type === 'day_30') return 'Day 30'
  if (type === 'day_60') return 'Day 60'
  return 'Day 90'
}

function pct(value: number | null): string {
  return value === null ? 'No evidence' : `${Math.round(value)}%`
}

function seconds(value: number | null): string {
  if (value === null) return 'No evidence'
  const minutes = Math.round(value / 60)
  const hours = Math.floor(minutes / 60)
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`
}

function deltaText(value: number | null, unit: 'pp' | 'count' | 'time'): string {
  if (value === null) return 'Not comparable'
  const sign = value > 0 ? '+' : ''
  if (unit === 'pp') return `${sign}${value} percentage points`
  if (unit === 'time') {
    const minutes = Math.round(value / 60)
    return `${minutes > 0 ? '+' : ''}${minutes} min`
  }
  return `${sign}${value}`
}

function coverageText(measured: number, total: number): string {
  if (total === 0) return 'No included learners'
  if (measured === total) return `${measured} of ${total} learners measured`
  return `Partial coverage: ${measured} of ${total} learners measured`
}

function comparisonRows(delta: PilotCheckpointDelta | null) {
  if (!delta) return []
  return [
    ['Exam Ready average', deltaText(delta.examReadyPercentagePoints, 'pp')],
    ['Exam Ready passing rate', deltaText(delta.examPassingPercentagePoints, 'pp')],
    ['Readiness', deltaText(delta.readinessPercentagePoints, 'pp')],
    ['Overall progress', deltaText(delta.progressPercentagePoints, 'pp')],
    ['Average active study time', deltaText(delta.averageStudySeconds, 'time')],
    ['Active learners', deltaText(delta.activeLearnerCount, 'count')],
    ['Needs attention', deltaText(delta.needsAttentionCount, 'count')],
  ] as const
}

export default async function PilotCheckpointReport({
  schoolId,
  checkpointType,
}: PilotCheckpointReportProps) {
  const supabase = await createClient()

  const [{ data: school }, { data: period }] = await Promise.all([
    supabase.from('schools').select('id,name').eq('id', schoolId).single(),
    supabase
      .from('pilot_measurement_periods')
      .select('id,pilot_start_date,pilot_end_date,timezone,status')
      .eq('school_id', schoolId)
      .in('status', ['active', 'completed'])
      .order('pilot_start_date', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (!school || !period) {
    return <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-5 text-red-300">Pilot report is unavailable.</div>
  }

  const { data: rows } = await supabase
    .from('pilot_measurement_checkpoints')
    .select('id,checkpoint_type,target_date,cutoff_at,generated_at,finalized_at,included_student_count,excluded_student_count,coverage,metrics,schema_version')
    .eq('pilot_period_id', period.id)
    .eq('status', 'finalized')
    .order('target_date', { ascending: true })

  const checkpoints = (rows ?? []) as FinalizedPilotCheckpoint[]
  const current = checkpoints.find((row) => row.checkpoint_type === checkpointType) ?? null

  if (!current) {
    return (
      <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-6">
        <h1 className="text-2xl font-bold text-white">{label(checkpointType)} Pilot Report</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">This checkpoint has not been finalized yet.</p>
      </div>
    )
  }

  const baseline = checkpointType === 'baseline'
    ? null
    : checkpoints.find((row) => row.checkpoint_type === 'baseline') ?? null
  const priorType = previousCheckpointType(checkpointType)
  const prior = priorType
    ? checkpoints.find((row) => row.checkpoint_type === priorType) ?? null
    : null

  const baselineDelta = comparePilotCheckpoints(current, baseline)
  const priorDelta = comparePilotCheckpoints(current, prior)

  const coverage = current.coverage
  const metrics = current.metrics

  return (
    <article className="mx-auto max-w-5xl bg-white p-6 text-gray-900 shadow-xl print:max-w-none print:p-0 print:shadow-none">
      <header className="border-b border-gray-200 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">ASCYN PRO Pilot Measurement</p>
            <h1 className="mt-1 text-3xl font-bold">{label(checkpointType)} Report</h1>
            <p className="mt-2 text-gray-600">{school.name}</p>
            <p className="text-sm text-gray-500">Pilot: {period.pilot_start_date} to {period.pilot_end_date}</p>
          </div>
          <PilotReportPrintButton />
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportMetric label="Cutoff" value={new Date(current.cutoff_at).toLocaleString('en-US')} />
        <ReportMetric label="Included learners" value={String(current.included_student_count)} />
        <ReportMetric label="Excluded learners" value={String(current.excluded_student_count)} />
        <ReportMetric label="Finalized" value={new Date(current.finalized_at).toLocaleDateString('en-US')} />
      </section>

      <ReportSection title="Evidence coverage">
        <div className="grid gap-3 sm:grid-cols-2">
          <EvidenceRow label="Study activity" value={coverageText(coverage.activity.measured, coverage.activity.total)} />
          <EvidenceRow label="Exam Ready" value={coverageText(coverage.examReady.measured, coverage.examReady.total)} />
          <EvidenceRow label="Chapter quizzes" value={coverageText(coverage.chapterQuiz.measured, coverage.chapterQuiz.total)} />
          <EvidenceRow label="Readiness" value={coverageText(coverage.readiness.measured, coverage.readiness.total)} />
        </div>
      </ReportSection>

      <ReportSection title="Observed evidence">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <EvidenceRow label="Total active study time" value={seconds(metrics.totalActiveStudySeconds)} />
          <EvidenceRow label="Average study time" value={seconds(metrics.averageActiveStudySeconds)} />
          <EvidenceRow label="Active learners" value={String(metrics.activeLearnerCount)} />
          <EvidenceRow label="Exam Ready average" value={pct(metrics.averageLatestExamPercentage)} />
          <EvidenceRow label="Exam Ready passing rate" value={pct(metrics.examPassingRate)} />
          <EvidenceRow label="Average readiness" value={pct(metrics.averageReadinessScore)} />
          <EvidenceRow label="Average overall progress" value={pct(metrics.averageOverallProgress)} />
          <EvidenceRow label="Needs attention" value={String(metrics.needsAttentionCount)} />
          <EvidenceRow label="Active remediation learners" value={String(metrics.activeRemediationLearnerCount)} />
        </div>
      </ReportSection>

      <ReportSection title="Exam Ready domains">
        {Object.keys(metrics.examDomainPercentages).length === 0 ? (
          <p className="text-gray-600">No completed Exam Ready domain evidence.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(metrics.examDomainPercentages).map(([domain, value]) => (
              <EvidenceRow key={domain} label={domain} value={pct(value)} />
            ))}
          </div>
        )}
      </ReportSection>

      {checkpointType !== 'baseline' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ComparisonSection
            title="Change vs baseline"
            subtitle={baseline ? 'Observed difference from the finalized baseline.' : 'Baseline is not finalized.'}
            rows={comparisonRows(baselineDelta)}
          />
          <ComparisonSection
            title="Change vs prior checkpoint"
            subtitle={prior ? `Observed difference from finalized ${label(prior.checkpoint_type)}.` : 'Prior checkpoint is not finalized.'}
            rows={comparisonRows(priorDelta)}
          />
        </div>
      )}

      <ReportSection title="Data-quality notes">
        <ul className="list-disc space-y-2 pl-5 text-gray-700">
          <li>Missing evidence is reported as “No evidence” or partial coverage rather than converted to 0%.</li>
          <li>ASCYN PRO active study time is learning telemetry, not attendance or earned school hours.</li>
          <li>Comparisons describe evidence observed during the pilot and do not claim ASCYN PRO caused the change.</li>
          <li>Excluded learners remain available individually but do not contribute to aggregate pilot metrics.</li>
        </ul>
      </ReportSection>

      <ReportSection title="Recommended staff follow-up">
        <p className="text-gray-700">
          Review learners currently marked as needing attention, verify weak or incomplete evidence coverage, and use the existing instructor/student drilldowns before deciding on intervention.
        </p>
      </ReportSection>

      <footer className="mt-8 border-t border-gray-200 pt-4 text-xs text-gray-500">
        Immutable checkpoint {current.id} · schema {current.schema_version} · cutoff {current.cutoff_at}
      </footer>
    </article>
  )
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function ReportMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  )
}

function EvidenceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  )
}

function ComparisonSection({
  title,
  subtitle,
  rows,
}: {
  title: string
  subtitle: string
  rows: readonly (readonly [string, string])[]
}) {
  return (
    <section className="mt-7 rounded-lg border border-gray-200 p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-gray-600">Not comparable yet.</p>
      ) : (
        <dl className="mt-4 space-y-3">
          {rows.map(([metric, value]) => (
            <div key={metric} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2 last:border-0">
              <dt className="text-gray-600">{metric}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

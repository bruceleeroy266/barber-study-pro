'use client'

import { useState, useTransition } from 'react'
import {
  finalizePilotCheckpoint,
  previewPilotCheckpoint,
  type CheckpointPreviewResult,
} from '@/app/admin/school/pilot-measurement/actions'
import type { PilotCheckpointType } from '@/lib/pilot-measurement/resolver'

const checkpoints: Array<{ type: PilotCheckpointType; label: string }> = [
  { type: 'baseline', label: 'Baseline' },
  { type: 'day_30', label: 'Day 30' },
  { type: 'day_60', label: 'Day 60' },
  { type: 'day_90', label: 'Day 90' },
]

export default function PilotCheckpointControls({ schoolId }: { schoolId: string }) {
  const [selected, setSelected] = useState<PilotCheckpointType>('baseline')
  const [preview, setPreview] = useState<CheckpointPreviewResult['data'] | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const runPreview = () => {
    setMessage(null)
    startTransition(async () => {
      const result = await previewPilotCheckpoint(schoolId, selected)
      if (!result.success || !result.data) {
        setPreview(null)
        setMessage(result.error ?? 'Unable to preview checkpoint.')
        return
      }
      setPreview(result.data)
    })
  }

  const runFinalize = () => {
    if (!preview) {
      setMessage('Preview this checkpoint before finalizing it.')
      return
    }
    if (preview.alreadyFinalized) {
      setMessage('This checkpoint is already finalized.')
      return
    }
    if (!preview.eligibleToFinalize) {
      setMessage('This checkpoint cannot be finalized before its target cutoff.')
      return
    }

    const confirmed = window.confirm(
      `Finalize ${checkpoints.find((item) => item.type === selected)?.label ?? selected}? This snapshot becomes immutable historical evidence.`
    )
    if (!confirmed) return

    setMessage(null)
    startTransition(async () => {
      const result = await finalizePilotCheckpoint(schoolId, selected)
      if (!result.success) {
        setMessage(result.error ?? 'Unable to finalize checkpoint.')
        return
      }
      setMessage('Checkpoint finalized successfully.')
      const refreshed = await previewPilotCheckpoint(schoolId, selected)
      if (refreshed.success && refreshed.data) setPreview(refreshed.data)
    })
  }

  return (
    <section className="rounded-xl border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/5 p-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Platform Admin Checkpoint Control</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Preview the canonical evidence first. Finalization stores an immutable Baseline/Day 30/60/90 snapshot.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm text-[var(--color-text-secondary)]">
          Checkpoint
          <select
            value={selected}
            onChange={(event) => {
              setSelected(event.target.value as PilotCheckpointType)
              setPreview(null)
              setMessage(null)
            }}
            className="mt-1 w-full rounded-lg border border-[var(--color-border-primary)] bg-black px-3 py-2 text-white"
          >
            {checkpoints.map((item) => (
              <option key={item.type} value={item.type}>{item.label}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={runPreview}
          disabled={isPending}
          className="min-h-11 rounded-lg border border-[var(--color-brand-gold)]/40 px-4 py-2 font-medium text-[var(--color-brand-gold)] disabled:opacity-50"
        >
          {isPending ? 'Working…' : 'Preview checkpoint'}
        </button>
      </div>

      {preview && (
        <div className="mt-5 rounded-lg border border-[var(--color-border-primary)] bg-black/30 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <PreviewMetric label="Target date" value={preview.targetDate} />
            <PreviewMetric label="Included learners" value={String(preview.includedStudentCount)} />
            <PreviewMetric label="Excluded learners" value={String(preview.excludedStudentCount)} />
            <PreviewMetric
              label="Exam Ready coverage"
              value={`${preview.coverage.examReady.measured} of ${preview.coverage.examReady.total}`}
            />
            <PreviewMetric
              label="Avg Exam Ready"
              value={preview.metrics.averageLatestExamPercentage === null ? 'No evidence' : `${Math.round(preview.metrics.averageLatestExamPercentage)}%`}
            />
            <PreviewMetric
              label="Avg readiness"
              value={preview.metrics.averageReadinessScore === null ? 'No evidence' : `${Math.round(preview.metrics.averageReadinessScore)}%`}
            />
            <PreviewMetric label="Needs attention" value={String(preview.metrics.needsAttentionCount)} />
            <PreviewMetric
              label="Status"
              value={preview.alreadyFinalized ? 'Finalized' : preview.eligibleToFinalize ? 'Ready to finalize' : 'Preview only'}
            />
          </div>

          <button
            type="button"
            onClick={runFinalize}
            disabled={isPending || preview.alreadyFinalized || !preview.eligibleToFinalize}
            className="mt-4 min-h-11 rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Finalize immutable checkpoint
          </button>
        </div>
      )}

      {message && (
        <p role="status" className="mt-4 text-sm text-[var(--color-text-secondary)]">{message}</p>
      )}
    </section>
  )
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  )
}

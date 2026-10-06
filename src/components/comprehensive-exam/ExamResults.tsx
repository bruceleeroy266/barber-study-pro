'use client'

import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { ExamAttempt, ExamHistoryItem } from '@/lib/comprehensive-exam/types'

const domainLabels: Record<string, string> = {
  scientific_concepts: 'Scientific Concepts',
  implements_equipment: 'Implements & Equipment',
  hair_care_services: 'Hair Care Services',
  facial_hair_skin_care_services: 'Facial Hair & Skin Care Services',
}

const formatDuration = (seconds: number | null | undefined) => {
  if (!seconds) return '—'
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}m ${remainder}s`
}

type Props = {
  attempt: ExamAttempt
  history: ExamHistoryItem[]
  onNewAttempt: () => void
}

export default function ExamResults({ attempt, history, onNewAttempt }: Props) {
  const result = attempt.result
  if (!result) return null

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg" className="text-center">
        <p className="text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
          Attempt {attempt.attemptNumber}
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          {result.passed ? 'Passing result' : 'Review recommended'}
        </h2>
        <p className="mt-3 text-6xl font-bold text-[var(--color-brand-gold)]">{result.percentage}%</p>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {result.scoredCorrect} of {result.scoredTotal} scored questions correct
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Passing threshold for this attempt: {attempt.passingPercentage}%
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(result.domainBreakdown ?? {}).map(([domain, value]) => (
          <Card key={domain} variant="default" padding="md">
            <p className="font-semibold text-white">{domainLabels[domain] ?? domain}</p>
            <p className="mt-2 text-2xl font-bold text-[var(--color-brand-gold)]">{value.percentage}%</p>
            <p className="text-sm text-[var(--color-text-muted)]">{value.correct}/{value.total} correct</p>
          </Card>
        ))}
      </div>

      <Card variant="default" padding="md">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div><p className="text-xs text-[var(--color-text-muted)]">Elapsed</p><p className="font-semibold text-white">{formatDuration(result.elapsedSeconds)}</p></div>
          <div><p className="text-xs text-[var(--color-text-muted)]">Unanswered</p><p className="font-semibold text-white">{result.unansweredAtSubmit}</p></div>
          <div><p className="text-xs text-[var(--color-text-muted)]">Flagged</p><p className="font-semibold text-white">{result.flaggedAtSubmit}</p></div>
          <div><p className="text-xs text-[var(--color-text-muted)]">Status</p><p className="font-semibold text-white">{attempt.status.replaceAll('_', ' ')}</p></div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="button" onClick={onNewAttempt}>Return to Exam Ready</Button>
      </div>

      {history.filter((item) => item.status !== 'active').length > 0 && (
        <Card variant="outlined" padding="md">
          <h3 className="text-lg font-semibold text-white">Attempt history</h3>
          <div className="mt-4 space-y-3">
            {history.filter((item) => item.status !== 'active').map((item) => (
              <div key={item.attemptId} className="flex flex-wrap items-center justify-between gap-3 border-b border-graphite pb-3 last:border-0">
                <div>
                  <p className="font-medium text-white">Attempt {item.attemptNumber}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{new Date(item.startedAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--color-brand-gold)]">{item.percentage ?? '—'}%</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatDuration(item.elapsedSeconds)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import QuestionNavigator from './QuestionNavigator'
import type { ExamItem } from '@/lib/comprehensive-exam/types'

type Props = {
  items: ExamItem[]
  submitting: boolean
  submitError: string | null
  onGoToQuestion: (position: number) => void
  onSubmit: () => Promise<void>
}

export default function ReviewScreen({
  items,
  submitting,
  submitError,
  onGoToQuestion,
  onSubmit,
}: Props) {
  const [confirming, setConfirming] = useState(false)
  const answered = items.filter((item) => item.selectedOption).length
  const flagged = items.filter((item) => item.flagged).length
  const unanswered = items.length - answered

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg">
        <h2 className="text-2xl font-bold text-white">Review your exam</h2>
        <p className="mt-2 text-[var(--color-text-muted)]">
          You may return to any question before submitting. Unanswered questions will remain unanswered.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div><p className="text-2xl font-bold text-white">{answered}</p><p className="text-xs text-[var(--color-text-muted)]">Answered</p></div>
          <div><p className="text-2xl font-bold text-white">{unanswered}</p><p className="text-xs text-[var(--color-text-muted)]">Unanswered</p></div>
          <div><p className="text-2xl font-bold text-white">{flagged}</p><p className="text-xs text-[var(--color-text-muted)]">Flagged</p></div>
        </div>
      </Card>

      <Card variant="default" padding="md">
        <QuestionNavigator items={items} currentPosition={0} onSelect={onGoToQuestion} />
      </Card>

      {submitError && (
        <div className="rounded-lg border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200" role="alert">
          {submitError}
        </div>
      )}

      {!confirming ? (
        <div className="flex flex-wrap justify-between gap-3">
          <Button type="button" variant="secondary" onClick={() => onGoToQuestion(1)}>
            Return to exam
          </Button>
          <Button type="button" onClick={() => setConfirming(true)}>
            Submit exam
          </Button>
        </div>
      ) : (
        <Card variant="outlined" padding="md" className="space-y-4">
          <p className="font-semibold text-white">Submit this attempt now?</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Submission ends the attempt. You cannot change answers afterward.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" disabled={submitting} onClick={() => setConfirming(false)}>
              Keep reviewing
            </Button>
            <Button type="button" loading={submitting} onClick={() => void onSubmit()}>
              Confirm submit
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

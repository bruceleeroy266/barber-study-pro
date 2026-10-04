'use client'

import { useMemo, useState } from 'react'
import type { ChapterTheme } from '@/lib/chapter-content'
import RandomizedMicroCheckChoices from './RandomizedMicroCheckChoices'
import MicroCheckRemediationPanel from './MicroCheckRemediationPanel'
import type {
  Chapter6MicroCheck,
  Chapter6MicroCheckAnswer,
} from '@/lib/chapter-6-concepts/micro-checks'
import type { Chapter6MicroCheckAttemptRow } from '@/lib/chapter-6-concepts/micro-check-persistence'
import { persistChapter6MicroCheckAttempt } from '@/lib/chapter-6-concepts/micro-check-persistence'

interface Props {
  check: Chapter6MicroCheck
  userId: string
  theme: ChapterTheme
  attempts: readonly Chapter6MicroCheckAttemptRow[]
  onAttemptPersisted: (row: Chapter6MicroCheckAttemptRow) => void
}

export default function Chapter6MicroCheckCard({
  check,
  userId,
  theme,
  attempts,
  onAttemptPersisted,
}: Props) {
  const [selected, setSelected] = useState<Record<string, Chapter6MicroCheckAnswer | undefined>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const attemptMap = useMemo(
    () => new Map(attempts.map((attempt) => [attempt.question_id, attempt])),
    [attempts],
  )

  const completedCount = check.questions.filter((question) => attemptMap.has(question.id)).length

  const submit = async (questionId: string) => {
    const question = check.questions.find((item) => item.id === questionId)
    const answer = selected[questionId]
    if (!question || !answer || attemptMap.has(questionId) || saving) return

    setSaving(questionId)
    setError(null)
    const result = await persistChapter6MicroCheckAttempt(userId, check, question, answer)
    setSaving(null)

    if (result.row) {
      onAttemptPersisted(result.row)
      return
    }

    setError(result.error ?? 'Unable to save this answer.')
  }

  return (
    <section
      className="rounded-2xl border p-5 space-y-5"
      style={{ borderColor: theme.primaryDark, background: theme.backgroundAlt }}
      aria-label={check.title}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.primary }}>
          Micro Knowledge Check
        </p>
        <h3 className="text-lg font-semibold mt-1" style={{ color: theme.text }}>
          {check.title}
        </h3>
        <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
          {completedCount} of {check.questions.length} first-attempt answers recorded
        </p>
      </div>

      {check.questions.map((question, index) => {
        const attempt = attemptMap.get(question.id)
        const chosen = selected[question.id]

        return (
          <div
            key={question.id}
            className="rounded-xl border p-4 space-y-3"
            style={{ borderColor: theme.border }}
          >
            <p className="font-medium" style={{ color: theme.text }}>
              {index + 1}. {question.question}
            </p>
            <RandomizedMicroCheckChoices
              question={question}
              chosen={chosen}
              recordedAnswer={attempt?.selected_answer}
              locked={!!attempt}
              disabled={saving === question.id}
              theme={theme}
              onSelect={(answerKey) =>
                setSelected((previous) => ({
                  ...previous,
                  [question.id]: answerKey,
                }))
              }
            />

            {!attempt && (
              <button
                type="button"
                disabled={!chosen || saving === question.id}
                onClick={() => void submit(question.id)}
                className="rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50"
                style={{ background: theme.primary, color: '#000' }}
              >
                {saving === question.id ? 'Saving…' : 'Lock First Attempt'}
              </button>
            )}

            {attempt && (
              <div
                className="rounded-lg border px-3 py-3 text-sm"
                style={{ borderColor: theme.border, color: theme.textMuted }}
              >
                <p
                  className="font-semibold"
                  style={{ color: attempt.is_correct ? theme.primary : theme.text }}
                >
                  {attempt.is_correct ? '✓ Correct' : 'Review this concept'}
                </p>
                {attempt.is_correct && (
                  <p className="mt-1">{question.explanation}</p>
                )}
                {!attempt.is_correct && (
                  <MicroCheckRemediationPanel
                    chapterId="ch-6"
                    question={question}
                    theme={theme}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}

      {error && <p className="text-sm text-red-300">{error}</p>}
    </section>
  )
}

'use client'

import { useMemo, useState } from 'react'
import type { ChapterTheme } from '@/lib/chapter-content'
import type {
  Chapter7MicroCheck,
  Chapter7MicroCheckAnswer,
} from '@/lib/chapter-7-concepts/micro-checks'
import type { Chapter7MicroCheckAttemptRow } from '@/lib/chapter-7-concepts/micro-check-persistence'
import { persistChapter7MicroCheckAttempt } from '@/lib/chapter-7-concepts/micro-check-persistence'

interface Props {
  check: Chapter7MicroCheck
  userId: string
  theme: ChapterTheme
  attempts: readonly Chapter7MicroCheckAttemptRow[]
  onAttemptPersisted: (row: Chapter7MicroCheckAttemptRow) => void
}

export default function Chapter7MicroCheckCard({
  check,
  userId,
  theme,
  attempts,
  onAttemptPersisted,
}: Props) {
  const [selected, setSelected] = useState<Record<string, Chapter7MicroCheckAnswer | undefined>>({})
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
    const result = await persistChapter7MicroCheckAttempt(userId, check, question, answer)
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
        <h3 className="text-lg font-semibold mt-1" style={{ color: theme.text }}>{check.title}</h3>
        <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
          {completedCount} of {check.questions.length} first-attempt answers recorded
        </p>
      </div>

      {check.questions.map((question, index) => {
        const attempt = attemptMap.get(question.id)
        const chosen = selected[question.id]

        return (
          <div key={question.id} className="rounded-xl border p-4 space-y-3" style={{ borderColor: theme.border }}>
            <p className="font-medium" style={{ color: theme.text }}>
              {index + 1}. {question.question}
            </p>

            <div className="grid gap-2">
              {(['a', 'b', 'c', 'd'] as const).map((answerKey) => {
                const text = question[`answer_${answerKey}`]
                const locked = !!attempt
                const active = locked
                  ? attempt.selected_answer === answerKey
                  : chosen === answerKey

                return (
                  <button
                    key={answerKey}
                    type="button"
                    disabled={locked || saving === question.id}
                    onClick={() => setSelected((previous) => ({ ...previous, [question.id]: answerKey }))}
                    className="w-full rounded-lg border px-3 py-3 text-left disabled:cursor-default"
                    style={{
                      borderColor: active ? theme.primary : theme.border,
                      background: active ? `${theme.primary}18` : theme.background,
                      color: theme.text,
                    }}
                  >
                    <span className="font-semibold uppercase mr-2">{answerKey}.</span>{text}
                  </button>
                )
              })}
            </div>

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
                <p className="font-semibold" style={{ color: attempt.is_correct ? theme.primary : theme.text }}>
                  {attempt.is_correct ? '✓ Correct' : 'Review this concept'}
                </p>
                <p className="mt-1">{question.explanation}</p>
              </div>
            )}
          </div>
        )
      })}

      {error && <p className="text-sm text-red-300">{error}</p>}
    </section>
  )
}

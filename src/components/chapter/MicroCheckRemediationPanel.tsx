'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChapterTheme } from '@/lib/chapter-content'
import {
  reduceMicroCheckAttempt,
  type MicroCheckAttemptSnapshot,
} from '@/lib/micro-checks/attempt-state'
import { buildMicroCheckCoverageHint } from '@/lib/micro-checks/hint-content'
import type { MicroCheckAnswerKey } from '@/lib/micro-checks/randomization'
import type { RegisteredMicroCheckQuestion } from '@/lib/micro-checks/registry'
import RandomizedMicroCheckChoices from './RandomizedMicroCheckChoices'

interface RemediationRow {
  selected_answer: MicroCheckAnswerKey
  is_correct: boolean
}

interface Props {
  chapterId: string
  question: RegisteredMicroCheckQuestion
  theme: ChapterTheme
}

const INITIAL_MISS: MicroCheckAttemptSnapshot = {
  state: 'initial_incorrect_hint',
  initialCorrect: false,
  remediationCorrect: null,
}

export default function MicroCheckRemediationPanel({
  chapterId,
  question,
  theme,
}: Props) {
  const [snapshot, setSnapshot] =
    useState<MicroCheckAttemptSnapshot>(INITIAL_MISS)
  const [selected, setSelected] = useState<MicroCheckAnswerKey | undefined>()
  const [recordedAnswer, setRecordedAnswer] =
    useState<MicroCheckAnswerKey | undefined>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hint = useMemo(
    () =>
      buildMicroCheckCoverageHint({
        ...question,
        conceptFamilyId:
          question.conceptFamilyId ?? question.conceptId ?? question.id,
      }),
    [question],
  )

  useEffect(() => {
    let cancelled = false

    async function loadExisting() {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          chapterId,
          questionId: question.id,
        })
        const response = await fetch(
          `/api/micro-checks/remediation?${params.toString()}`,
        )
        const body = (await response.json().catch(() => ({}))) as {
          row?: RemediationRow | null
          error?: string
        }

        if (cancelled) return

        if (!response.ok) {
          setError(body.error ?? 'Unable to load retry status.')
          return
        }

        if (body.row) {
          setRecordedAnswer(body.row.selected_answer)
          setSnapshot({
            state: 'remediation_complete',
            initialCorrect: false,
            remediationCorrect: body.row.is_correct,
          })
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load retry status.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadExisting()
    return () => {
      cancelled = true
    }
  }, [chapterId, question.id])

  const startRetry = () => {
    if (snapshot.state !== 'initial_incorrect_hint') return
    setSelected(undefined)
    setError(null)
    setSnapshot((current) =>
      reduceMicroCheckAttempt(current, { type: 'START_REMEDIATION' }),
    )
  }

  const submitRetry = async () => {
    if (
      snapshot.state !== 'remediation_active' ||
      !selected ||
      saving
    ) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/micro-checks/remediation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId,
          questionId: question.id,
          selectedAnswer: selected,
        }),
      })
      const body = (await response.json().catch(() => ({}))) as {
        row?: RemediationRow | null
        error?: string
      }

      if (!response.ok || !body.row) {
        setError(body.error ?? 'Unable to save retry answer.')
        return
      }

      setRecordedAnswer(body.row.selected_answer)
      setSnapshot((current) =>
        reduceMicroCheckAttempt(current, {
          type: 'SUBMIT_REMEDIATION',
          correct: body.row!.is_correct,
        }),
      )
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to save retry answer.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <p className="mt-3 text-sm" style={{ color: theme.textMuted }}>
        Checking retry status…
      </p>
    )
  }

  if (snapshot.state === 'remediation_complete') {
    return (
      <div
        className="mt-3 rounded-lg border px-3 py-3 text-sm"
        style={{ borderColor: theme.border, background: theme.background }}
      >
        <p className="font-semibold" style={{ color: theme.text }}>
          {snapshot.remediationCorrect
            ? '✓ Correct after review'
            : 'Needs more review'}
        </p>
        <p className="mt-1" style={{ color: theme.textMuted }}>
          {question.explanation}
        </p>
      </div>
    )
  }

  return (
    <div
      className="mt-3 rounded-lg border px-3 py-3 text-sm space-y-3"
      style={{ borderColor: theme.border, background: theme.background }}
    >
      <div>
        <p className="font-semibold" style={{ color: theme.primary }}>
          Hint
        </p>
        <p className="mt-1" style={{ color: theme.textMuted }}>
          {hint.text}
        </p>
      </div>

      {snapshot.state === 'initial_incorrect_hint' ? (
        <button
          type="button"
          onClick={startRetry}
          className="rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ background: theme.primary, color: '#000' }}
        >
          Try This Concept Again
        </button>
      ) : (
        <>
          <RandomizedMicroCheckChoices
            question={question}
            chosen={selected}
            recordedAnswer={recordedAnswer}
            locked={false}
            disabled={saving}
            theme={theme}
            onSelect={setSelected}
          />
          <button
            type="button"
            disabled={!selected || saving}
            onClick={() => void submitRetry()}
            className="rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50"
            style={{ background: theme.primary, color: '#000' }}
          >
            {saving ? 'Saving…' : 'Lock Retry'}
          </button>
        </>
      )}

      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  )
}

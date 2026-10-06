'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import ExamQuestion from './ExamQuestion'
import QuestionNavigator from './QuestionNavigator'
import ReviewScreen from './ReviewScreen'
import ExamResults from './ExamResults'
import type {
  ExamAttempt,
  ExamConfig,
  ExamHistoryItem,
  ExamOption,
} from '@/lib/comprehensive-exam/types'

type ViewState = 'loading' | 'entry' | 'active' | 'review' | 'results' | 'unavailable'

const formatClock = (seconds: number) => {
  const safe = Math.max(0, seconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const secs = safe % 60
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${minutes}:${String(secs).padStart(2, '0')}`
}

async function readJson(response: Response) {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(typeof payload?.error === 'string' ? payload.error : 'Request failed')
  }
  return payload
}

export default function ExamShell() {
  const [config, setConfig] = useState<ExamConfig | null>(null)
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null)
  const [history, setHistory] = useState<ExamHistoryItem[]>([])
  const [view, setView] = useState<ViewState>('loading')
  const [currentPosition, setCurrentPosition] = useState(1)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [starting, setStarting] = useState(false)
  const [savingPosition, setSavingPosition] = useState<number | null>(null)
  const [flagSavingPosition, setFlagSavingPosition] = useState<number | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [entryError, setEntryError] = useState<string | null>(null)
  const expirationHandledRef = useRef(false)

  const loadHistory = useCallback(async () => {
    const payload = await readJson(await fetch('/api/comprehensive-exam/history', { cache: 'no-store' }))
    const next = Array.isArray(payload.history) ? payload.history : []
    setHistory(next)
    return next as ExamHistoryItem[]
  }, [])

  const loadEntry = useCallback(async () => {
    setView('loading')
    setEntryError(null)
    try {
      const [configPayload] = await Promise.all([
        readJson(await fetch('/api/comprehensive-exam/config', { cache: 'no-store' })),
        loadHistory(),
      ])
      if (!configPayload.config) {
        setConfig(null)
        setView('unavailable')
        return
      }
      setConfig(configPayload.config as ExamConfig)
      setAttempt(null)
      setView('entry')
    } catch (error) {
      setEntryError(error instanceof Error ? error.message : 'Could not load Exam Ready')
      setView('unavailable')
    }
  }, [loadHistory])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadEntry()
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [loadEntry])

  const applyAttempt = useCallback((next: ExamAttempt) => {
    setAttempt(next)
    expirationHandledRef.current = false
    if (next.status === 'active') {
      const firstUnanswered = next.items.find((item) => !item.selectedOption)?.position ?? 1
      setCurrentPosition(firstUnanswered)
      setSecondsLeft(Math.max(0, next.remainingSeconds))
      setView('active')
    } else {
      setSecondsLeft(0)
      setView('results')
      void loadHistory()
    }
  }, [loadHistory])

  const refreshAttempt = useCallback(async () => {
    if (!attempt?.attemptId) return
    const payload = await readJson(
      await fetch(`/api/comprehensive-exam/attempts/${attempt.attemptId}`, { cache: 'no-store' }),
    )
    if (payload.attempt) applyAttempt(payload.attempt as ExamAttempt)
  }, [attempt, applyAttempt])

  useEffect(() => {
    if (!attempt || attempt.status !== 'active') return
    const tick = window.setInterval(() => {
      setSecondsLeft((remaining) => Math.max(0, remaining - 1))
    }, 1000)
    return () => window.clearInterval(tick)
  }, [attempt])

  useEffect(() => {
    if (!attempt || attempt.status !== 'active' || secondsLeft !== 0 || expirationHandledRef.current) return
    expirationHandledRef.current = true
    void refreshAttempt().catch(() => {
      setQuestionError('Time expired. Reconnecting to finalize your exam…')
      expirationHandledRef.current = false
    })
  }, [attempt, secondsLeft, refreshAttempt])

  useEffect(() => {
    if (!attempt || attempt.status !== 'active') return
    const reconcile = window.setInterval(() => {
      void refreshAttempt().catch(() => {
        setQuestionError('We could not verify the timer right now. Your server timer is still authoritative.')
      })
    }, 60_000)
    return () => window.clearInterval(reconcile)
  }, [attempt, refreshAttempt])

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (attempt?.status === 'active') {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [attempt?.status])

  const startOrResume = async () => {
    if (!config) return
    setStarting(true)
    setEntryError(null)
    try {
      const payload = await readJson(
        await fetch('/api/comprehensive-exam/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ configId: config.configId }),
        }),
      )
      applyAttempt(payload.attempt as ExamAttempt)
    } catch (error) {
      setEntryError(error instanceof Error ? error.message : 'Could not start or resume exam')
    } finally {
      setStarting(false)
    }
  }

  const currentItem = useMemo(
    () => attempt?.items.find((item) => item.position === currentPosition) ?? null,
    [attempt?.items, currentPosition],
  )

  const replaceItem = useCallback((position: number, patch: Partial<ExamAttempt['items'][number]>) => {
    setAttempt((current) => current
      ? {
          ...current,
          items: current.items.map((item) => item.position === position ? { ...item, ...patch } : item),
        }
      : current)
  }, [])

  const saveAnswer = async (option: ExamOption) => {
    if (!attempt || !currentItem || attempt.status !== 'active') return
    const position = currentItem.position
    setSavingPosition(position)
    setQuestionError(null)
    setSaveMessage(null)
    try {
      const payload = await readJson(
        await fetch(`/api/comprehensive-exam/attempts/${attempt.attemptId}/answers/${position}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedOption: option }),
        }),
      )
      const result = payload.result
      if (result?.status && result.status !== 'active' && result.items !== undefined) {
        applyAttempt(result as ExamAttempt)
        return
      }
      replaceItem(position, { selectedOption: option, answeredAt: result?.savedAt ?? new Date().toISOString() })
      setSaveMessage('Answer saved')
    } catch (error) {
      setQuestionError(error instanceof Error ? error.message : 'Could not save answer. Please try again.')
    } finally {
      setSavingPosition(null)
    }
  }

  const toggleFlag = async () => {
    if (!attempt || !currentItem || attempt.status !== 'active') return
    const position = currentItem.position
    const nextFlag = !currentItem.flagged
    setFlagSavingPosition(position)
    setQuestionError(null)
    try {
      const payload = await readJson(
        await fetch(`/api/comprehensive-exam/attempts/${attempt.attemptId}/flags/${position}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flagged: nextFlag }),
        }),
      )
      const result = payload.result
      if (result?.status && result.status !== 'active' && result.items !== undefined) {
        applyAttempt(result as ExamAttempt)
        return
      }
      replaceItem(position, { flagged: nextFlag })
    } catch (error) {
      setQuestionError(error instanceof Error ? error.message : 'Could not save flag. Please try again.')
    } finally {
      setFlagSavingPosition(null)
    }
  }

  const submitAttempt = async () => {
    if (!attempt) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = await readJson(
        await fetch(`/api/comprehensive-exam/attempts/${attempt.attemptId}/submit`, {
          method: 'POST',
        }),
      )
      applyAttempt(payload.attempt as ExamAttempt)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit exam. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (view === 'loading') {
    return (
      <Card variant="default" padding="lg">
        <p className="text-[var(--color-text-muted)]">Loading Exam Ready…</p>
      </Card>
    )
  }

  if (view === 'unavailable' || !config) {
    return (
      <Card variant="outlined" padding="lg">
        <h2 className="text-xl font-semibold text-white">Exam Ready is unavailable</h2>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {entryError ?? 'There is no active comprehensive exam configuration right now.'}
        </p>
        <Button className="mt-4" type="button" variant="outline" onClick={() => void loadEntry()}>
          Try again
        </Button>
      </Card>
    )
  }

  if (view === 'entry') {
    const completedHistory = history.filter((item) => item.status !== 'active')
    return (
      <div className="space-y-6">
        <Card variant="elevated" padding="lg">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-gold)]">Exam Ready</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{config.title}</h2>
          <p className="mt-3 max-w-2xl text-[var(--color-text-muted)]">
            Practice under a timed, board-style format. Correct answers are not shown during the exam.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div><p className="text-2xl font-bold text-white">{config.scoredQuestionCount + config.unscoredQuestionCount}</p><p className="text-xs text-[var(--color-text-muted)]">Total questions</p></div>
            <div><p className="text-2xl font-bold text-white">{config.scoredQuestionCount}</p><p className="text-xs text-[var(--color-text-muted)]">Scored</p></div>
            <div><p className="text-2xl font-bold text-white">{config.unscoredQuestionCount}</p><p className="text-xs text-[var(--color-text-muted)]">Unscored</p></div>
            <div><p className="text-2xl font-bold text-white">{Math.round(config.timeLimitSeconds / 60)} min</p><p className="text-xs text-[var(--color-text-muted)]">Time limit</p></div>
          </div>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            Passing threshold: {config.passingPercentage}%. The 10 unscored questions do not affect your percentage.
          </p>
          {entryError && <p className="mt-4 text-sm text-red-300" role="alert">{entryError}</p>}
          <Button className="mt-6" type="button" size="lg" loading={starting} onClick={() => void startOrResume()}>
            Start / Resume Exam
          </Button>
        </Card>

        {completedHistory.length > 0 && (
          <Card variant="default" padding="md">
            <h3 className="text-lg font-semibold text-white">Attempt history</h3>
            <div className="mt-4 space-y-3">
              {completedHistory.map((item) => (
                <div key={item.attemptId} className="flex flex-wrap items-center justify-between gap-3 border-b border-graphite pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-white">Attempt {item.attemptNumber}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{new Date(item.startedAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--color-brand-gold)]">{item.percentage ?? '—'}%</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{item.passed ? 'Passing result' : 'Review recommended'}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    )
  }

  if (!attempt) return null

  if (view === 'results') {
    return <ExamResults attempt={attempt} history={history} onNewAttempt={() => void loadEntry()} />
  }

  if (view === 'review') {
    return (
      <ReviewScreen
        items={attempt.items}
        submitting={submitting}
        submitError={submitError}
        onGoToQuestion={(position) => {
          setCurrentPosition(position)
          setView('active')
        }}
        onSubmit={submitAttempt}
      />
    )
  }

  if (!currentItem) return null

  const answered = attempt.items.filter((item) => item.selectedOption).length
  const flagged = attempt.items.filter((item) => item.flagged).length

  return (
    <div className="space-y-5">
      <Card variant="ghost" padding="sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Server-authoritative time remaining</p>
            <p className="text-2xl font-bold text-white" aria-live="polite">{formatClock(secondsLeft)}</p>
          </div>
          <div className="flex gap-5 text-sm">
            <span className="text-[var(--color-text-muted)]"><strong className="text-white">{answered}</strong>/110 answered</span>
            <span className="text-[var(--color-text-muted)]"><strong className="text-white">{flagged}</strong> flagged</span>
          </div>
        </div>
      </Card>

      <ExamQuestion
        item={currentItem}
        total={attempt.items.length}
        saving={savingPosition === currentItem.position}
        flagSaving={flagSavingPosition === currentItem.position}
        saveMessage={saveMessage}
        error={questionError}
        onSelect={saveAnswer}
        onToggleFlag={toggleFlag}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={currentPosition <= 1}
          onClick={() => setCurrentPosition((position) => Math.max(1, position - 1))}
        >
          Previous
        </Button>
        <Button type="button" variant="outline" onClick={() => setView('review')}>
          Review & Submit
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={currentPosition >= attempt.items.length}
          onClick={() => setCurrentPosition((position) => Math.min(attempt.items.length, position + 1))}
        >
          Next
        </Button>
      </div>

      <Card variant="default" padding="md">
        <QuestionNavigator
          items={attempt.items}
          currentPosition={currentPosition}
          onSelect={setCurrentPosition}
        />
      </Card>
    </div>
  )
}

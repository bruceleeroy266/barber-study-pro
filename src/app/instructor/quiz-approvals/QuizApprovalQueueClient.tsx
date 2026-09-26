'use client'

import { useMemo, useState, useTransition } from 'react'
import { bulkApproveQuizAccess, reviewQuizAccess } from './actions'

export interface QuizApprovalRequestRow {
  id: string
  studentId: string
  studentName: string
  quizId: string
  chapterId: string
  status: 'pending' | 'approved' | 'denied'
  requestedAt: string
  readiness: {
    lessonCompleted?: boolean
    flashcardsCompleted?: boolean
    knowledgeChecksCompleted?: boolean
    ready?: boolean
  }
}

export default function QuizApprovalQueueClient({
  requests,
}: {
  requests: QuizApprovalRequestRow[]
}) {
  const [selected, setSelected] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const pending = useMemo(() => requests.filter((request) => request.status === 'pending'), [requests])

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    )
  }

  function runReview(id: string, decision: 'approved' | 'denied') {
    startTransition(async () => {
      await reviewQuizAccess(id, decision)
      setSelected((current) => current.filter((value) => value !== id))
    })
  }

  function approveSelected(ids: string[]) {
    if (ids.length === 0) return
    startTransition(async () => {
      await bulkApproveQuizAccess(ids)
      setSelected([])
    })
  }

  return (
    <div className="space-y-4">
      {pending.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isPending || selected.length === 0}
            onClick={() => approveSelected(selected)}
            className="rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 text-sm font-semibold text-black disabled:opacity-40"
          >
            Approve selected ({selected.length})
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => approveSelected(pending.map((request) => request.id))}
            className="rounded-lg border border-[var(--color-brand-gold)]/40 px-4 py-2 text-sm font-semibold text-gold disabled:opacity-40"
          >
            Approve all pending
          </button>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="rounded-xl border border-graphite bg-charcoal p-6 text-silver">
          No quiz access requests yet.
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <article key={request.id} className="rounded-xl border border-graphite bg-charcoal p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  {request.status === 'pending' && (
                    <input
                      type="checkbox"
                      aria-label={`Select ${request.studentName}`}
                      checked={selected.includes(request.id)}
                      onChange={() => toggle(request.id)}
                      className="mt-1 h-4 w-4"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-white">{request.studentName}</p>
                    <p className="text-sm text-silver">
                      Chapter {request.chapterId.replace('ch-', '')} · {request.quizId}
                    </p>
                    <p className="mt-1 text-xs text-silver-gray">
                      Requested {new Date(request.requestedAt).toLocaleString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className={request.readiness.lessonCompleted ? 'text-gold' : 'text-silver-gray'}>
                        Lesson {request.readiness.lessonCompleted ? '✓' : '—'}
                      </span>
                      <span className={request.readiness.flashcardsCompleted ? 'text-gold' : 'text-silver-gray'}>
                        Flashcards {request.readiness.flashcardsCompleted ? '✓' : '—'}
                      </span>
                      <span className={request.readiness.knowledgeChecksCompleted ? 'text-gold' : 'text-silver-gray'}>
                        Checks {request.readiness.knowledgeChecksCompleted ? '✓' : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-graphite px-3 py-1 text-xs capitalize text-silver">
                    {request.status}
                  </span>
                  {request.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => runReview(request.id, 'approved')}
                        className="rounded-lg bg-[var(--color-brand-gold)] px-3 py-2 text-sm font-semibold text-black disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => runReview(request.id, 'denied')}
                        className="rounded-lg border border-silver/40 px-3 py-2 text-sm font-semibold text-silver disabled:opacity-40"
                      >
                        Deny
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

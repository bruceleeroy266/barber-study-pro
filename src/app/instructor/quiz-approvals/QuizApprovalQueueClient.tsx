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
  programIds: string[]
  readiness: {
    lessonCompleted?: boolean
    flashcardsCompleted?: boolean
    knowledgeChecksCompleted?: boolean
    ready?: boolean
  }
}

interface FilterOption {
  id: string
  name: string
}

interface ChapterFilterOption {
  id: string
  number: number
  title: string
}

export default function QuizApprovalQueueClient({
  requests,
  chapters,
  programs,
  students,
}: {
  requests: QuizApprovalRequestRow[]
  chapters: ChapterFilterOption[]
  programs: FilterOption[]
  students: FilterOption[]
}) {
  const [selected, setSelected] = useState<string[]>([])
  const [chapterFilter, setChapterFilter] = useState('')
  const [programFilter, setProgramFilter] = useState('')
  const [studentFilter, setStudentFilter] = useState('')
  const [isPending, startTransition] = useTransition()

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        if (chapterFilter && request.chapterId !== chapterFilter) return false
        if (programFilter && !request.programIds.includes(programFilter)) return false
        if (studentFilter && request.studentId !== studentFilter) return false
        return true
      }),
    [requests, chapterFilter, programFilter, studentFilter],
  )

  const filteredPending = useMemo(
    () => filteredRequests.filter((request) => request.status === 'pending'),
    [filteredRequests],
  )

  const hasActiveFilters = Boolean(chapterFilter || programFilter || studentFilter)

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

  function clearFilters() {
    setChapterFilter('')
    setProgramFilter('')
    setStudentFilter('')
    setSelected([])
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-graphite bg-charcoal p-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-white">Filter approvals</h3>
          <p className="text-sm text-silver">
            Narrow the queue by chapter, class/program, or individual student before approving.
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="text-sm text-silver">
            <span className="mb-1 block">Chapter</span>
            <select
              aria-label="Filter by chapter"
              value={chapterFilter}
              onChange={(event) => {
                setChapterFilter(event.target.value)
                setSelected([])
              }}
              className="w-full rounded-lg border border-graphite bg-black/30 px-3 py-2 text-white"
            >
              <option value="">All chapters</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  Chapter {chapter.number} — {chapter.title}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-silver">
            <span className="mb-1 block">Class / Program</span>
            <select
              aria-label="Filter by class or program"
              value={programFilter}
              onChange={(event) => {
                setProgramFilter(event.target.value)
                setSelected([])
              }}
              className="w-full rounded-lg border border-graphite bg-black/30 px-3 py-2 text-white"
            >
              <option value="">All classes/programs</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-silver">
            <span className="mb-1 block">Student</span>
            <select
              aria-label="Filter by student"
              value={studentFilter}
              onChange={(event) => {
                setStudentFilter(event.target.value)
                setSelected([])
              }}
              className="w-full rounded-lg border border-graphite bg-black/30 px-3 py-2 text-white"
            >
              <option value="">All students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-silver">
            Showing {filteredRequests.length} request{filteredRequests.length === 1 ? '' : 's'}
            {' · '}
            {filteredPending.length} pending
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-semibold text-gold hover:text-[var(--color-brand-gold-light)]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredPending.length > 0 && (
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
            onClick={() => approveSelected(filteredPending.map((request) => request.id))}
            className="rounded-lg border border-[var(--color-brand-gold)]/40 px-4 py-2 text-sm font-semibold text-gold disabled:opacity-40"
          >
            {hasActiveFilters
              ? `Approve all filtered pending (${filteredPending.length})`
              : `Approve all pending (${filteredPending.length})`}
          </button>
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <div className="rounded-xl border border-graphite bg-charcoal p-6 text-silver">
          {requests.length === 0
            ? 'No quiz access requests yet.'
            : 'No requests match the selected filters.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
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

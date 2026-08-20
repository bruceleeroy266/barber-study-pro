'use client'

/**
 * Phase 6C-3 / 6C-4 — Remediation Page Client Component
 *
 * Client-side interactive remediation experience.
 * Orchestrates targeted review, flashcards, and reassessment.
 * Phase 6C-4 adds request in-flight safeguards, explicit recovery states,
 * and accessibility hardening without changing remediation policy.
 */

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type {
  StudentRemediationState,
  RemediationContentBundle,
  RemediationAssignment,
} from '@/lib/remediation/student-service'
import { STUDENT_STATE_LABELS, STUDENT_STATE_DESCRIPTIONS } from '@/lib/remediation/student-service'
import RemediationContentRenderer from './RemediationContentRenderer'
import RemediationFlashcardReview from './RemediationFlashcardReview'
import ReassessmentKnowledgeCheck from './ReassessmentKnowledgeCheck'
import RemediationOutcome from './RemediationOutcome'
import { Button, Card, Badge, AlertPanel } from '@/components/ui'

interface RemediationPageClientProps {
  cycleId: string
  studentState: StudentRemediationState
  contentBundle: RemediationContentBundle
  assignments: RemediationAssignment[]
  progress: { completed: number; total: number; percentage: number }
}

export default function RemediationPageClient({
  cycleId,
  studentState: initialState,
  contentBundle,
  assignments,
  progress: initialProgress,
}: RemediationPageClientProps) {
  const router = useRouter()
  const [studentState, setStudentState] = useState<StudentRemediationState>(initialState)
  const [progress, setProgress] = useState(initialProgress)
  const [error, setError] = useState<string | null>(null)
  const [activeAction, setActiveAction] = useState<
    | 'start-review'
    | 'complete-review'
    | 'start-reassessment'
    | 'submit-answer'
    | 'refresh'
    | null
  >(null)
  const [viewedContentIds, setViewedContentIds] = useState<Set<string>>(
    () => new Set(assignments.filter((a) => a.assignmentType === 'content_block' && a.status === 'completed').map((a) => a.assetId))
  )
  const [reviewedFlashcardIds, setReviewedFlashcardIds] = useState<Set<string>>(
    () => new Set(assignments.filter((a) => a.assignmentType === 'flashcard' && a.status === 'completed').map((a) => a.assetId))
  )
  const [reservationStartedAt, setReservationStartedAt] = useState<Date | null>(null)

  const isLoading = activeAction !== null
  const actionInFlight = useMemo(() => activeAction !== null, [activeAction])

  // Reassessment state
  const [reassessmentData, setReassessmentData] = useState<{
    questionId: string
    reservationId: string
    quizAttemptId: string
    question: {
      id: string
      question: string
      answer_a: string
      answer_b: string
      answer_c: string
      answer_d: string
      explanation: string | null
    }
  } | null>(null)

  // Outcome state
  const [outcome, setOutcome] = useState<{
    isCorrect: boolean
    outcome: string
    studentState: StudentRemediationState
  } | null>(null)

  const reservationIsStale = useMemo(() => {
    if (!reservationStartedAt) return false
    const elapsedMs = Date.now() - reservationStartedAt.getTime()
    return elapsedMs > 60 * 60 * 1000
  }, [reservationStartedAt])

  const beginAction = useCallback((action: NonNullable<typeof activeAction>) => {
    let accepted = false
    setActiveAction((current) => {
      if (current !== null) {
        return current
      }
      accepted = true
      return action
    })
    return accepted
  }, [])

  const endAction = useCallback(() => {
    setActiveAction(null)
  }, [])

  // Record an event
  const recordEvent = useCallback(async (eventType: string, assetId?: string) => {
    try {
      const response = await fetch(`/api/remediation/cycles/${cycleId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, assetId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to record event')
      }

      return true
    } catch (err) {
      console.error('[Remediation] Event recording error:', err)
      setError(err instanceof Error ? err.message : 'Failed to record event')
      return false
    }
  }, [cycleId])

  // Start review
  const handleStartReview = useCallback(async () => {
    if (!beginAction('start-review')) return
    setError(null)
    const success = await recordEvent('review_started')
    if (success) {
      setStudentState('review_in_progress')
    }
    endAction()
  }, [beginAction, endAction, recordEvent])

  // Mark content viewed
  const handleContentViewed = useCallback(async (contentBlockId: string) => {
    const success = await recordEvent('content_viewed', contentBlockId)
    if (success) {
      setViewedContentIds((prev) => {
        const next = new Set(prev)
        next.add(contentBlockId)
        return next
      })
      setProgress((prev) => ({
        ...prev,
        completed: Math.min(prev.completed + 1, prev.total),
        percentage: Math.round(((prev.completed + 1) / prev.total) * 100),
      }))
    }
  }, [recordEvent])

  // Mark flashcard reviewed
  const handleFlashcardReviewed = useCallback(async (flashcardId: string) => {
    const success = await recordEvent('flashcard_reviewed', flashcardId)
    if (success) {
      setReviewedFlashcardIds((prev) => {
        const next = new Set(prev)
        next.add(flashcardId)
        return next
      })
      setProgress((prev) => ({
        ...prev,
        completed: Math.min(prev.completed + 1, prev.total),
        percentage: Math.round(((prev.completed + 1) / prev.total) * 100),
      }))
    }
  }, [recordEvent])

  // Complete review
  const handleCompleteReview = useCallback(async () => {
    if (!beginAction('complete-review')) return
    setError(null)
    const success = await recordEvent('review_completed')
    if (success) {
      setStudentState('review_completed')
    }
    endAction()
  }, [beginAction, endAction, recordEvent])

  // Start reassessment
  const handleStartReassessment = useCallback(async () => {
    if (!beginAction('start-reassessment')) return
    setError(null)

    try {
      const response = await fetch(`/api/remediation/cycles/${cycleId}/reassessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.poolExhausted) {
          setStudentState('pool_exhausted')
          return
        }
        throw new Error(data.error || 'We could not prepare your knowledge check. Please try again.')
      }

      setReassessmentData({
        questionId: data.questionId,
        reservationId: data.reservationId,
        quizAttemptId: data.quizAttemptId,
        question: data.question,
      })
      setReservationStartedAt(new Date())
      setStudentState('reassessment_in_progress')
    } catch (err) {
      console.error('[Remediation] Reassessment start error:', err)
      setError(err instanceof Error ? err.message : 'We could not prepare your knowledge check. Please try again.')
    } finally {
      endAction()
    }
  }, [beginAction, cycleId, endAction])

  // Submit reassessment answer
  const handleSubmitAnswer = useCallback(async (answer: string) => {
    if (!reassessmentData) return
    if (reservationIsStale) {
      setError('This knowledge check session has expired. Refresh to resume safely from your saved progress.')
      return
    }

    if (!beginAction('submit-answer')) return
    setError(null)

    try {
      const response = await fetch(`/api/remediation/cycles/${cycleId}/reassessment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: reassessmentData.questionId,
          reservationId: reassessmentData.reservationId,
          quizAttemptId: reassessmentData.quizAttemptId,
          answer,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('This knowledge check has already been completed. Refresh to view your current status.')
        }
        if (response.status === 404) {
          throw new Error('This knowledge check session is no longer valid. Refresh to resume from your saved progress.')
        }
        throw new Error(data.error || 'We could not submit your answer. Please try again.')
      }

      setOutcome({
        isCorrect: data.isCorrect,
        outcome: data.outcome,
        studentState: data.studentState,
      })
      setStudentState(data.studentState)
      setReassessmentData(null)
      setReservationStartedAt(null)
    } catch (err) {
      console.error('[Remediation] Answer submission error:', err)
      setError(err instanceof Error ? err.message : 'We could not submit your answer. Please try again.')
    } finally {
      endAction()
    }
  }, [beginAction, cycleId, endAction, reassessmentData, reservationIsStale])

  // Try another reassessment (for pending outcomes)
  const handleTryAgain = useCallback(() => {
    setOutcome(null)
    setStudentState('review_completed')
  }, [])

  // Refresh the page data
  const handleRefresh = useCallback(() => {
    if (!beginAction('refresh')) return
    router.refresh()
    window.setTimeout(() => endAction(), 500)
  }, [beginAction, endAction, router])

  // Render based on student state
  const renderContent = () => {
    switch (studentState) {
      case 'targeted_review':
        return (
          <div className="space-y-6">
            <AlertPanel
              title="Resume anytime"
              description="Your progress is saved as you go. If you leave or refresh, you can safely return to this page and continue from your last completed step."
              variant="info"
            />
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Review Materials
              </h2>
              <p className="text-silver mb-6">
                Your instructor has identified <strong>{contentBundle.conceptName}</strong> as an area to focus on.
                Review the materials below to strengthen your understanding.
              </p>
              <Button
                variant="primary"
                onClick={handleStartReview}
                disabled={actionInFlight}
                loading={activeAction === 'start-review'}
                aria-describedby="start-review-help"
              >
                {activeAction === 'start-review' ? 'Starting...' : 'Start Review'}
              </Button>
              <p id="start-review-help" className="text-xs text-silver-gray mt-3">
                Your review progress is saved automatically as you complete each activity.
              </p>
            </Card>

            <RemediationContentRenderer
              contentBlocks={contentBundle.contentBlocks}
              onContentViewed={handleContentViewed}
              viewedContentIds={viewedContentIds}
            />

            {contentBundle.flashcards.length > 0 && (
              <RemediationFlashcardReview
                flashcards={contentBundle.flashcards}
                onFlashcardReviewed={handleFlashcardReviewed}
                reviewedFlashcardIds={reviewedFlashcardIds}
              />
            )}
          </div>
        )

      case 'review_in_progress':
        return (
          <div className="space-y-6">
            <AlertPanel
              title="Progress saved"
              description="You can refresh or leave this page and come back later. Completed review activities will remain marked as complete."
              variant="info"
            />
            <RemediationContentRenderer
              contentBlocks={contentBundle.contentBlocks}
              onContentViewed={handleContentViewed}
              viewedContentIds={viewedContentIds}
            />

            {contentBundle.flashcards.length > 0 && (
              <RemediationFlashcardReview
                flashcards={contentBundle.flashcards}
                onFlashcardReviewed={handleFlashcardReviewed}
                reviewedFlashcardIds={reviewedFlashcardIds}
              />
            )}

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Ready to complete your review?
                  </h3>
                  <p className="text-silver text-sm mt-1">
                    Make sure you have reviewed all assigned materials before proceeding.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleCompleteReview}
                  disabled={actionInFlight || progress.completed < progress.total}
                  loading={activeAction === 'complete-review'}
                >
                  {activeAction === 'complete-review' ? 'Completing...' : 'Complete Review'}
                </Button>
              </div>
              {progress.completed < progress.total && (
                <p className="text-gold text-sm mt-2">
                  {progress.total - progress.completed} activities remaining
                </p>
              )}
            </Card>
          </div>
        )

      case 'review_completed':
        return (
          <div className="space-y-6">
            <AlertPanel
              title="Ready when you are"
              description="Your review is saved. You can start the knowledge check now or return later without losing your review progress."
              variant="success"
            />
            <Card className="p-6">
              <div className="text-center">
                <Badge variant="success" size="lg" className="mb-4">
                  ✓ Review Completed
                </Badge>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Ready for Knowledge Check
                </h2>
                <p className="text-silver mb-6">
                  You have completed your review of {contentBundle.conceptName}.
                  A knowledge check is now available to demonstrate your understanding.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartReassessment}
                  disabled={actionInFlight}
                  loading={activeAction === 'start-reassessment'}
                >
                  {activeAction === 'start-reassessment' ? 'Preparing...' : 'Start Knowledge Check'}
                </Button>
              </div>
            </Card>
          </div>
        )

      case 'reassessment_in_progress':
        if (!reassessmentData) {
          return (
            <AlertPanel
              title="Knowledge check unavailable"
              description="We could not restore this knowledge check session. Refresh the page to resume safely from your saved progress."
              variant="error"
              action={{ label: 'Refresh', onClick: handleRefresh }}
            />
          )
        }
        return (
          <div className="space-y-4">
            {reservationIsStale && (
              <AlertPanel
                title="Knowledge check session expired"
                description="This question session is no longer current. Refresh the page to resume from your saved progress and continue safely."
                variant="warning"
                action={{ label: 'Refresh', onClick: handleRefresh }}
              />
            )}
            <ReassessmentKnowledgeCheck
              question={reassessmentData.question}
              onSubmit={handleSubmitAnswer}
              isLoading={activeAction === 'submit-answer'}
              disabled={reservationIsStale}
            />
          </div>
        )

      case 'pending_more_evidence':
        return (
          <div className="space-y-6">
            {outcome && (
              <RemediationOutcome
                isCorrect={outcome.isCorrect}
                outcome={outcome.outcome}
                studentState={outcome.studentState}
                onTryAgain={handleTryAgain}
                onRefresh={handleRefresh}
              />
            )}
          </div>
        )

      case 'successful':
      case 'unsuccessful':
      case 'pool_exhausted':
      case 'already_completed':
        return (
          <div className="space-y-4">
            {studentState === 'pool_exhausted' && (
              <AlertPanel
                title="No more practice questions available"
                description="You have used all currently available practice questions for this topic. Your instructor can provide the next step."
                variant="info"
              />
            )}
            <RemediationOutcome
              isCorrect={outcome?.isCorrect ?? false}
              outcome={outcome?.outcome ?? ''}
              studentState={studentState}
              onTryAgain={undefined}
              onRefresh={handleRefresh}
              isRefreshing={activeAction === 'refresh'}
            />
          </div>
        )

      default:
        return (
          <AlertPanel
            title="Loading"
            description="Loading your remediation experience..."
            variant="info"
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <AlertPanel
          title="Something needs your attention"
          description={error}
          variant="error"
          dismissible
          onDismiss={() => setError(null)}
        />
      )}

      {renderContent()}
    </div>
  )
}

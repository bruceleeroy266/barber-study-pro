'use client'

/**
 * Phase 6C-3 — Remediation Page Client Component
 *
 * Client-side interactive remediation experience.
 * Orchestrates targeted review, flashcards, and reassessment.
 */

import { useState, useCallback } from 'react'
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
import { Button, Card, Alert, Badge } from '@/components/ui'

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
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)
    setError(null)
    const success = await recordEvent('review_started')
    if (success) {
      setStudentState('review_in_progress')
    }
    setIsLoading(false)
  }, [recordEvent])

  // Mark content viewed
  const handleContentViewed = useCallback(async (contentBlockId: string) => {
    const success = await recordEvent('content_viewed', contentBlockId)
    if (success) {
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
      setProgress((prev) => ({
        ...prev,
        completed: Math.min(prev.completed + 1, prev.total),
        percentage: Math.round(((prev.completed + 1) / prev.total) * 100),
      }))
    }
  }, [recordEvent])

  // Complete review
  const handleCompleteReview = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const success = await recordEvent('review_completed')
    if (success) {
      setStudentState('review_completed')
    }
    setIsLoading(false)
  }, [recordEvent])

  // Start reassessment
  const handleStartReassessment = useCallback(async () => {
    setIsLoading(true)
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
        throw new Error(data.error || 'Failed to start knowledge check')
      }

      setReassessmentData({
        questionId: data.questionId,
        reservationId: data.reservationId,
        quizAttemptId: data.quizAttemptId,
        question: data.question,
      })
      setStudentState('reassessment_in_progress')
    } catch (err) {
      console.error('[Remediation] Reassessment start error:', err)
      setError(err instanceof Error ? err.message : 'Failed to start knowledge check')
    } finally {
      setIsLoading(false)
    }
  }, [cycleId])

  // Submit reassessment answer
  const handleSubmitAnswer = useCallback(async (answer: string) => {
    if (!reassessmentData) return

    setIsLoading(true)
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
        throw new Error(data.error || 'Failed to submit answer')
      }

      setOutcome({
        isCorrect: data.isCorrect,
        outcome: data.outcome,
        studentState: data.studentState,
      })
      setStudentState(data.studentState)
      setReassessmentData(null)
    } catch (err) {
      console.error('[Remediation] Answer submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
    } finally {
      setIsLoading(false)
    }
  }, [cycleId, reassessmentData])

  // Try another reassessment (for pending outcomes)
  const handleTryAgain = useCallback(() => {
    setOutcome(null)
    setStudentState('review_completed')
  }, [])

  // Refresh the page data
  const handleRefresh = useCallback(() => {
    router.refresh()
  }, [router])

  // Render based on student state
  const renderContent = () => {
    switch (studentState) {
      case 'targeted_review':
        return (
          <div className="space-y-6">
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
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Start Review'}
              </Button>
            </Card>

            <RemediationContentRenderer
              contentBlocks={contentBundle.contentBlocks}
              onContentViewed={handleContentViewed}
              viewedContentIds={new Set()}
            />

            {contentBundle.flashcards.length > 0 && (
              <RemediationFlashcardReview
                flashcards={contentBundle.flashcards}
                onFlashcardReviewed={handleFlashcardReviewed}
                reviewedFlashcardIds={new Set()}
              />
            )}
          </div>
        )

      case 'review_in_progress':
        return (
          <div className="space-y-6">
            <RemediationContentRenderer
              contentBlocks={contentBundle.contentBlocks}
              onContentViewed={handleContentViewed}
              viewedContentIds={new Set()}
            />

            {contentBundle.flashcards.length > 0 && (
              <RemediationFlashcardReview
                flashcards={contentBundle.flashcards}
                onFlashcardReviewed={handleFlashcardReviewed}
                reviewedFlashcardIds={new Set()}
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
                  disabled={isLoading || progress.completed < progress.total}
                >
                  {isLoading ? 'Completing...' : 'Complete Review'}
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
                  disabled={isLoading}
                >
                  {isLoading ? 'Preparing...' : 'Start Knowledge Check'}
                </Button>
              </div>
            </Card>
          </div>
        )

      case 'reassessment_in_progress':
        if (!reassessmentData) {
          return (
            <Alert variant="error">
              <p>Knowledge check data not available. Please try again.</p>
              <Button variant="outline" onClick={handleRefresh} className="mt-2">
                Refresh
              </Button>
            </Alert>
          )
        }
        return (
          <ReassessmentKnowledgeCheck
            question={reassessmentData.question}
            onSubmit={handleSubmitAnswer}
            isLoading={isLoading}
          />
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
          <RemediationOutcome
            isCorrect={outcome?.isCorrect ?? false}
            outcome={outcome?.outcome ?? ''}
            studentState={studentState}
            onTryAgain={undefined}
            onRefresh={handleRefresh}
          />
        )

      default:
        return (
          <Alert variant="info">
            <p>Loading your remediation experience...</p>
          </Alert>
        )
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error">
          <p className="font-medium">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError(null)}
            className="mt-2"
          >
            Dismiss
          </Button>
        </Alert>
      )}

      {renderContent()}
    </div>
  )
}

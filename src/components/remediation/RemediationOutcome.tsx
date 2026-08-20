'use client'

/**
 * Phase 6C-3 — Remediation Outcome
 *
 * Displays the outcome of a reassessment or terminal cycle state.
 * Uses student-friendly language. Never exposes internal detection-state terminology.
 */

import { Button, Card, Badge } from '@/components/ui'
import { CheckCircle, AlertCircle, BookOpen, RefreshCw } from 'lucide-react'
import type { StudentRemediationState } from '@/lib/remediation/student-service'
import { STUDENT_STATE_LABELS, STUDENT_STATE_DESCRIPTIONS } from '@/lib/remediation/student-service'

interface RemediationOutcomeProps {
  isCorrect: boolean
  outcome: string
  studentState: StudentRemediationState
  onTryAgain?: () => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

export default function RemediationOutcome({
  isCorrect,
  outcome,
  studentState,
  onTryAgain,
  onRefresh,
  isRefreshing = false,
}: RemediationOutcomeProps) {
  const renderIcon = () => {
    switch (studentState) {
      case 'successful':
        return <CheckCircle className="w-12 h-12 text-green-500" aria-hidden="true" />
      case 'unsuccessful':
        return <AlertCircle className="w-12 h-12 text-orange-500" aria-hidden="true" />
      case 'pool_exhausted':
        return <BookOpen className="w-12 h-12 text-blue-500" aria-hidden="true" />
      case 'pending_more_evidence':
        return <RefreshCw className="w-12 h-12 text-blue-500" aria-hidden="true" />
      default:
        return <CheckCircle className="w-12 h-12 text-green-500" aria-hidden="true" />
    }
  }

  const renderBadge = () => {
    switch (studentState) {
      case 'successful':
        return <Badge variant="success" size="lg">Strong Understanding</Badge>
      case 'unsuccessful':
        return <Badge variant="warning" size="lg">Additional Support</Badge>
      case 'pool_exhausted':
        return <Badge variant="info" size="lg">Practice Complete</Badge>
      case 'pending_more_evidence':
        return <Badge variant="info" size="lg">Keep Practicing</Badge>
      default:
        return <Badge variant="info" size="lg">{STUDENT_STATE_LABELS[studentState]}</Badge>
    }
  }

  const renderMessage = () => {
    switch (studentState) {
      case 'successful':
        return (
          <div className="space-y-2">
            <p className="text-white text-lg">
              You have demonstrated strong understanding of this topic.
            </p>
            <p className="text-silver">
              Your knowledge check answer was {isCorrect ? 'correct' : 'incorrect'}, and your overall progress shows mastery.
              Well done!
            </p>
          </div>
        )
      case 'unsuccessful':
        return (
          <div className="space-y-2">
            <p className="text-white text-lg">
              Your instructor will provide additional support for this topic.
            </p>
            <p className="text-silver">
              This is a normal part of learning. Your instructor has been notified and will help you strengthen your understanding.
            </p>
          </div>
        )
      case 'pool_exhausted':
        return (
          <div className="space-y-2">
            <p className="text-white text-lg">
              You have completed all available practice questions for this topic.
            </p>
            <p className="text-silver">
              Your instructor has been notified and will provide additional guidance.
              You can continue reviewing the study materials.
            </p>
          </div>
        )
      case 'pending_more_evidence':
        return (
          <div className="space-y-2">
            <p className="text-white text-lg">
              You are building your foundation. Keep practicing!
            </p>
            <p className="text-silver">
              Your answer was {isCorrect ? 'correct' : 'incorrect'}.
              Continue reviewing the materials and try another knowledge check when you are ready.
            </p>
          </div>
        )
      default:
        return (
          <p className="text-silver">
            {STUDENT_STATE_DESCRIPTIONS[studentState]}
          </p>
        )
    }
  }

  return (
    <Card className="p-8">
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          {renderIcon()}
        </div>

        {/* Badge */}
        <div className="flex justify-center">
          {renderBadge()}
        </div>

        {/* Message */}
        {renderMessage()}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          {studentState === 'pending_more_evidence' && onTryAgain && (
            <Button
              variant="primary"
              onClick={onTryAgain}
              disabled={isRefreshing}
            >
              <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
              Try Another Knowledge Check
            </Button>
          )}
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              loading={isRefreshing}
            >
              Return to Dashboard
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

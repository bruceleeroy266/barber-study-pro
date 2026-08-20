'use client'

/**
 * Phase 6C-3 — Remediation Flashcard Review
 *
 * Concept-targeted flashcard review experience.
 * Thin wrapper around existing FlashcardClient patterns.
 * Server-side event recording (not localStorage).
 */

import { useState } from 'react'
import type { Flashcard } from '@/types'
import { Button, Card, Badge, ProgressBar } from '@/components/ui'
import { CheckCircle, Circle, ChevronLeft, ChevronRight } from 'lucide-react'

interface RemediationFlashcardReviewProps {
  flashcards: Flashcard[]
  onFlashcardReviewed: (flashcardId: string) => void
  reviewedFlashcardIds: Set<string>
}

export default function RemediationFlashcardReview({
  flashcards,
  onFlashcardReviewed,
  reviewedFlashcardIds,
}: RemediationFlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = flashcards[currentIndex]
  const isReviewed = currentCard ? reviewedFlashcardIds.has(currentCard.id) : false
  const progress = flashcards.length > 0
    ? ((currentIndex + 1) / flashcards.length) * 100
    : 0

  const handleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleMarkReviewed = () => {
    if (currentCard && !isReviewed) {
      onFlashcardReviewed(currentCard.id)
    }
  }

  if (flashcards.length === 0) {
    return null
  }

  if (!currentCard) {
    return (
      <Card className="p-6">
        <p className="text-silver text-center">No flashcards available for this topic.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Flashcard Review
        </h2>
        <Badge variant="info">
          {reviewedFlashcardIds.size} of {flashcards.length} reviewed
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <ProgressBar
          value={progress}
          variant="default"
          size="md"
          showLabel={false}
          aria-label={`Flashcard progress: card ${currentIndex + 1} of ${flashcards.length}`}
        />
        <div className="text-center text-sm text-silver">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
      </div>

      {/* Flashcard */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Flashcard ${currentIndex + 1} of ${flashcards.length}. ${isFlipped ? 'Answer showing. Press Enter or Space to show question.' : 'Question showing. Press Enter or Space to show answer.'}`}
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleFlip()
          }
        }}
        className="relative h-64 md:h-80 cursor-pointer perspective-1000 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:ring-offset-2 focus:ring-offset-gray-900 rounded-xl"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl p-8 flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center">
              {isReviewed && (
                <div className="inline-flex items-center gap-1 px-2 py-1 mb-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-medium">
                  <CheckCircle className="w-3 h-3" aria-hidden="true" />
                  <span>Reviewed</span>
                </div>
              )}
              <p className="text-sm text-[var(--color-text-muted)] mb-4">Question</p>
              <p className="text-xl md:text-2xl text-white font-medium">{currentCard.front}</p>
              <p className="text-xs text-silver-gray mt-8">Click to flip</p>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-gold)]/10 to-graphite border border-[var(--color-brand-gold)]/30 rounded-xl p-8 flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-center">
              {isReviewed && (
                <div className="inline-flex items-center gap-1 px-2 py-1 mb-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-medium">
                  <CheckCircle className="w-3 h-3" aria-hidden="true" />
                  <span>Reviewed</span>
                </div>
              )}
              <p className="text-sm text-[var(--color-brand-gold)] mb-4">Answer</p>
              <p className="text-xl md:text-2xl text-white font-medium">{currentCard.back}</p>
              {currentCard.category && (
                <span className="inline-block mt-4 px-3 py-1 bg-[var(--color-border-secondary)] text-[var(--color-text-secondary)] text-xs rounded-full">
                  {currentCard.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          Previous
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
          {!isReviewed && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleMarkReviewed}
            >
              <CheckCircle className="w-4 h-4 mr-1" aria-hidden="true" />
              Mark as Reviewed
            </Button>
          )}
          {isReviewed && (
            <Badge variant="success" size="lg">
              ✓ Reviewed
            </Badge>
          )}
        </div>

        <Button
          variant="secondary"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="w-full sm:w-auto"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
        </Button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-silver-gray">
        Press spacebar to flip • Use arrow keys to navigate
      </p>
    </div>
  )
}

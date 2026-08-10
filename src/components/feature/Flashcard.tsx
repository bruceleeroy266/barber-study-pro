import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface FlashcardProps {
  front: string
  back: string
  hint?: string
  isFlipped?: boolean
  onFlip?: () => void
  onCorrect?: () => void
  onIncorrect?: () => void
  showActions?: boolean
  className?: string
}

/**
 * Flashcard Component
 * 
 * Interactive flashcard with flip animation and study actions.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <Flashcard
 *   front="What is the capital of France?"
 *   back="Paris"
 *   hint="It's known as the City of Light"
 *   isFlipped={isFlipped}
 *   onFlip={() => setIsFlipped(!isFlipped)}
 *   onCorrect={() => {}}
 *   onIncorrect={() => {}}
 *   showActions
 * />
 * ```
 */
export const Flashcard: React.FC<FlashcardProps> = ({
  front,
  back,
  hint,
  isFlipped = false,
  onFlip,
  onCorrect,
  onIncorrect,
  showActions = false,
  className,
}) => {
  return (
    <div className={cn('perspective-1000', className)}>
      <div
        className={cn(
          'relative w-full h-64 transition-transform duration-500 transform-style-3d cursor-pointer',
          isFlipped && 'rotate-y-180'
        )}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onFlip?.()
          }
        }}
        aria-label={isFlipped ? 'Show front' : 'Show back'}
      >
        {/* Front */}
        <Card
          variant="elevated"
          className={cn(
            'absolute inset-0 backface-hidden',
            isFlipped && 'invisible'
          )}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <div className="text-xs font-semibold text-[var(--color-brand-gold)] uppercase tracking-wide mb-4">
              Term
            </div>
            <p className="text-xl font-semibold text-white text-center">{front}</p>
            {hint && (
              <p className="text-sm text-silver-gray mt-4 text-center">
                💡 {hint}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          variant="elevated"
          className={cn(
            'absolute inset-0 backface-hidden rotate-y-180',
            !isFlipped && 'invisible'
          )}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <div className="text-xs font-semibold text-[var(--color-brand-gold)] uppercase tracking-wide mb-4">
              Definition
            </div>
            <p className="text-lg text-white text-center leading-relaxed">{back}</p>
          </CardContent>
        </Card>
      </div>

      {showActions && isFlipped && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={onIncorrect}
            className="flex-1 max-w-[200px]"
          >
            Need Review
          </Button>
          <Button
            variant="primary"
            onClick={onCorrect}
            className="flex-1 max-w-[200px]"
          >
            Got It Right
          </Button>
        </div>
      )}
    </div>
  )
}

export default Flashcard

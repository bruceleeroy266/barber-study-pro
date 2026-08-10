import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestionProps {
  question: string
  options: QuizOption[]
  selectedOption?: string
  correctOption?: string
  showFeedback?: boolean
  onSelect?: (optionId: string) => void
  questionNumber?: number
  totalQuestions?: number
  className?: string
}

/**
 * QuizQuestion Component
 * 
 * Display a quiz question with multiple choice options.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <QuizQuestion
 *   question="What is the capital of France?"
 *   options={[
 *     { id: 'a', text: 'London' },
 *     { id: 'b', text: 'Paris' },
 *     { id: 'c', text: 'Berlin' },
 *   ]}
 *   selectedOption={selected}
 *   correctOption="b"
 *   showFeedback={submitted}
 *   onSelect={setSelected}
 *   questionNumber={1}
 *   totalQuestions={10}
 * />
 * ```
 */
export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  selectedOption,
  correctOption,
  showFeedback = false,
  onSelect,
  questionNumber,
  totalQuestions,
  className,
}) => {
  const getOptionStyles = (optionId: string) => {
    if (!showFeedback) {
      return selectedOption === optionId
        ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
        : 'border-graphite hover:border-[var(--color-border-secondary)]'
    }

    if (optionId === correctOption) {
      return 'border-gold bg-gold/10'
    }

    if (selectedOption === optionId && optionId !== correctOption) {
      return 'border-silver bg-silver/10'
    }

    return 'border-graphite opacity-50'
  }

  const getOptionIcon = (optionId: string) => {
    if (!showFeedback) return null

    if (optionId === correctOption) {
      return (
        <Badge variant="success" size="sm">
          Correct
        </Badge>
      )
    }

    if (selectedOption === optionId && optionId !== correctOption) {
      return (
        <Badge variant="error" size="sm">
          Incorrect
        </Badge>
      )
    }

    return null
  }

  return (
    <Card variant="default" padding="lg" className={className}>
      <CardContent>
        {questionNumber && totalQuestions && (
          <div className="text-sm text-silver-gray mb-4">
            Question {questionNumber} of {totalQuestions}
          </div>
        )}
        <h3 className="text-xl font-semibold text-white mb-6">{question}</h3>
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => !showFeedback && onSelect?.(option.id)}
              disabled={showFeedback}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded-lg border-2 text-left transition-all',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]',
                'disabled:cursor-not-allowed',
                getOptionStyles(option.id)
              )}
              aria-pressed={selectedOption === option.id}
            >
              <span className="text-white">{option.text}</span>
              {getOptionIcon(option.id)}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuizQuestion

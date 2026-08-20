'use client'

/**
 * Phase 6C-3 — Reassessment Knowledge Check
 *
 * Single-question reassessment experience.
 * Presents one reserved question and collects the student's answer.
 * Does NOT imply that answering one question completes the entire cycle.
 */

import { useState } from 'react'
import { Button, Card, Alert } from '@/components/ui'

interface ReassessmentKnowledgeCheckProps {
  question: {
    id: string
    question: string
    answer_a: string
    answer_b: string
    answer_c: string
    answer_d: string
    explanation: string | null
  }
  onSubmit: (answer: string) => void
  isLoading: boolean
}

export default function ReassessmentKnowledgeCheck({
  question,
  onSubmit,
  isLoading,
}: ReassessmentKnowledgeCheckProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const options = [
    { key: 'a', label: 'A', text: question.answer_a },
    { key: 'b', label: 'B', text: question.answer_b },
    { key: 'c', label: 'C', text: question.answer_c },
    { key: 'd', label: 'D', text: question.answer_d },
  ]

  const handleSubmit = () => {
    if (selectedAnswer) {
      onSubmit(selectedAnswer)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            Knowledge Check
          </h2>
          <p className="text-silver text-sm mt-1">
            This is the question for your current attempt.
          </p>
        </div>

        {/* Question */}
        <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl p-6">
          <p className="text-lg text-white font-medium">
            {question.question}
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => setSelectedAnswer(option.key)}
              disabled={isLoading}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selectedAnswer === option.key
                  ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
                  : 'border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] hover:border-[var(--color-brand-gold)]/50'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedAnswer === option.key
                      ? 'bg-[var(--color-brand-gold)] text-black'
                      : 'bg-[var(--color-border-primary)] text-silver'
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-white">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedAnswer || isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Answer'}
          </Button>
        </div>

        {/* Info */}
        <Alert variant="info" className="text-sm">
          <p>
            Your answer will be recorded and reviewed. This knowledge check helps
            demonstrate your understanding of this topic.
          </p>
        </Alert>
      </div>
    </Card>
  )
}

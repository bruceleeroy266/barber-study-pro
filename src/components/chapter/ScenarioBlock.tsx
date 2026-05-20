'use client'

import { useState } from 'react'
import { MessageSquare, CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ScenarioOption {
  letter: string
  text: string
  feedback: string
}

interface Scenario {
  situation: string
  options: ScenarioOption[]
  correctAnswer: string
}

interface ScenarioBlockProps {
  scenarios: Scenario[]
  theme?: ChapterTheme
}

export default function ScenarioBlock({ scenarios, theme }: ScenarioBlockProps) {
  const t = theme || defaultTheme
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const selectAnswer = (scenarioIdx: number, letter: string) => {
    if (revealed.has(scenarioIdx)) return
    setSelectedAnswers(prev => ({ ...prev, [scenarioIdx]: letter }))
  }

  const revealAnswer = (scenarioIdx: number) => {
    setRevealed(prev => new Set(prev).add(scenarioIdx))
  }

  return (
    <div className="space-y-6">
      {scenarios.map((scenario, sIdx) => {
        const isRevealed = revealed.has(sIdx)
        const selected = selectedAnswers[sIdx]
        const isCorrect = selected === scenario.correctAnswer

        return (
          <div
            key={sIdx}
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: t.background,
              borderColor: t.border,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            {/* Situation Header */}
            <div
              className="p-5"
              style={{
                backgroundColor: `${t.primary}10`,
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" style={{ color: t.primary }} />
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: t.primary }}>
                  Real Shop Scenario
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: t.text }}>
                {scenario.situation}
              </p>
            </div>

            {/* Options */}
            <div className="p-5">
              <div className="space-y-2 mb-4">
                {scenario.options.map((option) => {
                  const isSelected = selected === option.letter
                  const isCorrectOption = option.letter === scenario.correctAnswer
                  let borderColor = t.border
                  let bgColor = t.backgroundAlt

                  if (isRevealed) {
                    if (isCorrectOption) {
                      borderColor = '#10B981'
                      bgColor = 'rgba(16, 185, 129, 0.1)'
                    } else if (isSelected && !isCorrectOption) {
                      borderColor = '#EF4444'
                      bgColor = 'rgba(239, 68, 68, 0.1)'
                    }
                  } else if (isSelected) {
                    borderColor = t.primary
                    bgColor = `${t.primary}15`
                  }

                  return (
                    <button
                      key={option.letter}
                      onClick={() => selectAnswer(sIdx, option.letter)}
                      className="w-full text-left rounded-lg p-3 transition-all text-sm flex items-center gap-3"
                      style={{
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        cursor: isRevealed ? 'default' : 'pointer',
                      }}
                    >
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          backgroundColor: isSelected ? t.primary : t.background,
                          color: isSelected ? '#fff' : t.textMuted,
                        }}
                      >
                        {option.letter}
                      </span>
                      <span style={{ color: t.text }}>{option.text}</span>
                      {isRevealed && isCorrectOption && (
                        <CheckCircle className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: '#10B981' }} />
                      )}
                      {isRevealed && isSelected && !isCorrectOption && (
                        <XCircle className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: '#EF4444' }} />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Reveal Button */}
              {!isRevealed && (
                <button
                  onClick={() => revealAnswer(sIdx)}
                  disabled={selected === undefined}
                  className="w-full rounded-lg py-2.5 text-sm font-semibold transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: selected !== undefined ? t.primary : t.backgroundAlt,
                    color: selected !== undefined ? '#fff' : t.textMuted,
                  }}
                >
                  Check Answer
                </button>
              )}

              {/* Feedback */}
              {isRevealed && selected && (
                <div
                  className="rounded-lg p-4 mt-3"
                  style={{
                    backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 166, 35, 0.1)',
                    borderLeft: `3px solid ${isCorrect ? '#10B981' : '#F59E0B'}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4" style={{ color: isCorrect ? '#10B981' : '#F59E0B' }} />
                    <span className="text-xs font-bold uppercase" style={{ color: isCorrect ? '#10B981' : '#F59E0B' }}>
                      {isCorrect ? 'Correct! Well done!' : 'Not quite — here\'s why:'}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: t.textMuted }}>
                    {scenario.options.find(o => o.letter === selected)?.feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

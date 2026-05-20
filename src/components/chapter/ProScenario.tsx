'use client'

import { useState } from 'react'
import { MessageSquare, CheckCircle, XCircle, Award, ChevronRight } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ProScenarioOption {
  letter: string
  text: string
  feedback: string
  isPremium?: boolean
}

interface ProScenarioItem {
  situation: string
  context?: string
  options: ProScenarioOption[]
  correctAnswer: string
  proTip: string
}

interface ProScenarioProps {
  scenarios: ProScenarioItem[]
  theme?: ChapterTheme
}

export default function ProScenario({ scenarios, theme }: ProScenarioProps) {
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
            className="rounded-xl overflow-hidden backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${t.background}, ${t.backgroundAlt})`,
              borderColor: t.border,
              borderWidth: '1px',
              borderStyle: 'solid',
              boxShadow: `0 4px 24px rgba(0,0,0,0.15)`,
            }}
          >
            {/* Situation Header — Premium glassmorphism */}
            <div
              className="p-6"
              style={{
                background: `linear-gradient(135deg, ${t.primary}12, ${t.primary}05)`,
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${t.primary}20` }}
                >
                  <MessageSquare className="w-4 h-4" style={{ color: t.primary }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.primary }}>
                  Professional Scenario
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed" style={{ color: t.text }}>
                {scenario.situation}
              </p>
              {scenario.context && (
                <p className="text-xs mt-2 italic" style={{ color: t.textMuted }}>
                  {scenario.context}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="p-6">
              <div className="space-y-3 mb-5">
                {scenario.options.map((option) => {
                  const isSelected = selected === option.letter
                  const isCorrectOption = option.letter === scenario.correctAnswer
                  let borderColor = t.border
                  let bgColor = t.backgroundAlt
                  let glowEffect = 'none'

                  if (isRevealed) {
                    if (isCorrectOption) {
                      borderColor = '#10B981'
                      bgColor = 'rgba(16, 185, 129, 0.08)'
                      glowEffect = '0 0 20px rgba(16, 185, 129, 0.15)'
                    } else if (isSelected && !isCorrectOption) {
                      borderColor = '#EF4444'
                      bgColor = 'rgba(239, 68, 68, 0.06)'
                    }
                  } else if (isSelected) {
                    borderColor = t.primary
                    bgColor = `${t.primary}12`
                    glowEffect = `0 0 16px ${t.primary}20`
                  }

                  return (
                    <button
                      key={option.letter}
                      onClick={() => selectAnswer(sIdx, option.letter)}
                      className="w-full text-left rounded-lg p-4 transition-all duration-300 text-sm flex items-start gap-4 group"
                      style={{
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        cursor: isRevealed ? 'default' : 'pointer',
                        boxShadow: glowEffect,
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-all"
                        style={{
                          backgroundColor: isSelected ? t.primary : `${t.primary}15`,
                          color: isSelected ? '#fff' : t.primary,
                          border: `1px solid ${isSelected ? t.primary : `${t.primary}30`}`,
                        }}
                      >
                        {option.letter}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span style={{ color: t.text }}>{option.text}</span>
                        {isRevealed && option.isPremium && (
                          <span
                            className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                            style={{
                              backgroundColor: `${t.primary}20`,
                              color: t.primary,
                            }}
                          >
                            <Award className="w-3 h-3" />
                            Elite Response
                          </span>
                        )}
                      </div>
                      {isRevealed && isCorrectOption && (
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                      )}
                      {isRevealed && isSelected && !isCorrectOption && (
                        <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                      )}
                      {!isRevealed && (
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.primary }} />
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
                  className="w-full rounded-lg py-3 text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: selected !== undefined
                      ? `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`
                      : t.backgroundAlt,
                    color: selected !== undefined ? '#fff' : t.textMuted,
                    boxShadow: selected !== undefined ? `0 4px 16px ${t.primary}30` : 'none',
                  }}
                >
                  Reveal Professional Response
                </button>
              )}

              {/* Feedback + Pro Tip */}
              {isRevealed && selected && (
                <div className="space-y-3">
                  <div
                    className="rounded-lg p-4"
                    style={{
                      backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 166, 35, 0.08)',
                      borderLeft: `3px solid ${isCorrect ? '#10B981' : '#F59E0B'}`,
                    }}
                  >
                    <p className="text-sm" style={{ color: t.textMuted }}>
                      {scenario.options.find(o => o.letter === selected)?.feedback}
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-4 flex items-start gap-3"
                    style={{
                      backgroundColor: `${t.primary}08`,
                      border: `1px solid ${t.border}`,
                    }}
                  >
                    <Award className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: t.primary }} />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: t.primary }}>
                        Luxury Standard
                      </span>
                      <p className="text-sm mt-1" style={{ color: t.textMuted }}>
                        {scenario.proTip}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

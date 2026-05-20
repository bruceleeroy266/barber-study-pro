'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { MessageSquare, CheckCircle, XCircle, Lightbulb, Timer, AlertTriangle } from 'lucide-react'
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
  timeLimit?: number
}

interface ScenarioBlockProps {
  scenarios: Scenario[]
  theme?: ChapterTheme
}

export default function ScenarioBlock({ scenarios, theme }: ScenarioBlockProps) {
  const t = theme || defaultTheme
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState<Record<number, number>>({})
  const [timerExpired, setTimerExpired] = useState<Set<number>>(new Set())
  const intervalRefs = useRef<Record<number, NodeJS.Timeout>>({})

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval)
    }
  }, [])

  const startTimer = useCallback((scenarioIdx: number, seconds: number) => {
    // Clear any existing timer for this scenario
    if (intervalRefs.current[scenarioIdx]) {
      clearInterval(intervalRefs.current[scenarioIdx])
    }

    setTimeLeft(prev => ({ ...prev, [scenarioIdx]: seconds }))
    setTimerExpired(prev => {
      const next = new Set(prev)
      next.delete(scenarioIdx)
      return next
    })

    intervalRefs.current[scenarioIdx] = setInterval(() => {
      setTimeLeft(prev => {
        const current = prev[scenarioIdx] ?? 0
        if (current <= 1) {
          // Timer expired
          clearInterval(intervalRefs.current[scenarioIdx])
          delete intervalRefs.current[scenarioIdx]
          setTimerExpired(expired => new Set(expired).add(scenarioIdx))
          setRevealed(rev => new Set(rev).add(scenarioIdx))
          return { ...prev, [scenarioIdx]: 0 }
        }
        return { ...prev, [scenarioIdx]: current - 1 }
      })
    }, 1000)
  }, [])

  const selectAnswer = (scenarioIdx: number, letter: string) => {
    if (revealed.has(scenarioIdx)) return
    setSelectedAnswers(prev => ({ ...prev, [scenarioIdx]: letter }))
  }

  const revealAnswer = (scenarioIdx: number) => {
    // Stop timer if running
    if (intervalRefs.current[scenarioIdx]) {
      clearInterval(intervalRefs.current[scenarioIdx])
      delete intervalRefs.current[scenarioIdx]
    }
    setRevealed(prev => new Set(prev).add(scenarioIdx))
  }

  const resetScenario = (scenarioIdx: number) => {
    // Clear timer
    if (intervalRefs.current[scenarioIdx]) {
      clearInterval(intervalRefs.current[scenarioIdx])
      delete intervalRefs.current[scenarioIdx]
    }
    setSelectedAnswers(prev => {
      const next = { ...prev }
      delete next[scenarioIdx]
      return next
    })
    setRevealed(prev => {
      const next = new Set(prev)
      next.delete(scenarioIdx)
      return next
    })
    setTimerExpired(prev => {
      const next = new Set(prev)
      next.delete(scenarioIdx)
      return next
    })
    setTimeLeft(prev => {
      const next = { ...prev }
      delete next[scenarioIdx]
      return next
    })

    // Restart timer if scenario has timeLimit
    const scenario = scenarios[scenarioIdx]
    if (scenario?.timeLimit && scenario.timeLimit > 0) {
      startTimer(scenarioIdx, scenario.timeLimit)
    }
  }

  // Auto-start timers for scenarios with timeLimit when not yet started
  useEffect(() => {
    scenarios.forEach((scenario, idx) => {
      if (scenario.timeLimit && scenario.timeLimit > 0 && !revealed.has(idx) && timeLeft[idx] === undefined) {
        startTimer(idx, scenario.timeLimit)
      }
    })
  }, [scenarios, revealed, timeLeft, startTimer])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {scenarios.map((scenario, sIdx) => {
        const isRevealed = revealed.has(sIdx)
        const selected = selectedAnswers[sIdx]
        const isCorrect = selected === scenario.correctAnswer
        const isExpired = timerExpired.has(sIdx)
        const currentTimeLeft = timeLeft[sIdx]
        const hasTimer = scenario.timeLimit && scenario.timeLimit > 0
        const isUrgent = hasTimer && currentTimeLeft !== undefined && currentTimeLeft <= 10 && !isRevealed

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
                {hasTimer && !isRevealed && (
                  <div
                    className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(8, 145, 178, 0.15)',
                      color: isUrgent ? '#EF4444' : t.primaryLight,
                      border: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.3)' : t.border}`,
                    }}
                  >
                    <Timer className="w-3 h-3" />
                    {formatTime(currentTimeLeft ?? scenario.timeLimit!)}
                  </div>
                )}
                {hasTimer && isRevealed && (
                  <div
                    className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: isExpired ? '#EF4444' : '#10B981',
                      border: `1px solid ${isExpired ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                    }}
                  >
                    <Timer className="w-3 h-3" />
                    {isExpired ? 'TIME EXPIRED' : 'COMPLETED'}
                  </div>
                )}
              </div>
              <p className="text-sm font-medium" style={{ color: t.text }}>
                {scenario.situation}
              </p>
            </div>

            {/* Options */}
            <div className="p-5">
              {/* Timer Expired Warning */}
              {isExpired && (
                <div
                  className="rounded-lg p-4 mb-4"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: '#EF4444' }} />
                    <span className="text-xs font-bold uppercase" style={{ color: '#EF4444' }}>
                      Time Expired — Safety Response Required
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: t.textMuted }}>
                    In a real emergency, every second counts. You must act within 60 seconds to prevent bloodborne pathogen exposure. Review the correct response below.
                  </p>
                </div>
              )}

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

              {/* Reset Button (shown after reveal) */}
              {isRevealed && (
                <button
                  onClick={() => resetScenario(sIdx)}
                  className="w-full mt-4 rounded-lg py-2 text-sm font-medium transition-all"
                  style={{
                    backgroundColor: 'transparent',
                    color: t.primaryLight,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

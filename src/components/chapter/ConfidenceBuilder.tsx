'use client'

import { useState } from 'react'
import { Shield, CheckCircle2, Circle, Star, Sparkles } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ConfidenceCard {
  situation: string
  question: string
  responses: {
    text: string
    isProfessional: boolean
    feedback: string
  }[]
  insight: string
}

interface ConfidenceBuilderProps {
  cards: ConfidenceCard[]
  theme?: ChapterTheme
}

export default function ConfidenceBuilder({ cards, theme }: ConfidenceBuilderProps) {
  const t = theme || defaultTheme
  const [selectedResponses, setSelectedResponses] = useState<Record<number, number>>({})
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const selectResponse = (cardIdx: number, responseIdx: number) => {
    if (revealed.has(cardIdx)) return
    setSelectedResponses(prev => ({ ...prev, [cardIdx]: responseIdx }))
  }

  const revealCard = (cardIdx: number) => {
    setRevealed(prev => new Set(prev).add(cardIdx))
  }

  return (
    <div className="space-y-6">
      {cards.map((card, cIdx) => {
        const isRevealed = revealed.has(cIdx)
        const selected = selectedResponses[cIdx]
        const selectedResponse = selected !== undefined ? card.responses[selected] : null

        return (
          <div
            key={cIdx}
            className="rounded-xl overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${t.background}, ${t.backgroundAlt})`,
              borderColor: t.border,
              borderWidth: '1px',
              borderStyle: 'solid',
              boxShadow: `0 8px 32px rgba(0,0,0,0.12)`,
            }}
          >
            {/* Header */}
            <div
              className="p-5"
              style={{
                background: `linear-gradient(135deg, ${t.primary}10, ${t.primary}03)`,
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" style={{ color: t.primary }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.primary }}>
                  Confidence Builder
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: t.text }}>
                {card.situation}
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color: t.textMuted }}>
                {card.question}
              </p>
            </div>

            {/* Response Options */}
            <div className="p-5 space-y-3">
              {card.responses.map((response, rIdx) => {
                const isSelected = selected === rIdx
                const showCorrect = isRevealed && response.isProfessional
                const showIncorrect = isRevealed && isSelected && !response.isProfessional

                let borderColor = t.border
                let bgColor = t.backgroundAlt

                if (showCorrect) {
                  borderColor = 'rgba(16, 185, 129, 0.4)'
                  bgColor = 'rgba(16, 185, 129, 0.06)'
                } else if (showIncorrect) {
                  borderColor = 'rgba(239, 68, 68, 0.3)'
                  bgColor = 'rgba(239, 68, 68, 0.05)'
                } else if (isSelected && !isRevealed) {
                  borderColor = t.primary
                  bgColor = `${t.primary}10`
                }

                return (
                  <button
                    key={rIdx}
                    onClick={() => selectResponse(cIdx, rIdx)}
                    disabled={isRevealed}
                    className="w-full text-left rounded-lg p-4 transition-all duration-300 text-sm flex items-start gap-3"
                    style={{
                      backgroundColor: bgColor,
                      borderColor: borderColor,
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      cursor: isRevealed ? 'default' : 'pointer',
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {isRevealed && response.isProfessional ? (
                        <Star className="w-5 h-5" style={{ color: '#F59E0B' }} />
                      ) : isSelected ? (
                        <CheckCircle2 className="w-5 h-5" style={{ color: t.primary }} />
                      ) : (
                        <Circle className="w-5 h-5" style={{ color: `${t.primary}40` }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <span style={{ color: t.text }}>{response.text}</span>
                      {isRevealed && (
                        <p className="text-xs mt-2 italic" style={{ color: response.isProfessional ? '#10B981' : '#EF4444' }}>
                          {response.feedback}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}

              {/* Reveal Button */}
              {!isRevealed && (
                <button
                  onClick={() => revealCard(cIdx)}
                  disabled={selected === undefined}
                  className="w-full rounded-lg py-2.5 text-sm font-semibold transition-all disabled:opacity-40 mt-2"
                  style={{
                    background: selected !== undefined
                      ? `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`
                      : t.backgroundAlt,
                    color: selected !== undefined ? '#fff' : t.textMuted,
                  }}
                >
                  Check Your Instinct
                </button>
              )}

              {/* Insight */}
              {isRevealed && (
                <div
                  className="rounded-lg p-4 mt-3 flex items-start gap-3"
                  style={{
                    backgroundColor: `${t.primary}08`,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: t.primary }} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: t.primary }}>
                      Professional Insight
                    </span>
                    <p className="text-sm mt-1" style={{ color: t.textMuted }}>
                      {card.insight}
                    </p>
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

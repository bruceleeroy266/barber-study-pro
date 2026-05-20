'use client'

import { useState } from 'react'
import { Crown, CheckCircle, Lock, ChevronRight, Star } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ProLevel {
  level: string
  title: string
  description: string
  standards: string[]
  reward: string
}

interface ProLevelSystemProps {
  levels: ProLevel[]
  theme?: ChapterTheme
}

export default function ProLevelSystem({ levels, theme }: ProLevelSystemProps) {
  const t = theme || defaultTheme
  const [expandedLevel, setExpandedLevel] = useState<number | null>(0)

  return (
    <div className="space-y-4">
      {levels.map((level, idx) => {
        const isExpanded = expandedLevel === idx
        const isCompleted = idx < (expandedLevel ?? -1)

        return (
          <div
            key={idx}
            className="rounded-xl overflow-hidden transition-all duration-500"
            style={{
              background: isExpanded
                ? `linear-gradient(145deg, ${t.background}, ${t.backgroundAlt})`
                : `linear-gradient(145deg, ${t.backgroundAlt}, ${t.surface})`,
              borderColor: isExpanded ? t.primary : t.border,
              borderWidth: '1px',
              borderStyle: 'solid',
              boxShadow: isExpanded ? `0 8px 32px ${t.primary}15` : '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            {/* Level Header — Always visible */}
            <button
              onClick={() => setExpandedLevel(isExpanded ? null : idx)}
              className="w-full p-5 flex items-center gap-4 text-left transition-all"
            >
              {/* Level Badge */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: isCompleted
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : isExpanded
                      ? `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`
                      : `${t.primary}15`,
                  boxShadow: isExpanded ? `0 4px 16px ${t.primary}30` : 'none',
                }}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Crown className="w-6 h-6" style={{ color: isExpanded ? '#fff' : t.primary }} />
                )}
              </div>

              {/* Level Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: isExpanded ? t.primary : t.textMuted }}
                  >
                    {level.level}
                  </span>
                  {isCompleted && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 text-green-400">
                      Achieved
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold mt-0.5" style={{ color: t.text }}>
                  {level.title}
                </p>
              </div>

              {/* Expand Icon */}
              <ChevronRight
                className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                style={{
                  color: t.primary,
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div
                className="px-5 pb-5 pt-2"
                style={{ borderTop: `1px solid ${t.border}` }}
              >
                <p className="text-sm mb-4 leading-relaxed" style={{ color: t.textMuted }}>
                  {level.description}
                </p>

                {/* Standards List */}
                <div className="space-y-2 mb-4">
                  {level.standards.map((standard, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-start gap-3 p-3 rounded-lg"
                      style={{
                        backgroundColor: `${t.primary}08`,
                        border: `1px solid ${t.border}`,
                      }}
                    >
                      <Star className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: t.primary }} />
                      <span className="text-sm" style={{ color: t.text }}>
                        {standard}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Reward */}
                <div
                  className="rounded-lg p-4 flex items-center gap-3"
                  style={{
                    background: `linear-gradient(135deg, ${t.primary}12, ${t.primary}05)`,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${t.primary}20` }}
                  >
                    <Star className="w-4 h-4" style={{ color: t.primary }} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: t.primary }}>
                      Achievement Unlocked
                    </span>
                    <p className="text-sm font-medium" style={{ color: t.text }}>
                      {level.reward}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

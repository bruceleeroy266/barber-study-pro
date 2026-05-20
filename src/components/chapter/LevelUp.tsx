'use client'

import { Trophy, Star, Crown, ArrowRight } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface Level {
  level: string
  title: string
  description: string
  reward: string
}

interface LevelUpProps {
  levels: Level[]
  theme?: ChapterTheme
}

const levelIcons = [Star, Trophy, Crown]
const levelColors = ['#00D4FF', '#FFD700', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function LevelUp({ levels, theme }: LevelUpProps) {
  const t = theme || defaultTheme

  return (
    <div className="space-y-4">
      {levels.map((level, idx) => {
        const Icon = levelIcons[idx % levelIcons.length]
        const color = levelColors[idx % levelColors.length]

        return (
          <div
            key={idx}
            className="rounded-xl p-5 transition-all duration-300 hover:translate-x-1"
            style={{
              backgroundColor: t.background,
              borderColor: t.border,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="flex items-start gap-4">
              {/* Level Badge */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${color}20`,
                  borderColor: `${color}40`,
                  borderWidth: '2px',
                  borderStyle: 'solid',
                }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                    }}
                  >
                    {level.level}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-1" style={{ color: t.text }}>
                  {level.title}
                </h3>
                <p className="text-sm mb-2" style={{ color: t.textMuted }}>
                  {level.description}
                </p>

                {/* Reward */}
                <div
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                  style={{
                    backgroundColor: `${color}15`,
                    borderColor: `${color}30`,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  <ArrowRight className="w-3 h-3" style={{ color }} />
                  <span className="text-xs font-semibold" style={{ color }}>
                    {level.reward}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

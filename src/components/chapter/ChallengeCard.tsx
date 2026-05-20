'use client'

import { useState } from 'react'
import { Zap, Trophy, Flame, CheckCircle } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface Challenge {
  badge: string
  title: string
  description: string
  action: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface ChallengeCardProps {
  challenges: Challenge[]
  theme?: ChapterTheme
}

const difficultyConfig = {
  easy: { color: '#10B981', icon: Zap, label: 'Easy XP' },
  medium: { color: '#F59E0B', icon: Flame, label: 'Medium XP' },
  hard: { color: '#EF4444', icon: Trophy, label: 'Hard XP' },
}

export default function ChallengeCard({ challenges, theme }: ChallengeCardProps) {
  const t = theme || defaultTheme
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  const toggleComplete = (idx: number) => {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {challenges.map((challenge, idx) => {
        const config = difficultyConfig[challenge.difficulty]
        const DiffIcon = config.icon
        const isCompleted = completed.has(idx)

        return (
          <div
            key={idx}
            className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            style={{
              backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' : t.background,
              borderColor: isCompleted ? 'rgba(16, 185, 129, 0.4)' : t.border,
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
            onClick={() => toggleComplete(idx)}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                style={{
                  backgroundColor: `${config.color}20`,
                  color: config.color,
                }}
              >
                {challenge.badge}
              </div>
              <div className="flex items-center gap-1">
                <DiffIcon className="w-3 h-3" style={{ color: config.color }} />
                <span className="text-xs font-medium" style={{ color: config.color }}>
                  {config.label}
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold mb-2" style={{ color: t.text }}>
              {challenge.title}
            </h3>
            <p className="text-sm mb-3" style={{ color: t.textMuted }}>
              {challenge.description}
            </p>

            <div
              className="rounded-lg p-3 mb-3"
              style={{
                backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : `${t.primary}15`,
                borderLeft: `3px solid ${isCompleted ? '#10B981' : t.primary}`,
              }}
            >
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: isCompleted ? '#10B981' : t.primary }}>
                Action
              </span>
              <p className="text-sm mt-1 font-medium" style={{ color: t.text }}>
                {challenge.action}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: isCompleted ? '#10B981' : 'transparent',
                  borderColor: isCompleted ? '#10B981' : t.border,
                  borderWidth: '2px',
                  borderStyle: 'solid',
                }}
              >
                {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className="text-xs font-medium" style={{ color: isCompleted ? '#10B981' : t.textMuted }}>
                {isCompleted ? 'Completed! +' + (challenge.difficulty === 'easy' ? '50' : challenge.difficulty === 'medium' ? '100' : '200') + ' XP' : 'Tap to complete'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

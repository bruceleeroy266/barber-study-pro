'use client'

import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ChapterHeaderProps {
  num: number
  title: string
  description: string
  flashcardsCount: number
  questionsCount: number
  bestAttempt: { percentage: number } | null
  theme?: ChapterTheme
}

export default function ChapterHeader({
  num,
  title,
  description,
  flashcardsCount,
  questionsCount,
  bestAttempt,
  theme,
}: ChapterHeaderProps) {
  const t = theme || defaultTheme

  return (
    <div
      className="rounded-2xl p-8 relative overflow-hidden"
      style={{
        backgroundColor: t.surface,
        borderColor: t.border,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      {/* Decorative background accent */}
      <div
        className="absolute top-0 right-0 w-64 h-64 opacity-5 rounded-full blur-3xl"
        style={{ backgroundColor: t.primary }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <span
            className="text-5xl font-bold"
            style={{ color: t.primary }}
          >
            {String(num).padStart(2, '0')}
          </span>
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: t.text }}
            >
              {title}
            </h1>
            <p className="mt-1" style={{ color: t.textMuted }}>
              {description}
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6"
          style={{ borderTopColor: t.border, borderTopWidth: '1px', borderTopStyle: 'solid' }}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">📖</div>
            <div>
              <div className="text-sm" style={{ color: t.textMuted }}>Flashcards</div>
              <div className="font-semibold" style={{ color: t.text }}>
                {flashcardsCount} cards
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl">✅</div>
            <div>
              <div className="text-sm" style={{ color: t.textMuted }}>Quiz Questions</div>
              <div className="font-semibold" style={{ color: t.text }}>
                {questionsCount} questions
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏆</div>
            <div>
              <div className="text-sm" style={{ color: t.textMuted }}>Best Score</div>
              <div className="font-semibold" style={{ color: t.text }}>
                {bestAttempt ? `${bestAttempt.percentage}%` : 'Not taken'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

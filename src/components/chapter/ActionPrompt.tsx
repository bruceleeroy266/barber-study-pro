'use client'

import { useState } from 'react'
import { Clock, CheckCircle2, Circle } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface Prompt {
  action: string
  description: string
  benefit: string
  timeframe: string
}

interface ActionPromptProps {
  prompts: Prompt[]
  theme?: ChapterTheme
}

export default function ActionPrompt({ prompts, theme }: ActionPromptProps) {
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
      {prompts.map((prompt, idx) => {
        const isCompleted = completed.has(idx)

        return (
          <div
            key={idx}
            className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            style={{
              backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.08)' : t.background,
              borderColor: isCompleted ? 'rgba(16, 185, 129, 0.3)' : t.border,
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
            onClick={() => toggleComplete(idx)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
                ) : (
                  <Circle className="w-5 h-5" style={{ color: t.primary }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold mb-1 ${isCompleted ? 'line-through' : ''}`}
                  style={{
                    color: isCompleted ? '#10B981' : t.text,
                  }}
                >
                  {prompt.action}
                </p>

                <p className="text-xs mb-2" style={{ color: t.textMuted }}>
                  {prompt.description}
                </p>

                <div
                  className="rounded-lg p-2.5 mb-2"
                  style={{
                    backgroundColor: `${t.primary}10`,
                    borderLeft: `3px solid ${t.primary}`,
                  }}
                >
                  <p className="text-xs" style={{ color: t.textMuted }}>
                    {prompt.benefit}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" style={{ color: t.primary }} />
                  <span className="text-xs font-medium" style={{ color: t.primary }}>
                    {prompt.timeframe}
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

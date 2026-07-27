'use client'

import { useState } from 'react'
import { MessageSquare, Send, RotateCcw } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ReflectionQuestion {
  question: string
  placeholder: string
  insight: string
}

interface ReflectionBlockProps {
  questions: ReflectionQuestion[]
  theme?: ChapterTheme
}

export default function ReflectionBlock({ questions, theme }: ReflectionBlockProps) {
  const t = theme || defaultTheme
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState<Set<number>>(new Set())

  const handleSubmit = (idx: number) => {
    if (!responses[idx]?.trim()) return
    setSubmitted(prev => new Set(prev).add(idx))
  }

  const handleReset = (idx: number) => {
    setSubmitted(prev => {
      const next = new Set(prev)
      next.delete(idx)
      return next
    })
    setResponses(prev => ({ ...prev, [idx]: '' }))
  }

  return (
    <div className="space-y-6">
      {questions.map((q, idx) => {
        const isSubmitted = submitted.has(idx)
        const hasResponse = !!responses[idx]?.trim()

        return (
          <div
            key={idx}
            className="rounded-xl overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${t.background}, ${t.backgroundAlt})`,
              borderColor: isSubmitted ? `${t.primary}40` : t.border,
              borderWidth: '2px',
              borderStyle: 'solid',
              boxShadow: isSubmitted ? `0 4px 20px ${t.primary}10` : '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            {/* Question Header */}
            <div
              className="p-5"
              style={{
                background: `linear-gradient(135deg, ${t.primary}08, ${t.primary}02)`,
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" style={{ color: t.primary }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.primary }}>
                  Professional Reflection
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: t.text }}>
                {q.question}
              </p>
            </div>

            {/* Response Area */}
            <div className="p-5">
              {!isSubmitted ? (
                <>
                  <textarea
                    value={responses[idx] || ''}
                    onChange={(e) => setResponses(prev => ({ ...prev, [idx]: e.target.value }))}
                    placeholder={q.placeholder}
                    rows={3}
                    className="w-full rounded-lg p-3 text-sm resize-none transition-all focus:outline-none"
                    style={{
                      backgroundColor: t.backgroundAlt,
                      borderColor: `${t.primary}30`,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: t.text,
                    }}
                  />
                  <button
                    onClick={() => handleSubmit(idx)}
                    disabled={!hasResponse}
                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
                    style={{
                      background: hasResponse
                        ? `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`
                        : t.backgroundAlt,
                      color: hasResponse ? '#fff' : t.textMuted,
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Reflect & Reveal
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div
                    className="rounded-lg p-4"
                    style={{
                      backgroundColor: `${t.primary}06`,
                      border: `1px solid ${t.border}`,
                    }}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: t.primary }}>
                      Your Response
                    </p>
                    <p className="text-sm italic" style={{ color: t.text }}>
                      &quot;{responses[idx]}&quot;
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.06)',
                      borderLeft: `3px solid #10B981`,
                    }}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#10B981' }}>
                      Instructor Insight
                    </p>
                    <p className="text-sm" style={{ color: t.textMuted }}>
                      {q.insight}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReset(idx)}
                    className="flex items-center gap-2 text-xs transition-all hover:opacity-80"
                    style={{ color: t.textMuted }}
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reflect Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

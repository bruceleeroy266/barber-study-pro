'use client'

import { useState } from 'react'
import { ChevronDown, Lightbulb, Sparkles } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ProTipItem {
  category: string
  tips: string[]
}

interface ProTipProps {
  items: ProTipItem[]
  theme?: ChapterTheme
}

export default function ProTip({ items, theme }: ProTipProps) {
  const t = theme || defaultTheme
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleItem = (idx: number) => {
    setExpandedItems(prev => {
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
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isExpanded = expandedItems.has(idx)

        return (
          <div
            key={idx}
            className="rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background: isExpanded
                ? `linear-gradient(145deg, ${t.background}, ${t.backgroundAlt})`
                : t.backgroundAlt,
              borderColor: isExpanded ? t.border : `${t.border}80`,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <button
              onClick={() => toggleItem(idx)}
              className="w-full p-4 flex items-center gap-3 text-left transition-all"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${t.primary}15` }}
              >
                <Lightbulb className="w-4 h-4" style={{ color: t.primary }} />
              </div>
              <span className="text-sm font-semibold flex-1" style={{ color: t.text }}>
                {item.category}
              </span>
              <ChevronDown
                className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                style={{
                  color: t.primary,
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {isExpanded && (
              <div
                className="px-4 pb-4 space-y-2"
                style={{ borderTop: `1px solid ${t.border}` }}
              >
                {item.tips.map((tip, tIdx) => (
                  <div
                    key={tIdx}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: `${t.primary}06`,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: t.primary }} />
                    <span className="text-sm" style={{ color: t.textMuted }}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

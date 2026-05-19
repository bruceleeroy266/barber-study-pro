'use client'

import { Check } from 'lucide-react'
import type { ChecklistItem, ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ChecklistProps {
  items: ChecklistItem[]
  theme?: ChapterTheme
}

export default function Checklist({ items, theme }: ChecklistProps) {
  const t = theme || defaultTheme
  const ct = t.checklist || {}

  return (
    <div 
      className="rounded-xl p-6"
      style={{
        backgroundColor: (ct && ct.bg) || t.backgroundAlt,
        borderColor: t.border,
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div 
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ 
                borderColor: (ct && ct.checkBorder) || t.primary,
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              <Check className="w-3 h-3" style={{ color: (ct && ct.checkColor) || t.primary }} />
            </div>
            <span className="text-sm" style={{ color: t.textMuted }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

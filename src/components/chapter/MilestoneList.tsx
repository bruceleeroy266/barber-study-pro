'use client'

import type { MilestoneItem, ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface MilestoneListProps {
  milestones: MilestoneItem[]
  theme?: ChapterTheme
}

export default function MilestoneList({ milestones, theme }: MilestoneListProps) {
  const t = theme || defaultTheme
  const mt = t.milestone || {}

  return (
    <div className="space-y-3">
      {milestones.map((milestone, idx) => (
        <div
          key={idx}
          className="flex gap-4 rounded-xl p-4 transition-colors"
          style={{
            backgroundColor: t.backgroundAlt,
            borderColor: (mt && mt.border) || t.border,
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="flex-shrink-0 w-20 md:w-24">
            <span className="text-sm font-bold" style={{ color: (mt && mt.yearColor) || t.primary }}>
              {milestone.year}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-1" style={{ color: t.text }}>{milestone.title}</h4>
            <p className="text-sm" style={{ color: t.textMuted }}>{milestone.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

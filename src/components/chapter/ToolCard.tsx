'use client'

import type { ToolCardItem, ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ToolCardProps {
  tools: ToolCardItem[]
  theme?: ChapterTheme
}

export default function ToolCard({ tools, theme }: ToolCardProps) {
  const t = theme || defaultTheme
  const tt = t.toolCard || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tools.map((tool, idx) => (
        <div
          key={idx}
          className="rounded-xl p-6 transition-colors"
          style={{
            backgroundColor: t.background,
            borderColor: t.border,
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <h3 
            className="text-lg font-semibold mb-4"
            style={{ color: (tt && tt.headerText) || t.primary }}
          >
            {tool.name}
          </h3>
          <div className="space-y-3">
            {tool.timeline.map((entry, tidx) => (
              <div key={tidx} className="flex gap-3">
                <div className="flex-shrink-0 w-16">
                  <span className="text-xs font-semibold uppercase" style={{ color: t.textMuted }}>
                    {entry.year}
                  </span>
                </div>
                <div className="flex-1 relative">
                  {tidx < tool.timeline.length - 1 && (
                    <div 
                      className="absolute left-[-14px] top-4 bottom-[-12px] w-px"
                      style={{ backgroundColor: (tt && tt.line) || t.border }}
                    />
                  )}
                  <div 
                    className="w-2 h-2 rounded-full absolute left-[-16px] top-1.5"
                    style={{ backgroundColor: (tt && tt.dot) || t.primary }}
                  />
                  <p className="text-sm" style={{ color: t.textMuted }}>{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

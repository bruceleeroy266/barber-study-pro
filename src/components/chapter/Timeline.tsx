'use client'

import { Mountain, Crown, Hand, Building2, type LucideIcon } from 'lucide-react'
import type { TimelineItem, ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

const iconMap: Record<string, LucideIcon> = {
  Mountain,
  Crown,
  Hand,
  Building2,
}

function getIcon(name: string): LucideIcon {
  return iconMap[name] || Mountain
}

interface TimelineProps {
  items: TimelineItem[]
  theme?: ChapterTheme
}

export default function Timeline({ items, theme }: TimelineProps) {
  const t = theme || defaultTheme
  const tt = t.timeline || {}

  return (
    <div className="relative">
      {/* Vertical line */}
      <div 
        className="absolute left-5 top-0 bottom-0 w-px hidden md:block"
        style={{ backgroundColor: (tt && tt.line) || t.border }}
      />

      <div className="space-y-6">
        {items.map((item, idx) => {
          const Icon = getIcon(item.icon)
          return (
            <div key={idx} className="relative flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Icon bubble */}
              <div 
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10"
                style={{
                  backgroundColor: (tt && tt.iconBg) || t.surface,
                  borderColor: (tt && tt.iconBorder) || t.border,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <Icon className="w-4 h-4" style={{ color: t.primary }} />
              </div>

              {/* Content */}
              <div 
                className="flex-1 rounded-xl p-5 -mt-10 md:mt-0 ml-0 md:ml-0"
                style={{
                  backgroundColor: t.backgroundAlt,
                  borderColor: t.border,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div 
                  className="text-sm font-semibold mb-2 uppercase tracking-wide"
                  style={{ color: t.primary }}
                >
                  {item.period}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
                  {item.highlight ? (
                    <>
                      {item.text.split(item.highlight).map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="font-medium" style={{ color: t.highlight }}>
                              {item.highlight}
                            </span>
                          )}
                        </span>
                      ))}
                    </>
                  ) : (
                    item.text
                  )}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

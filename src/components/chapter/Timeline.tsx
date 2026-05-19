'use client'

import { Mountain, Crown, Hand, Building2, type LucideIcon } from 'lucide-react'
import type { TimelineItem } from '@/lib/chapter-content'

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
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-800 hidden md:block" />

      <div className="space-y-6">
        {items.map((item, idx) => {
          const Icon = getIcon(item.icon)
          return (
            <div key={idx} className="relative flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Icon bubble */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center z-10">
                <Icon className="w-4 h-4 text-[#D4AF37]" />
              </div>

              {/* Content */}
              <div className="flex-1 bg-gray-900/60 border border-gray-800/50 rounded-xl p-5 -mt-10 md:mt-0 ml-0 md:ml-0">
                <div className="text-sm font-semibold text-[#D4AF37] mb-2 uppercase tracking-wide">
                  {item.period}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.highlight ? (
                    <>
                      {item.text.split(item.highlight).map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="text-[#D4AF37] font-medium">{item.highlight}</span>
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

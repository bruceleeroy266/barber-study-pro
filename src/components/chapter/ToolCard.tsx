'use client'

import type { ToolCardItem } from '@/lib/chapter-content'

interface ToolCardProps {
  tools: ToolCardItem[]
}

export default function ToolCard({ tools }: ToolCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tools.map((tool, idx) => (
        <div
          key={idx}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors"
        >
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">{tool.name}</h3>
          <div className="space-y-3">
            {tool.timeline.map((entry, tidx) => (
              <div key={tidx} className="flex gap-3">
                <div className="flex-shrink-0 w-16">
                  <span className="text-xs font-semibold text-gray-500 uppercase">{entry.year}</span>
                </div>
                <div className="flex-1 relative">
                  {tidx < tool.timeline.length - 1 && (
                    <div className="absolute left-[-14px] top-4 bottom-[-12px] w-px bg-gray-800" />
                  )}
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]/50 absolute left-[-16px] top-1.5" />
                  <p className="text-gray-300 text-sm">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

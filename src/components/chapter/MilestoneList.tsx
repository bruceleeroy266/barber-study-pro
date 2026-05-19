'use client'

import type { MilestoneItem } from '@/lib/chapter-content'

interface MilestoneListProps {
  milestones: MilestoneItem[]
}

export default function MilestoneList({ milestones }: MilestoneListProps) {
  return (
    <div className="space-y-3">
      {milestones.map((milestone, idx) => (
        <div
          key={idx}
          className="flex gap-4 bg-gray-900/60 border border-gray-800/50 rounded-xl p-4 hover:border-gray-700 transition-colors"
        >
          <div className="flex-shrink-0 w-20 md:w-24">
            <span className="text-sm font-bold text-[#D4AF37]">{milestone.year}</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-white mb-1">{milestone.title}</h4>
            <p className="text-gray-400 text-sm">{milestone.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

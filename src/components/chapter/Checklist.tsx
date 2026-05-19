'use client'

import { Check } from 'lucide-react'
import type { ChecklistItem } from '@/lib/chapter-content'

interface ChecklistProps {
  items: ChecklistItem[]
}

export default function Checklist({ items }: ChecklistProps) {
  return (
    <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6">
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#D4AF37]" />
            </div>
            <span className="text-gray-300 text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { Sparkles, BookOpen, RotateCcw, MessageSquare, TrendingUp } from 'lucide-react'
import { AIQuickAction } from '@/types/ai'

interface QuickActionsProps {
  actions: AIQuickAction[]
  onAction: (action: AIQuickAction) => void
  disabled?: boolean
}

const actionIcons = {
  explain: BookOpen,
  quiz: RotateCcw,
  remediate: TrendingUp,
  review: BookOpen,
  encourage: Sparkles,
  plan: MessageSquare,
}

export default function QuickActions({ actions, onAction, disabled }: QuickActionsProps) {
  if (actions.length === 0) return null
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {actions.map((action) => {
        const Icon = actionIcons[action.action] || Sparkles
        return (
          <button
            key={action.id}
            onClick={() => onAction(action)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-graphite hover:bg-[var(--color-border-secondary)] border border-[var(--color-border-secondary)] hover:border-[var(--color-brand-gold)]/30 rounded-lg text-xs text-light-gray hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
          >
            <Icon className="w-3 h-3" aria-hidden="true" />
            {action.label}
          </button>
        )
      })}
    </div>
  )
}

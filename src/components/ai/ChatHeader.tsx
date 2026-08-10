'use client'

import { Bot, X, Minimize2, Maximize2 } from 'lucide-react'
import { AITutorContext } from '@/types/ai'

interface ChatHeaderProps {
  context: AITutorContext | null
  onClose?: () => void
  onMinimize?: () => void
  isMinimized?: boolean
}

export default function ChatHeader({ context, onClose, onMinimize, isMinimized }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-graphite bg-charcoal/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-gold)]/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-[var(--color-brand-gold)]" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold text-white">AI Tutor</h3>
          <p className="text-xs text-silver">
            {context?.currentChapter 
              ? `Chapter ${context.currentChapter}: ${context.currentChapterTitle}`
              : 'ASCYN PRO Study Assistant'
            }
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="p-2 text-silver hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)] rounded-lg"
            aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-silver hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)] rounded-lg"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

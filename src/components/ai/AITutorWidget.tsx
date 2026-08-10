'use client'

import { useState } from 'react'
import { Bot, X } from 'lucide-react'
import AITutorChat from './AITutorChat'
import { AITutorContext } from '@/types/ai'

interface AITutorWidgetProps {
  context?: AITutorContext
  currentChapter?: number
}

export default function AITutorWidget({ context, currentChapter }: AITutorWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--color-brand-gold)] text-black rounded-full shadow-lg hover:bg-[var(--color-brand-gold-light)] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 z-50 flex items-center justify-center"
        aria-label="Open AI Tutor"
      >
        <Bot className="w-6 h-6" />
      </button>
    )
  }
  
  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] shadow-2xl z-50 animate-fade-in">
      <AITutorChat
        initialContext={context}
        currentChapter={currentChapter}
        onClose={() => setIsOpen(false)}
      />
    </div>
  )
}

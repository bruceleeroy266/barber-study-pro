'use client'

import { Bot, User } from 'lucide-react'
import { AIMessage } from '@/types/ai'

interface ChatMessageProps {
  message: AIMessage
  isLast?: boolean
}

export default function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-graphite/50 text-silver text-xs px-3 py-1.5 rounded-full">
          {message.content}
        </div>
      </div>
    )
  }
  
  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} ${isLast ? 'animate-fade-in' : ''}`}
      role="article"
      aria-label={`${isUser ? 'Your' : 'AI Tutor'} message`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-[var(--color-brand-gold)] text-black'
            : 'bg-graphite text-[var(--color-brand-gold)]'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Bot className="w-4 h-4" aria-hidden="true" />
        )}
      </div>
      
      {/* Message Content */}
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 ${
          isUser
            ? 'bg-[var(--color-brand-gold)] text-black'
            : 'bg-charcoal border border-graphite text-white'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        <p
          className={`text-xs mt-2 ${
            isUser ? 'text-light-gray' : 'text-silver-gray'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}

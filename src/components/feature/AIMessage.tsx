import React from 'react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/brand/Logo'

export interface AIMessageProps {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
  isLoading?: boolean
  className?: string
}

/**
 * AIMessage Component
 * 
 * Display AI chat messages with consistent styling.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <AIMessage
 *   role="assistant"
 *   content="Hello! How can I help you today?"
 *   timestamp="2:30 PM"
 * />
 * ```
 */
export const AIMessage: React.FC<AIMessageProps> = ({
  role,
  content,
  timestamp,
  isLoading = false,
  className,
}) => {
  const isUser = role === 'user'
  const isSystem = role === 'system'

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isUser && 'flex-row-reverse',
        className
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-brand-gold)]/10 flex items-center justify-center">
          <Logo variant="icon" theme="gold" size="xs" decorative />
        </div>
      )}
      <div
        className={cn(
          'flex-1 max-w-[80%] rounded-lg p-4',
          isUser
            ? 'bg-[var(--color-brand-gold)] text-black ml-auto'
            : isSystem
            ? 'bg-graphite/50 text-silver-gray text-sm italic'
            : 'bg-charcoal text-white'
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            {timestamp && (
              <p
                className={cn(
                  'text-xs mt-2',
                  isUser ? 'text-black/60' : 'text-silver-gray'
                )}
              >
                {timestamp}
              </p>
            )}
          </>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-graphite flex items-center justify-center">
          <span className="text-sm font-semibold text-white">U</span>
        </div>
      )}
    </div>
  )
}

export default AIMessage

'use client'

export default function TypingIndicator() {
  return (
    <div className="flex gap-3" role="status" aria-label="AI is typing">
      <div className="w-8 h-8 rounded-lg bg-graphite text-[var(--color-brand-gold)] flex items-center justify-center shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="bg-charcoal border border-graphite rounded-xl px-4 py-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-silver-gray rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-silver-gray rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-silver-gray rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, FormEvent } from 'react'
import { Send } from 'lucide-react'

interface MessageComposerProps {
  onSend: (body: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function MessageComposer({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
}: MessageComposerProps) {
  const [body, setBody] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = body.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setBody('')
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-800 p-4">
      <div className="flex items-end gap-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <button
          type="submit"
          disabled={disabled || !body.trim()}
          className="flex items-center justify-center w-12 h-12 bg-[#D4AF37] text-gray-950 rounded-lg hover:bg-[#F4E4A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}

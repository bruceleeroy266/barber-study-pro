'use client'

import { MessageThread } from '@/types'
import { formatMessageTime, getThreadDisplayName } from '@/lib/messaging'

interface MessageListProps {
  threads: MessageThread[]
  selectedThreadId: string | null
  currentUserId: string
  onSelectThread: (threadId: string) => void
}

export default function MessageList({
  threads,
  selectedThreadId,
  currentUserId,
  onSelectThread,
}: MessageListProps) {
  return (
    <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-graphite">
        <h2 className="text-lg font-semibold text-white">Messages</h2>
        <p className="text-sm text-silver">{threads.length} conversation{threads.length === 1 ? '' : 's'}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="p-6 text-center text-silver-gray">
            No messages yet.
          </div>
        ) : (
          <ul className="divide-y divide-graphite">
            {threads.map((thread) => {
              const isSelected = thread.id === selectedThreadId
              const displayName = getThreadDisplayName(thread, currentUserId)

              return (
                <li key={thread.id}>
                  <button
                    onClick={() => onSelectThread(thread.id)}
                    className={`w-full text-left p-4 transition-colors ${
                      isSelected
                        ? 'bg-[var(--color-brand-gold)]/10 border-l-4 border-[var(--color-brand-gold)]'
                        : 'hover:bg-graphite/50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-medium truncate ${isSelected ? 'text-[var(--color-brand-gold)]' : 'text-white'}`}>
                          {displayName}
                        </h3>
                        <p className="text-sm text-silver truncate mt-0.5">
                          {thread.subject}
                        </p>
                        <p className="text-xs text-silver-gray truncate mt-1">
                          {thread.lastMessagePreview}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-silver-gray whitespace-nowrap">
                          {formatMessageTime(thread.lastMessageAt)}
                        </span>
                        {thread.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-silver rounded-full">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

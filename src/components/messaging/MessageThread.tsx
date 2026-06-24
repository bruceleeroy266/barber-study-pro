'use client'

import { Message, MessageThread as MessageThreadType } from '@/types'
import { formatFullTimestamp, getThreadDisplayName } from '@/lib/messaging'
import MessageComposer from './MessageComposer'

interface MessageThreadProps {
  thread: MessageThreadType
  messages: Message[]
  currentUserId: string
  onSendReply: (body: string) => void
}

export default function MessageThread({
  thread,
  messages,
  currentUserId,
  onSendReply,
}: MessageThreadProps) {
  const displayName = getThreadDisplayName(thread, currentUserId)

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white">{displayName}</h3>
        <p className="text-sm text-gray-400">{thread.subject}</p>
        {thread.isGroup && thread.groupName && (
          <p className="text-xs text-gray-500 mt-1">
            {thread.participants.length} participants
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation below.
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === currentUserId
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    isMe
                      ? 'bg-[#D4AF37]/20 text-white border border-[#D4AF37]/30'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#D4AF37]">
                      {isMe ? 'You' : message.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatFullTimestamp(message.sentAt)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <MessageComposer onSend={onSendReply} placeholder="Reply to this thread..." />
    </div>
  )
}

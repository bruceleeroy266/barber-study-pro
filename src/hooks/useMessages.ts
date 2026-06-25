'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { MessageThread, Message, Profile } from '@/types'
import {
  getThreadsForUser,
  getMessagesForThread,
  getThreadById,
  getThreadDisplayName,
  createDraftReply,
  countUnreadThreads,
} from '@/lib/messaging'

interface UseMessagesOptions {
  userId: string
  userName: string
  userRole: Profile['role']
}

export function useMessages({ userId, userName, userRole }: UseMessagesOptions) {
  const [threads, setThreads] = useState<MessageThread[]>(() => getThreadsForUser(userId))
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [messagesByThread, setMessagesByThread] = useState<Record<string, Message[]>>({})
  const loadedThreadIds = useRef<Set<string>>(new Set())

  const selectedThread = useMemo(
    () => (selectedThreadId ? getThreadById(selectedThreadId) : null),
    [selectedThreadId]
  )

  // Load messages for the selected thread only when the thread id changes.
  useEffect(() => {
    if (!selectedThreadId) return
    if (loadedThreadIds.current.has(selectedThreadId)) return
    loadedThreadIds.current.add(selectedThreadId)
    const loaded = getMessagesForThread(selectedThreadId)
    setMessagesByThread((prev) => ({ ...prev, [selectedThreadId]: loaded }))
  }, [selectedThreadId])

  const selectedMessages = useMemo(() => {
    if (!selectedThreadId) return []
    return messagesByThread[selectedThreadId] ?? []
  }, [selectedThreadId, messagesByThread])

  const unreadCount = useMemo(() => countUnreadThreads(userId), [userId])

  const selectThread = useCallback((threadId: string) => {
    setSelectedThreadId(threadId)
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    )
  }, [])

  const sendReply = useCallback(
    (threadId: string, body: string) => {
      const draft = createDraftReply(threadId, userId, userName, userRole, body)
      const sentMessage: Message = { ...draft, status: 'sent', sentAt: new Date().toISOString() }

      setMessagesByThread((prev) => {
        const existing = prev[threadId] || getMessagesForThread(threadId)
        return { ...prev, [threadId]: [...existing, sentMessage] }
      })

      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                lastMessageAt: sentMessage.sentAt,
                lastMessagePreview: body,
              }
            : t
        )
      )

      return sentMessage
    },
    [userId, userName, userRole]
  )

  const createThread = useCallback(
    (recipientIds: string[], subject: string, body: string) => {
      // Demo only: real implementation would persist to backend
      const newThreadId = `thread-${Date.now()}`
      const newThread: MessageThread = {
        id: newThreadId,
        subject,
        participants: [
          { id: `part-${userId}`, userId, name: userName, role: userRole },
          ...recipientIds.map((id) => ({ id: `part-${id}`, userId: id, name: 'Unknown', role: 'student' as const })),
        ],
        lastMessageAt: new Date().toISOString(),
        lastMessagePreview: body,
        unreadCount: 0,
        isGroup: recipientIds.length > 1,
        groupName: recipientIds.length > 1 ? subject : null,
      }

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        threadId: newThreadId,
        senderId: userId,
        senderName: userName,
        senderRole: userRole,
        recipientIds,
        subject,
        body,
        status: 'sent',
        priority: 'medium',
        sentAt: new Date().toISOString(),
      }

      setThreads((prev) => [newThread, ...prev])
      setMessagesByThread((prev) => ({ ...prev, [newThreadId]: [newMessage] }))
      setSelectedThreadId(newThreadId)

      return newThreadId
    },
    [userId, userName, userRole]
  )

  return {
    threads,
    selectedThread,
    selectedMessages,
    selectedThreadId,
    unreadCount,
    selectThread,
    sendReply,
    createThread,
    getThreadDisplayName: (thread: MessageThread) => getThreadDisplayName(thread, userId),
  }
}

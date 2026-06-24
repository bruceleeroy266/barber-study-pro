import { MessageThread, Message, MessageRecipient, Profile } from '@/types'
import { demoMessageThreads, demoMessages } from '@/lib/demo-data'

export function getThreadsForUser(userId: string): MessageThread[] {
  return demoMessageThreads
    .filter((thread) => thread.participants.some((p) => p.userId === userId))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
}

export function getMessagesForThread(threadId: string): Message[] {
  return demoMessages
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
}

export function getThreadById(threadId: string): MessageThread | null {
  return demoMessageThreads.find((t) => t.id === threadId) || null
}

export function countUnreadThreads(userId: string): number {
  return getThreadsForUser(userId).reduce((count, thread) => count + thread.unreadCount, 0)
}

export function getOtherParticipants(thread: MessageThread, userId: string): MessageRecipient[] {
  return thread.participants.filter((p) => p.userId !== userId)
}

export function getThreadDisplayName(thread: MessageThread, userId: string): string {
  if (thread.isGroup && thread.groupName) return thread.groupName
  const others = getOtherParticipants(thread, userId)
  if (others.length === 0) return 'Me'
  if (others.length === 1) return others[0].name
  return others.map((p) => p.name).join(', ')
}

export function buildThreadFromParticipants(
  subject: string,
  participants: Profile[],
  isGroup = false,
  groupName?: string
): MessageThread {
  const threadParticipants: MessageRecipient[] = participants.map((p) => ({
    id: `part-${p.id}`,
    userId: p.id,
    name: p.full_name,
    role: p.role,
    readAt: null,
  }))

  return {
    id: `thread-${Date.now()}`,
    subject,
    participants: threadParticipants,
    lastMessageAt: new Date().toISOString(),
    lastMessagePreview: 'New conversation started',
    unreadCount: 0,
    isGroup,
    groupName: isGroup ? groupName || subject : null,
  }
}

export function markThreadAsRead(threadId: string, userId: string): void {
  const thread = getThreadById(threadId)
  if (!thread) return
  const participant = thread.participants.find((p) => p.userId === userId)
  if (participant) {
    participant.readAt = new Date().toISOString()
  }
  thread.unreadCount = Math.max(0, thread.unreadCount - 1)
}

export function createDraftReply(
  threadId: string,
  senderId: string,
  senderName: string,
  senderRole: Profile['role'],
  body: string
): Message {
  const thread = getThreadById(threadId)
  const recipientIds = thread
    ? thread.participants.filter((p) => p.userId !== senderId).map((p) => p.userId)
    : []

  return {
    id: `msg-${Date.now()}`,
    threadId,
    senderId,
    senderName,
    senderRole,
    recipientIds,
    subject: thread?.subject || 'Re:',
    body,
    status: 'draft',
    priority: 'medium',
    sentAt: new Date().toISOString(),
  }
}

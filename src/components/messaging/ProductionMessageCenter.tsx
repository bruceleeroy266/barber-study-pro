'use client'

import { FormEvent, useMemo, useState, useTransition } from 'react'
import { MessageCircle, Plus, Send, UserRound } from 'lucide-react'
import {
  loadCommunicationThreadMessages,
  markCommunicationThreadRead,
  openCommunicationThread,
  sendCommunicationMessage,
  type ProductionCommunicationMessage,
  type ProductionCommunicationThread,
} from '@/app/communications/actions'

export interface ProductionMessagingPerson {
  id: string
  name: string
  role: 'student' | 'apprentice' | 'instructor'
}

interface ProductionMessageCenterProps {
  currentUserId: string
  currentUserName: string
  currentUserRole: 'student' | 'apprentice' | 'instructor'
  initialThreads: ProductionCommunicationThread[]
  people: ProductionMessagingPerson[]
  availableCounterparts: ProductionMessagingPerson[]
  title: string
  subtitle: string
}

function formatWhen(value: string | null) {
  if (!value) return 'No messages yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function ProductionMessageCenter({
  currentUserId,
  currentUserName,
  currentUserRole,
  initialThreads,
  people,
  availableCounterparts,
  title,
  subtitle,
}: ProductionMessageCenterProps) {
  const [threads, setThreads] = useState(initialThreads)
  const [selectedThread, setSelectedThread] =
    useState<ProductionCommunicationThread | null>(null)
  const [messages, setMessages] = useState<ProductionCommunicationMessage[]>([])
  const [replyBody, setReplyBody] = useState('')
  const [counterpartId, setCounterpartId] = useState(
    availableCounterparts.length === 1 ? availableCounterparts[0].id : ''
  )
  const [subject, setSubject] = useState('Conversation')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const peopleById = useMemo(
    () => new Map(people.map((person) => [person.id, person])),
    [people]
  )

  const counterpartForThread = (thread: ProductionCommunicationThread) => {
    const counterpart =
      thread.studentId === currentUserId ? thread.instructorId : thread.studentId
    return peopleById.get(counterpart)?.name || 'Assigned participant'
  }

  const loadThread = async (threadId: string) => {
    setError(null)
    const result = await loadCommunicationThreadMessages(threadId)
    if (!result.success) {
      setError(result.message)
      return
    }

    setSelectedThread(result.data.thread)
    setMessages(result.data.messages)

    const readResult = await markCommunicationThreadRead(threadId)
    if (!readResult.success) {
      setError(readResult.message)
    }
  }

  const handleSelect = (threadId: string) => {
    startTransition(() => {
      void loadThread(threadId)
    })
  }

  const handleOpenConversation = (event: FormEvent) => {
    event.preventDefault()
    if (!counterpartId || !subject.trim()) return

    startTransition(() => {
      void (async () => {
        setError(null)
        const result = await openCommunicationThread(counterpartId, subject)
        if (!result.success) {
          setError(result.message)
          return
        }

        setThreads((current) => {
          const exists = current.some((thread) => thread.id === result.data.thread.id)
          return exists ? current : [result.data.thread, ...current]
        })
        setSubject('Conversation')
        await loadThread(result.data.thread.id)
      })()
    })
  }

  const handleSend = (event: FormEvent) => {
    event.preventDefault()
    if (!selectedThread || !replyBody.trim()) return

    startTransition(() => {
      void (async () => {
        setError(null)
        const result = await sendCommunicationMessage(
          selectedThread.id,
          replyBody
        )

        if (!result.success) {
          setError(result.message)
          return
        }

        setMessages((current) => [...current, result.data])
        setReplyBody('')
        setThreads((current) =>
          current.map((thread) =>
            thread.id === selectedThread.id
              ? { ...thread, lastMessageAt: result.data.sentAt }
              : thread
          )
        )
      })()
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
        <p className="text-silver">{subtitle}</p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-5 min-h-[620px]">
        <aside className="bg-charcoal border border-graphite rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-graphite">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[var(--color-brand-gold)]" />
              <h2 className="font-semibold text-white">Conversations</h2>
            </div>
            <p className="text-xs text-silver mt-1">
              {threads.length} authorized thread{threads.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 ? (
              <div className="p-5 text-sm text-silver-gray">
                No conversations yet.
              </div>
            ) : (
              <ul className="divide-y divide-graphite">
                {threads.map((thread) => {
                  const selected = selectedThread?.id === thread.id
                  return (
                    <li key={thread.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(thread.id)}
                        className={`w-full text-left p-4 border-l-4 transition-colors ${
                          selected
                            ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
                            : 'border-transparent hover:bg-graphite/50'
                        }`}
                      >
                        <p className="font-medium text-white truncate">
                          {counterpartForThread(thread)}
                        </p>
                        <p className="text-sm text-silver truncate mt-0.5">
                          {thread.subject}
                        </p>
                        <p className="text-xs text-silver-gray mt-1">
                          {formatWhen(thread.lastMessageAt || thread.createdAt)}
                        </p>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {availableCounterparts.length > 0 && (
            <form
              onSubmit={handleOpenConversation}
              className="p-4 border-t border-graphite space-y-3"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Plus className="w-4 h-4" />
                New conversation
              </div>
              <label className="sr-only" htmlFor="message-counterpart">
                Assigned recipient
              </label>
              <select
                id="message-counterpart"
                value={counterpartId}
                onChange={(event) => setCounterpartId(event.target.value)}
                className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Choose assigned {currentUserRole === 'instructor' ? 'student' : 'instructor'}</option>
                {availableCounterparts.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor="message-subject">
                Conversation subject
              </label>
              <input
                id="message-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                maxLength={160}
                className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-sm text-white"
                placeholder="Conversation subject"
              />
              <button
                type="submit"
                disabled={isPending || !counterpartId || !subject.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand-gold)] px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
              >
                <UserRound className="w-4 h-4" />
                Open conversation
              </button>
            </form>
          )}
        </aside>

        <section className="bg-charcoal border border-graphite rounded-xl overflow-hidden flex flex-col min-h-[620px]">
          {selectedThread ? (
            <>
              <div className="p-4 border-b border-graphite">
                <h2 className="text-lg font-semibold text-white">
                  {counterpartForThread(selectedThread)}
                </h2>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-silver">
                  <span>{selectedThread.subject}</span>
                  {selectedThread.status === 'archived' && (
                    <span className="text-silver-gray">Archived</span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isPending && messages.length === 0 ? (
                  <p className="text-sm text-silver-gray">Loading conversation…</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-silver-gray text-center py-10">
                    No messages yet. Start the conversation below.
                  </p>
                ) : (
                  messages.map((message) => {
                    const mine = message.senderId === currentUserId
                    const senderName = mine
                      ? currentUserName
                      : peopleById.get(message.senderId)?.name || 'Assigned participant'
                    return (
                      <div
                        key={message.id}
                        className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-4 py-3 border ${
                            mine
                              ? 'bg-[var(--color-brand-gold)]/20 border-[var(--color-brand-gold)]/30'
                              : 'bg-graphite border-[var(--color-border-secondary)]'
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-[var(--color-brand-gold)]">
                              {mine ? 'You' : senderName}
                            </span>
                            <span className="text-xs text-silver-gray">
                              {formatWhen(message.sentAt)}
                            </span>
                          </div>
                          <p className="text-sm text-white whitespace-pre-wrap break-words">
                            {message.body}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <form onSubmit={handleSend} className="border-t border-graphite p-4">
                <div className="flex items-end gap-3">
                  <label className="sr-only" htmlFor="production-message-reply">
                    Reply
                  </label>
                  <textarea
                    id="production-message-reply"
                    value={replyBody}
                    onChange={(event) => setReplyBody(event.target.value)}
                    disabled={selectedThread.status !== 'active' || isPending}
                    maxLength={4000}
                    rows={2}
                    placeholder={
                      selectedThread.status === 'active'
                        ? 'Reply to this conversation…'
                        : 'This conversation is archived'
                    }
                    className="flex-1 bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-3 text-white placeholder-silver-gray resize-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={
                      selectedThread.status !== 'active' ||
                      isPending ||
                      !replyBody.trim()
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-brand-gold)] text-black disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 flex justify-between gap-3 text-xs text-silver-gray">
                  <span>Private to your assigned {currentUserRole === 'instructor' ? 'student' : 'instructor'}.</span>
                  <span>{replyBody.length}/4000</span>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <MessageCircle className="w-10 h-10 text-[var(--color-brand-gold)] mx-auto mb-3" />
                <p className="text-lg font-medium text-white">Select a conversation</p>
                <p className="text-sm text-silver mt-1">
                  Messages stay between the assigned student and instructor.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

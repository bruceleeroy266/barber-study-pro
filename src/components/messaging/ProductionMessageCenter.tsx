'use client'

import {
  FormEvent,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import {
  Archive,
  Inbox,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  UserRound,
} from 'lucide-react'
import {
  archiveCommunicationThread,
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

type ThreadFilter = 'inbox' | 'unread' | 'archived'

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
  const [filter, setFilter] = useState<ThreadFilter>('inbox')
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [loadingThreadId, setLoadingThreadId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const sendLockedRef = useRef(false)
  const openLockedRef = useRef(false)

  const peopleById = useMemo(
    () => new Map(people.map((person) => [person.id, person])),
    [people]
  )

  const unreadTotal = useMemo(
    () => threads.reduce((sum, thread) => sum + thread.unreadCount, 0),
    [threads]
  )

  const visibleThreads = useMemo(() => {
    if (filter === 'archived') {
      return threads.filter((thread) => thread.status === 'archived')
    }
    if (filter === 'unread') {
      return threads.filter(
        (thread) => thread.status === 'active' && thread.unreadCount > 0
      )
    }
    return threads.filter((thread) => thread.status === 'active')
  }, [filter, threads])

  const counterpartForThread = (thread: ProductionCommunicationThread) => {
    const counterpart =
      thread.studentId === currentUserId ? thread.instructorId : thread.studentId
    return peopleById.get(counterpart)?.name || 'Assigned participant'
  }

  const replaceThread = (nextThread: ProductionCommunicationThread) => {
    setThreads((current) =>
      current.map((thread) =>
        thread.id === nextThread.id ? nextThread : thread
      )
    )
    setSelectedThread((current) =>
      current?.id === nextThread.id ? nextThread : current
    )
  }

  const loadThread = async (threadId: string) => {
    setError(null)
    setStatusMessage('Loading conversation')
    setLoadingThreadId(threadId)

    try {
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
        return
      }

      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? { ...thread, unreadCount: 0 }
            : thread
        )
      )
      setSelectedThread((current) =>
        current?.id === threadId
          ? { ...current, unreadCount: 0 }
          : current
      )
      setStatusMessage('Conversation loaded')
    } finally {
      setLoadingThreadId(null)
    }
  }

  const handleSelect = (threadId: string) => {
    startTransition(() => {
      void loadThread(threadId)
    })
  }

  const handleOpenConversation = (event: FormEvent) => {
    event.preventDefault()
    if (
      !counterpartId ||
      !subject.trim() ||
      isPending ||
      openLockedRef.current
    ) {
      return
    }

    openLockedRef.current = true
    startTransition(() => {
      void (async () => {
        try {
          setError(null)
          setStatusMessage('Opening conversation')
          const result = await openCommunicationThread(counterpartId, subject)
          if (!result.success) {
            setError(result.message)
            return
          }

          setThreads((current) => {
            const exists = current.some(
              (thread) => thread.id === result.data.thread.id
            )
            return exists
              ? current.map((thread) =>
                  thread.id === result.data.thread.id
                    ? result.data.thread
                    : thread
                )
              : [result.data.thread, ...current]
          })
          setSubject('Conversation')
          setFilter('inbox')
          await loadThread(result.data.thread.id)
        } finally {
          openLockedRef.current = false
        }
      })()
    })
  }

  const handleSend = (event: FormEvent) => {
    event.preventDefault()
    if (
      !selectedThread ||
      !replyBody.trim() ||
      selectedThread.status !== 'active' ||
      isPending ||
      sendLockedRef.current
    ) {
      return
    }

    sendLockedRef.current = true
    startTransition(() => {
      void (async () => {
        const bodyToSend = replyBody
        try {
          setError(null)
          setStatusMessage('Sending message')
          const result = await sendCommunicationMessage(
            selectedThread.id,
            bodyToSend
          )

          if (!result.success) {
            setError(result.message)
            return
          }

          setMessages((current) => {
            if (current.some((message) => message.id === result.data.id)) {
              return current
            }
            return [...current, result.data]
          })
          setReplyBody('')
          setThreads((current) =>
            current.map((thread) =>
              thread.id === selectedThread.id
                ? {
                    ...thread,
                    lastMessageAt: result.data.sentAt,
                    unreadCount: 0,
                  }
                : thread
            )
          )
          setStatusMessage('Message sent')
        } finally {
          sendLockedRef.current = false
        }
      })()
    })
  }

  const handleArchive = () => {
    if (
      !selectedThread ||
      selectedThread.status !== 'active' ||
      currentUserRole !== 'instructor' ||
      isPending
    ) {
      return
    }

    startTransition(() => {
      void (async () => {
        setError(null)
        setStatusMessage('Archiving conversation')
        const result = await archiveCommunicationThread(selectedThread.id)
        if (!result.success) {
          setError(result.message)
          return
        }

        replaceThread({
          ...result.data.thread,
          unreadCount: selectedThread.unreadCount,
        })
        setFilter('archived')
        setStatusMessage('Conversation archived')
      })()
    })
  }

  const filterButtonClass = (active: boolean) =>
    `inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)] ${
      active
        ? 'bg-[var(--color-brand-gold)] text-black'
        : 'border border-graphite text-silver hover:bg-graphite/50'
    }`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
        <p className="text-silver">{subtitle}</p>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-5 min-h-[620px]">
        <aside className="bg-charcoal border border-graphite rounded-xl overflow-hidden flex flex-col min-h-[420px] xl:min-h-[620px]">
          <div className="p-4 border-b border-graphite space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[var(--color-brand-gold)]" />
              <h2 className="font-semibold text-white">Conversations</h2>
            </div>

            <div
              className="grid grid-cols-3 gap-2"
              role="tablist"
              aria-label="Conversation filters"
            >
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'inbox'}
                onClick={() => setFilter('inbox')}
                className={filterButtonClass(filter === 'inbox')}
              >
                <Inbox className="w-4 h-4" />
                <span>Inbox</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'unread'}
                onClick={() => setFilter('unread')}
                className={filterButtonClass(filter === 'unread')}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Unread</span>
                {unreadTotal > 0 && (
                  <span className="rounded-full bg-black/20 px-1.5 text-xs">
                    {unreadTotal}
                  </span>
                )}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'archived'}
                onClick={() => setFilter('archived')}
                className={filterButtonClass(filter === 'archived')}
              >
                <Archive className="w-4 h-4" />
                <span>Archived</span>
              </button>
            </div>

            <p className="text-xs text-silver">
              {visibleThreads.length} {filter} conversation
              {visibleThreads.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto" role="tabpanel">
            {visibleThreads.length === 0 ? (
              <div className="p-5 text-sm text-silver-gray">
                {filter === 'unread'
                  ? 'No unread conversations.'
                  : filter === 'archived'
                    ? 'No archived conversations.'
                    : 'No active conversations yet.'}
              </div>
            ) : (
              <ul className="divide-y divide-graphite">
                {visibleThreads.map((thread) => {
                  const selected = selectedThread?.id === thread.id
                  const loading = loadingThreadId === thread.id
                  return (
                    <li key={thread.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(thread.id)}
                        aria-current={selected ? 'true' : undefined}
                        aria-label={`${counterpartForThread(thread)}, ${thread.subject}, ${thread.unreadCount} unread message${thread.unreadCount === 1 ? '' : 's'}`}
                        className={`w-full min-h-20 text-left p-4 border-l-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)] ${
                          selected
                            ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
                            : 'border-transparent hover:bg-graphite/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white truncate">
                            {counterpartForThread(thread)}
                          </p>
                          {loading ? (
                            <Loader2 className="w-4 h-4 shrink-0 animate-spin text-[var(--color-brand-gold)]" />
                          ) : thread.unreadCount > 0 ? (
                            <span
                              className="min-w-6 rounded-full bg-[var(--color-brand-gold)] px-2 py-0.5 text-center text-xs font-semibold text-black"
                              aria-label={`${thread.unreadCount} unread`}
                            >
                              {thread.unreadCount}
                            </span>
                          ) : null}
                        </div>
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
              <label className="text-xs text-silver" htmlFor="message-counterpart">
                Assigned recipient
              </label>
              <select
                id="message-counterpart"
                value={counterpartId}
                onChange={(event) => setCounterpartId(event.target.value)}
                className="w-full min-h-11 bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
              >
                <option value="">
                  Choose assigned {currentUserRole === 'instructor' ? 'student' : 'instructor'}
                </option>
                {availableCounterparts.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
              <label className="text-xs text-silver" htmlFor="message-subject">
                Conversation subject
              </label>
              <input
                id="message-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                maxLength={160}
                className="w-full min-h-11 bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
                placeholder="Conversation subject"
              />
              <button
                type="submit"
                disabled={isPending || !counterpartId || !subject.trim()}
                className="w-full min-h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand-gold)] px-3 py-2 text-sm font-semibold text-black disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserRound className="w-4 h-4" />
                )}
                Open conversation
              </button>
            </form>
          )}
        </aside>

        <section className="bg-charcoal border border-graphite rounded-xl overflow-hidden flex flex-col min-h-[520px] xl:min-h-[620px]">
          {selectedThread ? (
            <>
              <div className="p-4 border-b border-graphite flex flex-wrap items-start justify-between gap-3">
                <div>
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

                {currentUserRole === 'instructor' &&
                  selectedThread.status === 'active' && (
                    <button
                      type="button"
                      onClick={handleArchive}
                      disabled={isPending}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-graphite px-3 py-2 text-sm text-silver hover:bg-graphite/50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
                    >
                      <Archive className="w-4 h-4" />
                      Archive
                    </button>
                  )}
              </div>

              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                aria-busy={loadingThreadId === selectedThread.id}
              >
                {loadingThreadId === selectedThread.id && messages.length === 0 ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-sm text-silver-gray">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading conversation…
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-silver-gray text-center py-10">
                    No messages yet. Start the conversation below.
                  </p>
                ) : (
                  messages.map((message) => {
                    const mine = message.senderId === currentUserId
                    const senderName = mine
                      ? currentUserName
                      : peopleById.get(message.senderId)?.name ||
                        'Assigned participant'
                    return (
                      <div
                        key={message.id}
                        className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[92%] sm:max-w-[85%] rounded-xl px-4 py-3 border ${
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
                <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-silver" htmlFor="production-message-reply">
                      Reply
                    </label>
                    <textarea
                      id="production-message-reply"
                      value={replyBody}
                      onChange={(event) => setReplyBody(event.target.value)}
                      disabled={selectedThread.status !== 'active' || isPending}
                      maxLength={4000}
                      rows={3}
                      placeholder={
                        selectedThread.status === 'active'
                          ? 'Reply to this conversation…'
                          : 'This conversation is archived'
                      }
                      className="mt-1 w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-3 text-white placeholder-silver-gray resize-y disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={
                      selectedThread.status !== 'active' ||
                      isPending ||
                      !replyBody.trim()
                    }
                    className="flex min-h-12 sm:h-12 sm:w-12 items-center justify-center gap-2 rounded-lg bg-[var(--color-brand-gold)] px-4 sm:px-0 text-black disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="Send message"
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span className="sm:sr-only">Send</span>
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap justify-between gap-3 text-xs text-silver-gray">
                  <span>
                    Private to your assigned{' '}
                    {currentUserRole === 'instructor' ? 'student' : 'instructor'}.
                  </span>
                  <span>{replyBody.length}/4000</span>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <MessageCircle className="w-10 h-10 text-[var(--color-brand-gold)] mx-auto mb-3" />
                <p className="text-lg font-medium text-white">
                  Select a conversation
                </p>
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

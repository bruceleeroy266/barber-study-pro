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
  ArrowLeft,
  Inbox,
  Loader2,
  MessageCircle,
  Plus,
  Send,
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
  role: 'student' | 'apprentice' | 'instructor' | 'school_admin' | 'admin'
}

interface ProductionMessageCenterProps {
  currentUserId: string
  currentUserName: string
  currentUserRole: 'student' | 'apprentice' | 'instructor' | 'school_admin' | 'admin'
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
  const [isComposing, setIsComposing] = useState(false)
  const [counterpartId, setCounterpartId] = useState('')
  const [newMessageBody, setNewMessageBody] = useState('')
  const [filter, setFilter] = useState<ThreadFilter>('inbox')
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [loadingThreadId, setLoadingThreadId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const sendLockedRef = useRef(false)
  const composeLockedRef = useRef(false)
  const replyOperationIdRef = useRef<string | null>(null)
  const composeOperationIdRef = useRef<string | null>(null)
  const viewEpochRef = useRef(0)

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

  const counterpartPersonForThread = (
    thread: ProductionCommunicationThread
  ) => {
    const counterpartIdForThread =
      thread.participantOneId === currentUserId
        ? thread.participantTwoId
        : thread.participantOneId
    return peopleById.get(counterpartIdForThread)
  }

  const counterpartForThread = (thread: ProductionCommunicationThread) =>
    counterpartPersonForThread(thread)?.name || 'Authorized participant'

  const roleLabel = (role: ProductionMessagingPerson['role'] | undefined) => {
    if (role === 'instructor') return 'Instructor'
    if (role === 'school_admin' || role === 'admin') return 'School Admin'
    if (role === 'apprentice') return 'Apprentice'
    return 'Student'
  }

  const returnToInbox = () => {
    viewEpochRef.current += 1
    setError(null)
    setIsComposing(false)
    setSelectedThread(null)
    setCounterpartId('')
    setNewMessageBody('')
    setReplyBody('')
    replyOperationIdRef.current = null
    composeOperationIdRef.current = null
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

  const loadThread = async (threadId: string, requestEpoch: number) => {
    setError(null)
    setStatusMessage('Loading conversation')
    setLoadingThreadId(threadId)

    try {
      const result = await loadCommunicationThreadMessages(threadId)
      if (viewEpochRef.current !== requestEpoch) return
      if (!result.success) {
        setError(result.message)
        return
      }

      setSelectedThread(result.data.thread)
      setMessages(result.data.messages)

      const readResult = await markCommunicationThreadRead(threadId)
      if (viewEpochRef.current !== requestEpoch) return
      if (!readResult.success) {
        setError(readResult.message)
        return
      }

      const remainingUnread = readResult.data.remainingUnread
      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? { ...thread, unreadCount: remainingUnread }
            : thread
        )
      )
      setSelectedThread((current) =>
        current?.id === threadId
          ? { ...current, unreadCount: remainingUnread }
          : current
      )
      setStatusMessage('Conversation loaded')
    } finally {
      if (viewEpochRef.current === requestEpoch) {
        setLoadingThreadId(null)
      }
    }
  }

  const handleSelect = (threadId: string) => {
    replyOperationIdRef.current = null
    const requestEpoch = viewEpochRef.current + 1
    viewEpochRef.current = requestEpoch
    startTransition(() => {
      void loadThread(threadId, requestEpoch)
    })
  }

  const handleNewMessageSend = (event: FormEvent) => {
    event.preventDefault()
    if (
      !counterpartId ||
      !newMessageBody.trim() ||
      isPending ||
      composeLockedRef.current
    ) {
      return
    }

    composeLockedRef.current = true
    startTransition(() => {
      void (async () => {
        const bodyToSend = newMessageBody
        const requestEpoch = viewEpochRef.current
        try {
          setError(null)
          setStatusMessage('Sending new message')

          const threadResult = await openCommunicationThread(
            counterpartId,
            'Conversation'
          )
          if (!threadResult.success) {
            setError(threadResult.message)
            return
          }

          const operationId =
            composeOperationIdRef.current ?? crypto.randomUUID()
          composeOperationIdRef.current = operationId

          const messageResult = await sendCommunicationMessage(
            threadResult.data.thread.id,
            bodyToSend,
            operationId
          )
          if (!messageResult.success) {
            setError(messageResult.message)
            return
          }

          setThreads((current) => {
            const nextThread = {
              ...threadResult.data.thread,
              lastMessageAt: messageResult.data.sentAt,
              unreadCount: 0,
            }
            const exists = current.some(
              (thread) => thread.id === nextThread.id
            )
            return exists
              ? current.map((thread) =>
                  thread.id === nextThread.id ? nextThread : thread
                )
              : [nextThread, ...current]
          })

          composeOperationIdRef.current = null
          if (viewEpochRef.current === requestEpoch) {
            setNewMessageBody('')
            setCounterpartId('')
            setIsComposing(false)
            setFilter('inbox')
            const nextEpoch = requestEpoch + 1
            viewEpochRef.current = nextEpoch
            await loadThread(threadResult.data.thread.id, nextEpoch)
            if (viewEpochRef.current === nextEpoch) {
              setStatusMessage('Message sent')
            }
          }
        } finally {
          composeLockedRef.current = false
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
          const operationId =
            replyOperationIdRef.current ?? crypto.randomUUID()
          replyOperationIdRef.current = operationId

          const result = await sendCommunicationMessage(
            selectedThread.id,
            bodyToSend,
            operationId
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
          replyOperationIdRef.current = null
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
    `inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)] sm:gap-2 sm:px-3 ${
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
        <aside
          className={`bg-charcoal border border-graphite rounded-xl overflow-hidden flex-col min-h-[420px] xl:min-h-[620px] ${isComposing || selectedThread ? 'hidden xl:flex' : 'flex'}`}
          aria-label="Conversation list"
        >
          <div className="p-4 border-b border-graphite space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[var(--color-brand-gold)]" />
                <h2 className="font-semibold text-white">Conversations</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  viewEpochRef.current += 1
                  setError(null)
                  setSelectedThread(null)
                  setIsComposing(true)
                }}
                disabled={availableCounterparts.length === 0 || isPending}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--color-brand-gold)] px-3 py-2 text-sm font-semibold text-black disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Plus className="w-4 h-4" />
                New Message
              </button>
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
                aria-controls="conversation-filter-panel"
                id="conversation-filter-inbox"
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
                aria-controls="conversation-filter-panel"
                id="conversation-filter-unread"
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
                aria-controls="conversation-filter-panel"
                id="conversation-filter-archived"
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

          <div
            id="conversation-filter-panel"
            className="flex-1 overflow-y-auto"
            role="tabpanel"
            aria-labelledby={`conversation-filter-${filter}`}
          >
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
                        <div className="mt-0.5 flex items-center justify-between gap-3">
                          <p className="text-sm text-silver truncate">
                            {roleLabel(counterpartPersonForThread(thread)?.role)}
                          </p>
                          <p className="text-xs text-silver-gray shrink-0">
                            {formatWhen(thread.lastMessageAt || thread.createdAt)}
                          </p>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

        </aside>

        <section
          className={`bg-charcoal border border-graphite rounded-xl overflow-hidden flex-col min-h-[520px] xl:min-h-[620px] ${isComposing || selectedThread ? 'flex' : 'hidden xl:flex'}`}
          aria-label={isComposing ? 'New message' : selectedThread ? 'Conversation' : 'Conversation details'}
        >
          {isComposing ? (
            <form
              onSubmit={handleNewMessageSend}
              className="flex-1 flex flex-col"
              aria-label="New message"
            >
              <div className="p-4 border-b border-graphite">
                <button
                  type="button"
                  onClick={returnToInbox}
                  disabled={isPending}
                  className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-silver hover:bg-graphite/50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to conversations
                </button>
                <h2 className="text-lg font-semibold text-white">New Message</h2>
                <p className="text-sm text-silver mt-1">
                  Pick a person you are allowed to message, type your message, then send.
                </p>
              </div>

              <div className="flex-1 p-4 space-y-5">
                <div>
                  <label
                    className="block text-sm font-medium text-white mb-2"
                    htmlFor="message-counterpart"
                  >
                    Pick Person
                  </label>
                  <select
                    id="message-counterpart"
                    value={counterpartId}
                    onChange={(event) => {
                      composeOperationIdRef.current = null
                      setCounterpartId(event.target.value)
                    }}
                    className="w-full min-h-12 bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
                  >
                    <option value="">Choose a person</option>
                    {availableCounterparts.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} — {person.role === 'instructor'
                          ? 'Instructor'
                          : person.role === 'school_admin' || person.role === 'admin'
                            ? 'School Admin'
                            : 'Student'}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-silver-gray">
                    Only authorized recipients appear here.
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-white mb-2"
                    htmlFor="new-message-body"
                  >
                    Message
                  </label>
                  <textarea
                    id="new-message-body"
                    value={newMessageBody}
                    onChange={(event) => {
                      composeOperationIdRef.current = null
                      setNewMessageBody(event.target.value)
                    }}
                    maxLength={4000}
                    rows={8}
                    placeholder="Type your message…"
                    className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-3 text-white placeholder-silver-gray resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
                  />
                  <div className="mt-2 text-right text-xs text-silver-gray">
                    {newMessageBody.length}/4000
                  </div>
                </div>
              </div>

              <div className="border-t border-graphite p-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={returnToInbox}
                  disabled={isPending}
                  className="min-h-12 rounded-lg border border-graphite px-4 py-2 text-sm font-medium text-silver hover:bg-graphite/50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !counterpartId || !newMessageBody.trim()}
                  className="min-h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand-gold)] px-5 py-2 text-sm font-semibold text-black disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  Send
                </button>
              </div>
            </form>
          ) : selectedThread ? (
            <>
              <div className="p-4 border-b border-graphite flex flex-wrap items-start justify-between gap-3">
                <div>
                  <button
                    type="button"
                    onClick={returnToInbox}
                    className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-silver hover:bg-graphite/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to conversations
                  </button>
                  <h2 className="text-lg font-semibold text-white">
                    {counterpartForThread(selectedThread)}
                  </h2>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-silver">
                    <span>
                      {roleLabel(counterpartPersonForThread(selectedThread)?.role)}
                    </span>
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
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-graphite px-3 py-2 text-sm text-silver hover:bg-graphite/50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)]"
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
                      onChange={(event) => {
                        replyOperationIdRef.current = null
                        setReplyBody(event.target.value)
                      }}
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
                  <span>Private to this authorized recipient.</span>
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
                  Select a conversation or choose New Message.
                </p>
                {availableCounterparts.length === 0 && (
                  <p className="text-xs text-silver-gray mt-3">
                    No authorized recipients are available right now.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

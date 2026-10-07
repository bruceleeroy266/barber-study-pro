'use server'

import { createClient } from '@/lib/supabase-server'

type MessagingRole = 'student' | 'apprentice' | 'instructor' | 'school_admin' | 'admin'

interface MessagingActor {
  id: string
  schoolId: string
  role: MessagingRole
}

interface CommunicationMessageRow {
  id: string
  thread_id: string
  school_id: string
  sender_id: string
  body: string
  client_operation_id?: string | null
  sent_at: string
  created_at: string
}

interface CommunicationReadRow {
  message_id: string
  reader_id?: string
  read_at?: string
}

interface CommunicationThreadRow {
  id: string
  school_id: string
  student_id: string | null
  instructor_id: string | null
  participant_one_id: string
  participant_two_id: string
  subject: string
  status: string
  last_message_at: string | null
  created_at: string
  updated_at: string
}

export interface ProductionCommunicationThread {
  id: string
  schoolId: string
  studentId: string | null
  instructorId: string | null
  participantOneId: string
  participantTwoId: string
  subject: string
  status: 'active' | 'archived'
  lastMessageAt: string | null
  createdAt: string
  updatedAt: string
  unreadCount: number
}

export interface ProductionCommunicationMessage {
  id: string
  threadId: string
  schoolId: string
  senderId: string
  body: string
  sentAt: string
  createdAt: string
  readAt: string | null
}

export type MessagingRuntimeResult<T> =
  | { success: true; data: T }
  | { success: false; message: string }

function logMessagingFailure(
  operation: string,
  error: { code?: string; message?: string } | null | undefined
) {
  console.error('[communications]', {
    operation,
    code: error?.code || 'unknown',
    message: error?.message || 'unknown failure',
  })
}

async function getMessagingActor(): Promise<
  MessagingRuntimeResult<{ actor: MessagingActor; supabase: Awaited<ReturnType<typeof createClient>> }>
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'You must be signed in to use messaging.' }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, school_id, role')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return { success: false, message: 'Unable to load your messaging profile.' }
  }

  if (!profile.school_id) {
    return { success: false, message: 'Your account is not assigned to a school.' }
  }

  if (!['student', 'apprentice', 'instructor', 'school_admin', 'admin'].includes(profile.role)) {
    return { success: false, message: 'Messaging is not available for this account role.' }
  }

  return {
    success: true,
    data: {
      supabase,
      actor: {
        id: user.id,
        schoolId: profile.school_id,
        role: profile.role as MessagingRole,
      },
    },
  }
}

function mapThread(row: CommunicationThreadRow): ProductionCommunicationThread {
  return {
    id: row.id,
    schoolId: row.school_id,
    studentId: row.student_id,
    instructorId: row.instructor_id,
    participantOneId: row.participant_one_id,
    participantTwoId: row.participant_two_id,
    subject: row.subject,
    status: row.status as 'active' | 'archived',
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    unreadCount: 0,
  }
}

export async function openCommunicationThread(
  counterpartId: string,
  subject = 'Conversation'
): Promise<MessagingRuntimeResult<{
  thread: ProductionCommunicationThread
  created: boolean
}>> {
  const trimmedSubject = subject.trim()

  if (!counterpartId) {
    return { success: false, message: 'A messaging counterpart is required.' }
  }

  if (trimmedSubject.length < 1 || trimmedSubject.length > 160) {
    return { success: false, message: 'Conversation subjects must be between 1 and 160 characters.' }
  }

  const actorResult = await getMessagingActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data

  const { data: counterpart, error: counterpartError } = await supabase
    .from('profiles')
    .select('id, school_id, role, approval_status, is_disabled')
    .eq('id', counterpartId)
    .single()

  if (counterpartError || !counterpart) {
    return { success: false, message: 'This recipient is not available.' }
  }

  const { data: authorized, error: authorizationError } = await supabase.rpc(
    'communication_pair_authorized',
    {
      p_actor_id: actor.id,
      p_recipient_id: counterpartId,
      p_school_id: actor.schoolId,
    }
  )

  if (authorizationError) {
    logMessagingFailure('authorize_recipient', authorizationError)
    return { success: false, message: 'Unable to verify this recipient right now.' }
  }

  if (!authorized) {
    return { success: false, message: 'You are not authorized to message this person.' }
  }

  const { data: existingThreads, error: existingError } = await supabase
    .from('communication_threads')
    .select(
      'id, school_id, student_id, instructor_id, participant_one_id, participant_two_id, subject, status, last_message_at, created_at, updated_at'
    )
    .eq('school_id', actor.schoolId)
    .eq('status', 'active')
    .or(
      `and(participant_one_id.eq.${actor.id},participant_two_id.eq.${counterpartId}),and(participant_one_id.eq.${counterpartId},participant_two_id.eq.${actor.id})`
    )
    .order('created_at', { ascending: false })
    .limit(1)

  if (existingError) {
    logMessagingFailure('open_thread_lookup', existingError)
    return { success: false, message: 'Unable to open this conversation right now.' }
  }

  const existingThread = existingThreads?.[0]
  if (existingThread) {
    return {
      success: true,
      data: {
        thread: mapThread(existingThread),
        created: false,
      },
    }
  }

  const actorIsLearner = actor.role === 'student' || actor.role === 'apprentice'
  const counterpartIsLearner =
    counterpart.role === 'student' || counterpart.role === 'apprentice'
  const actorIsInstructor = actor.role === 'instructor'
  const counterpartIsInstructor = counterpart.role === 'instructor'

  let studentId: string | null = null
  let instructorId: string | null = null

  if (actorIsLearner && counterpartIsInstructor) {
    studentId = actor.id
    instructorId = counterpartId
  } else if (actorIsInstructor && counterpartIsLearner) {
    studentId = counterpartId
    instructorId = actor.id
  }

  const { data: createdThread, error: createError } = await supabase
    .from('communication_threads')
    .insert({
      school_id: actor.schoolId,
      student_id: studentId,
      instructor_id: instructorId,
      participant_one_id: actor.id,
      participant_two_id: counterpartId,
      subject: trimmedSubject,
      status: 'active',
      created_by: actor.id,
    })
    .select(
      'id, school_id, student_id, instructor_id, participant_one_id, participant_two_id, subject, status, last_message_at, created_at, updated_at'
    )
    .single()

  if (createError || !createdThread) {
    if (createError?.code === '23505') {
      const { data: racedThreads, error: racedError } = await supabase
        .from('communication_threads')
        .select(
          'id, school_id, student_id, instructor_id, participant_one_id, participant_two_id, subject, status, last_message_at, created_at, updated_at'
        )
        .eq('school_id', actor.schoolId)
        .eq('status', 'active')
        .or(
          `and(participant_one_id.eq.${actor.id},participant_two_id.eq.${counterpartId}),and(participant_one_id.eq.${counterpartId},participant_two_id.eq.${actor.id})`
        )
        .order('created_at', { ascending: false })
        .limit(1)

      const racedThread = racedThreads?.[0]
      if (!racedError && racedThread) {
        return {
          success: true,
          data: {
            thread: mapThread(racedThread),
            created: false,
          },
        }
      }
    }

    logMessagingFailure('open_thread_create', createError)
    return {
      success: false,
      message: 'Unable to open this conversation right now.',
    }
  }

  return {
    success: true,
    data: {
      thread: mapThread(createdThread),
      created: true,
    },
  }
}

export async function loadCommunicationThreads(): Promise<
  MessagingRuntimeResult<ProductionCommunicationThread[]>
> {
  const actorResult = await getMessagingActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data
  const { data, error } = await supabase
    .from('communication_threads')
    .select(
      'id, school_id, student_id, instructor_id, participant_one_id, participant_two_id, subject, status, last_message_at, created_at, updated_at'
    )
    .order('last_message_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    logMessagingFailure('load_threads', error)
    return { success: false, message: 'Unable to load conversations right now.' }
  }

  const rows = data || []
  const threadIds = rows.map((thread: CommunicationThreadRow) => thread.id)
  const unreadByThread = new Map<string, number>()

  if (threadIds.length > 0) {
    const { data: incoming, error: incomingError } = await supabase
      .from('communication_messages')
      .select('id, thread_id')
      .in('thread_id', threadIds)
      .neq('sender_id', actor.id)

    if (incomingError) {
      logMessagingFailure('load_unread_messages', incomingError)
      return { success: false, message: 'Unable to load unread status right now.' }
    }

    const incomingIds = (incoming || []).map(
      (message: Pick<CommunicationMessageRow, 'id'>) => message.id
    )
    const readIds = new Set<string>()

    if (incomingIds.length > 0) {
      const { data: reads, error: readsError } = await supabase
        .from('communication_message_reads')
        .select('message_id')
        .eq('reader_id', actor.id)
        .in('message_id', incomingIds)

      if (readsError) {
        logMessagingFailure('load_unread_receipts', readsError)
        return { success: false, message: 'Unable to load unread status right now.' }
      }

      for (const read of reads || []) {
        readIds.add(read.message_id)
      }
    }

    for (const message of (incoming || []) as Array<
      Pick<CommunicationMessageRow, 'id' | 'thread_id'>
    >) {
      if (!readIds.has(message.id)) {
        unreadByThread.set(
          message.thread_id,
          (unreadByThread.get(message.thread_id) || 0) + 1
        )
      }
    }
  }

  return {
    success: true,
    data: rows.map((row: CommunicationThreadRow) => ({
      ...mapThread(row),
      unreadCount: unreadByThread.get(row.id) || 0,
    })),
  }
}

export async function loadCommunicationThreadMessages(
  threadId: string
): Promise<MessagingRuntimeResult<{
  thread: ProductionCommunicationThread
  messages: ProductionCommunicationMessage[]
}>> {
  if (!threadId) {
    return { success: false, message: 'A thread is required.' }
  }

  const actorResult = await getMessagingActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data

  const { data: thread, error: threadError } = await supabase
    .from('communication_threads')
    .select(
      'id, school_id, student_id, instructor_id, participant_one_id, participant_two_id, subject, status, last_message_at, created_at, updated_at'
    )
    .eq('id', threadId)
    .single()

  if (threadError || !thread) {
    return { success: false, message: 'Conversation not found or not authorized.' }
  }

  const { data: messages, error: messageError } = await supabase
    .from('communication_messages')
    .select('id, thread_id, school_id, sender_id, body, sent_at, created_at')
    .eq('thread_id', threadId)
    .order('sent_at', { ascending: true })

  if (messageError) {
    logMessagingFailure('load_thread_messages', messageError)
    return { success: false, message: 'Unable to load this conversation right now.' }
  }

  const messageIds = (messages || []).map((message: CommunicationMessageRow) => message.id)
  let readByMessage = new Map<string, string>()

  if (messageIds.length > 0) {
    const { data: reads, error: readsError } = await supabase
      .from('communication_message_reads')
      .select('message_id, reader_id, read_at')
      .in('message_id', messageIds)
      .eq('reader_id', actor.id)

    if (readsError) {
      logMessagingFailure('load_thread_reads', readsError)
      return { success: false, message: 'Unable to load message status right now.' }
    }

    readByMessage = new Map((reads || []).map((read: CommunicationReadRow) => [read.message_id, read.read_at ?? '']))
  }

  return {
    success: true,
    data: {
      thread: mapThread(thread),
      messages: (messages || []).map((message: CommunicationMessageRow) => ({
        id: message.id,
        threadId: message.thread_id,
        schoolId: message.school_id,
        senderId: message.sender_id,
        body: message.body,
        sentAt: message.sent_at,
        createdAt: message.created_at,
        readAt: readByMessage.get(message.id) ?? null,
      })),
    },
  }
}

export async function archiveCommunicationThread(
  threadId: string
): Promise<MessagingRuntimeResult<{ thread: ProductionCommunicationThread }>> {
  if (!threadId) {
    return { success: false, message: 'A thread is required.' }
  }

  const actorResult = await getMessagingActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data

  if (actor.role !== 'instructor') {
    return { success: false, message: 'Only instructors can archive conversations.' }
  }

  const { data: thread, error } = await supabase
    .from('communication_threads')
    .update({
      status: 'archived',
      updated_at: new Date().toISOString(),
    })
    .eq('id', threadId)
    .or(`participant_one_id.eq.${actor.id},participant_two_id.eq.${actor.id}`)
    .eq('status', 'active')
    .select(
      'id, school_id, student_id, instructor_id, participant_one_id, participant_two_id, subject, status, last_message_at, created_at, updated_at'
    )
    .single()

  if (error || !thread) {
    logMessagingFailure('archive_thread', error)
    return {
      success: false,
      message: 'Unable to archive this conversation right now.',
    }
  }

  return {
    success: true,
    data: { thread: mapThread(thread) },
  }
}

export async function sendCommunicationMessage(
  threadId: string,
  body: string,
  operationId: string
): Promise<MessagingRuntimeResult<ProductionCommunicationMessage>> {
  const trimmedBody = body.trim()
  if (!threadId) {
    return { success: false, message: 'A thread is required.' }
  }
  if (!operationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(operationId)) {
    return { success: false, message: 'A valid message operation is required.' }
  }
  if (trimmedBody.length < 1 || trimmedBody.length > 4000) {
    return { success: false, message: 'Messages must be between 1 and 4,000 characters.' }
  }

  const actorResult = await getMessagingActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data

  // RLS confirms participant visibility here and re-checks active assignment on INSERT.
  const { data: thread, error: threadError } = await supabase
    .from('communication_threads')
    .select('id, school_id, status')
    .eq('id', threadId)
    .single()

  if (threadError || !thread) {
    return { success: false, message: 'Conversation not found or not authorized.' }
  }

  if (thread.status !== 'active') {
    return { success: false, message: 'This conversation is archived.' }
  }

  const { data: message, error } = await supabase
    .from('communication_messages')
    .insert({
      thread_id: thread.id,
      school_id: thread.school_id,
      sender_id: actor.id,
      body: trimmedBody,
      client_operation_id: operationId,
    })
    .select('id, thread_id, school_id, sender_id, body, client_operation_id, sent_at, created_at')
    .single()

  let persistedMessage = message

  if (error || !message) {
    if (error?.code === '23505') {
      const { data: existing, error: existingError } = await supabase
        .from('communication_messages')
        .select('id, thread_id, school_id, sender_id, body, client_operation_id, sent_at, created_at')
        .eq('sender_id', actor.id)
        .eq('client_operation_id', operationId)
        .maybeSingle()

      if (
        !existingError &&
        existing &&
        existing.thread_id === thread.id &&
        existing.body === trimmedBody
      ) {
        persistedMessage = existing
      } else {
        logMessagingFailure('send_message_idempotency_conflict', existingError || error)
        return { success: false, message: 'Unable to safely retry this message.' }
      }
    } else {
      logMessagingFailure('send_message', error)
      return { success: false, message: 'Unable to send this message right now.' }
    }
  }

  if (!persistedMessage) {
    return { success: false, message: 'Unable to send this message right now.' }
  }

  return {
    success: true,
    data: {
      id: persistedMessage.id,
      threadId: persistedMessage.thread_id,
      schoolId: persistedMessage.school_id,
      senderId: persistedMessage.sender_id,
      body: persistedMessage.body,
      sentAt: persistedMessage.sent_at,
      createdAt: persistedMessage.created_at,
      readAt: null,
    },
  }
}

export async function markCommunicationThreadRead(
  threadId: string
): Promise<MessagingRuntimeResult<{ markedRead: number; remainingUnread: number }>> {
  if (!threadId) {
    return { success: false, message: 'A thread is required.' }
  }

  const actorResult = await getMessagingActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data

  const { data: thread, error: threadError } = await supabase
    .from('communication_threads')
    .select('id')
    .eq('id', threadId)
    .single()

  if (threadError || !thread) {
    return { success: false, message: 'Conversation not found or not authorized.' }
  }

  const { data: incomingMessages, error: messageError } = await supabase
    .from('communication_messages')
    .select('id')
    .eq('thread_id', threadId)
    .neq('sender_id', actor.id)

  if (messageError) {
    logMessagingFailure('mark_read_load_messages', messageError)
    return { success: false, message: 'Unable to update read status right now.' }
  }

  const incomingIds = (incomingMessages || []).map(
    (message: Pick<CommunicationMessageRow, 'id'>) => message.id
  )
  if (incomingIds.length === 0) {
    return { success: true, data: { markedRead: 0, remainingUnread: 0 } }
  }

  const { data: insertedReads, error: insertError } = await supabase
    .from('communication_message_reads')
    .upsert(
      incomingIds.map((messageId: string) => ({
        message_id: messageId,
        reader_id: actor.id,
      })),
      {
        onConflict: 'message_id,reader_id',
        ignoreDuplicates: true,
      }
    )
    .select('message_id')

  if (insertError) {
    logMessagingFailure('mark_read_upsert_receipts', insertError)
    return { success: false, message: 'Unable to update read status right now.' }
  }

  const { data: currentIncoming, error: currentIncomingError } = await supabase
    .from('communication_messages')
    .select('id')
    .eq('thread_id', threadId)
    .neq('sender_id', actor.id)

  if (currentIncomingError) {
    logMessagingFailure('mark_read_reconcile_messages', currentIncomingError)
    return { success: false, message: 'Unable to reconcile unread status right now.' }
  }

  const currentIncomingIds = (currentIncoming || []).map(
    (message: Pick<CommunicationMessageRow, 'id'>) => message.id
  )

  if (currentIncomingIds.length === 0) {
    return {
      success: true,
      data: { markedRead: insertedReads?.length || 0, remainingUnread: 0 },
    }
  }

  const { data: currentReads, error: currentReadsError } = await supabase
    .from('communication_message_reads')
    .select('message_id')
    .eq('reader_id', actor.id)
    .in('message_id', currentIncomingIds)

  if (currentReadsError) {
    logMessagingFailure('mark_read_reconcile_receipts', currentReadsError)
    return { success: false, message: 'Unable to reconcile unread status right now.' }
  }

  const currentReadIds = new Set(
    (currentReads || []).map(
      (read: Pick<CommunicationReadRow, 'message_id'>) => read.message_id
    )
  )
  const remainingUnread = currentIncomingIds.filter(
    (messageId: string) => !currentReadIds.has(messageId)
  ).length

  return {
    success: true,
    data: {
      markedRead: insertedReads?.length || 0,
      remainingUnread,
    },
  }
}

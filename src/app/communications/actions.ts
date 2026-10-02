'use server'

import { createClient } from '@/lib/supabase-server'

type MessagingRole = 'student' | 'apprentice' | 'instructor'

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
  sent_at: string
  created_at: string
}

interface CommunicationReadRow {
  message_id: string
  reader_id?: string
  read_at?: string
}

export interface ProductionCommunicationThread {
  id: string
  schoolId: string
  studentId: string
  instructorId: string
  subject: string
  status: 'active' | 'archived'
  lastMessageAt: string | null
  createdAt: string
  updatedAt: string
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

  if (!['student', 'apprentice', 'instructor'].includes(profile.role)) {
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

function mapThread(row: {
  id: string
  school_id: string
  student_id: string
  instructor_id: string
  subject: string
  status: string
  last_message_at: string | null
  created_at: string
  updated_at: string
}): ProductionCommunicationThread {
  return {
    id: row.id,
    schoolId: row.school_id,
    studentId: row.student_id,
    instructorId: row.instructor_id,
    subject: row.subject,
    status: row.status as 'active' | 'archived',
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
  const studentId = actor.role === 'instructor' ? counterpartId : actor.id
  const instructorId = actor.role === 'instructor' ? actor.id : counterpartId

  const { data: assignment, error: assignmentError } = await supabase
    .from('student_instructor_assignments')
    .select('id, school_id, student_id, instructor_id')
    .eq('school_id', actor.schoolId)
    .eq('student_id', studentId)
    .eq('instructor_id', instructorId)
    .eq('is_active', true)
    .is('ended_at', null)
    .maybeSingle()

  if (assignmentError) {
    return { success: false, message: assignmentError.message }
  }

  if (!assignment) {
    return { success: false, message: 'No active instructor assignment exists for this conversation.' }
  }

  const { data: existingThreads, error: existingError } = await supabase
    .from('communication_threads')
    .select(
      'id, school_id, student_id, instructor_id, subject, status, last_message_at, created_at, updated_at'
    )
    .eq('school_id', assignment.school_id)
    .eq('student_id', assignment.student_id)
    .eq('instructor_id', assignment.instructor_id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)

  if (existingError) {
    return { success: false, message: existingError.message }
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

  const { data: createdThread, error: createError } = await supabase
    .from('communication_threads')
    .insert({
      school_id: assignment.school_id,
      student_id: assignment.student_id,
      instructor_id: assignment.instructor_id,
      subject: trimmedSubject,
      status: 'active',
      created_by: actor.id,
    })
    .select(
      'id, school_id, student_id, instructor_id, subject, status, last_message_at, created_at, updated_at'
    )
    .single()

  if (createError || !createdThread) {
    return {
      success: false,
      message: createError?.message || 'Unable to open this conversation.',
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

  const { supabase } = actorResult.data
  const { data, error } = await supabase
    .from('communication_threads')
    .select(
      'id, school_id, student_id, instructor_id, subject, status, last_message_at, created_at, updated_at'
    )
    .order('last_message_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, message: error.message }
  }

  return {
    success: true,
    data: (data || []).map(mapThread),
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
      'id, school_id, student_id, instructor_id, subject, status, last_message_at, created_at, updated_at'
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
    return { success: false, message: messageError.message }
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
      return { success: false, message: readsError.message }
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

export async function sendCommunicationMessage(
  threadId: string,
  body: string
): Promise<MessagingRuntimeResult<ProductionCommunicationMessage>> {
  const trimmedBody = body.trim()
  if (!threadId) {
    return { success: false, message: 'A thread is required.' }
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
    })
    .select('id, thread_id, school_id, sender_id, body, sent_at, created_at')
    .single()

  if (error || !message) {
    return { success: false, message: error?.message || 'Unable to send message.' }
  }

  return {
    success: true,
    data: {
      id: message.id,
      threadId: message.thread_id,
      schoolId: message.school_id,
      senderId: message.sender_id,
      body: message.body,
      sentAt: message.sent_at,
      createdAt: message.created_at,
      readAt: null,
    },
  }
}

export async function markCommunicationThreadRead(
  threadId: string
): Promise<MessagingRuntimeResult<{ markedRead: number }>> {
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
    .select('id, sender_id')
    .eq('thread_id', threadId)
    .neq('sender_id', actor.id)

  if (messageError) {
    return { success: false, message: messageError.message }
  }

  const incomingIds = (incomingMessages || []).map((message: Pick<CommunicationMessageRow, 'id' | 'sender_id'>) => message.id)
  if (incomingIds.length === 0) {
    return { success: true, data: { markedRead: 0 } }
  }

  const { data: existingReads, error: readsError } = await supabase
    .from('communication_message_reads')
    .select('message_id')
    .eq('reader_id', actor.id)
    .in('message_id', incomingIds)

  if (readsError) {
    return { success: false, message: readsError.message }
  }

  const existingIds = new Set((existingReads || []).map((read: Pick<CommunicationReadRow, 'message_id'>) => read.message_id))
  const unreadIds = incomingIds.filter((messageId: string) => !existingIds.has(messageId))

  if (unreadIds.length === 0) {
    return { success: true, data: { markedRead: 0 } }
  }

  const { error: insertError } = await supabase
    .from('communication_message_reads')
    .insert(unreadIds.map((messageId: string) => ({ message_id: messageId, reader_id: actor.id })))

  if (insertError) {
    return { success: false, message: insertError.message }
  }

  return { success: true, data: { markedRead: unreadIds.length } }
}

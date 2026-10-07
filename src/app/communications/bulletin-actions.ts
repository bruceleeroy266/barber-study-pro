'use server'

import { createClient } from '@/lib/supabase-server'

type BulletinPriority = 'normal' | 'important' | 'urgent'
type BulletinStatus = 'draft' | 'published' | 'archived'
type AudienceType = 'school' | 'program' | 'student'
type ManagerRole = 'instructor' | 'admin' | 'school_admin'
type LearnerRole = 'student' | 'apprentice'

interface BulletinActor {
  id: string
  schoolId: string
  role: ManagerRole | LearnerRole
}

interface BulletinRow {
  id: string
  school_id: string
  author_id: string
  title: string
  body: string
  priority: BulletinPriority
  status: BulletinStatus
  is_pinned: boolean
  acknowledgment_required: boolean
  publish_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
}

interface AudienceRow {
  id: string
  bulletin_id: string
  school_id: string
  audience_type: AudienceType
  program_id: string | null
  student_id: string | null
  created_at: string
}

interface AckRow {
  id: string
  bulletin_id: string
  school_id: string
  student_id: string
  acknowledged_at: string
}

export interface ProductionBulletin {
  id: string
  schoolId: string
  authorId: string
  title: string
  body: string
  priority: BulletinPriority
  status: BulletinStatus
  isPinned: boolean
  acknowledgmentRequired: boolean
  publishAt: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  audiences: Array<{
    type: AudienceType
    programId: string | null
    studentId: string | null
  }>
  acknowledgmentCount: number
  acknowledgedByCurrentUser: boolean
}

export interface BulletinAcknowledgmentDetail {
  studentId: string
  acknowledgedAt: string
}

export type BulletinRuntimeResult<T> =
  | { success: true; data: T }
  | { success: false; message: string }

export interface PublishBulletinInput {
  title: string
  body: string
  priority: BulletinPriority
  isPinned: boolean
  acknowledgmentRequired: boolean
  publishAt?: string | null
  expiresAt?: string | null
  audiences: Array<{
    type: AudienceType
    programId?: string | null
    studentId?: string | null
  }>
}

async function getBulletinActor(): Promise<
  BulletinRuntimeResult<{
    actor: BulletinActor
    supabase: Awaited<ReturnType<typeof createClient>>
  }>
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'You must be signed in to use bulletins.' }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, school_id, role, approval_status, is_disabled')
    .eq('id', user.id)
    .single()

  if (error || !profile || !profile.school_id) {
    return { success: false, message: 'Your account is not assigned to a school.' }
  }

  if (profile.approval_status !== 'approved' || profile.is_disabled) {
    return { success: false, message: 'Bulletins are not available for this account.' }
  }

  if (!['instructor', 'admin', 'school_admin', 'student', 'apprentice'].includes(profile.role)) {
    return { success: false, message: 'Bulletins are not available for this account role.' }
  }

  return {
    success: true,
    data: {
      supabase,
      actor: {
        id: user.id,
        schoolId: profile.school_id,
        role: profile.role as BulletinActor['role'],
      },
    },
  }
}

function mapBulletin(
  row: BulletinRow,
  audiences: AudienceRow[] = [],
  acknowledgments: AckRow[] = [],
  currentUserId?: string
): ProductionBulletin {
  return {
    id: row.id,
    schoolId: row.school_id,
    authorId: row.author_id,
    title: row.title,
    body: row.body,
    priority: row.priority,
    status: row.status,
    isPinned: row.is_pinned,
    acknowledgmentRequired: row.acknowledgment_required,
    publishAt: row.publish_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    audiences: audiences
      .filter((audience) => audience.bulletin_id === row.id)
      .map((audience) => ({
        type: audience.audience_type,
        programId: audience.program_id,
        studentId: audience.student_id,
      })),
    acknowledgmentCount: acknowledgments.filter(
      (ack) => ack.bulletin_id === row.id
    ).length,
    acknowledgedByCurrentUser: currentUserId
      ? acknowledgments.some(
          (ack) =>
            ack.bulletin_id === row.id && ack.student_id === currentUserId
        )
      : false,
  }
}

export async function loadManagedBulletins(): Promise<
  BulletinRuntimeResult<ProductionBulletin[]>
> {
  const actorResult = await getBulletinActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data
  if (!['instructor', 'admin', 'school_admin'].includes(actor.role)) {
    return { success: false, message: 'Bulletin management is not available for this account.' }
  }

  const { data: bulletins, error } = await supabase
    .from('bulletins')
    .select('id, school_id, author_id, title, body, priority, status, is_pinned, acknowledgment_required, publish_at, expires_at, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) return { success: false, message: error.message }

  const ids = (bulletins || []).map((bulletin: BulletinRow) => bulletin.id)
  let audiences: AudienceRow[] = []
  let acknowledgments: AckRow[] = []

  if (ids.length > 0) {
    const [audienceResult, acknowledgmentResult] = await Promise.all([
      supabase
        .from('bulletin_audiences')
        .select('id, bulletin_id, school_id, audience_type, program_id, student_id, created_at')
        .in('bulletin_id', ids),
      supabase
        .from('bulletin_acknowledgments')
        .select('id, bulletin_id, school_id, student_id, acknowledged_at')
        .in('bulletin_id', ids),
    ])

    if (audienceResult.error) return { success: false, message: audienceResult.error.message }
    if (acknowledgmentResult.error) return { success: false, message: acknowledgmentResult.error.message }

    audiences = (audienceResult.data || []) as AudienceRow[]
    acknowledgments = (acknowledgmentResult.data || []) as AckRow[]
  }

  return {
    success: true,
    data: ((bulletins || []) as BulletinRow[]).map((bulletin) =>
      mapBulletin(bulletin, audiences, acknowledgments)
    ),
  }
}

export async function loadStudentBulletins(): Promise<
  BulletinRuntimeResult<ProductionBulletin[]>
> {
  const actorResult = await getBulletinActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data
  if (!['student', 'apprentice'].includes(actor.role)) {
    return { success: false, message: 'Student bulletin delivery is not available for this account.' }
  }

  const { data: bulletins, error } = await supabase
    .from('bulletins')
    .select('id, school_id, author_id, title, body, priority, status, is_pinned, acknowledgment_required, publish_at, expires_at, created_at, updated_at')
    .order('is_pinned', { ascending: false })
    .order('priority', { ascending: false })
    .order('publish_at', { ascending: false })

  if (error) return { success: false, message: error.message }

  const ids = (bulletins || []).map((bulletin: BulletinRow) => bulletin.id)
  let acknowledgments: AckRow[] = []

  if (ids.length > 0) {
    const { data, error: ackError } = await supabase
      .from('bulletin_acknowledgments')
      .select('id, bulletin_id, school_id, student_id, acknowledged_at')
      .eq('student_id', actor.id)
      .in('bulletin_id', ids)

    if (ackError) return { success: false, message: ackError.message }
    acknowledgments = (data || []) as AckRow[]
  }

  const priorityRank: Record<BulletinPriority, number> = {
    urgent: 2,
    important: 1,
    normal: 0,
  }

  const mapped = ((bulletins || []) as BulletinRow[]).map((bulletin) =>
    mapBulletin(bulletin, [], acknowledgments, actor.id)
  )

  mapped.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
    if (priorityRank[a.priority] !== priorityRank[b.priority]) {
      return priorityRank[b.priority] - priorityRank[a.priority]
    }
    const aTime = new Date(a.publishAt || a.createdAt).getTime()
    const bTime = new Date(b.publishAt || b.createdAt).getTime()
    return bTime - aTime
  })

  return {
    success: true,
    data: mapped,
  }
}

export async function publishBulletin(
  input: PublishBulletinInput,
  operationId: string
): Promise<BulletinRuntimeResult<ProductionBulletin>> {
  const actorResult = await getBulletinActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data
  if (!['instructor', 'admin', 'school_admin'].includes(actor.role)) {
    return { success: false, message: 'You are not authorized to publish bulletins.' }
  }

  if (
    !operationId ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(operationId)
  ) {
    return { success: false, message: 'A valid bulletin publish operation is required.' }
  }

  const title = input.title.trim()
  const body = input.body.trim()

  if (title.length < 1 || title.length > 160) {
    return { success: false, message: 'Bulletin titles must be between 1 and 160 characters.' }
  }
  if (body.length < 1 || body.length > 10000) {
    return { success: false, message: 'Bulletin body must be between 1 and 10,000 characters.' }
  }
  if (!['normal', 'important', 'urgent'].includes(input.priority)) {
    return { success: false, message: 'Invalid bulletin priority.' }
  }
  if (!input.audiences.length) {
    return { success: false, message: 'Choose at least one bulletin audience.' }
  }

  const publishAt = input.publishAt || null
  const expiresAt = input.expiresAt || null

  if (
    publishAt &&
    expiresAt &&
    new Date(expiresAt).getTime() <= new Date(publishAt).getTime()
  ) {
    return { success: false, message: 'Expiration must be after the publish time.' }
  }

  if (
    actor.role === 'instructor' &&
    input.audiences.some(
      (audience) => audience.type !== 'student' || !audience.studentId
    )
  ) {
    return {
      success: false,
      message: 'Instructors may target only their actively assigned students.',
    }
  }

  const audiencesPayload = input.audiences.map((audience) => ({
    audience_type: audience.type,
    program_id: audience.type === 'program' ? audience.programId || null : null,
    student_id: audience.type === 'student' ? audience.studentId || null : null,
  }))

  const { data: bulletinId, error: publishError } = await supabase.rpc(
    'publish_bulletin_atomic',
    {
      p_operation_id: operationId,
      p_title: title,
      p_body: body,
      p_priority: input.priority,
      p_is_pinned: input.isPinned,
      p_acknowledgment_required: input.acknowledgmentRequired,
      p_publish_at: publishAt,
      p_expires_at: expiresAt,
      p_audiences: audiencesPayload,
    }
  )

  if (publishError || !bulletinId) {
    console.error('[bulletins] publish failed', {
      code: publishError?.code,
      hint: publishError?.hint,
    })
    if (publishError?.code === '23505') {
      return { success: false, message: 'This publish retry no longer matches the original bulletin.' }
    }
    return { success: false, message: 'Unable to publish this bulletin right now.' }
  }

  const [bulletinResult, audienceResult] = await Promise.all([
    supabase
      .from('bulletins')
      .select('id, school_id, author_id, title, body, priority, status, is_pinned, acknowledgment_required, publish_at, expires_at, created_at, updated_at')
      .eq('id', bulletinId)
      .single(),
    supabase
      .from('bulletin_audiences')
      .select('id, bulletin_id, school_id, audience_type, program_id, student_id, created_at')
      .eq('bulletin_id', bulletinId),
  ])

  if (bulletinResult.error || !bulletinResult.data || audienceResult.error) {
    console.error('[bulletins] publish reload failed', {
      bulletinCode: bulletinResult.error?.code,
      audienceCode: audienceResult.error?.code,
    })
    return { success: false, message: 'Bulletin was published, but could not be reloaded right now.' }
  }

  return {
    success: true,
    data: mapBulletin(
      bulletinResult.data as BulletinRow,
      (audienceResult.data || []) as AudienceRow[]
    ),
  }
}

export async function archiveBulletin(
  bulletinId: string
): Promise<BulletinRuntimeResult<{ id: string }>> {
  if (!bulletinId) return { success: false, message: 'A bulletin is required.' }

  const actorResult = await getBulletinActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data
  if (!['instructor', 'admin', 'school_admin'].includes(actor.role)) {
    return { success: false, message: 'You are not authorized to archive bulletins.' }
  }

  const { data, error } = await supabase
    .from('bulletins')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', bulletinId)
    .select('id')
    .single()

  if (error || !data) {
    return { success: false, message: error?.message || 'Unable to archive bulletin.' }
  }

  return { success: true, data: { id: data.id } }
}

export async function acknowledgeBulletin(
  bulletinId: string
): Promise<BulletinRuntimeResult<{ bulletinId: string }>> {
  if (!bulletinId) return { success: false, message: 'A bulletin is required.' }

  const actorResult = await getBulletinActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data
  if (!['student', 'apprentice'].includes(actor.role)) {
    return { success: false, message: 'Only students may acknowledge bulletins.' }
  }

  const { error } = await supabase
    .from('bulletin_acknowledgments')
    .upsert(
      {
        bulletin_id: bulletinId,
        school_id: actor.schoolId,
        student_id: actor.id,
      },
      {
        onConflict: 'bulletin_id,student_id',
        ignoreDuplicates: true,
      }
    )

  if (error) {
    console.error('[bulletins] acknowledgment failed', { code: error.code })
    return { success: false, message: 'Unable to acknowledge this bulletin right now.' }
  }

  return { success: true, data: { bulletinId } }
}

export async function loadBulletinAcknowledgments(
  bulletinId: string
): Promise<BulletinRuntimeResult<BulletinAcknowledgmentDetail[]>> {
  if (!bulletinId) return { success: false, message: 'A bulletin is required.' }

  const actorResult = await getBulletinActor()
  if (!actorResult.success) return actorResult

  const { actor, supabase } = actorResult.data
  if (!['instructor', 'admin', 'school_admin'].includes(actor.role)) {
    return { success: false, message: 'You are not authorized to view acknowledgments.' }
  }

  const { data, error } = await supabase
    .from('bulletin_acknowledgments')
    .select('student_id, acknowledged_at')
    .eq('bulletin_id', bulletinId)
    .order('acknowledged_at', { ascending: false })

  if (error) return { success: false, message: error.message }

  return {
    success: true,
    data: (data || []).map((row: { student_id: string; acknowledged_at: string }) => ({
      studentId: row.student_id,
      acknowledgedAt: row.acknowledged_at,
    })),
  }
}

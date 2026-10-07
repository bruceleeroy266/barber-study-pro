'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { resolveSupportAccessContext, logSupportAction } from '@/lib/support-access'

async function getActor() {
  const supabase = await createClient()
  const context = await resolveSupportAccessContext()
  if (!context) throw new Error('Authentication required')

  const profile = context.effectiveProfile
  const user = { id: context.actorUserId, email: context.actorEmail }
  return { supabase, user, profile, context }
}

export async function requestQuizAccess(formData: FormData) {
  const quizId = String(formData.get('quizId') || '')
  const chapterId = String(formData.get('chapterId') || '')
  if (!quizId || !chapterId) throw new Error('Missing quiz information')

  const { supabase, profile } = await getActor()
  if (!profile.school_id || !['student', 'apprentice'].includes(profile.role)) {
    throw new Error('Student school membership required')
  }

  const { error } = await supabase.rpc('request_quiz_access', {
    p_quiz_id: quizId,
    p_chapter_id: chapterId,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/chapters/${chapterId.replace('ch-', '')}`)
  revalidatePath('/instructor/quiz-approvals')
}

export async function setQuizApprovalSettings(formData: FormData) {
  const { supabase, user, profile, context } = await getActor()
  if (!profile.school_id || !isInstructorOrAdmin(profile.role)) {
    throw new Error('Instructor access required')
  }

  const requireApproval = formData.get('requireApproval') === 'on'
  const autoApproveWhenReady = formData.get('autoApproveWhenReady') === 'on'

  const { error } = await supabase
    .from('quiz_approval_settings')
    .upsert({
      school_id: profile.school_id,
      require_approval: requireApproval,
      auto_approve_when_ready: autoApproveWhenReady,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'school_id' })

  if (error) throw new Error(error.message)
  await logSupportAction(context, 'set_quiz_approval_settings', 'quiz_approval_settings', { effectiveRole: profile.role, schoolId: profile.school_id })
  revalidatePath('/instructor/quiz-approvals')
}

export async function reviewQuizAccess(requestId: string, decision: 'approved' | 'denied') {
  const { supabase, user, profile, context } = await getActor()
  if (!profile.school_id || !isInstructorOrAdmin(profile.role)) {
    throw new Error('Instructor access required')
  }

  const { data: request } = await supabase
    .from('quiz_access_requests')
    .select('id, school_id, student_id, quiz_id')
    .eq('id', requestId)
    .eq('status', 'pending')
    .single()

  if (!request || request.school_id !== profile.school_id) throw new Error('Request not found')

  const now = new Date().toISOString()
  const { error } = await supabase
    .from('quiz_access_requests')
    .update({
      status: decision,
      reviewed_by: user.id,
      reviewed_at: now,
      updated_at: now,
    })
    .eq('id', requestId)
    .eq('school_id', profile.school_id)
    .eq('status', 'pending')

  if (error) throw new Error(error.message)

  await supabase.from('quiz_access_events').insert({
    request_id: request.id,
    school_id: request.school_id,
    student_id: request.student_id,
    quiz_id: request.quiz_id,
    event_type: decision,
    actor_id: user.id,
  })

  await logSupportAction(context, 'review_quiz_access', 'quiz_access_requests', { requestId, decision, studentId: request.student_id, effectiveRole: profile.role })
  revalidatePath('/instructor/quiz-approvals')
}

export async function bulkApproveQuizAccess(requestIds: string[]) {
  if (requestIds.length === 0) return
  const { supabase, user, profile } = await getActor()
  if (!profile.school_id || !isInstructorOrAdmin(profile.role)) {
    throw new Error('Instructor access required')
  }

  const { data: requests } = await supabase
    .from('quiz_access_requests')
    .select('id, school_id, student_id, quiz_id')
    .eq('school_id', profile.school_id)
    .eq('status', 'pending')
    .in('id', requestIds)

  const safeRequests = (requests || []) as Array<{
    id: string
    school_id: string
    student_id: string
    quiz_id: string
  }>
  if (safeRequests.length === 0) return

  const now = new Date().toISOString()
  const safeIds = safeRequests.map((request) => request.id)

  const { error } = await supabase
    .from('quiz_access_requests')
    .update({
      status: 'approved',
      reviewed_by: user.id,
      reviewed_at: now,
      updated_at: now,
    })
    .in('id', safeIds)
    .eq('school_id', profile.school_id)
    .eq('status', 'pending')

  if (error) throw new Error(error.message)

  await supabase.from('quiz_access_events').insert(
    safeRequests.map((request) => ({
      request_id: request.id,
      school_id: request.school_id,
      student_id: request.student_id,
      quiz_id: request.quiz_id,
      event_type: 'approved',
      actor_id: user.id,
      metadata: { bulk: true },
    }))
  )

  revalidatePath('/instructor/quiz-approvals')
}

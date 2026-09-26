'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'

async function getActor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile) throw new Error('Profile not found')
  return { supabase, user, profile }
}

export async function requestQuizAccess(formData: FormData) {
  const quizId = String(formData.get('quizId') || '')
  const chapterId = String(formData.get('chapterId') || '')
  if (!quizId || !chapterId) throw new Error('Missing quiz information')

  const { supabase, user, profile } = await getActor()
  if (!profile.school_id || !['student', 'apprentice'].includes(profile.role)) {
    throw new Error('Student school membership required')
  }

  const { data: settings } = await supabase
    .from('quiz_approval_settings')
    .select('require_approval, auto_approve_when_ready')
    .eq('school_id', profile.school_id)
    .maybeSingle()

  if (!settings?.require_approval) {
    revalidatePath('/dashboard')
    return
  }

  const { data: progress } = await supabase
    .from('student_progress')
    .select('lesson_completed, flashcards_completed, knowledge_checks_completed')
    .eq('user_id', user.id)
    .eq('chapter_id', chapterId)
    .maybeSingle()

  const ready = Boolean(
    progress?.lesson_completed &&
    progress?.flashcards_completed &&
    progress?.knowledge_checks_completed
  )
  const autoApproved = Boolean(settings.auto_approve_when_ready && ready)
  const status = autoApproved ? 'approved' : 'pending'
  const now = new Date().toISOString()

  const { data: request, error } = await supabase
    .from('quiz_access_requests')
    .upsert({
      school_id: profile.school_id,
      student_id: user.id,
      quiz_id: quizId,
      chapter_id: chapterId,
      status,
      readiness_snapshot: {
        lessonCompleted: Boolean(progress?.lesson_completed),
        flashcardsCompleted: Boolean(progress?.flashcards_completed),
        knowledgeChecksCompleted: Boolean(progress?.knowledge_checks_completed),
        ready,
      },
      requested_at: now,
      reviewed_by: autoApproved ? user.id : null,
      reviewed_at: autoApproved ? now : null,
      updated_at: now,
    }, { onConflict: 'student_id,quiz_id' })
    .select('id')
    .single()

  if (error || !request) throw new Error(error?.message || 'Failed to request quiz access')

  await supabase.from('quiz_access_events').insert({
    request_id: request.id,
    school_id: profile.school_id,
    student_id: user.id,
    quiz_id: quizId,
    event_type: autoApproved ? 'auto_approved' : 'requested',
    actor_id: user.id,
    metadata: { ready },
  })

  revalidatePath(`/dashboard/chapters/${chapterId.replace('ch-', '')}`)
  revalidatePath('/instructor/quiz-approvals')
}

export async function setQuizApprovalSettings(formData: FormData) {
  const { supabase, user, profile } = await getActor()
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
  revalidatePath('/instructor/quiz-approvals')
}

export async function reviewQuizAccess(requestId: string, decision: 'approved' | 'denied') {
  const { supabase, user, profile } = await getActor()
  if (!profile.school_id || !isInstructorOrAdmin(profile.role)) {
    throw new Error('Instructor access required')
  }

  const { data: request } = await supabase
    .from('quiz_access_requests')
    .select('id, school_id, student_id, quiz_id')
    .eq('id', requestId)
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

  if (error) throw new Error(error.message)

  await supabase.from('quiz_access_events').insert({
    request_id: request.id,
    school_id: request.school_id,
    student_id: request.student_id,
    quiz_id: request.quiz_id,
    event_type: decision,
    actor_id: user.id,
  })

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
    .in('id', requestIds)

  const safeRequests = requests || []
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

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { hasPermission, isSchoolAdmin } from '@/lib/auth-helpers'
import type { HourCategory } from '@/types'

const HOUR_CATEGORIES: HourCategory[] = [
  'Theory',
  'Practical',
  'Clinic',
  'Sanitation',
  'Makeup Hours',
  'Other',
]

const ALLOWED_RETURN_PATHS = new Set(['/instructor/hours', '/school/hours'])

export async function logStudentHours(formData: FormData) {
  const studentId = String(formData.get('studentId') || '').trim()
  const date = String(formData.get('date') || '').trim()
  const category = String(formData.get('category') || '').trim() as HourCategory
  const hoursValue = Number(formData.get('hours'))
  const notes = String(formData.get('notes') || '').trim()
  const returnToRaw = String(formData.get('returnTo') || '/instructor/hours')
  const returnTo = ALLOWED_RETURN_PATHS.has(returnToRaw) ? returnToRaw : '/instructor/hours'

  if (!studentId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    redirect(`${returnTo}?error=missing-fields`)
  }

  if (!HOUR_CATEGORIES.includes(category)) {
    redirect(`${returnTo}?error=invalid-category`)
  }

  if (!Number.isFinite(hoursValue) || hoursValue <= 0 || hoursValue > 24) {
    redirect(`${returnTo}?error=invalid-hours`)
  }

  const minutes = Math.round(hoursValue * 60)
  if (minutes <= 0) {
    redirect(`${returnTo}?error=invalid-hours`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: actor } = await supabase
    .from('profiles')
    .select('id, role, school_id')
    .eq('id', user.id)
    .single()

  if (!actor?.school_id || !hasPermission(actor.role, 'manage_attendance')) {
    redirect('/dashboard')
  }

  if (actor.role !== 'instructor') {
    redirect('/school/hours?error=instructor-only')
  }

  const { data: student } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', studentId)
    .eq('school_id', actor.school_id)
    .in('role', ['student', 'apprentice'])
    .maybeSingle()

  if (!student) {
    redirect(`${returnTo}?error=student-not-found`)
  }

  const { error } = await supabase
    .from('hour_logs')
    .insert({
      school_id: actor.school_id,
      user_id: studentId,
      date,
      category,
      minutes,
      status: 'pending',
      notes: notes || null,
      submitted_by: user.id,
      reviewed_by: null,
      reviewed_at: null,
    })

  if (error) {
    console.error('[StaffHours] Failed to add hours', error)
    redirect(`${returnTo}?error=save-failed`)
  }

  revalidatePath('/instructor')
  revalidatePath('/instructor/hours')
  revalidatePath('/school')
  revalidatePath('/school/hours')
  revalidatePath(`/instructor/student/${studentId}`)

  redirect(`${returnTo}?saved=1&student=${encodeURIComponent(studentId)}`)
}

export async function reviewStudentHours(formData: FormData) {
  const hourLogId = String(formData.get('hourLogId') || '').trim()
  const decision = String(formData.get('decision') || '').trim()
  const rejectionReason = String(formData.get('rejectionReason') || '').trim()

  if (!hourLogId || !['approved', 'rejected'].includes(decision)) {
    redirect('/school/hours?error=invalid-review')
  }

  if (decision === 'rejected' && !rejectionReason) {
    redirect('/school/hours?error=rejection-reason-required')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: actor } = await supabase
    .from('profiles')
    .select('id, role, school_id')
    .eq('id', user.id)
    .single()

  if (!actor?.school_id || !isSchoolAdmin(actor.role)) {
    redirect('/dashboard')
  }

  const { data: target } = await supabase
    .from('hour_logs')
    .select('id, user_id, school_id, status')
    .eq('id', hourLogId)
    .eq('school_id', actor.school_id)
    .maybeSingle()

  if (!target) {
    redirect('/school/hours?error=invalid-review')
  }

  if (target.status !== 'pending') {
    redirect(
      `/school/hours?alreadyReviewed=${encodeURIComponent(target.status)}&student=${encodeURIComponent(target.user_id)}`,
    )
  }

  const { data: updated, error } = await supabase
    .from('hour_logs')
    .update({
      status: decision,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: decision === 'rejected' ? rejectionReason.slice(0, 500) : null,
    })
    .eq('id', hourLogId)
    .eq('school_id', actor.school_id)
    .eq('status', 'pending')
    .select('id, user_id, status')
    .maybeSingle()

  if (error) {
    console.error('[StaffHours] Failed to review hours', error)
    const message = error.message.toLowerCase()
    redirect(
      message.includes('daily approved hours cannot exceed 1440')
        ? '/school/hours?error=daily-hour-cap'
        : '/school/hours?error=review-failed',
    )
  }

  if (!updated) {
    const { data: current, error: refreshError } = await supabase
      .from('hour_logs')
      .select('id, user_id, status')
      .eq('id', hourLogId)
      .eq('school_id', actor.school_id)
      .maybeSingle()

    if (refreshError) {
      console.error('[StaffHours] Failed to refresh hour review state', refreshError)
      redirect('/school/hours?error=review-failed')
    }

    if (!current) {
      redirect('/school/hours?error=invalid-review')
    }

    redirect(
      `/school/hours?alreadyReviewed=${encodeURIComponent(current.status)}&student=${encodeURIComponent(current.user_id)}`,
    )
  }

  revalidatePath('/school')
  revalidatePath('/school/hours')
  revalidatePath('/instructor/hours')
  revalidatePath(`/instructor/student/${updated.user_id}`)

  redirect(`/school/hours?reviewed=${decision}&student=${encodeURIComponent(updated.user_id)}`)
}


export async function bulkApproveStudentHours(formData: FormData) {
  const hourLogIds = Array.from(
    new Set(
      formData
        .getAll('hourLogId')
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  ).slice(0, 500)

  if (hourLogIds.length === 0) {
    redirect('/school/hours?error=no-hours-selected')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: actor } = await supabase
    .from('profiles')
    .select('id, role, school_id')
    .eq('id', user.id)
    .single()

  if (!actor?.school_id || !isSchoolAdmin(actor.role)) {
    redirect('/dashboard')
  }

  const reviewedAt = new Date().toISOString()
  const { data: updated, error } = await supabase
    .from('hour_logs')
    .update({
      status: 'approved',
      reviewed_by: user.id,
      reviewed_at: reviewedAt,
      rejection_reason: null,
    })
    .eq('school_id', actor.school_id)
    .eq('status', 'pending')
    .in('id', hourLogIds)
    .select('id, user_id')

  if (error) {
    console.error('[StaffHours] Failed to bulk approve hours', error)
    const message = error.message.toLowerCase()
    redirect(
      message.includes('daily approved hours cannot exceed 1440')
        ? '/school/hours?error=daily-hour-cap'
        : '/school/hours?error=bulk-review-failed',
    )
  }

  const updatedRows = (updated ?? []) as Array<{ id: string; user_id: string }>
  const affectedStudentIds = Array.from(
    new Set(updatedRows.map((row: { id: string; user_id: string }) => row.user_id).filter(Boolean)),
  )

  revalidatePath('/school')
  revalidatePath('/school/hours')
  revalidatePath('/instructor/hours')
  for (const studentId of affectedStudentIds) {
    revalidatePath(`/instructor/student/${studentId}`)
  }

  redirect(`/school/hours?bulkApproved=${updatedRows.length}`)
}


export async function adjustApprovedStudentHours(formData: FormData) {
  const hourLogId = String(formData.get('hourLogId') || '').trim()
  const correctedHours = Number(formData.get('correctedHours'))
  const reason = String(formData.get('reason') || '').trim()
  const expectedVersion = Number(formData.get('expectedAdjustmentVersion'))

  if (
    !hourLogId ||
    !Number.isFinite(correctedHours) ||
    correctedHours < 0 ||
    correctedHours > 24
  ) {
    redirect('/school/hours?error=invalid-adjustment-hours')
  }

  const correctedMinutes = Math.round(correctedHours * 60)
  if (correctedMinutes < 0 || correctedMinutes > 1440) {
    redirect('/school/hours?error=invalid-adjustment-hours')
  }

  if (reason.length < 10 || reason.length > 500) {
    redirect('/school/hours?error=adjustment-reason-required')
  }

  if (!Number.isInteger(expectedVersion) || expectedVersion < 0) {
    redirect('/school/hours?error=stale-adjustment')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: actor } = await supabase
    .from('profiles')
    .select('id, role, school_id')
    .eq('id', user.id)
    .single()

  if (!actor?.school_id || !isSchoolAdmin(actor.role)) {
    redirect('/dashboard')
  }

  const { data: target } = await supabase
    .from('effective_hour_logs')
    .select('id, user_id, school_id, status, adjustment_version')
    .eq('id', hourLogId)
    .eq('school_id', actor.school_id)
    .maybeSingle()

  if (!target || target.status !== 'approved') {
    redirect('/school/hours?error=invalid-adjustment')
  }

  const { error } = await supabase.rpc('adjust_approved_hour', {
    p_hour_log_id: hourLogId,
    p_new_effective_minutes: correctedMinutes,
    p_reason: reason,
    p_expected_adjustment_version: expectedVersion,
  })

  if (error) {
    console.error('[StaffHours] Failed to adjust approved hours', error)
    const message = error.message.toLowerCase()
    const code =
      message.includes('changed since') || message.includes('changed during')
        ? 'stale-adjustment'
        : message.includes('daily approved hours cannot exceed 1440')
          ? 'daily-hour-cap'
          : message.includes('attendance must match')
            ? 'attendance-adjustment-mismatch'
            : message.includes('must differ')
              ? 'no-op-adjustment'
              : 'adjustment-failed'

    redirect(
      `/school/hours?error=${code}&student=${encodeURIComponent(target.user_id)}`,
    )
  }

  revalidatePath('/school')
  revalidatePath('/school/hours')
  revalidatePath('/instructor/hours')
  revalidatePath('/dashboard/hours')
  revalidatePath('/dashboard/compliance')
  revalidatePath('/instructor/compliance')
  revalidatePath(`/instructor/student/${target.user_id}`)

  redirect(
    `/school/hours?adjusted=1&student=${encodeURIComponent(target.user_id)}`,
  )
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { hasPermission, isSchoolAdmin } from '@/lib/auth-helpers'
import type { HourCategory } from '@/types'
import { resolveSupportAccessContext, logSupportAction } from '@/lib/support-access'

const HOUR_CATEGORIES: HourCategory[] = [
  'Theory',
  'Practical',
  'Clinic',
  'Sanitation',
  'Makeup Hours',
  'Other',
]

const ALLOWED_RETURN_PATHS = new Set(['/instructor/hours', '/school/hours'])

async function canReviewStudentHours(
  supabase: Awaited<ReturnType<typeof createClient>>,
  actor: { id: string; role: string | null; school_id: string | null },
): Promise<boolean> {
  if (!actor.school_id) return false
  if (isSchoolAdmin(actor.role)) return true
  if (actor.role !== 'instructor') return false

  const { data } = await supabase
    .from('instructors')
    .select('can_approve_hours')
    .eq('profile_id', actor.id)
    .eq('school_id', actor.school_id)
    .eq('is_active', true)
    .is('deleted_at', null)
    .maybeSingle()

  return data?.can_approve_hours === true
}

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
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')
  const actor = context.effectiveProfile
  const trueActorId = context.actorUserId

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
      submitted_by: trueActorId,
      reviewed_by: null,
      reviewed_at: null,
    })

  if (error) {
    console.error('[StaffHours] Failed to add hours', error)
    redirect(`${returnTo}?error=save-failed`)
  }

  await logSupportAction(context, 'log_hours', 'hour_logs', { studentId, minutes, category, effectiveRole: actor.role })

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
  const returnToRaw = String(formData.get('returnTo') || '/school/hours')
  const returnTo = ALLOWED_RETURN_PATHS.has(returnToRaw) ? returnToRaw : '/school/hours'

  if (!hourLogId || !['approved', 'rejected'].includes(decision)) {
    redirect(`${returnTo}?error=invalid-review`)
  }

  if (decision === 'rejected' && !rejectionReason) {
    redirect(`${returnTo}?error=rejection-reason-required`)
  }

  const supabase = await createClient()
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')
  const actor = context.effectiveProfile
  const trueActorId = context.actorUserId

  if (!actor?.school_id || !(await canReviewStudentHours(supabase, actor))) {
    redirect('/dashboard')
  }

  const { data: target } = await supabase
    .from('hour_logs')
    .select('id, user_id, school_id, status')
    .eq('id', hourLogId)
    .eq('school_id', actor.school_id)
    .maybeSingle()

  if (!target) {
    redirect(`${returnTo}?error=invalid-review`)
  }

  if (target.status !== 'pending') {
    redirect(
      `${returnTo}?alreadyReviewed=${encodeURIComponent(target.status)}&student=${encodeURIComponent(target.user_id)}`,
    )
  }

  const { data: reviewedRows, error } = await supabase.rpc(
    'review_hour_log_as_authorized_approver',
    {
      p_hour_log_id: hourLogId,
      p_decision: decision,
      p_rejection_reason: decision === 'rejected' ? rejectionReason.slice(0, 500) : null,
    },
  )
  const updated = Array.isArray(reviewedRows) ? reviewedRows[0] ?? null : null

  if (error) {
    console.error('[StaffHours] Failed to review hours', error)
    const message = error.message.toLowerCase()
    redirect(
      message.includes('daily approved hours cannot exceed 1440')
        ? `${returnTo}?error=daily-hour-cap`
        : `${returnTo}?error=review-failed`,
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
      redirect(`${returnTo}?error=review-failed`)
    }

    if (!current) {
      redirect('/school/hours?error=invalid-review')
    }

    redirect(
      `${returnTo}?alreadyReviewed=${encodeURIComponent(current.status)}&student=${encodeURIComponent(current.user_id)}`,
    )
  }

  await logSupportAction(context, 'review_hours', 'hour_logs', { hourLogId, decision, studentId: updated.user_id, effectiveRole: actor.role })

  revalidatePath('/school')
  revalidatePath('/school/hours')
  revalidatePath('/instructor/hours')
  revalidatePath(`/instructor/student/${updated.user_id}`)

  redirect(`${returnTo}?reviewed=${decision}&student=${encodeURIComponent(updated.user_id)}`)
}


export async function bulkApproveStudentHours(formData: FormData) {
  const returnToRaw = String(formData.get('returnTo') || '/school/hours')
  const returnTo = ALLOWED_RETURN_PATHS.has(returnToRaw) ? returnToRaw : '/school/hours'
  const hourLogIds = Array.from(
    new Set(
      formData
        .getAll('hourLogId')
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  ).slice(0, 500)

  if (hourLogIds.length === 0) {
    redirect(`${returnTo}?error=no-hours-selected`)
  }

  const supabase = await createClient()
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')
  const actor = context.effectiveProfile
  const trueActorId = context.actorUserId

  if (!actor?.school_id || !(await canReviewStudentHours(supabase, actor))) {
    redirect('/dashboard')
  }

  const { data: updated, error } = await supabase.rpc(
    'bulk_approve_hour_logs_as_authorized_approver',
    { p_hour_log_ids: hourLogIds },
  )

  if (error) {
    console.error('[StaffHours] Failed to bulk approve hours', error)
    const message = error.message.toLowerCase()
    redirect(
      message.includes('daily approved hours cannot exceed 1440')
        ? `${returnTo}?error=daily-hour-cap`
        : `${returnTo}?error=bulk-review-failed`,
    )
  }

  const updatedRows = (updated ?? []) as Array<{ id: string; user_id: string }>
  const affectedStudentIds = Array.from(
    new Set(updatedRows.map((row: { id: string; user_id: string }) => row.user_id).filter(Boolean)),
  )

  await logSupportAction(context, 'bulk_approve_hours', 'hour_logs', { hourLogIds, approvedCount: updatedRows.length, effectiveRole: actor.role })

  revalidatePath('/school')
  revalidatePath('/school/hours')
  revalidatePath('/instructor/hours')
  for (const studentId of affectedStudentIds) {
    revalidatePath(`/instructor/student/${studentId}`)
  }

  redirect(`${returnTo}?bulkApproved=${updatedRows.length}`)
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
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')
  const actor = context.effectiveProfile
  const trueActorId = context.actorUserId

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

  await logSupportAction(context, 'adjust_approved_hours', 'hour_logs', { hourLogId, correctedMinutes, effectiveRole: actor.role })

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


const STUDENT_HOUR_CHANGE_TYPES = new Set([
  'transfer_credit',
  'returning_student',
  'redo_requirement',
  'correction',
  'other',
])

export async function setStudentHourContract(formData: FormData) {
  const studentProfileId = String(formData.get('studentId') || '').trim()
  const returnToRaw = String(formData.get('returnTo') || '/school/hours')
  const returnTo = ALLOWED_RETURN_PATHS.has(returnToRaw) ? returnToRaw : '/school/hours'
  const startingFromZero = String(formData.get('startingFromZero') || 'yes') === 'yes'
  const priorCreditHours = Number(formData.get('priorCreditHours') || 0)
  const useSpecialRequirement = String(formData.get('useSpecialRequirement') || '') === 'yes'
  const specialRequirementHours = Number(formData.get('specialRequirementHours') || 0)
  const changeTypeRaw = String(formData.get('changeType') || 'other').trim()
  const changeType = STUDENT_HOUR_CHANGE_TYPES.has(changeTypeRaw) ? changeTypeRaw : 'other'
  const reason = String(formData.get('reason') || '').trim()
  const sourceReference = String(formData.get('sourceReference') || '').trim()
  const expectedVersion = Number(formData.get('expectedVersion') || 0)

  if (!studentProfileId) {
    redirect(`${returnTo}?error=student-contract-student&student=${encodeURIComponent(studentProfileId)}`)
  }

  if (
    !Number.isFinite(priorCreditHours) ||
    priorCreditHours < 0 ||
    priorCreditHours > 16666.66
  ) {
    redirect(`${returnTo}?error=student-contract-prior&student=${encodeURIComponent(studentProfileId)}`)
  }

  if (
    useSpecialRequirement &&
    (!Number.isFinite(specialRequirementHours) ||
      specialRequirementHours <= 0 ||
      specialRequirementHours > 16666.66)
  ) {
    redirect(`${returnTo}?error=student-contract-requirement&student=${encodeURIComponent(studentProfileId)}`)
  }

  if (reason.length < 10 || reason.length > 1000) {
    redirect(`${returnTo}?error=student-contract-reason&student=${encodeURIComponent(studentProfileId)}`)
  }

  if (sourceReference.length > 500) {
    redirect(`${returnTo}?error=student-contract-source&student=${encodeURIComponent(studentProfileId)}`)
  }

  if (!Number.isInteger(expectedVersion) || expectedVersion < 0) {
    redirect(`${returnTo}?error=student-contract-stale&student=${encodeURIComponent(studentProfileId)}`)
  }

  const priorCreditMinutes = startingFromZero ? 0 : Math.round(priorCreditHours * 60)
  const requirementOverrideMinutes = useSpecialRequirement
    ? Math.round(specialRequirementHours * 60)
    : null

  const supabase = await createClient()
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')
  const actor = context.effectiveProfile
  const trueActorId = context.actorUserId

  if (!actor?.school_id || !isSchoolAdmin(actor.role)) {
    redirect('/dashboard')
  }

  const { data: studentRow } = await supabase
    .from('students')
    .select('id, profile_id, school_id')
    .eq('profile_id', studentProfileId)
    .eq('school_id', actor.school_id)
    .eq('is_active', true)
    .is('deleted_at', null)
    .maybeSingle()

  if (!studentRow) {
    redirect(`${returnTo}?error=student-contract-student&student=${encodeURIComponent(studentProfileId)}`)
  }

  const { data: enrollmentRows } = await supabase
    .from('enrollments')
    .select('id, program_id, created_at')
    .eq('student_id', studentRow.id)
    .eq('status', 'active')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(1)

  const enrollment = enrollmentRows?.[0] ?? null
  if (!enrollment) {
    redirect(`${returnTo}?error=student-contract-enrollment&student=${encodeURIComponent(studentProfileId)}`)
  }

  const { data: program } = await supabase
    .from('programs')
    .select('id, school_id')
    .eq('id', enrollment.program_id)
    .eq('school_id', actor.school_id)
    .is('deleted_at', null)
    .maybeSingle()

  if (!program) {
    redirect(`${returnTo}?error=student-contract-enrollment&student=${encodeURIComponent(studentProfileId)}`)
  }

  const { error } = await supabase.rpc('set_enrollment_hour_contract', {
    p_enrollment_id: enrollment.id,
    p_prior_credit_minutes: priorCreditMinutes,
    p_requirement_override_minutes: requirementOverrideMinutes,
    p_change_type: changeType,
    p_reason: reason,
    p_source_reference: sourceReference || null,
    p_expected_version: expectedVersion,
  })

  if (error) {
    console.error('[StaffHours] Failed to set enrollment hour contract', error)
    const message = error.message.toLowerCase()
    const code =
      message.includes('changed since') ||
      message.includes('changed during') ||
      message.includes('expected version')
        ? 'student-contract-stale'
        : message.includes('must modify')
          ? 'student-contract-noop'
          : 'student-contract-failed'

    redirect(
      `${returnTo}?error=${code}&student=${encodeURIComponent(studentProfileId)}`,
    )
  }

  revalidatePath('/school')
  await logSupportAction(context, 'set_student_hour_contract', 'enrollment_hour_contracts', { studentProfileId, enrollmentId: enrollment.id, effectiveRole: actor.role })

  revalidatePath('/school/hours')
  revalidatePath('/instructor/hours')
  revalidatePath('/dashboard/hours')
  revalidatePath('/dashboard/compliance')
  revalidatePath('/instructor/compliance')
  revalidatePath(`/instructor/student/${studentProfileId}`)

  redirect(
    `${returnTo}?contractSaved=1&student=${encodeURIComponent(studentProfileId)}`,
  )
}

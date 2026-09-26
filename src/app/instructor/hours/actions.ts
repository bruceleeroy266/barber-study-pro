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

  if (!hourLogId || !['approved', 'rejected'].includes(decision)) {
    redirect('/school/hours?error=invalid-review')
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

  if (!target || target.status !== 'pending') {
    redirect('/school/hours?error=invalid-review')
  }

  const { error } = await supabase
    .from('hour_logs')
    .update({
      status: decision,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', hourLogId)
    .eq('school_id', actor.school_id)
    .eq('status', 'pending')

  if (error) {
    console.error('[StaffHours] Failed to review hours', error)
    redirect('/school/hours?error=review-failed')
  }

  revalidatePath('/school')
  revalidatePath('/school/hours')
  revalidatePath('/instructor/hours')
  revalidatePath(`/instructor/student/${target.user_id}`)

  redirect(`/school/hours?reviewed=${decision}&student=${encodeURIComponent(target.user_id)}`)
}

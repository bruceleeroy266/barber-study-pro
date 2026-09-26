'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { hasPermission } from '@/lib/auth-helpers'
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
      status: 'approved',
      notes: notes || null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
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

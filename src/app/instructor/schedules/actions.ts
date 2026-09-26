'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { hasPermission } from '@/lib/auth-helpers'

const DAY_COUNT = 7
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

interface DayInput {
  day_of_week: number
  is_scheduled: boolean
  start_time: string | null
  end_time: string | null
  break_minutes: number
}

function parseDays(formData: FormData): DayInput[] {
  const days: DayInput[] = []

  for (let day = 0; day < DAY_COUNT; day += 1) {
    const active = formData.get(`day-${day}-active`) === 'on'
    const start = String(formData.get(`day-${day}-start`) || '').trim()
    const end = String(formData.get(`day-${day}-end`) || '').trim()
    const breakMinutes = Number(formData.get(`day-${day}-break`) || 0)

    if (!Number.isInteger(breakMinutes) || breakMinutes < 0 || breakMinutes > 480) {
      throw new Error('invalid-break')
    }

    if (active) {
      if (!TIME_RE.test(start) || !TIME_RE.test(end) || end <= start) {
        throw new Error('invalid-time')
      }
    }

    days.push({
      day_of_week: day,
      is_scheduled: active,
      start_time: active ? start : null,
      end_time: active ? end : null,
      break_minutes: active ? breakMinutes : 0,
    })
  }

  if (!days.some((day) => day.is_scheduled)) {
    throw new Error('no-days')
  }

  return days
}

async function getStaffActor() {
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

  return { supabase, user, actor }
}

async function requireSchoolStudent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  schoolId: string,
  studentId: string,
) {
  const { data: student } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', studentId)
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])
    .maybeSingle()

  if (!student) throw new Error('student-not-found')
}

function scheduleRedirect(params: Record<string, string>) {
  const search = new URLSearchParams(params)
  redirect(`/instructor/schedules?${search.toString()}`)
}

export async function createScheduleTemplate(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  const description = String(formData.get('description') || '').trim()

  if (!name || name.length > 100) scheduleRedirect({ error: 'invalid-template-name' })

  let days: DayInput[]
  try {
    days = parseDays(formData)
  } catch (error) {
    scheduleRedirect({ error: error instanceof Error ? error.message : 'invalid-schedule' })
  }

  const { supabase, user, actor } = await getStaffActor()

  const { data: template, error: templateError } = await supabase
    .from('school_schedule_templates')
    .insert({
      school_id: actor.school_id,
      name,
      description: description ? description.slice(0, 500) : null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (templateError || !template) {
    console.error('[Schedules] Failed to create template', templateError)
    scheduleRedirect({ error: templateError?.code === '23505' ? 'duplicate-template' : 'save-failed' })
  }

  const { error: daysError } = await supabase
    .from('school_schedule_template_days')
    .insert(days.map((day) => ({ ...day, template_id: template.id })))

  if (daysError) {
    console.error('[Schedules] Failed to create template days', daysError)
    await supabase.from('school_schedule_templates').delete().eq('id', template.id)
    scheduleRedirect({ error: 'save-failed' })
  }

  revalidatePath('/instructor/schedules')
  scheduleRedirect({ saved: 'template' })
}

export async function assignTemplateSchedule(formData: FormData) {
  const studentId = String(formData.get('studentId') || '').trim()
  const templateId = String(formData.get('templateId') || '').trim()
  const effectiveFrom = String(formData.get('effectiveFrom') || '').trim()
  const effectiveTo = String(formData.get('effectiveTo') || '').trim()
  const notes = String(formData.get('notes') || '').trim()

  if (!studentId || !templateId || !/^\d{4}-\d{2}-\d{2}$/.test(effectiveFrom)) {
    scheduleRedirect({ error: 'missing-fields' })
  }
  if (effectiveTo && (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveTo) || effectiveTo < effectiveFrom)) {
    scheduleRedirect({ error: 'invalid-dates', student: studentId })
  }

  const { supabase, user, actor } = await getStaffActor()

  try {
    await requireSchoolStudent(supabase, actor.school_id, studentId)
  } catch {
    scheduleRedirect({ error: 'student-not-found' })
  }

  const { data: template } = await supabase
    .from('school_schedule_templates')
    .select('id, name')
    .eq('id', templateId)
    .eq('school_id', actor.school_id)
    .eq('is_active', true)
    .maybeSingle()

  if (!template) scheduleRedirect({ error: 'template-not-found', student: studentId })

  const { data: templateDays } = await supabase
    .from('school_schedule_template_days')
    .select('day_of_week, is_scheduled, start_time, end_time, break_minutes')
    .eq('template_id', templateId)
    .order('day_of_week')

  if (!templateDays || templateDays.length !== DAY_COUNT) {
    scheduleRedirect({ error: 'template-incomplete', student: studentId })
  }

  const { data: profile, error: profileError } = await supabase
    .from('student_schedule_profiles')
    .insert({
      school_id: actor.school_id,
      student_id: studentId,
      name: template.name,
      source_template_id: template.id,
      effective_from: effectiveFrom,
      effective_to: effectiveTo || null,
      notes: notes ? notes.slice(0, 500) : null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (profileError || !profile) {
    console.error('[Schedules] Failed to assign schedule profile', profileError)
    scheduleRedirect({ error: 'save-failed', student: studentId })
  }

  const { error: daysError } = await supabase
    .from('student_schedule_days')
    .insert(
      templateDays.map((day) => ({
        schedule_profile_id: profile.id,
        day_of_week: day.day_of_week,
        is_scheduled: day.is_scheduled,
        start_time: day.start_time,
        end_time: day.end_time,
        break_minutes: day.break_minutes,
      })),
    )

  if (daysError) {
    console.error('[Schedules] Failed to snapshot template days', daysError)
    await supabase.from('student_schedule_profiles').delete().eq('id', profile.id)
    scheduleRedirect({ error: 'save-failed', student: studentId })
  }

  revalidatePath('/instructor/schedules')
  scheduleRedirect({ saved: 'schedule', student: studentId })
}

export async function saveCustomStudentSchedule(formData: FormData) {
  const studentId = String(formData.get('studentId') || '').trim()
  const name = String(formData.get('name') || '').trim() || 'Custom Schedule'
  const effectiveFrom = String(formData.get('effectiveFrom') || '').trim()
  const effectiveTo = String(formData.get('effectiveTo') || '').trim()
  const notes = String(formData.get('notes') || '').trim()

  if (!studentId || !/^\d{4}-\d{2}-\d{2}$/.test(effectiveFrom)) {
    scheduleRedirect({ error: 'missing-fields' })
  }
  if (effectiveTo && (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveTo) || effectiveTo < effectiveFrom)) {
    scheduleRedirect({ error: 'invalid-dates', student: studentId })
  }

  let days: DayInput[]
  try {
    days = parseDays(formData)
  } catch (error) {
    scheduleRedirect({
      error: error instanceof Error ? error.message : 'invalid-schedule',
      student: studentId,
    })
  }

  const { supabase, user, actor } = await getStaffActor()
  try {
    await requireSchoolStudent(supabase, actor.school_id, studentId)
  } catch {
    scheduleRedirect({ error: 'student-not-found' })
  }

  const { data: profile, error: profileError } = await supabase
    .from('student_schedule_profiles')
    .insert({
      school_id: actor.school_id,
      student_id: studentId,
      name: name.slice(0, 100),
      source_template_id: null,
      effective_from: effectiveFrom,
      effective_to: effectiveTo || null,
      notes: notes ? notes.slice(0, 500) : null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (profileError || !profile) {
    console.error('[Schedules] Failed to create custom schedule', profileError)
    scheduleRedirect({ error: 'save-failed', student: studentId })
  }

  const { error: daysError } = await supabase
    .from('student_schedule_days')
    .insert(days.map((day) => ({ ...day, schedule_profile_id: profile.id })))

  if (daysError) {
    console.error('[Schedules] Failed to create custom schedule days', daysError)
    await supabase.from('student_schedule_profiles').delete().eq('id', profile.id)
    scheduleRedirect({ error: 'save-failed', student: studentId })
  }

  revalidatePath('/instructor/schedules')
  scheduleRedirect({ saved: 'schedule', student: studentId })
}

export async function saveScheduleOverride(formData: FormData) {
  const studentId = String(formData.get('studentId') || '').trim()
  const overrideDate = String(formData.get('overrideDate') || '').trim()
  const overrideType = String(formData.get('overrideType') || '').trim()
  const start = String(formData.get('startTime') || '').trim()
  const end = String(formData.get('endTime') || '').trim()
  const breakMinutes = Number(formData.get('breakMinutes') || 0)
  const reason = String(formData.get('reason') || '').trim()

  if (
    !studentId ||
    !/^\d{4}-\d{2}-\d{2}$/.test(overrideDate) ||
    !['scheduled', 'off', 'makeup'].includes(overrideType)
  ) {
    scheduleRedirect({ error: 'missing-fields', student: studentId })
  }

  if (!Number.isInteger(breakMinutes) || breakMinutes < 0 || breakMinutes > 480) {
    scheduleRedirect({ error: 'invalid-break', student: studentId })
  }

  if (overrideType !== 'off' && (!TIME_RE.test(start) || !TIME_RE.test(end) || end <= start)) {
    scheduleRedirect({ error: 'invalid-time', student: studentId })
  }

  const { supabase, user, actor } = await getStaffActor()
  try {
    await requireSchoolStudent(supabase, actor.school_id, studentId)
  } catch {
    scheduleRedirect({ error: 'student-not-found' })
  }

  const { error } = await supabase
    .from('student_schedule_overrides')
    .upsert(
      {
        school_id: actor.school_id,
        student_id: studentId,
        override_date: overrideDate,
        override_type: overrideType,
        start_time: overrideType === 'off' ? null : start,
        end_time: overrideType === 'off' ? null : end,
        break_minutes: overrideType === 'off' ? 0 : breakMinutes,
        reason: reason ? reason.slice(0, 500) : null,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'school_id,student_id,override_date' },
    )

  if (error) {
    console.error('[Schedules] Failed to save one-day override', error)
    scheduleRedirect({ error: 'save-failed', student: studentId })
  }

  revalidatePath('/instructor/schedules')
  scheduleRedirect({ saved: 'override', student: studentId })
}

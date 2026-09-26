'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { hasPermission } from '@/lib/auth-helpers'
import type { HourCategory } from '@/types'

export interface AttendanceHourGenerationResult {
  created: number
  updated: number
  skipped: number
  attendanceCount: number
}

interface AttendanceHourRow {
  id: string
  user_id: string
  date: string
  status: string
  minutes_present: number
}

interface ExistingGeneratedHourRow {
  id: string
  source_attendance_id: string | null
  status: 'pending' | 'approved' | 'rejected'
  minutes: number
  category: HourCategory
}

interface ScheduleOverrideTypeRow {
  student_id: string
  override_type: string
}

export async function generatePendingHoursFromAttendance(
  date: string,
): Promise<AttendanceHourGenerationResult> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Invalid attendance date.')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in.')

  const { data: actor } = await supabase
    .from('profiles')
    .select('id, role, school_id')
    .eq('id', user.id)
    .single()

  if (!actor?.school_id || !hasPermission(actor.role, 'manage_attendance')) {
    throw new Error('You do not have permission to generate student hours.')
  }

  if (actor.role !== 'instructor') {
    throw new Error('Only instructors can submit attendance-generated hours.')
  }

  const { data: attendanceData, error: attendanceError } = await supabase
    .from('attendance_records')
    .select('id, user_id, date, status, minutes_present')
    .eq('school_id', actor.school_id)
    .eq('date', date)
    .in('status', ['Present', 'Tardy'])
    .gt('minutes_present', 0)

  if (attendanceError) {
    console.error('[AttendanceHours] Failed to load attendance records', attendanceError)
    throw new Error('Attendance records could not be loaded.')
  }

  const attendanceRows = (attendanceData ?? []) as AttendanceHourRow[]
  if (attendanceRows.length === 0) {
    return { created: 0, updated: 0, skipped: 0, attendanceCount: 0 }
  }

  const attendanceIds = attendanceRows.map((row: AttendanceHourRow) => row.id)
  const studentIds = Array.from(
    new Set(attendanceRows.map((row: AttendanceHourRow) => row.user_id)),
  )

  const [{ data: existingData, error: existingError }, { data: overridesData, error: overridesError }] =
    await Promise.all([
      supabase
        .from('hour_logs')
        .select('id, source_attendance_id, status, minutes, category')
        .eq('school_id', actor.school_id)
        .in('source_attendance_id', attendanceIds),
      supabase
        .from('student_schedule_overrides')
        .select('student_id, override_type')
        .eq('school_id', actor.school_id)
        .eq('override_date', date)
        .in('student_id', studentIds),
    ])

  if (existingError) {
    console.error('[AttendanceHours] Failed to check existing hour logs', existingError)
    throw new Error('Existing student hours could not be checked.')
  }

  if (overridesError) {
    console.error('[AttendanceHours] Failed to load schedule overrides', overridesError)
    throw new Error('Schedule overrides could not be checked.')
  }

  const existingRows = (existingData ?? []) as ExistingGeneratedHourRow[]
  const existingByAttendanceId = new Map(
    existingRows
      .filter(
        (row: ExistingGeneratedHourRow) =>
          typeof row.source_attendance_id === 'string' && row.source_attendance_id.length > 0,
      )
      .map((row: ExistingGeneratedHourRow) => [row.source_attendance_id as string, row]),
  )

  const makeupStudentIds = new Set(
    ((overridesData ?? []) as ScheduleOverrideTypeRow[])
      .filter((row: ScheduleOverrideTypeRow) => row.override_type === 'makeup')
      .map((row: ScheduleOverrideTypeRow) => row.student_id),
  )

  let created = 0
  let updated = 0
  let skipped = 0

  for (const attendance of attendanceRows) {
    const existing = existingByAttendanceId.get(attendance.id)


    const category: HourCategory = makeupStudentIds.has(attendance.user_id)
      ? 'Makeup Hours'
      : 'Other'

    if (existing) {
      if (existing.status !== 'pending') {
        skipped += 1
        continue
      }

      if (existing.minutes === attendance.minutes_present && existing.category === category) {
        skipped += 1
        continue
      }

      const { error: updateError } = await supabase
        .from('hour_logs')
        .update({
          minutes: attendance.minutes_present,
          category,
          notes: 'Updated from resubmitted Daily Attendance & Hours.',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .eq('school_id', actor.school_id)
        .eq('submitted_by', user.id)
        .eq('status', 'pending')
        .is('reviewed_by', null)
        .is('reviewed_at', null)
        .eq('source_type', 'attendance')
        .select('id')
        .maybeSingle()

      if (updateError) {
        console.error('[AttendanceHours] Failed to refresh pending generated hours', {
          attendanceId: attendance.id,
          error: updateError,
        })
        throw new Error('Pending student hours could not be refreshed.')
      }

      updated += 1
      continue
    }

    const { error } = await supabase
      .from('hour_logs')
      .insert({
        school_id: actor.school_id,
        user_id: attendance.user_id,
        date: attendance.date,
        category,
        minutes: attendance.minutes_present,
        status: 'pending',
        notes: 'Generated from submitted Daily Attendance & Hours.',
        submitted_by: user.id,
        reviewed_by: null,
        reviewed_at: null,
        rejection_reason: null,
        source_type: 'attendance',
        source_attendance_id: attendance.id,
      })

    if (!error) {
      created += 1
      continue
    }

    if (error.code === '23505') {
      skipped += 1
      continue
    }

    console.error('[AttendanceHours] Failed to create pending hour log', {
      attendanceId: attendance.id,
      error,
    })
    throw new Error('Pending student hours could not be generated.')
  }

  revalidatePath('/instructor')
  revalidatePath('/instructor/attendance')
  revalidatePath('/instructor/hours')
  revalidatePath('/school')
  revalidatePath('/school/hours')
  for (const studentId of studentIds) {
    revalidatePath(`/instructor/student/${studentId}`)
  }

  return {
    created,
    updated,
    skipped,
    attendanceCount: attendanceRows.length,
  }
}

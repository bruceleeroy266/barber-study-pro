'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { hasPermission } from '@/lib/auth-helpers'
import type { HourCategory } from '@/types'

export interface AttendanceHourGenerationResult {
  created: number
  resubmitted: number
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
  created_at: string | null
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
    return { created: 0, resubmitted: 0, updated: 0, skipped: 0, attendanceCount: 0 }
  }

  const attendanceIds = attendanceRows.map((row: AttendanceHourRow) => row.id)
  const studentIds = Array.from(
    new Set(attendanceRows.map((row: AttendanceHourRow) => row.user_id)),
  )

  const [{ data: existingData, error: existingError }, { data: overridesData, error: overridesError }] =
    await Promise.all([
      supabase
        .from('hour_logs')
        .select('id, source_attendance_id, status, minutes, category, created_at')
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
  const existingByAttendanceId = new Map<
    string,
    { active: ExistingGeneratedHourRow | null; latestRejected: ExistingGeneratedHourRow | null }
  >()

  for (const row of existingRows) {
    if (!row.source_attendance_id) continue
    const current = existingByAttendanceId.get(row.source_attendance_id) ?? {
      active: null,
      latestRejected: null,
    }

    if (row.status === 'pending' || row.status === 'approved') {
      current.active = row
    } else if (
      !current.latestRejected ||
      (row.created_at ?? '') > (current.latestRejected.created_at ?? '')
    ) {
      current.latestRejected = row
    }

    existingByAttendanceId.set(row.source_attendance_id, current)
  }

  const makeupStudentIds = new Set(
    ((overridesData ?? []) as ScheduleOverrideTypeRow[])
      .filter((row: ScheduleOverrideTypeRow) => row.override_type === 'makeup')
      .map((row: ScheduleOverrideTypeRow) => row.student_id),
  )

  let created = 0
  let resubmitted = 0
  let updated = 0
  let skipped = 0

  for (const attendance of attendanceRows) {
    const existingState = existingByAttendanceId.get(attendance.id)
    const existing = existingState?.active ?? null
    const latestRejected = existingState?.latestRejected ?? null

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

      const { data: refreshed, error: updateError } = await supabase
        .from('hour_logs')
        .update({
          minutes: attendance.minutes_present,
          category,
          notes: 'Updated from resubmitted Daily Attendance & Hours.',
          submitted_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .eq('school_id', actor.school_id)
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

      if (!refreshed) {
        // An administrator may have reviewed the row after our initial read.
        // Treat that race as a safe skip rather than overwriting the decision.
        skipped += 1
        continue
      }

      updated += 1
      continue
    }

    const isResubmission = Boolean(latestRejected)
    const { error } = await supabase
      .from('hour_logs')
      .insert({
        school_id: actor.school_id,
        user_id: attendance.user_id,
        date: attendance.date,
        category,
        minutes: attendance.minutes_present,
        status: 'pending',
        notes: isResubmission
          ? 'Corrected attendance resubmitted after hour rejection.'
          : 'Generated from submitted Daily Attendance & Hours.',
        submitted_by: user.id,
        reviewed_by: null,
        reviewed_at: null,
        rejection_reason: null,
        source_type: 'attendance',
        source_attendance_id: attendance.id,
        resubmission_of_hour_log_id: latestRejected?.id ?? null,
      })

    if (!error) {
      if (isResubmission) resubmitted += 1
      else created += 1
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
    resubmitted,
    updated,
    skipped,
    attendanceCount: attendanceRows.length,
  }
}

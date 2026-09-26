export interface ScheduleProfileRow {
  id: string
  student_id: string
  name: string
  effective_from: string
  effective_to: string | null
}

export interface ScheduleDayRow {
  schedule_profile_id: string
  day_of_week: number
  is_scheduled: boolean
  start_time: string | null
  end_time: string | null
  break_minutes: number
}

export interface ScheduleOverrideRow {
  student_id: string
  override_date: string
  override_type: 'scheduled' | 'off' | 'makeup'
  start_time: string | null
  end_time: string | null
  break_minutes: number
  reason: string | null
}

export interface DailyScheduleExpectation {
  studentId: string
  date: string
  isScheduled: boolean
  source: 'recurring' | 'override' | 'makeup' | 'none'
  label: string
  startTime: string | null
  endTime: string | null
  breakMinutes: number
  plannedMinutes: number
  reason: string | null
}

function toMinutes(value: string | null): number | null {
  if (!value) return null
  const [hours, minutes] = value.slice(0, 5).split(':').map(Number)
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null
  return hours * 60 + minutes
}

export function calculatePlannedMinutes(
  startTime: string | null,
  endTime: string | null,
  breakMinutes: number,
): number {
  const start = toMinutes(startTime)
  const end = toMinutes(endTime)
  if (start === null || end === null || end <= start) return 0
  return Math.max(0, end - start - Math.max(0, breakMinutes || 0))
}

function dayOfWeekUtc(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay()
}

export function resolveDailyScheduleExpectations(args: {
  studentIds: string[]
  date: string
  profiles: ScheduleProfileRow[]
  days: ScheduleDayRow[]
  overrides: ScheduleOverrideRow[]
}): DailyScheduleExpectation[] {
  const { studentIds, date, profiles, days, overrides } = args
  const weekday = dayOfWeekUtc(date)

  const overridesByStudent = new Map(
    overrides
      .filter((override) => override.override_date === date)
      .map((override) => [override.student_id, override]),
  )

  return studentIds.map((studentId) => {
    const override = overridesByStudent.get(studentId)
    if (override) {
      if (override.override_type === 'off') {
        return {
          studentId,
          date,
          isScheduled: false,
          source: 'override',
          label: 'Day Off',
          startTime: null,
          endTime: null,
          breakMinutes: 0,
          plannedMinutes: 0,
          reason: override.reason,
        }
      }

      const plannedMinutes = calculatePlannedMinutes(
        override.start_time,
        override.end_time,
        override.break_minutes,
      )

      return {
        studentId,
        date,
        isScheduled: true,
        source: override.override_type === 'makeup' ? 'makeup' : 'override',
        label: override.override_type === 'makeup' ? 'Makeup / Extra Session' : 'Changed Schedule',
        startTime: override.start_time,
        endTime: override.end_time,
        breakMinutes: override.break_minutes,
        plannedMinutes,
        reason: override.reason,
      }
    }

    const activeProfile = profiles
      .filter(
        (profile) =>
          profile.student_id === studentId &&
          profile.effective_from <= date &&
          (!profile.effective_to || profile.effective_to >= date),
      )
      .sort((a, b) => b.effective_from.localeCompare(a.effective_from))[0]

    if (!activeProfile) {
      return {
        studentId,
        date,
        isScheduled: false,
        source: 'none',
        label: 'No schedule assigned',
        startTime: null,
        endTime: null,
        breakMinutes: 0,
        plannedMinutes: 0,
        reason: null,
      }
    }

    const day = days.find(
      (candidate) =>
        candidate.schedule_profile_id === activeProfile.id &&
        candidate.day_of_week === weekday,
    )

    if (!day?.is_scheduled) {
      return {
        studentId,
        date,
        isScheduled: false,
        source: 'recurring',
        label: `${activeProfile.name} · Not scheduled`,
        startTime: null,
        endTime: null,
        breakMinutes: 0,
        plannedMinutes: 0,
        reason: null,
      }
    }

    return {
      studentId,
      date,
      isScheduled: true,
      source: 'recurring',
      label: activeProfile.name,
      startTime: day.start_time,
      endTime: day.end_time,
      breakMinutes: day.break_minutes,
      plannedMinutes: calculatePlannedMinutes(day.start_time, day.end_time, day.break_minutes),
      reason: null,
    }
  })
}

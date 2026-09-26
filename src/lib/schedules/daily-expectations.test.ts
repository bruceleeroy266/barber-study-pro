import { describe, expect, it } from 'vitest'
import {
  calculatePlannedMinutes,
  resolveDailyScheduleExpectations,
} from './daily-expectations'

describe('daily schedule expectations', () => {
  it('calculates planned minutes after breaks', () => {
    expect(calculatePlannedMinutes('08:30', '16:00', 30)).toBe(420)
  })

  it('uses the effective recurring schedule for the selected date', () => {
    const [result] = resolveDailyScheduleExpectations({
      studentIds: ['student-1'],
      date: '2026-09-28',
      profiles: [
        {
          id: 'profile-1',
          student_id: 'student-1',
          name: 'Full-Time',
          effective_from: '2026-09-01',
          effective_to: null,
        },
      ],
      days: [
        {
          schedule_profile_id: 'profile-1',
          day_of_week: 1,
          is_scheduled: true,
          start_time: '08:30',
          end_time: '16:00',
          break_minutes: 30,
        },
      ],
      overrides: [],
    })

    expect(result.isScheduled).toBe(true)
    expect(result.source).toBe('recurring')
    expect(result.plannedMinutes).toBe(420)
  })

  it('lets a one-day override replace the recurring schedule', () => {
    const [result] = resolveDailyScheduleExpectations({
      studentIds: ['student-1'],
      date: '2026-09-28',
      profiles: [
        {
          id: 'profile-1',
          student_id: 'student-1',
          name: 'Full-Time',
          effective_from: '2026-09-01',
          effective_to: null,
        },
      ],
      days: [
        {
          schedule_profile_id: 'profile-1',
          day_of_week: 1,
          is_scheduled: true,
          start_time: '08:30',
          end_time: '16:00',
          break_minutes: 30,
        },
      ],
      overrides: [
        {
          student_id: 'student-1',
          override_date: '2026-09-28',
          override_type: 'makeup',
          start_time: '10:00',
          end_time: '13:00',
          break_minutes: 0,
          reason: 'Makeup clinic',
        },
      ],
    })

    expect(result.source).toBe('makeup')
    expect(result.label).toBe('Makeup / Extra Session')
    expect(result.plannedMinutes).toBe(180)
  })

  it('does not mark an unscheduled student as scheduled', () => {
    const [result] = resolveDailyScheduleExpectations({
      studentIds: ['student-1'],
      date: '2026-09-28',
      profiles: [],
      days: [],
      overrides: [],
    })

    expect(result.isScheduled).toBe(false)
    expect(result.source).toBe('none')
    expect(result.plannedMinutes).toBe(0)
  })
})

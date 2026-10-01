import { describe, expect, it } from 'vitest'
import {
  calculateApprovedPeriodTotals,
  calculateOfficialApprovedMinutes,
  formatHourMinutes,
  getOfficialMinutes,
  getCurrentReportingWindows,
  type HoursReportLog,
} from './reporting'

function log(
  id: string,
  date: string,
  minutes: number,
  status: HoursReportLog['status'],
): HoursReportLog {
  return {
    id,
    user_id: 'student-1',
    date,
    category: 'Clinic',
    minutes,
    status,
    notes: null,
    submitted_by: 'instructor-1',
    reviewed_by: status === 'pending' ? null : 'admin-1',
    reviewed_at: status === 'pending' ? null : '2026-09-25T20:00:00.000Z',
    created_at: '2026-09-25T19:00:00.000Z',
  }
}

describe('student hours reporting windows', () => {
  it('calculates week, month, and year from approved hours only', () => {
    const logs = [
      log('w1', '2026-09-21', 120, 'approved'),
      log('m1', '2026-09-10', 180, 'approved'),
      log('y1', '2026-05-10', 240, 'approved'),
      log('old', '2025-12-31', 600, 'approved'),
      log('pending', '2026-09-25', 480, 'pending'),
      log('rejected', '2026-09-25', 480, 'rejected'),
    ]

    const totals = calculateApprovedPeriodTotals(
      logs,
      new Date('2026-09-25T20:00:00-05:00'),
      'America/Chicago',
    )

    expect(totals.weekMinutes).toBe(120)
    expect(totals.monthMinutes).toBe(300)
    expect(totals.yearMinutes).toBe(540)
  })

  it('uses canonical effective minutes for adjusted approved rows', () => {
    const adjusted = {
      ...log('adjusted', '2026-09-25', 450, 'approved'),
      effective_minutes: 420,
      integrity_status: 'valid_adjusted' as const,
    }

    expect(getOfficialMinutes(adjusted)).toBe(420)
    expect(calculateOfficialApprovedMinutes([adjusted])).toBe(420)

    const totals = calculateApprovedPeriodTotals(
      [adjusted],
      new Date('2026-09-25T20:00:00-05:00'),
      'America/Chicago',
    )
    expect(totals.weekMinutes).toBe(420)
    expect(totals.monthMinutes).toBe(420)
    expect(totals.yearMinutes).toBe(420)
  })

  it('fails closed when the canonical read model marks an approved chain invalid', () => {
    const invalid = {
      ...log('invalid', '2026-09-25', 450, 'approved'),
      effective_minutes: null,
      integrity_status: 'invalid' as const,
    }

    expect(() => getOfficialMinutes(invalid)).toThrow('invalid adjustment chain')
    expect(() => calculateOfficialApprovedMinutes([invalid])).toThrow('invalid adjustment chain')
  })

  it('uses a Monday-based current week', () => {
    const windows = getCurrentReportingWindows(
      new Date('2026-09-25T20:00:00-05:00'),
      'America/Chicago',
    )

    expect(windows.today).toBe('2026-09-25')
    expect(windows.weekStart).toBe('2026-09-21')
    expect(windows.monthStart).toBe('2026-09-01')
    expect(windows.yearStart).toBe('2026-01-01')
  })

  it('formats hours and minutes for reports', () => {
    expect(formatHourMinutes(0)).toBe('0h')
    expect(formatHourMinutes(60)).toBe('1h')
    expect(formatHourMinutes(450)).toBe('7h 30m')
  })
})

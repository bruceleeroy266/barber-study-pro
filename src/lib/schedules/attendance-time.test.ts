import { describe, expect, it } from 'vitest'
import {
  calculateAttendedMinutes,
  isoToLocalTime,
  zonedLocalTimeToIso,
} from './attendance-time'

describe('attendance time helpers', () => {
  it('calculates attended minutes after the break', () => {
    expect(calculateAttendedMinutes('09:15', '16:00', 30)).toBe(375)
  })

  it('returns zero for invalid or reversed ranges', () => {
    expect(calculateAttendedMinutes('16:00', '09:15', 30)).toBe(0)
  })

  it('converts school-local time to a real instant and back', () => {
    const iso = zonedLocalTimeToIso('2026-09-28', '08:30', 'America/Chicago')
    expect(isoToLocalTime(iso, 'America/Chicago')).toBe('08:30')
  })

  it('handles daylight-saving standard time correctly', () => {
    const iso = zonedLocalTimeToIso('2026-12-15', '08:30', 'America/Chicago')
    expect(iso).toContain('14:30:00.000Z')
  })
})

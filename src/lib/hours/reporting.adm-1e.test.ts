import { describe, expect, it } from 'vitest'
import type { HoursReportLog } from './reporting'
import { calculateHoursProgressSummary } from './reporting'

const log = (
  id: string,
  status: HoursReportLog['status'],
  minutes: number,
  effectiveMinutes: number | null = minutes,
): HoursReportLog => ({
  id,
  user_id: 'student-1',
  date: '2026-10-03',
  category: 'Theory',
  minutes,
  effective_minutes: effectiveMinutes,
  integrity_status: status === 'approved' ? 'valid_unadjusted' : 'not_approved',
  status,
  notes: null,
  submitted_by: null,
  reviewed_by: null,
  reviewed_at: null,
  created_at: null,
})

describe('ADM-1E canonical hours progress summary', () => {
  it('counts only official approved minutes toward completion', () => {
    const summary = calculateHoursProgressSummary([
      log('approved', 'approved', 120),
      log('pending', 'pending', 90),
      log('rejected', 'rejected', 60),
    ], 10)

    expect(summary.approvedMinutes).toBe(120)
    expect(summary.pendingMinutes).toBe(90)
    expect(summary.remainingMinutes).toBe(480)
    expect(summary.completionPercentage).toBe(20)
  })

  it('uses adjusted effective minutes for approved hours', () => {
    const adjusted = log('adjusted', 'approved', 180, 120)
    adjusted.integrity_status = 'valid_adjusted'

    const summary = calculateHoursProgressSummary([adjusted], 10)
    expect(summary.approvedMinutes).toBe(120)
  })

  it('caps completion at 100 and remaining at zero', () => {
    const summary = calculateHoursProgressSummary([
      log('approved', 'approved', 720),
    ], 10)

    expect(summary.completionPercentage).toBe(100)
    expect(summary.remainingMinutes).toBe(0)
  })

  it('returns a safe zero percentage when no positive requirement exists', () => {
    const summary = calculateHoursProgressSummary([], 0)
    expect(summary.requiredMinutes).toBe(0)
    expect(summary.completionPercentage).toBe(0)
  })
})

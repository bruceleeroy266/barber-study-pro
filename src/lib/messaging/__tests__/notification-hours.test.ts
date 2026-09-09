/**
 * Program-driven hour-pace notifications (nationwide hardening, 2026-09-08).
 *
 * Proves that generateNotificationsFromHours / generateAllNotifications use
 * the applicable program's configured required_hours instead of the historical
 * hard-coded 1500, and that missing/invalid values preserve the default
 * fallback behavior.
 */

import { describe, it, expect } from 'vitest'
import {
  generateNotificationsFromHours,
  generateAllNotifications,
} from '@/lib/messaging/notification-engine'
import { DEFAULT_REQUIRED_HOURS } from '@/lib/programs/requirements'
import { HourLog, HourStatus } from '@/types'

function makeHourLog(userId: string, minutes: number, status: HourStatus): HourLog {
  return {
    id: `log-${userId}-${status}-${minutes}`,
    user_id: userId,
    date: '2026-09-01',
    category: 'Clinic',
    minutes,
    status,
    notes: null,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  }
}

const missingHoursTitles = <T extends { title: string }>(notifications: T[]): T[] =>
  notifications.filter((n) => n.title === 'Missing Hours')

describe('generateNotificationsFromHours with configured program required_hours', () => {
  // 600 approved hours: ahead of pace for a 1000h program (>= 50%), behind for 1500h (< 50%).
  const logs = [makeHourLog('u1', 600 * 60, 'approved')]

  it('does not flag a 1000h-program student who is on pace', () => {
    const notifications = generateNotificationsFromHours('u1', logs, 1000)
    expect(missingHoursTitles(notifications)).toHaveLength(0)
  })

  it('flags the same student under the default 1500h requirement', () => {
    const notifications = generateNotificationsFromHours('u1', logs)
    expect(missingHoursTitles(notifications)).toHaveLength(1)
  })

  it('flags a 1000h-program student who is actually behind pace', () => {
    const behind = [makeHourLog('u1', 400 * 60, 'approved')]
    const notifications = generateNotificationsFromHours('u1', behind, 1000)
    expect(missingHoursTitles(notifications)).toHaveLength(1)
    expect(missingHoursTitles(notifications)[0]?.body).toContain('400 approved hours')
  })

  it.each([undefined, null, 0, -100, NaN])('falls back to the 1500 schema default for %s', (value) => {
    const notifications = generateNotificationsFromHours('u1', logs, value)
    expect(missingHoursTitles(notifications)).toHaveLength(1)
    expect(DEFAULT_REQUIRED_HOURS).toBe(1500)
  })

  it('pending-hours notification is independent of required_hours', () => {
    const withPending = [makeHourLog('u1', 600 * 60, 'approved'), makeHourLog('u1', 5 * 60, 'pending')]
    const notifications = generateNotificationsFromHours('u1', withPending, 1000)
    expect(notifications.some((n) => n.title === 'Pending Hour Logs')).toBe(true)
    expect(missingHoursTitles(notifications)).toHaveLength(0)
  })
})

describe('generateAllNotifications threads requiredHours', () => {
  const logs = [makeHourLog('u1', 600 * 60, 'approved')]

  it('uses input.requiredHours for hour-pace checks', () => {
    const notifications = generateAllNotifications({ userId: 'u1', fullName: 'U One', hourLogs: logs, requiredHours: 1000 })
    expect(missingHoursTitles(notifications)).toHaveLength(0)
  })

  it('preserves the default when input.requiredHours is omitted', () => {
    const notifications = generateAllNotifications({ userId: 'u1', fullName: 'U One', hourLogs: logs })
    expect(missingHoursTitles(notifications)).toHaveLength(1)
  })
})

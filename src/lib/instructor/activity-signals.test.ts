/**
 * @vitest-environment node
 *
 * Tests proving that "Last Learning Activity" and "Last Login" are DISTINCT
 * instructor-facing signals derived from independent sources:
 *   - learning recency ← student_progress.last_studied_at (study work)
 *   - login recency   ← auth.users.last_sign_in_at (account access)
 *
 * A recent login must never masquerade as learning activity, and recent
 * learning activity must never require a recent login.
 */

import { describe, it, expect } from 'vitest'

import { daysSinceTimestamp, deriveLearningVsLoginSignals } from './activity-signals'

const NOW = new Date('2026-09-09T12:00:00.000Z')
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 60 * 60 * 1000).toISOString()
const daysAgo = (d: number) => hoursAgo(d * 24)

describe('daysSinceTimestamp', () => {
  it('returns null when there is no signal', () => {
    expect(daysSinceTimestamp(null, NOW)).toBeNull()
    expect(daysSinceTimestamp(undefined, NOW)).toBeNull()
    expect(daysSinceTimestamp('', NOW)).toBeNull()
  })

  it('returns null for an unparseable timestamp', () => {
    expect(daysSinceTimestamp('not-a-date', NOW)).toBeNull()
  })

  it('returns 0 for activity today', () => {
    expect(daysSinceTimestamp(hoursAgo(3), NOW)).toBe(0)
  })

  it('returns whole days elapsed', () => {
    expect(daysSinceTimestamp(daysAgo(6), NOW)).toBe(6)
    expect(daysSinceTimestamp(daysAgo(14), NOW)).toBe(14)
  })
})

describe('deriveLearningVsLoginSignals — login recency vs learning recency are distinct', () => {
  it('a student who logged in today but never studied shows login recency and NO learning recency', () => {
    const signals = deriveLearningVsLoginSignals({
      lastStudiedAt: null,
      lastSignInAt: hoursAgo(1),
      now: NOW,
    })

    expect(signals.daysSinceLogin).toBe(0)
    expect(signals.daysSinceLearning).toBeNull()
    expect(signals.lastLearningActivityAt).toBeNull()
    expect(signals.lastLoginAt).toBe(hoursAgo(1))
  })

  it('a student who studied today but last logged in 10 days ago shows learning recency and stale login', () => {
    const signals = deriveLearningVsLoginSignals({
      lastStudiedAt: hoursAgo(2),
      lastSignInAt: daysAgo(10),
      now: NOW,
    })

    expect(signals.daysSinceLearning).toBe(0)
    expect(signals.daysSinceLogin).toBe(10)
  })

  it('each signal is derived independently — neither input shifts the other', () => {
    const studiedOnly = deriveLearningVsLoginSignals({
      lastStudiedAt: daysAgo(1),
      lastSignInAt: null,
      now: NOW,
    })
    expect(studiedOnly.daysSinceLearning).toBe(1)
    expect(studiedOnly.daysSinceLogin).toBeNull()

    const loginOnly = deriveLearningVsLoginSignals({
      lastStudiedAt: null,
      lastSignInAt: daysAgo(2),
      now: NOW,
    })
    expect(loginOnly.daysSinceLearning).toBeNull()
    expect(loginOnly.daysSinceLogin).toBe(2)
  })

  it('both signals absent stay absent', () => {
    const signals = deriveLearningVsLoginSignals({
      lastStudiedAt: null,
      lastSignInAt: null,
      now: NOW,
    })
    expect(signals.daysSinceLearning).toBeNull()
    expect(signals.daysSinceLogin).toBeNull()
  })

  it('defaults lastSignInAt to null when not provided (login signal simply unavailable)', () => {
    const signals = deriveLearningVsLoginSignals({
      lastStudiedAt: daysAgo(3),
      now: NOW,
    })
    expect(signals.daysSinceLearning).toBe(3)
    expect(signals.daysSinceLogin).toBeNull()
  })
})

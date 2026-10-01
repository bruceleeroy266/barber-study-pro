import { describe, expect, it } from 'vitest'
import {
  HourAdjustmentIntegrityError,
  calculateEffectiveApprovedMinutes,
  resolveEffectiveHourLog,
  resolveEffectiveHourLogs,
  type EffectiveHourLogInput,
  type HourAdjustmentInput,
} from './effective-hours'

function hour(overrides: Partial<EffectiveHourLogInput> = {}): EffectiveHourLogInput {
  return {
    id: 'hour-1',
    school_id: 'school-1',
    user_id: 'student-1',
    date: '2026-10-01',
    category: 'Clinic',
    minutes: 450,
    status: 'approved',
    source_type: 'manual',
    source_attendance_id: null,
    adjustment_version: 0,
    ...overrides,
  }
}

function adjustment(
  overrides: Partial<HourAdjustmentInput> = {},
): HourAdjustmentInput {
  return {
    id: 'adj-1',
    school_id: 'school-1',
    hour_log_id: 'hour-1',
    student_id: 'student-1',
    adjustment_sequence: 1,
    original_minutes: 450,
    previous_effective_minutes: 450,
    new_effective_minutes: 420,
    delta_minutes: -30,
    source_type: 'manual',
    source_attendance_id: null,
    previous_adjustment_id: null,
    ...overrides,
  }
}

describe('H&A-6B effective-hours resolver', () => {
  it('keeps an unadjusted approved row unchanged', () => {
    const resolved = resolveEffectiveHourLog(hour(), [])

    expect(resolved.originalMinutes).toBe(450)
    expect(resolved.effectiveMinutes).toBe(450)
    expect(resolved.adjustmentDeltaMinutes).toBe(0)
    expect(resolved.isAdjusted).toBe(false)
    expect(resolved.integrityStatus).toBe('valid_unadjusted')
  })

  it('resolves approved 7h30 to adjusted 7h00 without changing the original evidence', () => {
    const resolved = resolveEffectiveHourLog(
      hour({ adjustment_version: 1 }),
      [adjustment()],
    )

    expect(resolved.originalMinutes).toBe(450)
    expect(resolved.effectiveMinutes).toBe(420)
    expect(resolved.adjustmentDeltaMinutes).toBe(-30)
    expect(resolved.adjustmentCount).toBe(1)
    expect(resolved.latestAdjustmentId).toBe('adj-1')
    expect(resolved.isAdjusted).toBe(true)
    expect(resolved.integrityStatus).toBe('valid_adjusted')
  })

  it('resolves a multi-adjustment chain to the final official value', () => {
    const adjustments = [
      adjustment(),
      adjustment({
        id: 'adj-2',
        adjustment_sequence: 2,
        previous_effective_minutes: 420,
        new_effective_minutes: 435,
        delta_minutes: 15,
        previous_adjustment_id: 'adj-1',
      }),
    ]

    const resolved = resolveEffectiveHourLog(
      hour({ adjustment_version: 2 }),
      adjustments,
    )

    expect(resolved.originalMinutes).toBe(450)
    expect(resolved.effectiveMinutes).toBe(435)
    expect(resolved.adjustmentDeltaMinutes).toBe(-15)
    expect(resolved.adjustmentCount).toBe(2)
    expect(resolved.latestAdjustmentId).toBe('adj-2')
  })

  it('allows a valid approved record to be corrected all the way to zero credit', () => {
    const resolved = resolveEffectiveHourLog(
      hour({ adjustment_version: 1 }),
      [adjustment({ new_effective_minutes: 0, delta_minutes: -450 })],
    )

    expect(resolved.originalMinutes).toBe(450)
    expect(resolved.effectiveMinutes).toBe(0)
    expect(resolved.adjustmentDeltaMinutes).toBe(-450)
  })

  it('makes pending and rejected rows contribute zero official minutes', () => {
    for (const status of ['pending', 'rejected'] as const) {
      const resolved = resolveEffectiveHourLog(hour({ status }), [])
      expect(resolved.effectiveMinutes).toBe(0)
      expect(resolved.integrityStatus).toBe('not_approved')
    }
  })

  it('sums effective approved minutes rather than raw approved evidence', () => {
    const logs = [
      hour({ id: 'hour-1', adjustment_version: 1, minutes: 450 }),
      hour({ id: 'hour-2', minutes: 480 }),
      hour({ id: 'hour-3', minutes: 300, status: 'pending' }),
    ]
    const adjustments = [adjustment()]

    expect(calculateEffectiveApprovedMinutes(logs, adjustments)).toBe(900)
  })

  it('preserves original training date/category in the resolved record', () => {
    const resolved = resolveEffectiveHourLog(
      hour({
        date: '2026-06-05',
        category: 'Theory',
        adjustment_version: 1,
      }),
      [adjustment()],
    )

    expect(resolved.date).toBe('2026-06-05')
    expect(resolved.category).toBe('Theory')
  })

  it('fails closed when adjustment count does not match the version', () => {
    expect(() =>
      resolveEffectiveHourLog(hour({ adjustment_version: 2 }), [adjustment()]),
    ).toThrow(HourAdjustmentIntegrityError)
  })

  it('fails closed when sequence links skip or point to the wrong adjustment', () => {
    const adjustments = [
      adjustment(),
      adjustment({
        id: 'adj-2',
        adjustment_sequence: 2,
        previous_effective_minutes: 420,
        new_effective_minutes: 435,
        delta_minutes: 15,
        previous_adjustment_id: 'wrong-id',
      }),
    ]

    expect(() =>
      resolveEffectiveHourLog(hour({ adjustment_version: 2 }), adjustments),
    ).toThrow('immediately preceding adjustment')
  })

  it('fails closed when original evidence or tenant provenance changes in the chain', () => {
    expect(() =>
      resolveEffectiveHourLog(
        hour({ adjustment_version: 1 }),
        [adjustment({ school_id: 'school-2' })],
      ),
    ).toThrow('school does not match')

    expect(() =>
      resolveEffectiveHourLog(
        hour({ adjustment_version: 1 }),
        [adjustment({ original_minutes: 400 })],
      ),
    ).toThrow('original minutes do not match')
  })

  it('fails closed when delta math is inconsistent', () => {
    expect(() =>
      resolveEffectiveHourLog(
        hour({ adjustment_version: 1 }),
        [adjustment({ delta_minutes: -10 })],
      ),
    ).toThrow('delta does not match')
  })

  it('fails closed when a non-approved row somehow has adjustment history', () => {
    expect(() =>
      resolveEffectiveHourLog(
        hour({ status: 'rejected', adjustment_version: 1 }),
        [adjustment()],
      ),
    ).toThrow('non-approved record contains adjustment history')
  })

  it('keeps batch resolution in the same input order', () => {
    const logs = [
      hour({ id: 'hour-a', minutes: 60 }),
      hour({ id: 'hour-b', minutes: 120 }),
    ]

    const resolved = resolveEffectiveHourLogs(logs, [])
    expect(resolved.map((row) => row.hourLogId)).toEqual(['hour-a', 'hour-b'])
    expect(resolved.map((row) => row.effectiveMinutes)).toEqual([60, 120])
  })
})

import type { HourCategory, HourStatus } from '@/types'

export type HourSourceType = 'manual' | 'attendance'

export interface EffectiveHourLogInput {
  id: string
  school_id: string
  user_id: string
  date: string
  category: HourCategory
  minutes: number
  status: HourStatus
  source_type: HourSourceType
  source_attendance_id: string | null
  adjustment_version: number
}

export interface HourAdjustmentInput {
  id: string
  school_id: string
  hour_log_id: string
  student_id: string
  adjustment_sequence: number
  original_minutes: number
  previous_effective_minutes: number
  new_effective_minutes: number
  delta_minutes: number
  source_type: HourSourceType
  source_attendance_id: string | null
  previous_adjustment_id: string | null
}

export type HourIntegrityStatus =
  | 'not_approved'
  | 'valid_unadjusted'
  | 'valid_adjusted'

export interface EffectiveHourResolution {
  hourLogId: string
  studentId: string
  schoolId: string
  date: string
  category: HourCategory
  status: HourStatus
  originalMinutes: number
  effectiveMinutes: number
  adjustmentDeltaMinutes: number
  adjustmentCount: number
  adjustmentVersion: number
  latestAdjustmentId: string | null
  isAdjusted: boolean
  integrityStatus: HourIntegrityStatus
}

export class HourAdjustmentIntegrityError extends Error {
  readonly hourLogId: string

  constructor(hourLogId: string, message: string) {
    super(`Hour adjustment integrity failure for ${hourLogId}: ${message}`)
    this.name = 'HourAdjustmentIntegrityError'
    this.hourLogId = hourLogId
  }
}

function fail(hourLogId: string, message: string): never {
  throw new HourAdjustmentIntegrityError(hourLogId, message)
}

function assertMinuteValue(hourLogId: string, label: string, value: number): void {
  if (!Number.isInteger(value) || value < 0 || value > 1440) {
    fail(hourLogId, `${label} must be an integer between 0 and 1440`)
  }
}

function validateBaseLog(hourLog: EffectiveHourLogInput): void {
  if (!Number.isInteger(hourLog.minutes) || hourLog.minutes <= 0 || hourLog.minutes > 1440) {
    fail(hourLog.id, 'original approved minutes are invalid')
  }

  if (!Number.isInteger(hourLog.adjustment_version) || hourLog.adjustment_version < 0) {
    fail(hourLog.id, 'adjustment version is invalid')
  }

  if (hourLog.source_type === 'manual' && hourLog.source_attendance_id !== null) {
    fail(hourLog.id, 'manual hour record has attendance provenance')
  }

  if (hourLog.source_type === 'attendance' && hourLog.source_attendance_id === null) {
    fail(hourLog.id, 'attendance hour record is missing attendance provenance')
  }
}

function validateAdjustmentChain(
  hourLog: EffectiveHourLogInput,
  adjustments: HourAdjustmentInput[],
): HourAdjustmentInput[] {
  const ordered = [...adjustments].sort(
    (a, b) => a.adjustment_sequence - b.adjustment_sequence,
  )

  if (ordered.length !== hourLog.adjustment_version) {
    fail(
      hourLog.id,
      `adjustment count ${ordered.length} does not match version ${hourLog.adjustment_version}`,
    )
  }

  for (let index = 0; index < ordered.length; index += 1) {
    const current = ordered[index]
    const expectedSequence = index + 1
    const previous = index === 0 ? null : ordered[index - 1]

    if (current.hour_log_id !== hourLog.id) {
      fail(hourLog.id, 'adjustment references another hour log')
    }
    if (current.adjustment_sequence !== expectedSequence) {
      fail(hourLog.id, `expected adjustment sequence ${expectedSequence}`)
    }
    if (current.school_id !== hourLog.school_id) {
      fail(hourLog.id, 'adjustment school does not match the hour log')
    }
    if (current.student_id !== hourLog.user_id) {
      fail(hourLog.id, 'adjustment student does not match the hour log')
    }
    if (current.original_minutes !== hourLog.minutes) {
      fail(hourLog.id, 'adjustment original minutes do not match the approved evidence')
    }
    if (current.source_type !== hourLog.source_type) {
      fail(hourLog.id, 'adjustment source type does not match the hour log')
    }
    if (current.source_attendance_id !== hourLog.source_attendance_id) {
      fail(hourLog.id, 'adjustment attendance provenance does not match the hour log')
    }

    assertMinuteValue(hourLog.id, 'previous effective minutes', current.previous_effective_minutes)
    assertMinuteValue(hourLog.id, 'new effective minutes', current.new_effective_minutes)

    if (current.new_effective_minutes === current.previous_effective_minutes) {
      fail(hourLog.id, 'no-op adjustment is not valid')
    }
    if (
      current.delta_minutes !==
      current.new_effective_minutes - current.previous_effective_minutes
    ) {
      fail(hourLog.id, 'adjustment delta does not match before/after values')
    }

    if (!previous) {
      if (current.previous_adjustment_id !== null) {
        fail(hourLog.id, 'first adjustment must not reference a previous adjustment')
      }
      if (current.previous_effective_minutes !== hourLog.minutes) {
        fail(hourLog.id, 'first adjustment must start from the original approved minutes')
      }
    } else {
      if (current.previous_adjustment_id !== previous.id) {
        fail(hourLog.id, 'adjustment does not link to the immediately preceding adjustment')
      }
      if (current.previous_effective_minutes !== previous.new_effective_minutes) {
        fail(hourLog.id, 'adjustment before-value does not match the preceding after-value')
      }
    }
  }

  return ordered
}

/**
 * Canonical effective-hours contract.
 *
 * - pending/rejected records contribute 0 official minutes and may not have
 *   adjustment history.
 * - approved records with no adjustments contribute their original minutes.
 * - approved adjusted records contribute the final valid chain value.
 * - any structural inconsistency throws instead of guessing an official total.
 */
export function resolveEffectiveHourLog(
  hourLog: EffectiveHourLogInput,
  adjustments: HourAdjustmentInput[],
): EffectiveHourResolution {
  validateBaseLog(hourLog)

  if (hourLog.status !== 'approved') {
    if (hourLog.adjustment_version !== 0 || adjustments.length !== 0) {
      fail(hourLog.id, 'non-approved record contains adjustment history')
    }

    return {
      hourLogId: hourLog.id,
      studentId: hourLog.user_id,
      schoolId: hourLog.school_id,
      date: hourLog.date,
      category: hourLog.category,
      status: hourLog.status,
      originalMinutes: hourLog.minutes,
      effectiveMinutes: 0,
      adjustmentDeltaMinutes: -hourLog.minutes,
      adjustmentCount: 0,
      adjustmentVersion: 0,
      latestAdjustmentId: null,
      isAdjusted: false,
      integrityStatus: 'not_approved',
    }
  }

  if (hourLog.adjustment_version === 0) {
    if (adjustments.length !== 0) {
      fail(hourLog.id, 'version 0 approved record unexpectedly has adjustments')
    }

    return {
      hourLogId: hourLog.id,
      studentId: hourLog.user_id,
      schoolId: hourLog.school_id,
      date: hourLog.date,
      category: hourLog.category,
      status: hourLog.status,
      originalMinutes: hourLog.minutes,
      effectiveMinutes: hourLog.minutes,
      adjustmentDeltaMinutes: 0,
      adjustmentCount: 0,
      adjustmentVersion: 0,
      latestAdjustmentId: null,
      isAdjusted: false,
      integrityStatus: 'valid_unadjusted',
    }
  }

  const ordered = validateAdjustmentChain(hourLog, adjustments)
  const latest = ordered[ordered.length - 1]

  if (!latest) {
    fail(hourLog.id, 'positive adjustment version has no adjustment rows')
  }

  return {
    hourLogId: hourLog.id,
    studentId: hourLog.user_id,
    schoolId: hourLog.school_id,
    date: hourLog.date,
    category: hourLog.category,
    status: hourLog.status,
    originalMinutes: hourLog.minutes,
    effectiveMinutes: latest.new_effective_minutes,
    adjustmentDeltaMinutes: latest.new_effective_minutes - hourLog.minutes,
    adjustmentCount: ordered.length,
    adjustmentVersion: hourLog.adjustment_version,
    latestAdjustmentId: latest.id,
    isAdjusted: true,
    integrityStatus: 'valid_adjusted',
  }
}

export function resolveEffectiveHourLogs(
  hourLogs: EffectiveHourLogInput[],
  adjustments: HourAdjustmentInput[],
): EffectiveHourResolution[] {
  const adjustmentsByHourLog = new Map<string, HourAdjustmentInput[]>()

  for (const adjustment of adjustments) {
    const bucket = adjustmentsByHourLog.get(adjustment.hour_log_id) ?? []
    bucket.push(adjustment)
    adjustmentsByHourLog.set(adjustment.hour_log_id, bucket)
  }

  return hourLogs.map((hourLog) =>
    resolveEffectiveHourLog(hourLog, adjustmentsByHourLog.get(hourLog.id) ?? []),
  )
}

export function calculateEffectiveApprovedMinutes(
  hourLogs: EffectiveHourLogInput[],
  adjustments: HourAdjustmentInput[],
): number {
  return resolveEffectiveHourLogs(hourLogs, adjustments).reduce(
    (sum, row) => sum + row.effectiveMinutes,
    0,
  )
}

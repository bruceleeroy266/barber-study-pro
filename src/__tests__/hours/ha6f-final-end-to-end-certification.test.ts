import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  calculateEffectiveApprovedMinutes,
  resolveEffectiveHourLog,
  type EffectiveHourLogInput,
  type HourAdjustmentInput,
} from '@/lib/hours/effective-hours'
import {
  calculateOfficialApprovedMinutes,
  getOfficialMinutes,
  type HoursReportLog,
} from '@/lib/hours/reporting'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

const adjustmentMigration = read(
  'supabase/migrations/20261001153000_ha6a_hour_adjustment_foundation.sql',
)
const effectiveViewMigration = read(
  'supabase/migrations/20261001170000_ha6e_attendance_provenance_view.sql',
)
const actions = read('src/app/instructor/hours/actions.ts')
const manager = read('src/components/hours/StaffHoursManager.tsx')
const reporting = read('src/lib/hours/reporting.ts')
const pdf = read('src/lib/hours/export-pdf.ts')
const compliance = read('src/lib/compliance/compliance-engine.ts')
const analytics = read('src/lib/school-owner/school-analytics.ts')
const notifications = read('src/lib/messaging/notification-engine.ts')

function approvedHour(overrides: Partial<EffectiveHourLogInput> = {}): EffectiveHourLogInput {
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

function adjustment(overrides: Partial<HourAdjustmentInput> = {}): HourAdjustmentInput {
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

describe('H&A-6F final end-to-end certification', () => {
  it('preserves original approved evidence while changing the official effective value', () => {
    const result = resolveEffectiveHourLog(
      approvedHour({ adjustment_version: 1 }),
      [adjustment()],
    )

    expect(result.originalMinutes).toBe(450)
    expect(result.effectiveMinutes).toBe(420)
    expect(result.adjustmentDeltaMinutes).toBe(-30)
    expect(result.isAdjusted).toBe(true)
  })

  it('supports chained corrections without erasing prior evidence', () => {
    const chain = [
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

    const result = resolveEffectiveHourLog(
      approvedHour({ adjustment_version: 2 }),
      chain,
    )

    expect(result.originalMinutes).toBe(450)
    expect(result.effectiveMinutes).toBe(435)
    expect(result.adjustmentCount).toBe(2)
  })

  it('keeps unadjusted approved records backward-compatible', () => {
    const logs = [approvedHour(), approvedHour({ id: 'hour-2', minutes: 120 })]
    expect(calculateEffectiveApprovedMinutes(logs, [])).toBe(570)
  })

  it('keeps pending and rejected hours out of official totals', () => {
    const rows: HoursReportLog[] = [
      {
        id: 'pending',
        user_id: 'student-1',
        date: '2026-10-01',
        category: 'Clinic',
        minutes: 300,
        status: 'pending',
        notes: null,
        submitted_by: 'instructor-1',
        reviewed_by: null,
        reviewed_at: null,
        created_at: '2026-10-01T12:00:00Z',
      },
      {
        id: 'rejected',
        user_id: 'student-1',
        date: '2026-10-01',
        category: 'Clinic',
        minutes: 300,
        status: 'rejected',
        notes: null,
        submitted_by: 'instructor-1',
        reviewed_by: 'admin-1',
        reviewed_at: '2026-10-01T13:00:00Z',
        created_at: '2026-10-01T12:00:00Z',
      },
    ]

    expect(calculateOfficialApprovedMinutes(rows)).toBe(0)
  })

  it('fails closed instead of trusting raw minutes when a chain is invalid', () => {
    const invalid: HoursReportLog = {
      id: 'invalid',
      user_id: 'student-1',
      date: '2026-10-01',
      category: 'Clinic',
      minutes: 450,
      status: 'approved',
      notes: null,
      submitted_by: 'instructor-1',
      reviewed_by: 'admin-1',
      reviewed_at: '2026-10-01T13:00:00Z',
      created_at: '2026-10-01T12:00:00Z',
      effective_minutes: null,
      integrity_status: 'invalid',
    }

    expect(() => getOfficialMinutes(invalid)).toThrow('invalid adjustment chain')
  })

  it('keeps approved-hour corrections server-authoritative and immutable', () => {
    expect(adjustmentMigration).toContain('create table if not exists public.hour_adjustments')
    expect(adjustmentMigration).toContain('before update or delete on public.hour_adjustments')
    expect(adjustmentMigration).toContain("supabase").toBe(false)
    expect(adjustmentMigration).toContain('create or replace function public.adjust_approved_hour(')
    expect(adjustmentMigration).toContain('for update;')
    expect(adjustmentMigration).toContain('adjustment_version = adjustment_version + 1')
  })

  it('keeps the admin UX narrow while the backend derives authoritative audit fields', () => {
    expect(manager).toContain('Adjust Hours')
    expect(manager).toContain('Corrected hours')
    expect(manager).toContain('Reason for adjustment')
    expect(manager).toContain('Save Adjustment')
    expect(actions).toContain("supabase.rpc('adjust_approved_hour'")
    expect(manager).not.toContain('name="deltaMinutes"')
    expect(manager).not.toContain('name="schoolId"')
  })

  it('preserves attendance provenance and requires attendance alignment before adjustment', () => {
    expect(effectiveViewMigration).toContain('attendance_provenance_status')
    expect(effectiveViewMigration).toContain("then 'aligned'")
    expect(effectiveViewMigration).toContain("else 'needs_adjustment'")
    expect(adjustmentMigration).toContain('ar.minutes_present = p_new_effective_minutes')
    expect(manager).toContain('Attendance changed · adjustment needed')
  })

  it('routes all official downstream consumers through effective-hour helpers', () => {
    expect(reporting).toContain('getOfficialMinutes')
    expect(pdf).toContain('getOfficialMinutes(log)')
    expect(compliance).toContain('getOfficialMinutes(h)')
    expect(analytics).toContain('getOfficialMinutes(h)')
    expect(notifications).toContain('getOfficialMinutes(h)')
  })

  it('keeps rejected attendance correction/resubmission semantics separate from approved adjustments', () => {
    expect(adjustmentMigration).not.toContain('resubmission_of_hour_log_id =')
    expect(actions).toContain("target.status !== 'approved'")
  })

  it('does not cross the TLS or Chapters 1-21 boundary', () => {
    const combined = [
      adjustmentMigration,
      effectiveViewMigration,
      actions,
      manager,
      reporting,
      pdf,
      compliance,
      analytics,
      notifications,
    ].join('\n')

    expect(combined).not.toContain("from '@/lib/tls")
    expect(combined).not.toContain('remediation_cycles')
    expect(combined).not.toContain('quiz_attempts')
  })
})

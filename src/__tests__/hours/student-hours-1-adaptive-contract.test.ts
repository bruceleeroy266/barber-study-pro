import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { calculateAdaptiveStudentHours } from '@/lib/hours/adaptive-student-hours'
import type { HoursProgressLog } from '@/lib/hours/reporting'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')
const migration = read(
  'supabase/migrations/20261006233000_student_hours_1_adaptive_enrollment_contract.sql',
)

function approved(minutes: number): HoursProgressLog {
  return {
    id: `approved-${minutes}`,
    status: 'approved',
    minutes,
    effective_minutes: minutes,
    integrity_status: 'valid_unadjusted',
  }
}

function adjusted(original: number, effective: number): HoursProgressLog {
  return {
    id: `adjusted-${original}-${effective}`,
    status: 'approved',
    minutes: original,
    effective_minutes: effective,
    integrity_status: 'valid_adjusted',
  }
}

describe('STUDENT-HOURS-1 adaptive enrollment contract', () => {
  it('keeps prior credit separate from official earned-hour evidence', () => {
    expect(migration).toContain('create table if not exists public.enrollment_hour_contracts')
    expect(migration).toContain('prior_credit_minutes integer not null default 0')
    expect(migration).toContain('requirement_override_minutes integer')
    expect(migration).not.toContain('insert into public.hour_logs')
    expect(migration).not.toContain('update public.hour_logs')
    expect(migration).not.toContain('insert into public.hour_adjustments')
  })

  it('creates an append-only audit ledger with actor, old/new values, reason, source, and version', () => {
    expect(migration).toContain('create table if not exists public.enrollment_hour_contract_events')
    expect(migration).toContain('previous_prior_credit_minutes')
    expect(migration).toContain('new_prior_credit_minutes')
    expect(migration).toContain('previous_requirement_override_minutes')
    expect(migration).toContain('new_requirement_override_minutes')
    expect(migration).toContain('change_type text not null')
    expect(migration).toContain('reason text not null')
    expect(migration).toContain('source_reference text')
    expect(migration).toContain('changed_by uuid not null references public.profiles')
    expect(migration).toContain('contract_version integer not null')
    expect(migration).toContain('before update or delete on public.enrollment_hour_contract_events')
  })

  it('locks official writes behind one authenticated atomic RPC with optimistic concurrency', () => {
    expect(migration).toContain('create or replace function public.set_enrollment_hour_contract(')
    expect(migration).toContain('for update;')
    expect(migration).toContain('p_expected_version integer default 0')
    expect(migration).toContain("using errcode = '40001'")
    expect(migration).toContain('security definer')
    expect(migration).toContain('set search_path = public, pg_temp')
    expect(migration).toContain('revoke insert, update, delete on public.enrollment_hour_contracts from anon, authenticated')
    expect(migration).toContain('revoke insert, update, delete on public.enrollment_hour_contract_events from anon, authenticated')
  })

  it('keeps mutation authority administrative and school-scoped', () => {
    expect(migration).toContain("v_actor.role in ('admin', 'school_admin')")
    expect(migration).toContain('v_actor.school_id = v_student.school_id')
    expect(migration).toContain("v_actor.role = 'admin'")
    expect(migration).toContain('v_actor.school_id is null')
    expect(migration).toContain("v_actor.role = 'platform_super_admin'")
    expect(migration).not.toContain("v_actor.role = 'instructor'")
  })

  it('exposes a canonical requirement view without aggregating earned hours', () => {
    expect(migration).toContain('create view public.effective_enrollment_hour_contracts')
    expect(migration).toContain('coalesce(c.prior_credit_minutes, 0) as prior_credit_minutes')
    expect(migration).toContain(
      'coalesce(c.requirement_override_minutes, p.required_hours * 60) as effective_required_minutes',
    )
    expect(migration).not.toContain('join public.effective_hour_logs')
  })

  it('calculates a standard new student from program requirement only', () => {
    const result = calculateAdaptiveStudentHours([approved(120 * 60)], {
      programRequiredHours: 1250,
    })

    expect(result.programRequiredMinutes).toBe(1250 * 60)
    expect(result.priorCreditMinutes).toBe(0)
    expect(result.earnedApprovedMinutes).toBe(120 * 60)
    expect(result.effectiveRequiredMinutes).toBe(1250 * 60)
    expect(result.remainingMinutes).toBe(1130 * 60)
    expect(result.requirementSource).toBe('program')
  })

  it('applies accepted transfer credit without creating fake earned hours', () => {
    const result = calculateAdaptiveStudentHours([approved(120 * 60)], {
      programRequiredHours: 1250,
      priorCreditMinutes: 700 * 60,
      contractVersion: 1,
    })

    expect(result.priorCreditMinutes).toBe(700 * 60)
    expect(result.earnedApprovedMinutes).toBe(120 * 60)
    expect(result.creditedAndEarnedMinutes).toBe(820 * 60)
    expect(result.remainingMinutes).toBe(430 * 60)
    expect(result.contractVersion).toBe(1)
  })

  it('uses a student-specific total requirement override without changing program requirement', () => {
    const result = calculateAdaptiveStudentHours([approved(100 * 60)], {
      programRequiredHours: 1250,
      requirementOverrideMinutes: 500 * 60,
    })

    expect(result.programRequiredHours).toBe(1250)
    expect(result.effectiveRequiredHours).toBe(500)
    expect(result.requirementSource).toBe('student_override')
    expect(result.remainingMinutes).toBe(400 * 60)
  })

  it('combines transfer credit, adjusted official earned hours, and override deterministically', () => {
    const result = calculateAdaptiveStudentHours(
      [adjusted(300 * 60, 280 * 60)],
      {
        programRequiredHours: 1250,
        priorCreditMinutes: 200 * 60,
        requirementOverrideMinutes: 600 * 60,
      },
    )

    expect(result.earnedApprovedMinutes).toBe(280 * 60)
    expect(result.creditedAndEarnedMinutes).toBe(480 * 60)
    expect(result.remainingMinutes).toBe(120 * 60)
    expect(result.completionPercentage).toBe(80)
  })

  it('keeps pending and rejected hours out of completion', () => {
    const logs: HoursProgressLog[] = [
      approved(100 * 60),
      { id: 'pending', status: 'pending', minutes: 300 * 60 },
      { id: 'rejected', status: 'rejected', minutes: 300 * 60 },
    ]

    const result = calculateAdaptiveStudentHours(logs, {
      programRequiredHours: 1250,
      priorCreditMinutes: 100 * 60,
    })

    expect(result.creditedAndEarnedMinutes).toBe(200 * 60)
  })

  it('floors remaining at zero and caps completion at 100 without erasing raw overage', () => {
    const result = calculateAdaptiveStudentHours([approved(700 * 60)], {
      programRequiredHours: 1250,
      priorCreditMinutes: 700 * 60,
    })

    expect(result.creditedAndEarnedMinutes).toBe(1400 * 60)
    expect(result.remainingMinutes).toBe(0)
    expect(result.completionPercentage).toBe(100)
  })

  it('fails closed through the existing official-hours contract when an adjustment chain is invalid', () => {
    expect(() =>
      calculateAdaptiveStudentHours(
        [{
          id: 'invalid',
          status: 'approved',
          minutes: 60,
          effective_minutes: null,
          integrity_status: 'invalid',
        }],
        { programRequiredHours: 1250 },
      ),
    ).toThrow('invalid adjustment chain')
  })
})

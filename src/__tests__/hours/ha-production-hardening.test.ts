import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

const correctionGrantMigration = read(
  'supabase/migrations/20261001221000_repair_attendance_corrections_grants.sql',
)
const dailyCapMigration = read(
  'supabase/migrations/20261001221500_ha_aggregate_student_day_cap.sql',
)
const actions = read('src/app/instructor/hours/actions.ts')
const manager = read('src/components/hours/StaffHoursManager.tsx')

describe('H&A production hardening', () => {
  it('restores only the authenticated attendance correction privileges the UI needs', () => {
    expect(correctionGrantMigration).toContain(
      'grant select, insert on public.attendance_corrections to authenticated',
    )
    expect(correctionGrantMigration).toContain(
      'revoke update, delete on public.attendance_corrections from authenticated',
    )
  })

  it('enforces the aggregate 1,440-minute student/day cap at the database boundary', () => {
    expect(dailyCapMigration).toContain(
      'create or replace function public.enforce_hour_logs_daily_approved_cap()',
    )
    expect(dailyCapMigration).toContain(
      'before insert or update of status, minutes, user_id, date',
    )
    expect(dailyCapMigration).toContain(
      "if v_existing_minutes + new.minutes > 1440 then",
    )
    expect(dailyCapMigration).toContain(
      "raise exception 'Daily approved hours cannot exceed 1440 minutes (24 hours)'",
    )
  })

  it('serializes competing approval and adjustment writes for the same student/date', () => {
    expect(dailyCapMigration).toContain('pg_advisory_xact_lock')
    expect(dailyCapMigration).toContain(
      "hashtextextended(new.user_id::text || ':' || new.date::text, 0)",
    )
    expect(dailyCapMigration).toContain(
      "hashtextextended(v_hour.user_id::text || ':' || v_hour.date::text, 0)",
    )
  })

  it('uses effective approved minutes and fails closed on invalid adjustment chains', () => {
    expect(dailyCapMigration).toContain(
      'create or replace function public.ha_effective_approved_minutes_for_day',
    )
    expect(dailyCapMigration).toContain(
      "e.integrity_status not in ('valid_unadjusted', 'valid_adjusted')",
    )
    expect(dailyCapMigration).toContain(
      "raise exception 'Cannot calculate daily approved hours because an existing hour chain is invalid'",
    )
    expect(dailyCapMigration).toContain('sum(e.effective_minutes)')
  })

  it('applies the same aggregate cap to approved-hour adjustments', () => {
    expect(dailyCapMigration).toContain(
      'v_other_daily_minutes + p_new_effective_minutes > 1440',
    )
    expect(dailyCapMigration).toContain(
      'public.ha_effective_approved_minutes_for_day(v_hour.user_id, v_hour.date, v_hour.id)',
    )
  })

  it('surfaces the database cap cleanly through individual, bulk, and adjustment server actions', () => {
    const matches = actions.match(/daily approved hours cannot exceed 1440/g) ?? []
    expect(matches.length).toBeGreaterThanOrEqual(3)
    expect(actions).toContain("'daily-hour-cap'")
    expect(manager).toContain(
      'Approved hours cannot exceed 24 total hours for the same student on the same date.',
    )
  })

  it('does not alter TLS, chapter, quiz, mastery, remediation, or reassessment behavior', () => {
    const combined = [
      correctionGrantMigration,
      dailyCapMigration,
      actions,
      manager,
    ].join('\n').toLowerCase()

    expect(combined).not.toContain("from '@/lib/tls")
    expect(combined).not.toContain('remediation_cycles')
    expect(combined).not.toContain('quiz_attempts')
    expect(combined).not.toContain('reassessment')
  })
})

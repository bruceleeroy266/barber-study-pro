import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

const migration = read('supabase/migrations/20261001170000_ha6e_attendance_provenance_view.sql')
const manager = read('src/components/hours/StaffHoursManager.tsx')
const adjustmentMigration = read('supabase/migrations/20261001153000_ha6a_hour_adjustment_foundation.sql')

describe('H&A-6E attendance provenance integration', () => {
  it('extends the canonical effective-hour view with current attendance evidence', () => {
    expect(migration).toContain('ar.status as attendance_status')
    expect(migration).toContain('ar.minutes_present as attendance_minutes_present')
    expect(migration).toContain('ar.updated_at as attendance_updated_at')
    expect(migration).toContain('attendance_provenance_status')
    expect(migration).toContain('left join public.attendance_records ar')
    expect(migration).toContain('on ar.id = e.source_attendance_id')
  })

  it('distinguishes aligned attendance from attendance that now needs an hour adjustment', () => {
    expect(migration).toContain("when ar.minutes_present = e.effective_minutes then 'aligned'")
    expect(migration).toContain("else 'needs_adjustment'")
    expect(migration).toContain("when e.source_type = 'manual' then 'not_applicable'")
  })

  it('fails provenance visibly when source evidence is missing, invalid, or no longer creditable', () => {
    expect(migration).toContain("then 'missing_source'")
    expect(migration).toContain("then 'invalid_source'")
    expect(migration).toContain("then 'attendance_not_creditable'")
    expect(migration).toContain("then 'attendance_minutes_missing'")
    expect(migration).toContain("then 'invalid_hour_chain'")
  })

  it('does not silently rewrite approved hour evidence when attendance changes', () => {
    expect(migration).not.toContain('update public.hour_logs')
    expect(migration).not.toContain('insert into public.hour_adjustments')
    expect(migration).not.toContain('delete from public.hour_logs')
  })

  it('surfaces provenance status in the school-admin reviewed-hours UI', () => {
    expect(manager).toContain('attendance_provenance_status')
    expect(manager).toContain('Attendance changed · adjustment needed')
    expect(manager).toContain('Attendance source needs review')
    expect(manager).toContain('Attendance and official hours are aligned.')
    expect(manager).toContain('Review the attendance source before saving an hour adjustment.')
  })

  it('prefills the adjustment input from corrected attendance only when provenance says adjustment is needed', () => {
    expect(manager).toContain("log.attendance_provenance_status === 'needs_adjustment'")
    expect(manager).toContain('log.attendance_minutes_present')
    expect(manager).toContain('getOfficialMinutes(log)')
  })

  it('preserves the server-authoritative requirement that attendance must match the requested new official value', () => {
    expect(adjustmentMigration).toContain('ar.id = v_hour.source_attendance_id')
    expect(adjustmentMigration).toContain('ar.school_id = v_hour.school_id')
    expect(adjustmentMigration).toContain('ar.user_id = v_hour.user_id')
    expect(adjustmentMigration).toContain('ar.date = v_hour.date')
    expect(adjustmentMigration).toContain('ar.minutes_present = p_new_effective_minutes')
  })

  it('keeps manual hour records outside attendance provenance matching', () => {
    expect(migration).toContain("when e.source_type = 'manual' then 'not_applicable'")
    expect(manager).toContain("log.source_type === 'attendance'")
  })

  it('keeps the H&A/TLS architecture boundary intact', () => {
    const combined = [migration, manager].join('\n')
    expect(combined).not.toContain("from '@/lib/tls")
    expect(combined).not.toContain('remediation_cycles')
    expect(combined).not.toContain('quiz_attempts')
  })
})

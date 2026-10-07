import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')

const instructor = read('src/app/instructor/pilot-measurement/page.tsx')
const school = read('src/app/school/pilot-measurement/page.tsx')
const admin = read('src/app/admin/school/pilot-measurement/page.tsx')
const adminReport = read('src/app/admin/school/pilot-measurement/report/[checkpoint]/page.tsx')
const schoolReport = read('src/app/school/pilot-measurement/report/[checkpoint]/page.tsx')
const actions = read('src/app/admin/school/pilot-measurement/actions.ts')
const resolver = read('src/lib/pilot-measurement/resolver.ts')
const comparison = read('src/lib/pilot-measurement/report-comparisons.ts')
const persistence = read('supabase/migrations/20261006020000_po1e2_pilot_period_checkpoint_persistence.sql')
const hardening = read('supabase/migrations/20261007104500_po1e6_instructor_checkpoint_scope.sql')

describe('PO-1E.6 final certification', () => {
  it('keeps instructor aggregates assignment scoped and blocks official checkpoint reads', () => {
    expect(instructor).toContain('loadAssignedStudentIds')
    expect(instructor).toContain('allowedStudentIds')
    expect(instructor).not.toContain("from('pilot_measurement_checkpoints')")
    expect(instructor).toContain('This instructor view remains scoped to your assigned learners')
    expect(hardening).toContain('pilot_measurement_checkpoints_school_admin_select')
    expect(hardening).toContain('public.is_school_admin(school_id)')
    expect(hardening).not.toContain('public.is_school_staff(school_id)')
  })

  it('keeps school and platform admin routes fail closed', () => {
    expect(school).toContain('profile.school_id')
    expect(admin).toContain('isPlatformAdminProfile')
    expect(admin).toContain('schoolList.find((school) => school.id === requestedSchoolId)')
    expect(adminReport).toContain("eq('is_active', true)")
    expect(adminReport).toContain("is('deleted_at', null)")
    expect(schoolReport).toContain('profile.school_id')
  })

  it('preserves deterministic checkpoints and immutable finalized history', () => {
    expect(persistence).toContain("when 'baseline' then return p_start_date")
    expect(persistence).toContain("when 'day_30' then return p_start_date + 30")
    expect(persistence).toContain("when 'day_60' then return p_start_date + 60")
    expect(persistence).toContain("when 'day_90' then return p_start_date + 90")
    expect(persistence).toContain('before update or delete on public.pilot_measurement_checkpoints')
    expect(persistence).toContain("raise exception 'Finalized pilot measurement checkpoints are immutable'")
  })

  it('preserves aggregate exclusion and no-evidence semantics', () => {
    expect(resolver).toContain('include_in_school_metrics !== false')
    expect(resolver).toContain('averageOrNull')
    expect(resolver).toContain('averageLatestExamPercentage: averageOrNull')
    expect(resolver).toContain('averageReadinessScore: averageOrNull')
  })

  it('uses trusted activity and student-safe Exam Ready fields without answer-key leakage', () => {
    expect(actions).toContain("from('trusted_study_activity_days')")
    expect(actions).toContain("from('comprehensive_exam_attempts')")
    expect(actions).toContain('domain_breakdown')
    expect(actions).not.toContain('correct_option_snapshot')
    expect(actions).not.toContain('unscored_correct')
  })

  it('keeps checkpoint generation observational and outside H&A/grade mutation', () => {
    for (const forbidden of [
      "from('hour_logs')",
      "from('attendance_records')",
      ".from('student_progress').update",
      ".from('quiz_attempts').update",
      ".from('comprehensive_exam_attempts').update",
    ]) {
      expect(actions).not.toContain(forbidden)
    }
  })

  it('requires platform admin for official checkpoint mutation', () => {
    expect(actions).toContain('isPlatformAdminProfile')
    expect(persistence).toContain("if not public.is_platform_admin() then")
    expect(persistence).toContain("raise exception 'Platform admin required'")
  })

  it('keeps baseline and prior comparison math null-safe', () => {
    expect(comparison).toContain('if (current === null || reference === null) return null')
    expect(comparison).toContain("if (type === 'day_30') return 'baseline'")
    expect(comparison).toContain("if (type === 'day_60') return 'day_30'")
    expect(comparison).toContain("return 'day_60'")
  })
})

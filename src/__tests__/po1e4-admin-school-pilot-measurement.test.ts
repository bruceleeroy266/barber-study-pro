import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const shared = read('src/components/pilot-measurement/StaffPilotMeasurementView.tsx')
const school = read('src/app/school/pilot-measurement/page.tsx')
const admin = read('src/app/admin/school/pilot-measurement/page.tsx')
const schoolMenu = read('src/components/school-owner/SchoolAdminMenu.tsx')
const adminNav = read('src/components/AdminNav.tsx')

describe('PO-1E.4 school/admin pilot measurement view', () => {
  it('adds discoverable school and admin pilot measurement routes', () => {
    expect(schoolMenu).toContain("href: '/school/pilot-measurement'")
    expect(adminNav).toContain("href: '/admin/school/pilot-measurement'")
  })

  it('keeps school admins tenant-scoped and validates platform-admin school selection', () => {
    expect(school).toContain('profile.school_id')
    expect(admin).toContain('isPlatformAdminProfile')
    expect(admin).toContain("schoolList.find((school) => school.id === requestedSchoolId)")
    expect(admin).toContain('selected.id')
  })

  it('uses the canonical resolver and certified evidence sources', () => {
    expect(shared).toContain('resolvePilotMeasurement')
    expect(shared).toContain("from('trusted_study_activity_days')")
    expect(shared).toContain("from('comprehensive_exam_attempts')")
    expect(shared).toContain("from('remediation_cycles')")
    expect(shared).toContain("from('pilot_measurement_checkpoints')")
  })

  it('preserves aggregate inclusion semantics and no-evidence coverage', () => {
    expect(shared).toContain('Included in aggregate pilot metrics')
    expect(shared).toContain('Excluded from aggregate pilot metrics')
    expect(shared).toContain('Missing evidence stays missing')
  })

  it('does not expose answer-key or unscored correctness data', () => {
    expect(shared).not.toContain('correct_option_snapshot')
    expect(shared).not.toContain('unscored_correct')
    expect(shared).not.toContain('comprehensive_exam_attempt_items')
  })

  it('is observational and does not mutate H&A, grading, readiness, or checkpoints', () => {
    expect(shared).not.toContain('.insert(')
    expect(shared).not.toContain('.update(')
    expect(shared).not.toContain('.delete(')
    expect(shared).not.toContain("from('hour_logs')")
    expect(shared).not.toContain("from('attendance_records')")
    expect(shared).not.toContain('finalize_pilot_measurement_checkpoint')
  })
})

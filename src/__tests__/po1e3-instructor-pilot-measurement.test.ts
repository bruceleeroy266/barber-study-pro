import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const page = fs.readFileSync(
  path.join(process.cwd(), 'src/app/instructor/pilot-measurement/page.tsx'),
  'utf8'
)
const nav = fs.readFileSync(
  path.join(process.cwd(), 'src/components/InstructorNav.tsx'),
  'utf8'
)

describe('PO-1E.3 instructor pilot measurement view', () => {
  it('is discoverable from instructor navigation', () => {
    expect(nav).toContain("href: '/instructor/pilot-measurement'")
    expect(nav).toContain("label: 'Pilot Measurement'")
  })

  it('uses assignment scope and the canonical pilot resolver', () => {
    expect(page).toContain('loadAssignedStudentIds')
    expect(page).toContain('resolvePilotMeasurement')
    expect(page).toContain('allowedStudentIds')
  })

  it('uses trusted learning activity and safe Exam Ready aggregate fields only', () => {
    expect(page).toContain("from('trusted_study_activity_days')")
    expect(page).toContain("from('comprehensive_exam_attempts')")
    expect(page).toContain('domain_breakdown')
    expect(page).not.toContain('correct_option_snapshot')
    expect(page).not.toContain('unscored_correct')
  })

  it('keeps excluded learners visible while labeling aggregate exclusion', () => {
    expect(page).toContain('Excluded from aggregate pilot metrics')
    expect(page).toContain('Included in pilot metrics')
  })

  it('does not conflate learning telemetry with attendance hours', () => {
    expect(page).toContain('learning telemetry, not attendance or earned school hours')
    expect(page).not.toContain("from('hour_logs')")
    expect(page).not.toContain("from('attendance_records')")
  })

  it('does not mutate pilot checkpoints or learning evidence', () => {
    expect(page).not.toContain('.insert(')
    expect(page).not.toContain('.update(')
    expect(page).not.toContain('.delete(')
    expect(page).not.toContain('finalize_pilot_measurement_checkpoint')
  })
})

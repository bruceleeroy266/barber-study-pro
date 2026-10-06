import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const actions = read('src/app/admin/school/pilot-measurement/actions.ts')
const controls = read('src/components/pilot-measurement/PilotCheckpointControls.tsx')
const view = read('src/components/pilot-measurement/StaffPilotMeasurementView.tsx')

describe('PO-1E.4 checkpoint controls', () => {
  it('requires platform-admin authorization server-side', () => {
    expect(actions).toContain('isPlatformAdminProfile')
    expect(actions).toContain('Platform administrator access required')
  })

  it('recomputes canonical evidence on the server before persistence', () => {
    expect(actions).toContain('resolvePilotMeasurement')
    expect(actions).toContain("from('trusted_study_activity_days')")
    expect(actions).toContain("from('comprehensive_exam_attempts')")
    expect(actions).toContain("from('remediation_cycles')")
  })

  it('uses the certified checkpoint RPCs rather than direct table mutation', () => {
    expect(actions).toContain("'create_pilot_measurement_checkpoint_draft'")
    expect(actions).toContain("'finalize_pilot_measurement_checkpoint'")
    expect(actions).not.toContain(".from('pilot_measurement_checkpoints').insert")
    expect(actions).not.toContain(".from('pilot_measurement_checkpoints').update")
  })

  it('prevents finalization before target cutoff and requires explicit confirmation', () => {
    expect(actions).toContain('eligibleToFinalize')
    expect(controls).toContain('window.confirm')
    expect(controls).toContain('immutable historical evidence')
  })

  it('renders controls only in the platform-admin view', () => {
    expect(view).toContain("viewer === 'platform_admin'")
    expect(view).toContain('PilotCheckpointControls')
  })

  it('does not write H&A, grades, readiness, or exam evidence', () => {
    for (const forbidden of [
      "from('hour_logs')",
      "from('attendance_records')",
      "from('grades')",
      ".from('student_progress').update",
      ".from('quiz_attempts').update",
      ".from('comprehensive_exam_attempts').update",
    ]) {
      expect(actions).not.toContain(forbidden)
    }
  })
})

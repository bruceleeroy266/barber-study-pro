import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const resolver = read('src/lib/pilot-measurement/resolver.ts')
const instructor = read('src/app/instructor/pilot-measurement/page.tsx')
const staff = read('src/components/pilot-measurement/StaffPilotMeasurementView.tsx')
const actions = read('src/app/admin/school/pilot-measurement/actions.ts')

describe('Gate 6 heavy audit regressions', () => {
  it('excludes disabled learners from aggregates while retaining learner visibility', () => {
    expect(resolver).toContain('student.include_in_school_metrics !== false && !student.is_disabled')
    expect(resolver).toContain('includedInAggregate: student.include_in_school_metrics !== false && !student.is_disabled')
  })

  it('uses the stored pilot timezone in every live/finalization window', () => {
    expect(instructor).toContain('checkpointForPilotInstant(period.pilot_start_date, now, period.timezone)')
    expect(instructor).toContain('period.timezone')
    expect(staff).toContain('checkpointForPilotInstant(period.pilot_start_date, now, period.timezone)')
    expect(staff).toContain('endOfPilotLocalDate(period.pilot_end_date, period.timezone)')
    expect(actions).toContain('buildPilotCheckpointWindow(period.pilot_start_date, checkpointType, undefined, period.timezone)')
    expect(actions).toContain('buildPilotCheckpointWindow(period.pilot_start_date, checkpointType, previewCutoff, period.timezone)')
  })

  it('does not fall back to hard-coded UTC end-of-day for completed pilots', () => {
    expect(staff).not.toContain("${period.pilot_end_date}T23:59:59.999Z")
  })
})

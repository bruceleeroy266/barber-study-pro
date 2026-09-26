import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const manager = readFileSync(
  join(root, 'src/components/hours/StaffHoursManager.tsx'),
  'utf-8',
)

describe('D4 reviewed-hour history', () => {
  it('keeps reviewed entries separate from the pending approval queue', () => {
    expect(manager).toContain("const pendingLogs = logs.filter((log) => log.status === 'pending')")
    expect(manager).toContain("const reviewedLogs = logs.filter((log) => log.status === 'approved' || log.status === 'rejected')")
    expect(manager).toContain('{filteredPendingLogs.map((log) => {')
    expect(manager).toContain('{reviewedLogs.slice(0, 25).map((log) => {')
  })

  it('shows reviewer identity and review time for reviewed entries', () => {
    expect(manager).toContain("actorNameMap.get(log.reviewed_by)")
    expect(manager).toContain("log.reviewed_at")
    expect(manager).toContain("Approved by")
    expect(manager).toContain("Rejected by")
  })

  it('shows rejection reasons only on rejected records', () => {
    expect(manager).toContain("log.status === 'rejected' && log.rejection_reason")
    expect(manager).toContain('Rejection reason:')
  })

  it('preserves source and correction provenance in reviewed history', () => {
    expect(manager).toContain('<HourSourceBadge sourceType={log.source_type} />')
    expect(manager).toContain('Corrected resubmission')
  })

  it('limits the initial reviewed history to the 25 most recent rows', () => {
    expect(manager).toContain('reviewedLogs.slice(0, 25)')
    expect(manager).toContain('Showing the 25 most recent reviewed entries.')
  })
})

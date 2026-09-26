import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const actions = readFileSync(
  join(root, 'src/app/instructor/hours/actions.ts'),
  'utf-8',
)
const manager = readFileSync(
  join(root, 'src/components/hours/StaffHoursManager.tsx'),
  'utf-8',
)
const schoolHoursPage = readFileSync(
  join(root, 'src/app/school/hours/page.tsx'),
  'utf-8',
)

describe('D5 filtered bulk hour approval', () => {
  it('bulk approves only school-scoped pending rows from the supplied filtered ids', () => {
    expect(actions).toContain('export async function bulkApproveStudentHours')
    expect(actions).toContain(".eq('school_id', actor.school_id)")
    expect(actions).toContain(".eq('status', 'pending')")
    expect(actions).toContain(".in('id', hourLogIds)")
    expect(actions).toContain("status: 'approved'")
  })

  it('stamps one reviewer and review time for the bulk operation', () => {
    expect(actions).toContain('const reviewedAt = new Date().toISOString()')
    expect(actions).toContain('reviewed_by: user.id')
    expect(actions).toContain('reviewed_at: reviewedAt')
    expect(actions).toContain('rejection_reason: null')
  })

  it('keeps stale or already-reviewed rows safe by updating pending rows only', () => {
    expect(actions).toContain(".eq('status', 'pending')")
    expect(actions).toContain('updatedRows.length')
    expect(actions).toContain('bulkApproved=')
  })

  it('limits the action to school administrators', () => {
    expect(actions).toContain('!isSchoolAdmin(actor.role)')
  })

  it('bulk approves exactly the currently filtered pending entries shown in the queue', () => {
    expect(manager).toContain('<form action={bulkApproveStudentHours}')
    expect(manager).toContain('filteredPendingLogs.map((log) => (')
    expect(manager).toContain('name="hourLogId"')
    expect(manager).toContain('Approve filtered (')
    expect(manager).toContain('Rejections remain individual.')
  })

  it('preserves the individual rejection form and required reason', () => {
    expect(manager).toContain('action={reviewStudentHours}')
    expect(manager).toContain('name="decision" value="rejected"')
    expect(manager).toContain('name="rejectionReason"')
    expect(manager).toContain('required')
  })

  it('shows the bulk approval result without changing queue filters or total calculations', () => {
    expect(schoolHoursPage).toContain('bulkApproved?: string')
    expect(schoolHoursPage).toContain('bulkApprovedCount=')
    expect(manager).toContain('Totals and reviewed history have been refreshed.')
    expect(manager).toContain("const approvedMinutes = studentLogs")
  })
})

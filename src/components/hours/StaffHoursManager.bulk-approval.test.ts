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
const delegatedApproverMigration = readFileSync(
  join(root, 'supabase/migrations/20261006214500_delegated_hour_approver.sql'),
  'utf-8',
)

describe('D5 filtered bulk hour approval', () => {
  it('bulk approves only school-scoped pending rows from the supplied filtered ids', () => {
    expect(actions).toContain('export async function bulkApproveStudentHours')
    expect(actions).toContain("'bulk_approve_hour_logs_as_authorized_approver'")
    expect(actions).toContain('{ p_hour_log_ids: hourLogIds }')
    expect(delegatedApproverMigration).toContain('h.school_id = v_school_id')
    expect(delegatedApproverMigration).toContain("h.status = 'pending'")
    expect(delegatedApproverMigration).toContain('h.id = any(p_hour_log_ids)')
    expect(delegatedApproverMigration).toContain("set status = 'approved'")
  })

  it('stamps one reviewer and review time for the bulk operation', () => {
    expect(delegatedApproverMigration).toContain('reviewed_by = v_actor_id')
    expect(delegatedApproverMigration).toContain('reviewed_at = clock_timestamp()')
    expect(delegatedApproverMigration).toContain('rejection_reason = null')
  })

  it('keeps stale or already-reviewed rows safe by updating pending rows only', () => {
    expect(delegatedApproverMigration).toContain("h.status = 'pending'")
    expect(actions).toContain('updatedRows.length')
    expect(actions).toContain('bulkApproved=')
  })

  it('limits review to school admins or explicitly delegated active instructors', () => {
    expect(actions).toContain('canReviewStudentHours')
    expect(actions).toContain("select('can_approve_hours')")
    expect(actions).toContain('isSchoolAdmin(actor.role)')
    expect(delegatedApproverMigration).toContain('i.can_approve_hours = true')
    expect(delegatedApproverMigration).toContain('i.school_id = v_school_id')
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
    expect(manager).toContain('calculateHoursProgressSummary(studentLogs, requiredHours)')
  })
})

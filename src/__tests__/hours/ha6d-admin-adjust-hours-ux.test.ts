import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

const actions = read('src/app/instructor/hours/actions.ts')
const manager = read('src/components/hours/StaffHoursManager.tsx')
const schoolPage = read('src/app/school/hours/page.tsx')

describe('H&A-6D admin Adjust Hours UX', () => {
  it('exposes a simple admin-only adjustment workflow for approved rows', () => {
    expect(manager).toContain('Adjust Hours')
    expect(manager).toContain('Corrected hours')
    expect(manager).toContain('Reason for adjustment')
    expect(manager).toContain('Save Adjustment')
    expect(manager).toContain("log.status === 'approved'")
    expect(manager).toContain('isSchoolAdmin(actor.role)')
  })

  it('keeps the original/current distinction visible without exposing backend complexity', () => {
    expect(manager).toContain('Current official hours')
    expect(manager).toContain('Adjusted from')
    expect(manager).toContain('The original approved record stays in the audit history.')
    expect(manager).not.toContain('immutable ledger')
    expect(manager).not.toContain('optimistic concurrency')
  })

  it('sends only the narrow user-editable payload plus the hidden concurrency version', () => {
    expect(manager).toContain('name="hourLogId"')
    expect(manager).toContain('name="correctedHours"')
    expect(manager).toContain('name="reason"')
    expect(manager).toContain('name="expectedAdjustmentVersion"')
    expect(manager).not.toContain('name="deltaMinutes"')
    expect(manager).not.toContain('name="studentId" value={log.user_id}')
    expect(manager).not.toContain('name="schoolId"')
  })

  it('validates hours and reason before calling the server-authoritative RPC', () => {
    expect(actions).toContain('export async function adjustApprovedStudentHours')
    expect(actions).toContain('correctedHours < 0')
    expect(actions).toContain('correctedHours > 24')
    expect(actions).toContain('reason.length < 10')
    expect(actions).toContain('reason.length > 500')
    expect(actions).toContain("supabase.rpc('adjust_approved_hour'")
  })

  it('rechecks school-admin authority and same-school approved ownership server-side', () => {
    expect(actions).toContain('!isSchoolAdmin(actor.role)')
    expect(actions).toContain(".from('effective_hour_logs')")
    expect(actions).toContain(".eq('school_id', actor.school_id)")
    expect(actions).toContain("target.status !== 'approved'")
  })

  it('threads the exact adjustment version into the RPC stale-write guard', () => {
    expect(manager).toContain('value={log.adjustment_version}')
    expect(actions).toContain('p_expected_adjustment_version: expectedVersion')
    expect(actions).toContain("'stale-adjustment'")
    expect(manager).toContain('This hour record changed since you opened it.')
  })

  it('explains attendance mismatch simply and requires attendance correction first', () => {
    expect(manager).toContain('Attendance has changed since these hours became official.')
    expect(actions).toContain("'attendance-adjustment-mismatch'")
    expect(manager).toContain('Attendance must be corrected first')
  })

  it('shows safe user-facing failures and a success confirmation', () => {
    expect(manager).toContain('The corrected hours must be different from the current official hours.')
    expect(manager).toContain('Only an approved hour entry from your school can be adjusted.')
    expect(manager).toContain('Hours adjusted. Official totals and reports now use the corrected value')
    expect(schoolPage).toContain("adjusted={params.adjusted === '1'}")
    expect(actions).toContain('?adjusted=1&student=')
  })

  it('revalidates all primary hour/compliance surfaces after a successful adjustment', () => {
    expect(actions).toContain("revalidatePath('/school/hours')")
    expect(actions).toContain("revalidatePath('/instructor/hours')")
    expect(actions).toContain("revalidatePath('/dashboard/hours')")
    expect(actions).toContain("revalidatePath('/dashboard/compliance')")
    expect(actions).toContain("revalidatePath('/instructor/compliance')")
    expect(actions).toContain('revalidatePath(`/instructor/student/${target.user_id}`)')
  })

  it('does not cross into TLS or Chapter learning implementation', () => {
    const combined = [actions, manager, schoolPage].join('\n')
    expect(combined).not.toContain("from '@/lib/tls")
    expect(combined).not.toContain('remediation_cycles')
    expect(combined).not.toContain('quiz_attempts')
  })
})

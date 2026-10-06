import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const instructorPage = readFileSync(join(root, 'src/app/instructor/hours/page.tsx'), 'utf-8')
const actions = readFileSync(join(root, 'src/app/instructor/hours/actions.ts'), 'utf-8')
const manager = readFileSync(join(root, 'src/components/hours/StaffHoursManager.tsx'), 'utf-8')
const migration = readFileSync(join(root, 'supabase/migrations/20261006214500_delegated_hour_approver.sql'), 'utf-8')

describe('delegated hour approver heavy-audit contract', () => {
  it('keeps instructor review feedback and queue filters on the instructor route', () => {
    expect(instructorPage).toContain('reviewed?: string')
    expect(instructorPage).toContain('alreadyReviewed?: string')
    expect(instructorPage).toContain('bulkApproved?: string')
    expect(instructorPage).toContain('queueStudent?: string')
    expect(instructorPage).toContain('reviewedStatus={params.reviewed ?? null}')
    expect(instructorPage).toContain('alreadyReviewedStatus={params.alreadyReviewed ?? null}')
    expect(instructorPage).toContain('bulkApprovedCount=')
    expect(instructorPage).toContain("queueStudentFilter={params.queueStudent ?? ''}")
    expect(instructorPage).toContain("queueDateFilter={params.queueDate ?? ''}")
    expect(instructorPage).toContain("queueSourceFilter={params.queueSource ?? ''}")
    expect(instructorPage).toContain("queueCategoryFilter={params.queueCategory ?? ''}")
  })

  it('returns delegated approver errors to the originating route', () => {
    expect(actions).toContain('const returnTo = ALLOWED_RETURN_PATHS.has(returnToRaw)')
    expect(actions).toContain('redirect(`${returnTo}?error=invalid-review`)')
    expect(actions).toContain('`${returnTo}?error=review-failed`')
    expect(actions).toContain('`${returnTo}?error=bulk-review-failed`')
  })

  it('keeps approval narrow and post-approval adjustments admin-only', () => {
    expect(migration).toContain('i.can_approve_hours = true')
    expect(migration).toContain('i.school_id = v_school_id')
    expect(migration).toContain("h.status = 'pending'")
    expect(actions).toContain('if (!actor?.school_id || !isSchoolAdmin(actor.role))')
    expect(manager).toContain("{isSchoolAdministrator && log.status === 'approved' && (")
  })

  it('labels delegated review provenance generically', () => {
    expect(manager).toContain("'Authorized reviewer'")
    expect(manager).not.toContain("'School administrator'")
  })
})

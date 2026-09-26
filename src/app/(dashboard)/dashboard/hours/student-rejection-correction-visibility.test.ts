import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const page = readFileSync(
  join(root, 'src/app/(dashboard)/dashboard/hours/page.tsx'),
  'utf-8',
)

describe('E5 student rejection and correction visibility', () => {
  it('fetches rejection and correction context for the student own hour rows', () => {
    expect(page).toContain('rejection_reason')
    expect(page).toContain('reviewed_at')
    expect(page).toContain('resubmission_of_hour_log_id')
    expect(page).toContain(".eq('user_id', user.id)")
  })

  it('shows rejection reasons without counting rejected hours as official', () => {
    expect(page).toContain('Rejection reason')
    expect(page).toContain('Rejected hours do not count toward your official total.')
    expect(page).toContain("entry.status === 'rejected' && entry.rejection_reason")
    expect(page).toContain("row.status === 'approved'")
    expect(page).toContain("row.status === 'pending'")
  })

  it('explains corrected resubmission states', () => {
    expect(page).toContain('Corrected resubmission')
    expect(page).toContain('waiting for administrator review')
    expect(page).toContain('approved and now counts toward your official total')
    expect(page).toContain('linked to a prior rejected entry')
  })

  it('keeps correction responsibility with instructor or school staff', () => {
    expect(page).toContain('Your instructor or school must correct and resubmit the record.')
    expect(page).not.toContain('Resubmit hours')
    expect(page).not.toContain('Edit hours')
  })

  it('remains a read-only student surface', () => {
    expect(page).not.toContain('<form')
    expect(page).not.toContain('action=')
    expect(page).not.toContain('.insert(')
    expect(page).not.toContain('.update(')
    expect(page).not.toContain('.delete(')
  })

  it('does not expose internal linkage identifiers in rendered text', () => {
    expect(page).not.toContain('{entry.resubmission_of_hour_log_id}')
    expect(page).not.toContain('source_attendance_id')
  })
})

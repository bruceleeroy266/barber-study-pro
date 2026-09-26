import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { calculateApprovedPeriodTotals } from '@/lib/hours/reporting'
import type { HoursReportLog } from '@/lib/hours/reporting'

const root = process.cwd()
const page = readFileSync(
  join(root, 'src/app/(dashboard)/dashboard/hours/page.tsx'),
  'utf-8',
)

describe('E6 student weekly monthly yearly and overall hour totals', () => {
  it('shows approved totals for week, month, year, and overall with pending separate', () => {
    expect(page).toContain('Approved Hour Totals')
    expect(page).toContain('This Week')
    expect(page).toContain('This Month')
    expect(page).toContain('This Year')
    expect(page).toContain('Overall')
    expect(page).toContain('Pending')
    expect(page).toContain('Not included above')
  })

  it('uses the shared approved-only period reporting helper in the school timezone', () => {
    expect(page).toContain('calculateApprovedPeriodTotals')
    expect(page).toContain('schoolTimeZone')
    expect(page).toContain('approvedPeriods.weekMinutes')
    expect(page).toContain('approvedPeriods.monthMinutes')
    expect(page).toContain('approvedPeriods.yearMinutes')
  })

  it('keeps overall official totals approved-only and pending separate', () => {
    expect(page).toContain("row.status === 'approved'")
    expect(page).toContain("row.status === 'pending'")
    expect(page).toContain('{formatMinutes(approvedMinutes)}')
    expect(page).toContain('{formatMinutes(pendingMinutes)}')
    expect(page).toContain('Pending hours remain separate until administrator approval.')
  })

  it('shared reporting helper excludes pending and rejected rows from every approved period', () => {
    const logs: HoursReportLog[] = [
      { id: 'a', user_id: 's', date: '2026-09-21', category: 'Theory', minutes: 120, status: 'approved', notes: null, submitted_by: null, reviewed_by: null, reviewed_at: null, created_at: null },
      { id: 'b', user_id: 's', date: '2026-09-22', category: 'Theory', minutes: 60, status: 'pending', notes: null, submitted_by: null, reviewed_by: null, reviewed_at: null, created_at: null },
      { id: 'c', user_id: 's', date: '2026-09-23', category: 'Theory', minutes: 90, status: 'rejected', notes: null, submitted_by: null, reviewed_by: null, reviewed_at: null, created_at: null },
      { id: 'd', user_id: 's', date: '2026-09-01', category: 'Clinic', minutes: 180, status: 'approved', notes: null, submitted_by: null, reviewed_by: null, reviewed_at: null, created_at: null },
      { id: 'e', user_id: 's', date: '2026-01-15', category: 'Practical', minutes: 240, status: 'approved', notes: null, submitted_by: null, reviewed_by: null, reviewed_at: null, created_at: null },
    ]

    const totals = calculateApprovedPeriodTotals(
      logs,
      new Date('2026-09-26T12:00:00Z'),
      'America/Chicago',
    )

    expect(totals.weekMinutes).toBe(120)
    expect(totals.monthMinutes).toBe(300)
    expect(totals.yearMinutes).toBe(540)
  })

  it('remains read-only for students', () => {
    expect(page).not.toContain('<form')
    expect(page).not.toContain('.insert(')
    expect(page).not.toContain('.update(')
    expect(page).not.toContain('.delete(')
  })
})

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const page = readFileSync(
  join(root, 'src/app/(dashboard)/dashboard/hours/page.tsx'),
  'utf-8',
)

describe('E4 student hour history', () => {
  it('renders a read-only student hour history section', () => {
    expect(page).toContain('Hour History')
    expect(page).toContain('Your most recent hour entries.')
    expect(page).toContain('No hour entries yet.')
    expect(page).not.toContain('<form')
    expect(page).not.toContain('.insert(')
    expect(page).not.toContain('.update(')
    expect(page).not.toContain('.delete(')
  })

  it('shows the required hour-entry evidence fields', () => {
    expect(page).toContain('entry.date')
    expect(page).toContain('entry.category')
    expect(page).toContain('entry.minutes')
    expect(page).toContain('entry.status')
    expect(page).toContain('entry.source_type')
    expect(page).toContain('entry.resubmission_of_hour_log_id')
  })

  it('shows approval status, source, and corrected resubmission without exposing internal ids', () => {
    expect(page).toContain('Approved')
    expect(page).toContain('Pending')
    expect(page).toContain('Rejected')
    expect(page).toContain('Attendance-generated')
    expect(page).toContain('Manual entry')
    expect(page).toContain('Corrected resubmission')
    expect(page).not.toContain('source_attendance_id')
  })

  it('keeps approved-only official totals separate from history status', () => {
    expect(page).toContain("row.status === 'approved'")
    expect(page).toContain("row.status === 'pending'")
    expect(page).toContain('Approved entries count toward your official total; pending and rejected entries do not.')
  })

  it('uses a mobile card layout and desktop table', () => {
    expect(page).toContain('md:hidden')
    expect(page).toContain('hidden overflow-x-auto md:block')
    expect(page).toContain('<table')
  })

  it('orders the hour query newest first and caps display at 30 entries', () => {
    expect(page).toContain(".order('date', { ascending: false })")
    expect(page).toContain(".order('created_at', { ascending: false })")
    expect(page).toContain('hours.slice(0, 30)')
    expect(page).toContain('Showing the 30 most recent hour entries.')
  })

  it('continues to query only the authenticated student own hour records', () => {
    expect(page).toContain(".from('hour_logs')")
    expect(page).toContain(".eq('user_id', user.id)")
  })
})

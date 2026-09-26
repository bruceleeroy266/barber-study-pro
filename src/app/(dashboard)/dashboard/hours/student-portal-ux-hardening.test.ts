import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const page = readFileSync(
  join(root, 'src/app/(dashboard)/dashboard/hours/page.tsx'),
  'utf-8',
)

describe('E9 student portal UX hardening', () => {
  it('adds a concise status guide so hour states are understandable', () => {
    expect(page).toContain('Hour status guide')
    expect(page).toContain('Approved')
    expect(page).toContain('Pending')
    expect(page).toContain('Rejected')
    expect(page).toContain('counts toward official hours')
    expect(page).toContain('waiting for administrator review')
    expect(page).toContain('does not count toward official hours')
  })

  it('reduces clutter with collapsible long sections', () => {
    expect(page).toContain('<details')
    expect(page).toContain('My Schedule')
    expect(page).toContain('Attendance History')
    expect(page).toContain('Hour History')
    expect(page).toContain('Show / hide')
  })

  it('keeps summary content visible and mobile responsive', () => {
    expect(page).toContain('max-w-7xl')
    expect(page).toContain('grid grid-cols-1')
    expect(page).toContain('sm:grid-cols-2')
    expect(page).toContain('xl:grid-cols-5')
  })

  it('adds accessible progress semantics and section labels', () => {
    expect(page).toContain('role="progressbar"')
    expect(page).toContain('aria-label="Official hour progress"')
    expect(page).toContain('aria-valuemin={0}')
    expect(page).toContain('aria-valuemax={100}')
    expect(page).toContain('aria-valuenow={completionPercentage}')
    expect(page).toContain('aria-labelledby="attendance-summary-heading"')
    expect(page).toContain('id="attendance-summary-heading"')
  })

  it('keeps meaningful empty states', () => {
    expect(page).toContain('No current weekly schedule is assigned.')
    expect(page).toContain('No one-day overrides recorded.')
    expect(page).toContain('No attendance records yet.')
    expect(page).toContain('No hour entries yet.')
  })

  it('preserves read-only student behavior', () => {
    expect(page).not.toContain('<form')
    expect(page).not.toContain('action=')
    expect(page).not.toContain('.insert(')
    expect(page).not.toContain('.update(')
    expect(page).not.toContain('.delete(')
  })
})

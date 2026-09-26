import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const page = readFileSync(
  join(root, 'src/app/(dashboard)/dashboard/hours/page.tsx'),
  'utf-8',
)

describe('E3 student attendance history', () => {
  it('renders a read-only attendance history section', () => {
    expect(page).toContain('Attendance History')
    expect(page).toContain('Your most recent attendance records')
    expect(page).toContain('No attendance records yet.')
    expect(page).not.toContain('<form')
    expect(page).not.toContain('.insert(')
    expect(page).not.toContain('.update(')
    expect(page).not.toContain('.delete(')
  })

  it('shows the required attendance evidence fields', () => {
    expect(page).toContain('Arrival')
    expect(page).toContain('Departure')
    expect(page).toContain('Attended')
    expect(page).toContain('record.date')
    expect(page).toContain('record.status')
    expect(page).toContain('record.clockedInAt')
    expect(page).toContain('record.clockedOutAt')
    expect(page).toContain('record.minutesPresent')
  })

  it('uses mobile cards and a desktop table', () => {
    expect(page).toContain('md:hidden')
    expect(page).toContain('hidden overflow-x-auto md:block')
    expect(page).toContain('<table')
  })

  it('formats actual arrival and departure in the school timezone', () => {
    expect(page).toContain('formatAttendanceTime')
    expect(page).toContain('timeZone')
    expect(page).toContain('schoolTimeZone')
  })

  it('shows minutes/hours attended without inventing missing data', () => {
    expect(page).toContain("if (minutes === null) return '—'")
    expect(page).toContain("if (minutes === 0) return '0m'")
    expect(page).toContain('formatAttendanceDuration(record.minutesPresent)')
  })

  it('keeps the history bounded to the 30 most recent rows', () => {
    expect(page).toContain('attendanceRecords.slice(0, 30)')
    expect(page).toContain('Showing the 30 most recent attendance records.')
  })

  it('continues to query only the authenticated student attendance records', () => {
    expect(page).toContain(".from('attendance_records')")
    expect(page).toContain(".eq('user_id', user.id)")
  })
})

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const page = readFileSync(
  join(root, 'src/app/(dashboard)/dashboard/hours/page.tsx'),
  'utf-8',
)
const nav = readFileSync(
  join(root, 'src/components/DashboardNav.tsx'),
  'utf-8',
)

describe('E2 student attendance and hours summary', () => {
  it('adds a dedicated read-only student Attendance & Hours page', () => {
    expect(page).toContain('Attendance & Hours')
    expect(page).toContain('Approved Hours')
    expect(page).toContain('Pending Hours')
    expect(page).toContain('Remaining Hours')
    expect(page).toContain('Required Hours')
    expect(page).toContain("Today&apos;s Attendance")
  })

  it('keeps official progress approved-only and pending separate', () => {
    expect(page).toContain("row.status === 'approved'")
    expect(page).toContain("row.status === 'pending'")
    expect(page).toContain('Based on approved hours only')
    expect(page).toContain('Pending hours do not increase this progress')
  })

  it('resolves per-student program requirements instead of hard-coding hours', () => {
    expect(page).toContain('resolveStudentProgramRequirements')
    expect(page).toContain('requirements.requiredHours')
    expect(page).toContain('requirements.programName')
  })

  it('uses the school timezone for today attendance status', () => {
    expect(page).toContain("select('timezone')")
    expect(page).toContain('timeZone: schoolTimeZone')
    expect(page).toContain('getTodayAttendanceStatus')
    expect(page).toContain('localToday')
  })

  it('queries only the authenticated student own hour and attendance records', () => {
    expect(page).toContain(".eq('user_id', user.id)")
    expect(page).toContain(".from('hour_logs')")
    expect(page).toContain(".from('attendance_records')")
  })

  it('adds Attendance & Hours to the student dashboard navigation', () => {
    expect(nav).toContain("href: '/dashboard/hours'")
    expect(nav).toContain("label: 'Attendance & Hours'")
    expect(nav).toContain('Clock3')
  })

  it('does not add write controls to the student page', () => {
    expect(page).not.toContain('<form')
    expect(page).not.toContain('action=')
    expect(page).not.toContain('.insert(')
    expect(page).not.toContain('.update(')
    expect(page).not.toContain('.delete(')
  })
})

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const page = readFileSync(
  join(root, 'src/app/(dashboard)/dashboard/hours/page.tsx'),
  'utf-8',
)

describe('E8 student schedule visibility', () => {
  it('shows a read-only current weekly schedule with effective dates', () => {
    expect(page).toContain('My Schedule')
    expect(page).toContain('Effective')
    expect(page).toContain('currentScheduleProfile.effective_from')
    expect(page).toContain("currentScheduleProfile.effective_to ?? 'ongoing'")
    expect(page).toContain('Template-based schedule')
    expect(page).toContain('Custom schedule')
  })

  it('shows all seven recurring days and unscheduled days clearly', () => {
    expect(page).toContain("const scheduleDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']")
    expect(page).toContain('Not scheduled')
    expect(page).toContain('break_minutes')
    expect(page).toContain('start_time')
    expect(page).toContain('end_time')
  })

  it('shows one-day overrides including off, changed, and makeup sessions', () => {
    expect(page).toContain('One-Day Overrides')
    expect(page).toContain("if (type === 'off') return 'Day Off'")
    expect(page).toContain("if (type === 'makeup') return 'Makeup / Extra Session'")
    expect(page).toContain("return 'Changed Schedule'")
    expect(page).toContain('No one-day overrides recorded.')
  })

  it('selects the current effective profile and keeps ownership scoped to the student', () => {
    expect(page).toContain("profile.effective_from <= localToday")
    expect(page).toContain("!profile.effective_to || profile.effective_to >= localToday")
    expect(page).toContain(".eq('student_id', user.id)")
    expect(page).toContain(".eq('schedule_profile_id', currentScheduleProfile.id)")
  })

  it('remains read-only for students', () => {
    expect(page).not.toContain('<form')
    expect(page).not.toContain('action=')
    expect(page).not.toContain('.insert(')
    expect(page).not.toContain('.update(')
    expect(page).not.toContain('.delete(')
  })

  it('keeps schedule informational rather than changing official hours', () => {
    expect(page).toContain('Schedule changes do not change official hours by themselves.')
    expect(page).toContain('without changing your recurring weekly schedule')
  })
})

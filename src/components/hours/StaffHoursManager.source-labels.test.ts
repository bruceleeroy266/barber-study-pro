import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = readFileSync(
  join(process.cwd(), 'src/components/hours/StaffHoursManager.tsx'),
  'utf-8',
)

describe('C6 hour source labels', () => {
  it('defines clear labels for attendance-generated and manual entries', () => {
    expect(source).toContain("Attendance-generated")
    expect(source).toContain("Manual entry")
    expect(source).toContain("aria-label={attendanceGenerated ? 'Attendance-generated hour entry' : 'Manual hour entry'}")
  })

  it('shows source badges in both admin approval and recent student hour entries', () => {
    expect(source).toContain('<h2 className="text-xl font-semibold text-white">Hours Approval Queue</h2>')
    expect(source).toContain('<HourSourceBadge sourceType={log.source_type} />')
    expect(source).toContain('<div className="text-sm font-medium text-white">Recent hour entries</div>')
  })

  it('keeps manual and attendance labels visually distinct without changing approval behavior', () => {
    expect(source).toContain('border-[var(--color-brand-gold)]/40')
    expect(source).toContain('border-silver/30')
    expect(source).toContain('action={reviewStudentHours}')
  })
})

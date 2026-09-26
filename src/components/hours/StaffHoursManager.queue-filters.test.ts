import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const schoolHoursPage = readFileSync(
  join(root, 'src/app/school/hours/page.tsx'),
  'utf-8',
)
const manager = readFileSync(
  join(root, 'src/components/hours/StaffHoursManager.tsx'),
  'utf-8',
)

describe('D3 admin hour approval queue filters', () => {
  it('accepts Student, Date, Source, and Category filters from the URL', () => {
    expect(schoolHoursPage).toContain('queueStudent?: string')
    expect(schoolHoursPage).toContain('queueDate?: string')
    expect(schoolHoursPage).toContain('queueSource?: string')
    expect(schoolHoursPage).toContain('queueCategory?: string')
    expect(schoolHoursPage).toContain('queueStudentFilter={params.queueStudent ??')
    expect(schoolHoursPage).toContain('queueDateFilter={params.queueDate ??')
    expect(schoolHoursPage).toContain('queueSourceFilter={params.queueSource ??')
    expect(schoolHoursPage).toContain('queueCategoryFilter={params.queueCategory ??')
  })

  it('filters pending entries without changing approval behavior', () => {
    expect(manager).toContain("const pendingLogs = logs.filter((log) => log.status === 'pending')")
    expect(manager).toContain('const filteredPendingLogs = pendingLogs.filter')
    expect(manager).toContain("log.user_id !== queueStudentFilter")
    expect(manager).toContain("log.date !== queueDateFilter")
    expect(manager).toContain("log.source_type !== queueSourceFilter")
    expect(manager).toContain("log.category !== queueCategoryFilter")
    expect(manager).toContain('action={reviewStudentHours}')
  })

  it('renders all four compact queue controls and a clear action', () => {
    expect(manager).toContain('name="queueStudent"')
    expect(manager).toContain('name="queueDate"')
    expect(manager).toContain('name="queueSource"')
    expect(manager).toContain('name="queueCategory"')
    expect(manager).toContain('All students')
    expect(manager).toContain('All sources')
    expect(manager).toContain('All categories')
    expect(manager).toContain('href="/school/hours"')
  })

  it('shows filtered counts and a specific empty-filter state', () => {
    expect(manager).toContain("of ${pendingLogs.length}")
    expect(manager).toContain('No pending hour submissions match the selected filters.')
  })
})

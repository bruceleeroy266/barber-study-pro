import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DEFAULT_REQUIRED_HOURS, defaultProgramRequirements } from '@/lib/programs/requirements'
import { calculateApprovedPeriodTotals } from '@/lib/hours/reporting'
import type { HoursReportLog } from '@/lib/hours/reporting'

const root = process.cwd()
const studentPage = readFileSync(join(root, 'src/app/(dashboard)/dashboard/hours/page.tsx'), 'utf-8')
const staffManager = readFileSync(join(root, 'src/components/hours/StaffHoursManager.tsx'), 'utf-8')
const reviewActions = readFileSync(join(root, 'src/app/instructor/hours/actions.ts'), 'utf-8')
const generationActions = readFileSync(join(root, 'src/app/instructor/attendance/hour-generation-actions.ts'), 'utf-8')
const pdfExport = readFileSync(join(root, 'src/lib/hours/export-pdf.ts'), 'utf-8')
const complianceRules = readFileSync(join(root, 'src/lib/compliance/compliance-rules.ts'), 'utf-8')
const requiredHoursMigration = readFileSync(join(root, 'supabase/migrations/20260926223803_set_program_required_hours_default_1200.sql'), 'utf-8')

describe('E11 final hours and attendance certification', () => {
  it('uses a 1200-hour fallback consistently when no configured program resolves', () => {
    expect(DEFAULT_REQUIRED_HOURS).toBe(1200)
    expect(defaultProgramRequirements().requiredHours).toBe(1200)
    expect(staffManager).toContain('requirements?.requiredHours ?? 1200')
  })

  it('uses one 1200-hour fallback source across application, compliance, and database migration', () => {
    expect(DEFAULT_REQUIRED_HOURS).toBe(1200)
    expect(complianceRules).toContain("import { DEFAULT_REQUIRED_HOURS } from '@/lib/programs/requirements'")
    expect(complianceRules).toContain('requiredHours: DEFAULT_REQUIRED_HOURS')
    expect(requiredHoursMigration).toContain('alter column required_hours set default 1200')
  })

  it('routes official totals through the canonical effective-hours contract', () => {
    expect(studentPage).toContain(".from('effective_hour_logs')")
    expect(studentPage).toContain('calculateHoursProgressSummary(reportingHours, requirements.requiredHours)')
    expect(staffManager).toContain(".from('effective_hour_logs')")
    expect(staffManager).toContain('calculateHoursProgressSummary(studentLogs, requiredHours)')
    expect(pdfExport).toContain('calculateHoursProgressSummary(studentLogs, student.requiredHours)')
    expect(pdfExport).toContain('getOfficialMinutes(log)')
  })

  it('keeps pending hours separate from official totals', () => {
    expect(studentPage).toContain('pendingMinutes')
    expect(staffManager).toContain(".filter((log) => log.status === 'pending')")
    expect(studentPage).toContain('Pending hours do not increase this progress')
  })

  it('requires school-admin, school-scoped, pending-only review with provenance', () => {
    expect(reviewActions).toContain('isSchoolAdmin(actor.role)')
    expect(reviewActions).toContain(".eq('school_id', actor.school_id)")
    expect(reviewActions).toContain(".eq('status', 'pending')")
    expect(reviewActions).toContain('reviewed_by: user.id')
    expect(reviewActions).toContain('reviewed_at: new Date().toISOString()')
  })

  it('prevents attendance regeneration from overwriting an approved decision', () => {
    expect(generationActions).toContain("if (existing.status !== 'pending')")
    expect(generationActions).toContain(".eq('status', 'pending')")
    expect(generationActions).toContain(".is('reviewed_by', null)")
    expect(generationActions).toContain(".is('reviewed_at', null)")
  })

  it('exports only approved detail rows while reporting pending separately in summaries', () => {
    expect(pdfExport).toContain("const approved = logs.filter((log) => log.status === 'approved')")
    expect(pdfExport).toContain("studentLogs\n      .filter((log) => log.status === 'pending')")
  })

  it('calculates period totals from approved rows only', () => {
    const logs: HoursReportLog[] = [
      {
        id: 'approved',
        user_id: 'student-1',
        date: '2026-09-25',
        category: 'Clinic',
        minutes: 360,
        status: 'approved',
        notes: null,
        submitted_by: 'instructor',
        reviewed_by: 'admin',
        reviewed_at: '2026-09-25T18:00:00.000Z',
        created_at: '2026-09-25T12:00:00.000Z',
      },
      {
        id: 'pending',
        user_id: 'student-1',
        date: '2026-09-25',
        category: 'Clinic',
        minutes: 420,
        status: 'pending',
        notes: null,
        submitted_by: 'instructor',
        reviewed_by: null,
        reviewed_at: null,
        created_at: '2026-09-25T12:00:00.000Z',
      },
      {
        id: 'rejected',
        user_id: 'student-1',
        date: '2026-09-25',
        category: 'Clinic',
        minutes: 480,
        status: 'rejected',
        notes: null,
        submitted_by: 'instructor',
        reviewed_by: 'admin',
        reviewed_at: '2026-09-25T18:00:00.000Z',
        created_at: '2026-09-25T12:00:00.000Z',
      },
    ]

    const totals = calculateApprovedPeriodTotals(
      logs,
      new Date('2026-09-26T16:00:00.000Z'),
      'America/Chicago',
    )

    expect(totals.weekMinutes).toBe(360)
    expect(totals.monthMinutes).toBe(360)
    expect(totals.yearMinutes).toBe(360)
  })
})

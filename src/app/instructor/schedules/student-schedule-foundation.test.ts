import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const migration = readFileSync(
  join(root, 'supabase/migrations/20260926060000_student_schedule_foundation.sql'),
  'utf-8',
)
const actions = readFileSync(
  join(root, 'src/app/instructor/schedules/actions.ts'),
  'utf-8',
)
const page = readFileSync(
  join(root, 'src/app/instructor/schedules/page.tsx'),
  'utf-8',
)

describe('Segment A student schedule foundation', () => {
  it('creates reusable templates, student schedule profiles, weekly days, and one-day overrides', () => {
    expect(migration).toContain('create table if not exists public.school_schedule_templates')
    expect(migration).toContain('create table if not exists public.school_schedule_template_days')
    expect(migration).toContain('create table if not exists public.student_schedule_profiles')
    expect(migration).toContain('create table if not exists public.student_schedule_days')
    expect(migration).toContain('create table if not exists public.student_schedule_overrides')
    expect(migration).toContain("override_type in ('scheduled', 'off', 'makeup')")
  })

  it('keeps schedule management tenant-scoped and student schedules self-readable', () => {
    expect(migration).toContain("p.school_id = student_schedule_profiles.school_id")
    expect(migration).toContain('student_id = auth.uid()')
    expect(migration).toContain("p.role in ('instructor', 'school_admin', 'admin')")
  })

  it('supports template assignment, custom effective-dated schedules, and daily overrides', () => {
    expect(actions).toContain('export async function createScheduleTemplate')
    expect(actions).toContain('export async function assignTemplateSchedule')
    expect(actions).toContain('export async function saveCustomStudentSchedule')
    expect(actions).toContain('export async function saveScheduleOverride')
    expect(actions).toContain("source_template_id: null")
    expect(actions).toContain("{ onConflict: 'school_id,student_id,override_date' }")
  })

  it('does not couple Segment A to attendance or hour creation', () => {
    expect(actions).not.toContain(".from('attendance_records')")
    expect(actions).not.toContain(".from('hour_logs')")
    expect(page).toContain('does not create attendance records or student hours')
  })

  it('exposes the expected schedule management controls', () => {
    expect(page).toContain('Assign a Reusable Template')
    expect(page).toContain('Create Custom / Temporary Schedule')
    expect(page).toContain('One-Day Override')
    expect(page).toContain('Manage Reusable Schedule Templates')
    expect(page).toContain('Makeup / Extra Session')
  })
})

import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const MIGRATION_PATH = path.join(
  process.cwd(),
  'supabase/migrations/20261001230500_com1c1_authorization_hardening.sql'
)

describe('COM-1C.1A authorization hardening', () => {
  let sql = ''

  beforeAll(() => {
    sql = fs.readFileSync(MIGRATION_PATH, 'utf-8')
  })

  it('binds student and instructor profile schools to the assignment row school', () => {
    expect(sql).toContain(
      'student_profile.school_id = student_instructor_assignments.school_id'
    )
    expect(sql).toContain(
      'instructor_profile.school_id = student_instructor_assignments.school_id'
    )
    expect(sql).not.toContain('student_profile.school_id = school_id')
    expect(sql).not.toContain('instructor_profile.school_id = school_id')
  })

  it('keeps ordinary anonymous access closed', () => {
    expect(sql).toContain(
      'revoke all on table public.student_instructor_assignments from anon, authenticated'
    )
    expect(sql).toContain(
      'revoke all on table public.communication_threads from anon, authenticated'
    )
    expect(sql).not.toMatch(/grant[\s\S]+\bto anon\b/i)
  })

  it('grants authenticated only the operations needed by COM-1C.1', () => {
    expect(sql).toContain(
      'grant select on table public.student_instructor_assignments to authenticated'
    )
    expect(sql).toContain(
      'grant select on table public.communication_threads to authenticated'
    )
    expect(sql).toContain(
      'grant insert (school_id, student_id, instructor_id, assigned_by)'
    )
    expect(sql).toContain(
      'grant insert (school_id, student_id, instructor_id, subject, status, created_by)'
    )
  })

  it('restricts assignment updates to lifecycle columns', () => {
    expect(sql).toContain(
      'grant update (is_active, ended_at, updated_at)'
    )
    expect(sql).not.toMatch(
      /grant\s+update\s+on table public\.student_instructor_assignments/i
    )
  })

  it('restricts thread updates to status metadata', () => {
    expect(sql).toContain(
      'grant update (status, updated_at)'
    )
    expect(sql).not.toMatch(
      /grant\s+update\s+on table public\.communication_threads/i
    )
  })

  it('does not grant delete or truncate to authenticated', () => {
    expect(sql.toLowerCase()).not.toMatch(/grant\s+delete/)
    expect(sql.toLowerCase()).not.toMatch(/grant\s+truncate/)
  })

  it('does not open message, read-receipt, bulletin, or audit tables', () => {
    expect(sql).not.toContain('on public.communication_messages')
    expect(sql).not.toContain('on public.communication_message_reads')
    expect(sql).not.toContain('on public.bulletins')
    expect(sql).not.toContain('on public.bulletin_audiences')
    expect(sql).not.toContain('on public.bulletin_acknowledgments')
    expect(sql).not.toContain('on public.communication_audit_events')
  })
})

import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const MIGRATION_PATH = path.join(
  process.cwd(),
  'supabase/migrations/20261001225500_com1c1_assignment_thread_authorization.sql'
)

describe('COM-1C.1 communication assignment + thread authorization', () => {
  let sql = ''

  beforeAll(() => {
    sql = fs.readFileSync(MIGRATION_PATH, 'utf-8')
  })

  it('limits assignment management to school admins/admins in their school', () => {
    expect(sql).toContain('public.is_school_admin(school_id)')
    expect(sql).toContain('school_id = public.current_user_school_id()')
    expect(sql).toContain("student_profile.role in ('student', 'apprentice')")
    expect(sql).toContain("instructor_profile.role = 'instructor'")
  })

  it('allows assignment participants to read their own assignment rows', () => {
    expect(sql).toContain('student_id = auth.uid()')
    expect(sql).toContain('instructor_id = auth.uid()')
  })

  it('requires an active assignment before thread creation', () => {
    expect(sql).toContain('public.student_instructor_assignments assignment')
    expect(sql).toContain('assignment.is_active = true')
    expect(sql).toContain('assignment.ended_at is null')
  })

  it('limits private thread reads to the student or instructor participant', () => {
    expect(sql).toContain('(student_id = auth.uid() or instructor_id = auth.uid())')
  })

  it('does not create delete policies for assignments or threads', () => {
    expect(sql.toLowerCase()).not.toMatch(/for\s+delete/)
  })

  it('does not open message, bulletin, acknowledgment, or audit policies yet', () => {
    expect(sql).not.toContain('on public.communication_messages')
    expect(sql).not.toContain('on public.communication_message_reads')
    expect(sql).not.toContain('on public.bulletins')
    expect(sql).not.toContain('on public.bulletin_audiences')
    expect(sql).not.toContain('on public.bulletin_acknowledgments')
    expect(sql).not.toContain('on public.communication_audit_events')
  })
})

import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const MIGRATION_PATH = path.join(
  process.cwd(),
  'supabase/migrations/20261001231500_com1c2_message_read_authorization.sql'
)

describe('COM-1C.2 message and read-receipt authorization', () => {
  let sql = ''

  beforeAll(() => {
    sql = fs.readFileSync(MIGRATION_PATH, 'utf-8')
  })

  it('limits message reads to same-school thread participants', () => {
    expect(sql).toContain('communication messages participants select')
    expect(sql).toContain(
      'thread.school_id = communication_messages.school_id'
    )
    expect(sql).toContain(
      'school_id = (select public.current_user_school_id())'
    )
    expect(sql).toContain(
      'thread.student_id = (select auth.uid())'
    )
    expect(sql).toContain(
      'thread.instructor_id = (select auth.uid())'
    )
  })

  it('requires sender identity, active thread, and active assignment for message inserts', () => {
    expect(sql).toContain('communication messages participants insert')
    expect(sql).toContain('sender_id = (select auth.uid())')
    expect(sql).toContain("thread.status = 'active'")
    expect(sql).toContain('assignment.is_active = true')
    expect(sql).toContain('assignment.ended_at is null')
    expect(sql).toContain(
      'assignment.student_id = thread.student_id'
    )
    expect(sql).toContain(
      'assignment.instructor_id = thread.instructor_id'
    )
  })

  it('allows read receipt visibility only through authorized thread membership', () => {
    expect(sql).toContain('communication message reads participants select')
    expect(sql).toContain(
      'thread.school_id = (select public.current_user_school_id())'
    )
    expect(sql).toContain(
      'where message.id = communication_message_reads.message_id'
    )
  })

  it('allows only the non-sender participant to insert their own read receipt', () => {
    expect(sql).toContain('communication message reads recipient insert')
    expect(sql).toContain('reader_id = (select auth.uid())')
    expect(sql).toContain(
      'thread.student_id = (select auth.uid())'
    )
    expect(sql).toContain('message.sender_id = thread.instructor_id')
    expect(sql).toContain(
      'thread.instructor_id = (select auth.uid())'
    )
    expect(sql).toContain('message.sender_id = thread.student_id')
  })

  it('keeps anon closed and grants authenticated only select + constrained inserts', () => {
    expect(sql).toContain(
      'revoke all on table public.communication_messages from anon, authenticated'
    )
    expect(sql).toContain(
      'revoke all on table public.communication_message_reads from anon, authenticated'
    )
    expect(sql).toContain(
      'grant select on table public.communication_messages to authenticated'
    )
    expect(sql).toContain(
      'grant insert (thread_id, school_id, sender_id, body)'
    )
    expect(sql).toContain(
      'grant select on table public.communication_message_reads to authenticated'
    )
    expect(sql).toContain(
      'grant insert (message_id, reader_id)'
    )
  })

  it('keeps messages and read receipts immutable to ordinary authenticated users', () => {
    expect(sql.toLowerCase()).not.toMatch(/grant\s+update/)
    expect(sql.toLowerCase()).not.toMatch(/grant\s+delete/)
    expect(sql.toLowerCase()).not.toMatch(/grant\s+truncate/)
    expect(sql).not.toMatch(
      /create policy[^;]+on public\.communication_messages[^;]+for update/is
    )
    expect(sql).not.toMatch(
      /create policy[^;]+on public\.communication_messages[^;]+for delete/is
    )
    expect(sql).not.toMatch(
      /create policy[^;]+on public\.communication_message_reads[^;]+for update/is
    )
    expect(sql).not.toMatch(
      /create policy[^;]+on public\.communication_message_reads[^;]+for delete/is
    )
  })

  it('does not open bulletin, acknowledgment, audit, or realtime authorization', () => {
    expect(sql).not.toContain('on public.bulletins')
    expect(sql).not.toContain('on public.bulletin_audiences')
    expect(sql).not.toContain('on public.bulletin_acknowledgments')
    expect(sql).not.toContain('on public.communication_audit_events')
    expect(sql).not.toContain('realtime.messages')
  })
})

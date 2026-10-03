import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const MIGRATION_PATH = path.join(
  process.cwd(),
  'supabase/migrations/20261003220000_com2c_database_rls_enforcement.sql'
)

describe('COM-2C database / RLS enforcement', () => {
  let sql = ''
  let authorizationHelper = ''

  beforeAll(() => {
    sql = fs.readFileSync(MIGRATION_PATH, 'utf-8')
    const helperStart = sql.indexOf(
      'create or replace function public.communication_pair_authorized'
    )
    const helperEnd = sql.indexOf(
      'revoke all on function public.communication_pair_authorized'
    )
    authorizationHelper = sql.slice(helperStart, helperEnd)
  })

  it('adds generic participants without discarding legacy student/instructor evidence', () => {
    expect(sql).toContain('add column if not exists participant_one_id')
    expect(sql).toContain('add column if not exists participant_two_id')
    expect(sql).toContain('participant_one_id = coalesce(participant_one_id, student_id)')
    expect(sql).toContain('participant_two_id = coalesce(participant_two_id, instructor_id)')
    expect(sql).toContain('alter column student_id drop not null')
    expect(sql).toContain('alter column instructor_id drop not null')
    expect(sql).toContain('communication_threads_legacy_pair_shape')
  })

  it('keeps COM-1 inserts working through a compatibility trigger', () => {
    expect(sql).toContain('sync_communication_thread_participants')
    expect(sql).toContain('new.participant_one_id := new.student_id')
    expect(sql).toContain('new.participant_two_id := new.instructor_id')
  })

  it('creates one canonical database authorization function', () => {
    expect(authorizationHelper).toContain('communication_pair_authorized')
    expect(authorizationHelper).toContain("actor_approval_status = 'approved'")
    expect(authorizationHelper).toContain("recipient_approval_status = 'approved'")
    expect(authorizationHelper).toContain('actor_is_disabled = false')
    expect(authorizationHelper).toContain('recipient_is_disabled = false')
    expect(authorizationHelper).toContain("actor_role in ('student', 'apprentice')")
    expect(authorizationHelper).toContain("recipient_role in ('admin', 'school_admin')")
    expect(authorizationHelper).toContain("actor_role = 'instructor'")
    expect(authorizationHelper).toContain('assignment.is_active = true')
    expect(authorizationHelper).toContain('assignment.ended_at is null')
  })

  it('authorizes only the six intended directional relationship clauses', () => {
    const normalized = authorizationHelper.replace(/\s+/g, ' ')

    const allowedClauses = [
      "actor_role in ('student', 'apprentice') and recipient_role = 'instructor'",
      "actor_role = 'instructor' and recipient_role in ('student', 'apprentice')",
      "actor_role in ('student', 'apprentice') and recipient_role in ('admin', 'school_admin')",
      "actor_role in ('admin', 'school_admin') and recipient_role in ('student', 'apprentice')",
      "actor_role = 'instructor' and recipient_role in ('admin', 'school_admin')",
      "actor_role in ('admin', 'school_admin') and recipient_role = 'instructor'",
    ]

    for (const clause of allowedClauses) {
      expect(normalized).toContain(clause)
    }

    expect(normalized).not.toContain(
      "actor_role in ('student', 'apprentice') and recipient_role in ('student', 'apprentice')"
    )
    expect(normalized).not.toContain(
      "actor_role = 'instructor' and recipient_role = 'instructor'"
    )
    expect(normalized).not.toContain(
      "actor_role in ('admin', 'school_admin') and recipient_role in ('admin', 'school_admin')"
    )
  })

  it('requires same-school active approved participants', () => {
    expect(authorizationHelper).toContain('actor_school_id = p_school_id')
    expect(authorizationHelper).toContain('recipient_school_id = p_school_id')
    expect(authorizationHelper).toContain("actor_approval_status = 'approved'")
    expect(authorizationHelper).toContain("recipient_approval_status = 'approved'")
  })

  it('enforces participant-only thread visibility and canonical authorization on creation', () => {
    expect(sql).toContain('participant_one_id = (select auth.uid())')
    expect(sql).toContain('participant_two_id = (select auth.uid())')
    expect(sql).toContain('created_by = (select auth.uid())')
    expect(sql).toContain(
      'public.communication_pair_authorized(\n    participant_one_id,\n    participant_two_id,\n    school_id\n  )'
    )
  })

  it('rechecks authorization on every new message so removed relationships cannot keep sending', () => {
    expect(sql).toContain('create policy "communication messages participants insert"')
    expect(sql).toContain("thread.status = 'active'")
    expect(sql).toContain(
      'public.communication_pair_authorized(\n        thread.participant_one_id,\n        thread.participant_two_id,\n        thread.school_id\n      )'
    )
  })

  it('allows read receipts only for incoming messages inside participant threads', () => {
    expect(sql).toContain('reader_id = (select auth.uid())')
    expect(sql).toContain('message.sender_id <> (select auth.uid())')
    expect(sql).toContain('message.sender_id = thread.participant_one_id')
    expect(sql).toContain('message.sender_id = thread.participant_two_id')
  })

  it('keeps participant identities non-updatable by ordinary clients', () => {
    expect(sql).toContain('grant update (status, updated_at)')
    expect(sql).not.toContain('grant update (participant_one_id')
    expect(sql).not.toContain('grant update (participant_two_id')
  })

  it('does not touch bulletin authorization', () => {
    expect(sql).not.toContain('on public.bulletins')
    expect(sql).not.toContain('on public.bulletin_audiences')
    expect(sql).not.toContain('on public.bulletin_acknowledgments')
  })
})

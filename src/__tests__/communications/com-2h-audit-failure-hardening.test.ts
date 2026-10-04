import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const ACTIONS = path.join(process.cwd(), 'src/app/communications/actions.ts')
const MIGRATION = path.join(
  process.cwd(),
  'supabase/migrations/20261004011000_com2h_messaging_audit_failure_hardening.sql'
)

describe('COM-2H messaging audit and failure hardening', () => {
  let actions = ''
  let migration = ''

  beforeAll(() => {
    actions = fs.readFileSync(ACTIONS, 'utf-8')
    migration = fs.readFileSync(MIGRATION, 'utf-8')
  })

  it('records generic private-thread creation as server-authoritative audit evidence', () => {
    expect(migration).toContain("tg_op = 'INSERT'")
    expect(migration).toContain("'thread_created'")
    expect(migration).toContain("'participant_one_id'")
    expect(migration).toContain("'participant_two_id'")
    expect(migration).toContain("coalesce(v_actor, new.created_by)")
  })

  it('keeps archive evidence and enriches it with generic participants', () => {
    expect(migration).toContain("'thread_archived'")
    expect(migration).toContain("'previous_status'")
    expect(migration).toContain("'current_status'")
    expect(migration).toContain('new.participant_one_id')
    expect(migration).toContain('new.participant_two_id')
  })

  it('keeps audit writes private and append-only for ordinary clients', () => {
    expect(migration).toContain(
      'revoke all on function private.audit_communication_thread() from public, anon, authenticated'
    )
    expect(migration).toContain(
      'revoke all on table public.communication_audit_events from anon, authenticated'
    )
    expect(migration).toContain(
      'grant select on table public.communication_audit_events to authenticated'
    )
  })

  it('audits both thread creation and later archive changes', () => {
    expect(migration).toContain(
      'after insert or update on public.communication_threads'
    )
  })

  it('keeps raw database failures out of user-facing messaging results', () => {
    expect(actions).toContain('logMessagingFailure')
    expect(actions).not.toMatch(/message:\s*[a-zA-Z]+Error\.message/)
    expect(actions).not.toMatch(/message:\s*error\?\.message/)
    expect(actions).toContain('Unable to open this conversation right now.')
    expect(actions).toContain('Unable to load conversations right now.')
    expect(actions).toContain('Unable to send this message right now.')
    expect(actions).toContain('Unable to update read status right now.')
  })

  it('keeps authorization failures plain without exposing RLS details', () => {
    expect(actions).toContain('Unable to verify this recipient right now.')
    expect(actions).toContain('You are not authorized to message this person.')
    expect(actions).toContain("logMessagingFailure('authorize_recipient'")
  })

  it('does not duplicate message/read evidence into audit events', () => {
    expect(migration).not.toContain("'message_sent'")
    expect(migration).not.toContain("'message_read'")
  })
})

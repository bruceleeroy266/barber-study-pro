import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const MIGRATION_PATH = path.join(
  process.cwd(),
  'supabase/migrations/20261002001500_com1c5_audit_events_authorization.sql'
)

describe('COM-1C.5 communication audit-events authorization', () => {
  let sql = ''

  beforeAll(() => {
    sql = fs.readFileSync(MIGRATION_PATH, 'utf-8')
  })

  it('limits audit-event reads to same-school school admins/admins', () => {
    expect(sql).toContain(
      'create policy "communication audit events school admins select"'
    )
    expect(sql).toContain(
      'school_id = (select public.current_user_school_id())'
    )
    expect(sql).toContain('public.is_school_admin(school_id)')
  })

  it('keeps anonymous access closed', () => {
    expect(sql).toContain(
      'revoke all on table public.communication_audit_events from anon, authenticated'
    )
    expect(sql).not.toMatch(/grant[^;]+\bto anon\b/i)
  })

  it('grants authenticated read-only access subject to RLS', () => {
    expect(sql).toContain(
      'grant select on table public.communication_audit_events to authenticated'
    )
    expect(sql.toLowerCase()).not.toMatch(/grant\s+insert/)
    expect(sql.toLowerCase()).not.toMatch(/grant\s+update/)
    expect(sql.toLowerCase()).not.toMatch(/grant\s+delete/)
    expect(sql.toLowerCase()).not.toMatch(/grant\s+truncate/)
  })

  it('does not add client-side mutation policies', () => {
    expect(sql).not.toMatch(
      /create policy[^;]+on public\.communication_audit_events[^;]+for insert/i
    )
    expect(sql).not.toMatch(
      /create policy[^;]+on public\.communication_audit_events[^;]+for update/i
    )
    expect(sql).not.toMatch(
      /create policy[^;]+on public\.communication_audit_events[^;]+for delete/i
    )
  })

  it('does not open messages, bulletins, realtime, or UI authorization', () => {
    expect(sql).not.toContain('on public.communication_messages')
    expect(sql).not.toContain('on public.communication_message_reads')
    expect(sql).not.toContain('on public.bulletins')
    expect(sql).not.toContain('on public.bulletin_audiences')
    expect(sql).not.toContain('on public.bulletin_acknowledgments')
    expect(sql).not.toContain('realtime.messages')
  })
})

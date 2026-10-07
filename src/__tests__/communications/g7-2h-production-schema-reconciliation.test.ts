import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const com2c = read('supabase/migrations/20261003220000_com2c_database_rls_enforcement.sql')
const com2h = read('supabase/migrations/20261004011000_com2h_messaging_audit_failure_hardening.sql')
const archive = read('supabase/migrations/20261004022000_com2_heavy_audit_archive_authorization.sql')
const actions = read('src/app/communications/actions.ts')

describe('G7-2H production communications schema reconciliation', () => {
  it('locks the exact three-migration reconciliation chain in dependency order', () => {
    expect(com2c).toContain('add column if not exists participant_one_id')
    expect(com2c).toContain('add column if not exists participant_two_id')
    expect(com2c).toContain('create or replace function public.communication_pair_authorized')
    expect(com2h).toContain('new.participant_one_id')
    expect(com2h).toContain('new.participant_two_id')
    expect(archive).toContain('create policy "communication threads instructor archive update"')
  })

  it('preserves existing COM-1 evidence while expanding generic participants', () => {
    expect(com2c).toContain('participant_one_id = coalesce(participant_one_id, student_id)')
    expect(com2c).toContain('participant_two_id = coalesce(participant_two_id, instructor_id)')
    expect(com2c).toContain('communication_threads_legacy_pair_shape')
    expect(com2c).not.toContain('drop table public.communication_threads')
    expect(com2c).not.toContain('drop table public.communication_messages')
    expect(com2c).not.toContain('delete from public.communication_messages')
  })

  it('keeps ordinary clients least-privilege after reconciliation', () => {
    expect(com2c).toContain('revoke all on table public.communication_threads from anon, authenticated')
    expect(com2c).toContain('grant select on table public.communication_threads to authenticated')
    expect(com2c).toContain('grant insert (')
    expect(com2c).toContain('grant update (status, updated_at)')
    expect(com2c).not.toContain('grant delete on table public.communication_messages')
    expect(com2h).toContain('revoke all on function private.audit_communication_thread() from public, anon, authenticated')
  })

  it('keeps current runtime aligned with generic participant columns and canonical authorization', () => {
    expect(actions).toContain('participant_one_id')
    expect(actions).toContain('participant_two_id')
    expect(actions).toContain('communication_pair_authorized')
  })

  it('keeps stale relationship checks on message insert', () => {
    expect(com2c).toContain("thread.status = 'active'")
    expect(com2c).toContain('public.communication_pair_authorized(')
    expect(com2c).toContain("actor_approval_status = 'approved'")
    expect(com2c).toContain('actor_is_disabled = false')
    expect(com2c).toContain('recipient_is_disabled = false')
  })

  it('keeps archive enforcement aligned at runtime and RLS boundary', () => {
    expect(actions).toContain("if (actor.role !== 'instructor')")
    expect(archive).toContain("actor.role = 'instructor'")
    expect(archive).toContain("actor.approval_status = 'approved'")
    expect(archive).toContain('coalesce(actor.is_disabled, false) = false')
    expect(archive).toContain("status = 'archived'")
  })
})

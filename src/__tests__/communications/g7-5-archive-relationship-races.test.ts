import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const actions = read('src/app/communications/actions.ts')
const migration = read('supabase/migrations/20261007145500_g7_5_archive_relationship_races.sql')

describe('G7-5 archive + relationship-race hardening', () => {
  it('serializes every message insert against thread archive transitions', () => {
    expect(migration).toContain('communication_message_insert_race_guard')
    expect(migration).toContain('for update')
    expect(migration).toContain("thread_row.status <> 'active'")
    expect(migration).toContain('communication_pair_authorized(')
  })

  it('makes current actor eligibility authoritative in stale sessions', () => {
    expect(actions).toContain("'id, school_id, role, approval_status, is_disabled'")
    expect(actions).toContain("profile.approval_status !== 'approved' || profile.is_disabled")
    expect(migration).toContain("actor.approval_status = 'approved'")
    expect(migration).toContain('coalesce(actor.is_disabled, false) = false')
  })

  it('preserves historical rows while blocking stale new actions', () => {
    expect(migration).not.toContain('delete from public.communication_messages')
    expect(migration).not.toContain('delete from public.communication_threads')
    expect(migration).toContain('communication message reads recipient insert')
    expect(migration).toContain('communication threads instructor archive update')
    expect(migration).toContain('public.communication_pair_authorized(')
  })

  it('makes repeated archive converge to the persisted archived thread', () => {
    expect(actions).toContain("if (existingThread.status === 'archived')")
    expect(actions).toContain('archive_thread_race_reload')
    expect(actions).toContain("racedThread.status !== 'archived'")
    expect(actions).toContain('stillAuthorized')
  })

  it('rechecks current assignment before archive, including after a race', () => {
    expect(actions).toContain("'archive_thread_authorize'")
    expect(actions).toContain('You are no longer authorized to archive this conversation.')
    expect(actions).toContain("'archive_thread_race_authorize'")
    expect(migration).toContain("status = 'active'")
  })

  it('blocks stale read-receipt creation after relationship loss', () => {
    expect(migration).toContain('reader_id = (select auth.uid())')
    expect(migration).toContain('message.sender_id <> (select auth.uid())')
    expect(migration).toContain('case')
    expect(migration).toContain('then thread.participant_two_id')
  })

  it('keeps historical SELECT access separate from new-action authorization', () => {
    expect(migration).toContain('communication threads participants select')
    expect(migration).toContain('communication messages participants select')
    expect(migration).not.toMatch(/create policy "communication threads participants select"[\s\S]*communication_pair_authorized/)
  })

  it('does not widen messaging scope or add realtime', () => {
    expect(actions).not.toContain('.channel(')
    expect(migration).not.toContain('student-to-student')
  })
})

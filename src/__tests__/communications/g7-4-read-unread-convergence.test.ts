import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const actions = read('src/app/communications/actions.ts')
const center = read('src/components/messaging/ProductionMessageCenter.tsx')
const migration = read('supabase/migrations/20261007134000_g7_4_unread_convergence.sql')

describe('G7-4 read / unread convergence hardening', () => {
  it('uses conflict-safe read receipt insertion for concurrent tabs', () => {
    expect(actions).toContain('.upsert(')
    expect(actions).toContain("onConflict: 'message_id,reader_id'")
    expect(actions).toContain('ignoreDuplicates: true')
    expect(actions).not.toContain("insertError.code === '23505'")
  })

  it('computes inbox unread from one canonical database snapshot', () => {
    expect(actions).toContain("supabase.rpc(\n    'communication_unread_counts'")
    expect(actions).toContain("logMessagingFailure('load_unread_counts'")
    expect(migration).toContain('returns table (')
    expect(migration).toContain('read_receipt.message_id is null')
    expect(migration).toContain('message.sender_id <> auth.uid()')
  })

  it('keeps the unread resolver inside the caller RLS boundary', () => {
    expect(migration).toContain('security invoker')
    expect(migration).toContain('thread.school_id = public.current_user_school_id()')
    expect(migration).toContain('thread.participant_one_id = auth.uid()')
    expect(migration).toContain('thread.participant_two_id = auth.uid()')
    expect(migration).toContain('revoke all on function public.communication_unread_counts()')
    expect(migration).toContain('grant execute on function public.communication_unread_counts()')
  })

  it('reconciles selected-thread unread from persisted server truth', () => {
    expect(actions).toContain("logMessagingFailure('mark_read_reconcile_unread'")
    expect(actions).toContain('remainingUnread: Number(remainingUnread) || 0')
    expect(center).toContain('const remainingUnread = readResult.data.remainingUnread')
    expect(center).toContain('unreadCount: remainingUnread')
  })

  it('preserves repeated-read idempotency and never counts the actor own sends', () => {
    expect(actions).toContain('ignoreDuplicates: true')
    expect(migration).toContain('message.sender_id <> auth.uid()')
  })

  it('does not introduce realtime or browser-local unread authority', () => {
    expect(actions).not.toContain('.channel(')
    expect(center).not.toContain('localStorage')
    expect(center).not.toContain('sessionStorage')
  })
})

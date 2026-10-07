import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const migration = read('supabase/migrations/20261007130700_g7_3_message_thread_idempotency.sql')
const actions = read('src/app/communications/actions.ts')
const center = read('src/components/messaging/ProductionMessageCenter.tsx')

describe('G7-3 message + thread idempotency foundation', () => {
  it('enforces one active order-independent thread per school participant pair', () => {
    expect(migration).toContain('uq_communication_threads_one_active_pair')
    expect(migration).toContain('least(participant_one_id, participant_two_id)')
    expect(migration).toContain('greatest(participant_one_id, participant_two_id)')
    expect(migration).toContain("where status = 'active'")
  })

  it('enforces exactly-once sender operation identity for message retries', () => {
    expect(migration).toContain('add column if not exists client_operation_id uuid')
    expect(migration).toContain('uq_communication_messages_sender_operation')
    expect(migration).toContain('sender_id, client_operation_id')
    expect(migration).toContain('where client_operation_id is not null')
  })

  it('treats a concurrent active-thread uniqueness collision as the existing thread', () => {
    expect(actions).toContain("createError?.code === '23505'")
    expect(actions).toContain('racedThreads')
    expect(actions).toContain('created: false')
  })

  it('treats a same-operation message retry as the already persisted message', () => {
    expect(actions).toContain("error?.code === '23505'")
    expect(actions).toContain(".eq('client_operation_id', operationId)")
    expect(actions).toContain('existing.thread_id === thread.id')
    expect(actions).toContain('existing.body === trimmedBody')
    expect(actions).toContain('Unable to safely retry this message.')
  })

  it('requires a valid client operation identity and persists it on insert', () => {
    expect(actions).toContain('A valid message operation is required.')
    expect(actions).toContain('client_operation_id: operationId')
  })

  it('keeps one operation ID across an unchanged failed draft and clears it on edit or success', () => {
    expect(center).toContain('replyOperationIdRef')
    expect(center).toContain('composeOperationIdRef')
    expect(center).toContain('crypto.randomUUID()')
    expect(center).toContain('replyOperationIdRef.current = null')
    expect(center).toContain('composeOperationIdRef.current = null')
  })

  it('preserves UI locks as defense-in-depth rather than the source of correctness', () => {
    expect(center).toContain('sendLockedRef')
    expect(center).toContain('composeLockedRef')
    expect(migration).toContain('create unique index')
  })
})

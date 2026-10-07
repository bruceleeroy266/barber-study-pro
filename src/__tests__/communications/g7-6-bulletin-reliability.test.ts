import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const actions = read('src/app/communications/bulletin-actions.ts')
const manager = read('src/components/messaging/BulletinManager.tsx')
const migration = read('supabase/migrations/20261007182000_g7_6_bulletin_reliability.sql')
const delivery = read('supabase/migrations/20261002024000_com1d4_bulletin_rls_recursion_fix.sql')
const ack = read('supabase/migrations/20261002000500_com1c4_bulletin_delivery_ack_authorization.sql')

describe('G7-6 bulletin reliability hardening', () => {
  it('publishes bulletin + audiences atomically through one database operation', () => {
    expect(migration).toContain('create or replace function public.publish_bulletin_atomic')
    expect(migration).toContain('security invoker')
    expect(migration).toContain("status = 'published'")
    expect(actions).toContain("supabase.rpc('publish_bulletin_atomic'")
    expect(actions).not.toContain("draft was saved, but audience targeting failed")
  })

  it('makes publish retries exactly-once per author operation', () => {
    expect(migration).toContain('client_operation_id uuid')
    expect(migration).toContain('uq_bulletins_author_operation')
    expect(migration).toContain('publish_request_hash')
    expect(migration).toContain('bulletin operation payload mismatch')
    expect(manager).toContain('publishOperationIdRef')
    expect(manager).toContain('crypto.randomUUID()')
  })

  it('keeps audience authorization behind existing RLS', () => {
    expect(migration).toContain('security invoker')
    expect(migration).toContain('insert into public.bulletin_audiences')
    expect(migration).not.toContain('security definer')
  })

  it('blocks rejected or disabled bulletin actors', () => {
    expect(actions).toContain("'id, school_id, role, approval_status, is_disabled'")
    expect(actions).toContain("profile.approval_status !== 'approved' || profile.is_disabled")
    expect(migration).toContain("actor.approval_status = 'approved'")
    expect(migration).toContain('coalesce(actor.is_disabled, false) = false')
  })

  it('keeps acknowledgment exactly-once and append-only', () => {
    expect(actions).toContain("onConflict: 'bulletin_id,student_id'")
    expect(actions).toContain('ignoreDuplicates: true')
    expect(ack).toContain('bulletin_acknowledgments_unique')
    expect(ack).not.toMatch(/grant\s+update/i)
    expect(ack).not.toMatch(/grant\s+delete/i)
  })

  it('uses database server time for delivery and acknowledgment windows', () => {
    expect(delivery).toContain('(publish_at is null or publish_at <= now())')
    expect(delivery).toContain('(expires_at is null or expires_at > now())')
    expect(ack).toContain('(bulletin.publish_at is null or bulletin.publish_at <= now())')
    expect(ack).toContain('(bulletin.expires_at is null or bulletin.expires_at > now())')
  })

  it('does not introduce realtime or bulletin replies', () => {
    expect(actions).not.toContain('.channel(')
    expect(manager).not.toContain('reply')
  })
})

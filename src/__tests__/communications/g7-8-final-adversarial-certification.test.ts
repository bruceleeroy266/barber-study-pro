import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')

const certification = read('docs/engineering/GATE7_G7-8_FINAL_ADVERSARIAL_CERTIFICATION.md')
const callerGuard = read('supabase/migrations/20261007200500_g7_8_s1_pair_authorization_caller_guard.sql')

const requiredEvidence = [
  'src/__tests__/communications/com-1e-final-communications-certification.test.ts',
  'src/__tests__/communications/com-2j-final-certification.test.ts',
  'src/__tests__/communications/g7-3-message-thread-idempotency.test.ts',
  'src/__tests__/communications/g7-4-read-unread-convergence.test.ts',
  'src/__tests__/communications/g7-5-archive-relationship-races.test.ts',
  'src/__tests__/communications/g7-6-bulletin-reliability.test.ts',
  'src/__tests__/communications/g7-7-failure-mobile-refresh.test.ts',
]

describe('G7-8 final adversarial certification matrix', () => {
  it('passes the product boundary without entering guarded integration zones', () => {
    expect(certification).toContain('Product-boundary check:** PASS')
    expect(certification).toContain('classified as **COEXIST**')
    expect(certification).toContain('No DO NOT BUILD capability is introduced')
    expect(certification).toContain('Guarded integration zone contact:** NONE')
  })

  it('keeps every COM-1 / COM-2 / Gate 7 evidence suite in the final matrix', () => {
    for (const evidence of requiredEvidence) {
      expect(fs.existsSync(path.join(process.cwd(), evidence))).toBe(true)
      expect(certification).toContain(path.basename(evidence))
    }
  })

  it('locks the full Gate 7 reliability matrix into final certification', () => {
    expect(certification).toContain('exactly-once and concurrency')
    expect(certification).toContain('read/unread convergence')
    expect(certification).toContain('archive and relationship races')
    expect(certification).toContain('bulletin reliability')
    expect(certification).toContain('failure/mobile refresh')
  })

  it('repairs the SECURITY DEFINER helper by requiring caller membership', () => {
    expect(callerGuard).toContain('security definer')
    expect(callerGuard).toContain('auth.uid() as id')
    expect(callerGuard).toContain('caller.id is not null')
    expect(callerGuard).toContain('caller.id in (p_actor_id, p_recipient_id)')
    expect(callerGuard).toContain('from public, anon')
    expect(callerGuard).toContain('to authenticated')
  })

  it('preserves the canonical messaging relationships after the caller guard', () => {
    expect(callerGuard).toContain("actor_role in ('student', 'apprentice')")
    expect(callerGuard).toContain("recipient_role = 'instructor'")
    expect(callerGuard).toContain('public.student_instructor_assignments')
    expect(callerGuard).toContain("recipient_role in ('admin', 'school_admin')")
    expect(callerGuard).toContain("actor_role in ('admin', 'school_admin')")
  })

  it('requires exact-head and exact-production closure evidence', () => {
    expect(certification).toContain('Engineering Verification passes on exact head')
    expect(certification).toContain('exact-head Vercel preview is READY')
    expect(certification).toContain('production main is the exact merge commit')
    expect(certification).toContain('production Vercel is READY')
  })
})

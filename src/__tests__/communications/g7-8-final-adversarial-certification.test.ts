import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')

const certification = read('docs/engineering/GATE7_G7-8_FINAL_ADVERSARIAL_CERTIFICATION.md')

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

  it('locks all four reliability families into final certification', () => {
    expect(certification).toContain('exactly-once and concurrency')
    expect(certification).toContain('read/unread convergence')
    expect(certification).toContain('archive and relationship races')
    expect(certification).toContain('bulletin reliability')
    expect(certification).toContain('failure/mobile refresh')
  })

  it('does not allow G7-8 to hide the live SECURITY DEFINER blocker', () => {
    expect(certification).toContain('G7-8-S1 — SECURITY BLOCKER')
    expect(certification).toContain('auth.uid() = p_actor_id OR auth.uid() = p_recipient_id')
    expect(certification).toContain('BLOCKED until G7-8-S1 is repaired')
  })

  it('requires exact-head and exact-production closure evidence', () => {
    expect(certification).toContain('Engineering Verification passes on exact head')
    expect(certification).toContain('exact-head Vercel preview is READY')
    expect(certification).toContain('production main is the exact merge commit')
    expect(certification).toContain('production Vercel is READY')
  })
})

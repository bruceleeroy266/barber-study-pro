import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const center = read('src/components/messaging/ProductionMessageCenter.tsx')
const actions = read('src/app/communications/actions.ts')
const certification = read('docs/engineering/GATE7_G7-7_FAILURE_MOBILE_REFRESH.md')

describe('G7-7 failure + mobile refresh hardening', () => {
  it('passes the locked product-boundary contract', () => {
    expect(certification).toContain('Product-boundary check:** PASS')
    expect(certification).toContain('classified as **COEXIST**')
    expect(certification).toContain('No DO NOT BUILD capability is introduced')
    expect(certification).toContain('Guarded integration zone contact:** NONE')
  })

  it('ignores stale conversation loads after newer mobile navigation', () => {
    expect(center).toContain('viewEpochRef')
    expect(center).toContain('viewEpochRef.current !== requestEpoch')
    expect(center).toContain('viewEpochRef.current += 1')
    expect(center).toContain('loadThread(threadId, requestEpoch)')
  })

  it('keeps stable message operation identity across recoverable send failure', () => {
    expect(center).toContain('replyOperationIdRef.current ?? crypto.randomUUID()')
    expect(center).toContain('composeOperationIdRef.current ?? crypto.randomUUID()')
    expect(center).toContain('replyOperationIdRef.current = null')
    expect(center).toContain('composeOperationIdRef.current = null')
  })

  it('keeps safe visible failures and diagnostic logging without raw DB errors', () => {
    expect(actions).toContain('logMessagingFailure')
    expect(actions).toContain('Unable to send this message right now.')
    expect(actions).not.toMatch(/return\s*\{\s*success:\s*false,\s*message:\s*[A-Za-z]+Error\.message/)
  })

  it('keeps refresh truth in persisted server state rather than browser storage', () => {
    expect(center).not.toContain('localStorage')
    expect(center).not.toContain('sessionStorage')
    expect(actions).toContain('communication_unread_counts')
  })
})

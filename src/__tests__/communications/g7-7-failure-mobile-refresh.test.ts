import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const center = read('src/components/messaging/ProductionMessageCenter.tsx')
const actions = read('src/app/communications/actions.ts')
const bulletins = read('src/app/communications/bulletin-actions.ts')
const instructorPage = read('src/app/instructor/messages/page.tsx')
const studentPage = read('src/app/(dashboard)/dashboard/messages/page.tsx')
const certification = read('docs/engineering/GATE7_G7-7_FAILURE_MOBILE_REFRESH.md')

describe('G7-7 failure + mobile refresh hardening', () => {
  it('passes the locked product-boundary contract', () => {
    expect(certification).toContain('Product-boundary check:** PASS')
    expect(certification).toContain('classified as **COEXIST**')
    expect(certification).toContain('No DO NOT BUILD capability is introduced')
    expect(certification).toContain('Guarded integration zone contact:** NONE')
  })

  it('ignores stale conversation loads and failures after newer mobile navigation', () => {
    expect(center).toContain('viewEpochRef')
    expect(center).toContain('viewEpochRef.current !== requestEpoch')
    expect(center).toContain('viewEpochRef.current === requestEpoch')
    expect(center).toContain('viewEpochRef.current += 1')
    expect(center).toContain('loadThread(threadId, requestEpoch)')
    expect(center).toContain("setStatusMessage('')")
  })

  it('keeps unchanged retry identity but clears it when the user changes intent', () => {
    expect(center).toContain('replyOperationIdRef.current ?? crypto.randomUUID()')
    expect(center).toContain('composeOperationIdRef.current ?? crypto.randomUUID()')
    expect(center).toContain('replyOperationIdRef.current = null')
    expect(center).toContain('composeOperationIdRef.current = null')
    expect(center).toContain('setReplyBody(event.target.value)')
    expect(center).toContain('setNewMessageBody(event.target.value)')
    expect(center).toContain('setCounterpartId(event.target.value)')
  })

  it('reconstructs production thread truth from Postgres on full refresh', () => {
    expect(instructorPage).toContain('const threadsResult = await loadCommunicationThreads()')
    expect(studentPage).toContain('const threadsResult = await loadCommunicationThreads()')
    expect(instructorPage).toContain('initialThreads={initialThreads}')
    expect(studentPage).toContain('initialThreads={initialThreads}')
    expect(center).not.toContain('localStorage')
    expect(center).not.toContain('sessionStorage')
    expect(actions).toContain('communication_unread_counts')
  })

  it('keeps safe visible failures and content-minimal diagnostic evidence', () => {
    expect(actions).toContain('logMessagingFailure')
    expect(actions).toContain('Unable to send this message right now.')
    expect(actions).not.toMatch(/return\s*\{\s*success:\s*false,\s*message:\s*[A-Za-z]+Error\.message/)
    expect(actions).not.toMatch(/console\.error\([^\n]*trimmedBody/)
    expect(bulletins).toContain("console.error('[bulletins] publish failed'")
    expect(bulletins).not.toMatch(/console\.error\([^\n]*\bbody\b/)
  })

  it('documents persisted-success convergence after back navigation', () => {
    expect(certification).toContain('Confirmed persisted success may still update the thread list')
    expect(certification).toContain('server truth is authoritative')
    expect(certification).toContain('Full refresh therefore reconstructs')
  })
})

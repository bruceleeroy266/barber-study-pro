import { describe, expect, it } from 'vitest'
import { buildCleanupPreview } from '../cleanup-safeguards'

describe('cleanup-safeguards', () => {
  it('separates protected and deletable accounts', () => {
    const preview = buildCleanupPreview([
      { id: '1', email: 'ascynproofficial@gmail.com', role: 'admin', schoolId: null, isDesignated: true },
      { id: '2', email: 'old-smoke@ascyn-smoke.test', role: 'student', schoolId: null, isDesignated: false },
    ])

    expect(preview.totalMatched).toBe(2)
    expect(preview.protectedCount).toBe(1)
    expect(preview.deletableCount).toBe(1)
    expect(preview.protectedAccounts[0].email).toBe('ascynproofficial@gmail.com')
    expect(preview.deletableAccounts[0].email).toBe('old-smoke@ascyn-smoke.test')
  })
})

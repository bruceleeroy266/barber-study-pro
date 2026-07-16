/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'

describe('server-only guard', () => {
  it('prevents direct import of the server-only marker outside a server environment', async () => {
    await expect(import('server-only')).rejects.toThrow(
      /cannot be imported from a Client Component/i
    )
  })

  it('prevents client-side import of audit-logger because it imports server-only', async () => {
    await expect(import('./audit-logger')).rejects.toThrow(
      /cannot be imported from a Client Component/i
    )
  })
})

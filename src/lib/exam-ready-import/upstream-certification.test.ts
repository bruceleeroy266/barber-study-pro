import { describe, expect, it } from 'vitest'

/**
 * Execute upstream script-style certification in the Vitest runner, without
 * introducing a new tsx dependency. Upstream scripts set process.exitCode=2
 * on blocking findings. Always restore it to avoid contaminating other tests.
 */
async function certify(load: () => Promise<unknown>): Promise<void> {
  const prior = process.exitCode
  process.exitCode = 0
  try {
    await load()
    expect(process.exitCode).toBe(0)
  } finally {
    process.exitCode = prior
  }
}

describe('Exam Ready upstream script certification', () => {
  it('passes upstream master-bank certification (blocking rules)', async () => {
    await certify(() => import('./upstream/master-bank-certification'))
  })

  it('executes upstream difficulty/distractor review baseline', async () => {
    // Difficulty audit emits REVIEW candidates but does not fail on heuristics.
    await certify(() => import('./upstream/difficulty-audit'))
  })

  it('passes factual key drift certification with adapted source paths', async () => {
    await certify(() => import('./factual-key-drift-certification'))
  })
})

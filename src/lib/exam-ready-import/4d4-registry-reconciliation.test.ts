import { describe, expect, it } from 'vitest'
import { reconcileRegistry, type ExistingQuestion } from './4d4-registry-reconciliation'

describe('4D-4 registry reconciliation', () => {
  const makeExisting = () => reconcileRegistry([], true).plan.inventory.map((row, index) => ({ ...row, id: String(index + 1) }))
  it('plans 573 inserts on a clean complete snapshot', () => {
    const result = reconcileRegistry([], true)
    expect(result.inserts).toHaveLength(573)
    expect(result.reused).toHaveLength(0)
    expect(result.plan.config.status).toBe('draft')
  })
  it('is repeatable without duplicate inserts after complete import', () => {
    const rows = makeExisting()
    const result = reconcileRegistry(rows, true)
    expect(result.inserts).toHaveLength(0)
    expect(result.reused).toHaveLength(573)
  })
  it('handles partial import and rejects changed content', () => {
    const rows = makeExisting()
    expect(reconcileRegistry(rows.slice(0, 200), true).inserts).toHaveLength(373)
    const changed: ExistingQuestion = { ...rows[0], prompt: 'tampered' }
    expect(() => reconcileRegistry([changed], true)).toThrow(/changed content/)
  })
  it('rejects incomplete snapshots and duplicate identities', () => {
    expect(() => reconcileRegistry([], false)).toThrow(/Complete/)
    const rows = makeExisting()
    expect(() => reconcileRegistry([rows[0], rows[0]], true)).toThrow(/duplicate/)
    expect(() => reconcileRegistry([{ ...rows[0], id: '' }], true)).toThrow(/identity/)
  })
})

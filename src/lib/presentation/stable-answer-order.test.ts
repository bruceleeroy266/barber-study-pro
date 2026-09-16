import { describe, expect, it } from 'vitest'
import { orderInteractiveAnswers } from './stable-answer-order'

describe('orderInteractiveAnswers', () => {
  const options = ['alpha', 'bravo', 'charlie', 'delta'] as const

  it('preserves answer identity while moving the preferred answer', () => {
    const ordered = orderInteractiveAnswers(options, 1, 0, 'chapter-3-scenarios')

    expect(ordered.map((entry) => entry.item).sort()).toEqual([...options].sort())
    expect(ordered.find((entry) => entry.originalIndex === 1)?.item).toBe('bravo')
  })

  it('is deterministic for the same section and item', () => {
    const first = orderInteractiveAnswers(options, 1, 3, 'chapter-3-scenarios')
    const second = orderInteractiveAnswers(options, 1, 3, 'chapter-3-scenarios')

    expect(second).toEqual(first)
  })

  it('distributes the preferred answer evenly across A/B/C/D', () => {
    const positions = Array.from({ length: 8 }, (_, itemIndex) => {
      const ordered = orderInteractiveAnswers(options, 1, itemIndex, 'chapter-3-scenarios')
      return ordered.find((entry) => entry.originalIndex === 1)?.displayLabel
    })

    const counts = positions.reduce<Record<string, number>>((acc, label) => {
      if (label) acc[label] = (acc[label] ?? 0) + 1
      return acc
    }, {})

    expect(counts).toEqual({ A: 2, B: 2, C: 2, D: 2 })
  })

  it('does not mutate the authored option array', () => {
    const authored = ['A', 'B', 'C']
    const snapshot = [...authored]

    orderInteractiveAnswers(authored, 1, 2, 'confidence-builder')

    expect(authored).toEqual(snapshot)
  })
})

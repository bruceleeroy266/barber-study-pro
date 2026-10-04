import { describe, expect, it } from 'vitest'
import { chapter1MicroChecks } from '@/lib/chapter-1-concepts/micro-checks'
import {
  buildMicroCheckChoices,
  buildShuffledMicroCheckChoices,
  shuffleMicroCheckChoices,
  sourceKeyForDisplayIndex,
  type MicroCheckRandomSource,
} from '@/lib/micro-checks/randomization'

function sequenceRandom(values: readonly number[]): MicroCheckRandomSource {
  let index = 0
  return () => {
    const value = values[index]
    index += 1
    if (value === undefined) {
      throw new Error('Deterministic test random sequence exhausted.')
    }
    return value
  }
}

describe('MC-R1B shared micro-check randomization runtime', () => {
  it('builds stable source-key choices without mutating the question bank', () => {
    const question = chapter1MicroChecks[0].questions[0]
    const before = { ...question }

    expect(buildMicroCheckChoices(question)).toEqual([
      { sourceKey: 'a', text: question.answer_a },
      { sourceKey: 'b', text: question.answer_b },
      { sourceKey: 'c', text: question.answer_c },
      { sourceKey: 'd', text: question.answer_d },
    ])
    expect(question).toEqual(before)
  })

  it('shuffles visible order while preserving the canonical source key used for grading', () => {
    const question = chapter1MicroChecks[0].questions[0]
    expect(question.correctAnswer).toBe('a')

    const displayed = buildShuffledMicroCheckChoices(
      question,
      sequenceRandom([0, 0, 0]),
    )

    expect(displayed.map((choice) => choice.sourceKey)).toEqual(['b', 'c', 'd', 'a'])
    expect(displayed.map((choice) => choice.displayLabel)).toEqual(['A', 'B', 'C', 'D'])

    const visibleFourth = displayed[3]
    expect(visibleFourth.displayLabel).toBe('D')
    expect(visibleFourth.sourceKey).toBe('a')
    expect(visibleFourth.sourceKey === question.correctAnswer).toBe(true)
  })

  it('can place each canonical source key in different visible positions with deterministic inputs', () => {
    const original = [
      { sourceKey: 'a' as const, text: 'A' },
      { sourceKey: 'b' as const, text: 'B' },
      { sourceKey: 'c' as const, text: 'C' },
      { sourceKey: 'd' as const, text: 'D' },
    ]

    const orders = [
      shuffleMicroCheckChoices(original, sequenceRandom([0, 0, 0])),
      shuffleMicroCheckChoices(original, sequenceRandom([0.99, 0.99, 0.99])),
      shuffleMicroCheckChoices(original, sequenceRandom([0.5, 0.25, 0.75])),
      shuffleMicroCheckChoices(original, sequenceRandom([0.25, 0.75, 0.5])),
    ]

    for (const key of ['a', 'b', 'c', 'd'] as const) {
      const positions = new Set(
        orders.map((order) => order.find((choice) => choice.sourceKey === key)?.displayIndex),
      )
      expect(positions.size).toBeGreaterThan(1)
    }
  })

  it('never duplicates or drops a source choice', () => {
    const choices = [
      { sourceKey: 'a' as const, text: 'A' },
      { sourceKey: 'b' as const, text: 'B' },
      { sourceKey: 'c' as const, text: 'C' },
      { sourceKey: 'd' as const, text: 'D' },
    ]

    const shuffled = shuffleMicroCheckChoices(
      choices,
      sequenceRandom([0.3, 0.7, 0.1]),
    )

    expect(shuffled).toHaveLength(4)
    expect(new Set(shuffled.map((choice) => choice.sourceKey))).toEqual(
      new Set(['a', 'b', 'c', 'd']),
    )
  })

  it('does not mutate the source choices', () => {
    const choices = [
      { sourceKey: 'a' as const, text: 'A' },
      { sourceKey: 'b' as const, text: 'B' },
      { sourceKey: 'c' as const, text: 'C' },
      { sourceKey: 'd' as const, text: 'D' },
    ]
    const before = choices.map((choice) => ({ ...choice }))

    shuffleMicroCheckChoices(choices, sequenceRandom([0.4, 0.2, 0.8]))

    expect(choices).toEqual(before)
  })

  it('maps a visible slot back to the canonical source key before grading', () => {
    const question = chapter1MicroChecks[0].questions[0]
    const displayed = buildShuffledMicroCheckChoices(
      question,
      sequenceRandom([0, 0, 0]),
    )

    expect(sourceKeyForDisplayIndex(displayed, 3)).toBe('a')
    expect(sourceKeyForDisplayIndex(displayed, 99)).toBeNull()
  })

  it('rejects invalid random sources and malformed answer sets', () => {
    expect(() =>
      shuffleMicroCheckChoices(
        [
          { sourceKey: 'a', text: 'A' },
          { sourceKey: 'b', text: 'B' },
          { sourceKey: 'c', text: 'C' },
          { sourceKey: 'd', text: 'D' },
        ],
        () => 1,
      ),
    ).toThrow(/0 \(inclusive\) to 1 \(exclusive\)/)

    expect(() =>
      shuffleMicroCheckChoices([
        { sourceKey: 'a', text: 'A' },
        { sourceKey: 'a', text: 'Duplicate A' },
        { sourceKey: 'c', text: 'C' },
        { sourceKey: 'd', text: 'D' },
      ]),
    ).toThrow(/Duplicate micro-check source key/)

    expect(() =>
      shuffleMicroCheckChoices([
        { sourceKey: 'a', text: 'A' },
        { sourceKey: 'b', text: 'B' },
        { sourceKey: 'c', text: 'C' },
      ]),
    ).toThrow(/exactly four answer choices/)
  })
})

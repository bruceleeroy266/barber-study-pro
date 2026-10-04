export type MicroCheckAnswerKey = 'a' | 'b' | 'c' | 'd'

export interface MicroCheckChoice {
  sourceKey: MicroCheckAnswerKey
  text: string
}

export interface DisplayedMicroCheckChoice extends MicroCheckChoice {
  displayIndex: number
  displayLabel: 'A' | 'B' | 'C' | 'D'
}

export type MicroCheckRandomSource = () => number

export interface FourChoiceMicroCheckQuestion {
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
}

const SOURCE_KEYS = ['a', 'b', 'c', 'd'] as const
const DISPLAY_LABELS = ['A', 'B', 'C', 'D'] as const

function assertRandomValue(value: number): number {
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('Micro-check random source must return a finite value from 0 (inclusive) to 1 (exclusive).')
  }
  return value
}

export function buildMicroCheckChoices(
  question: FourChoiceMicroCheckQuestion,
): readonly MicroCheckChoice[] {
  return SOURCE_KEYS.map((sourceKey) => ({
    sourceKey,
    text: question[`answer_${sourceKey}`],
  }))
}

export function shuffleMicroCheckChoices(
  choices: readonly MicroCheckChoice[],
  random: MicroCheckRandomSource = Math.random,
): readonly DisplayedMicroCheckChoice[] {
  if (choices.length !== 4) {
    throw new RangeError('Micro-check randomization requires exactly four answer choices.')
  }

  const seen = new Set<MicroCheckAnswerKey>()
  const shuffled = choices.map((choice) => {
    if (seen.has(choice.sourceKey)) {
      throw new Error(`Duplicate micro-check source key: ${choice.sourceKey}`)
    }
    seen.add(choice.sourceKey)
    return { ...choice }
  })

  if (seen.size !== 4 || SOURCE_KEYS.some((key) => !seen.has(key))) {
    throw new Error('Micro-check choices must contain source keys a, b, c, and d exactly once.')
  }

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(assertRandomValue(random()) * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = current
  }

  return shuffled.map((choice, displayIndex) => ({
    ...choice,
    displayIndex,
    displayLabel: DISPLAY_LABELS[displayIndex],
  }))
}

export function buildShuffledMicroCheckChoices(
  question: FourChoiceMicroCheckQuestion,
  random: MicroCheckRandomSource = Math.random,
): readonly DisplayedMicroCheckChoice[] {
  return shuffleMicroCheckChoices(buildMicroCheckChoices(question), random)
}

export function sourceKeyForDisplayIndex(
  choices: readonly DisplayedMicroCheckChoice[],
  displayIndex: number,
): MicroCheckAnswerKey | null {
  return choices.find((choice) => choice.displayIndex === displayIndex)?.sourceKey ?? null
}

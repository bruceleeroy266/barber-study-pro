import type { MicroCheckAnswerKey } from './randomization'

export interface HintableMicroCheckQuestion {
  id: string
  conceptFamilyId: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: MicroCheckAnswerKey
  explanation?: string
}

export interface MicroCheckHintRegistry {
  questionHints?: Readonly<Record<string, string>>
  conceptHints?: Readonly<Record<string, string>>
}

export type MicroCheckHintSource =
  | 'question'
  | 'concept'
  | 'explanation'
  | 'neutral'

export interface ResolvedMicroCheckHint {
  text: string
  source: MicroCheckHintSource
}

export type MicroCheckExplanationHintBuilder = (
  question: HintableMicroCheckQuestion,
) => string | null | undefined

const ANSWER_REFERENCE_PATTERN =
  /\b(?:correct\s+answer|answer\s+is|correct\s+(?:choice|option)|(?:choice|option)\s+[abcd]|pick\s+[abcd]|select\s+[abcd])\b/i

const POSITION_REFERENCE_PATTERN =
  /\b(?:first|second|third|fourth)\s+(?:choice|option|answer)\b/i

const DEFAULT_NEUTRAL_HINT =
  'Review the key rule for this concept and compare each response against that rule.'

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function meaningfulTokens(value: string): string[] {
  return normalize(value)
    .split(' ')
    .filter((token) => token.length >= 5)
}

function correctAnswerText(question: HintableMicroCheckQuestion): string {
  return question[`answer_${question.correctAnswer}`]
}

function hasHighCorrectAnswerOverlap(
  hint: string,
  question: HintableMicroCheckQuestion,
): boolean {
  const correct = correctAnswerText(question)
  const normalizedHint = normalize(hint)
  const normalizedCorrect = normalize(correct)

  if (!normalizedHint || !normalizedCorrect) return false

  if (
    normalizedCorrect.length >= 12 &&
    normalizedHint.includes(normalizedCorrect)
  ) {
    return true
  }

  const answerTokens = [...new Set(meaningfulTokens(correct))]
  if (answerTokens.length < 3) return false

  const hintTokens = new Set(meaningfulTokens(hint))
  const shared = answerTokens.filter((token) => hintTokens.has(token)).length

  return shared / answerTokens.length >= 0.8
}

export function hintLeaksAnswer(
  hint: string,
  question: HintableMicroCheckQuestion,
): boolean {
  const trimmed = hint.trim()
  if (!trimmed) return true

  return (
    ANSWER_REFERENCE_PATTERN.test(trimmed) ||
    POSITION_REFERENCE_PATTERN.test(trimmed) ||
    hasHighCorrectAnswerOverlap(trimmed, question)
  )
}

function safeCandidate(
  value: string | null | undefined,
  question: HintableMicroCheckQuestion,
): string | null {
  const trimmed = value?.trim()
  if (!trimmed || hintLeaksAnswer(trimmed, question)) return null
  return trimmed
}

export function buildNeutralMicroCheckHint(
  _question: HintableMicroCheckQuestion,
): string {
  return DEFAULT_NEUTRAL_HINT
}

export function resolveMicroCheckHint(
  question: HintableMicroCheckQuestion,
  registry: MicroCheckHintRegistry = {},
  explanationHintBuilder?: MicroCheckExplanationHintBuilder,
): ResolvedMicroCheckHint {
  const questionHint = safeCandidate(
    registry.questionHints?.[question.id],
    question,
  )
  if (questionHint) {
    return { text: questionHint, source: 'question' }
  }

  const conceptHint = safeCandidate(
    registry.conceptHints?.[question.conceptFamilyId],
    question,
  )
  if (conceptHint) {
    return { text: conceptHint, source: 'concept' }
  }

  if (explanationHintBuilder) {
    const explanationHint = safeCandidate(
      explanationHintBuilder(question),
      question,
    )
    if (explanationHint) {
      return { text: explanationHint, source: 'explanation' }
    }
  }

  return {
    text: buildNeutralMicroCheckHint(question),
    source: 'neutral',
  }
}

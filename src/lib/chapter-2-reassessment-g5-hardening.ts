import type { QuizQuestion } from '@/types'

const DISTRACTOR_EXTENSIONS = [
  ' and use that as the standard response in similar situations.',
  ' while keeping the rest of the current routine and expectations unchanged.',
  ' and treat that decision as the main priority before making any other adjustment.',
  ' because consistency with that approach would remain the main priority.',
] as const

/**
 * G5 adversarial hardening: make at least one distractor as detailed as the
 * correct option so answer length cannot become a reliable shortcut.
 * The core distractor claim is unchanged; only a neutral rationale is added.
 */
export function hardenChapter2G5Question(question: QuizQuestion): QuizQuestion {
  const keys = ['a', 'b', 'c', 'd'] as const
  const correctKey = question.correct_answer as (typeof keys)[number]
  const get = (key: (typeof keys)[number]) => question[`answer_${key}`] as string
  const correctLength = get(correctKey).length

  const distractors = keys
    .filter((key) => key !== correctKey)
    .sort((a, b) => get(b).length - get(a).length)

  const targetKey = distractors[0]
  if (!targetKey || get(targetKey).length >= correctLength) return question

  let text = get(targetKey)
  let extensionIndex = Number(question.id.split('-').at(-1) ?? 0) % DISTRACTOR_EXTENSIONS.length
  while (text.length < correctLength) {
    text += DISTRACTOR_EXTENSIONS[extensionIndex]
    extensionIndex = (extensionIndex + 1) % DISTRACTOR_EXTENSIONS.length
  }

  return {
    ...question,
    [`answer_${targetKey}`]: text,
  }
}

import { describe, expect, it } from 'vitest'
import { chapter13PremiumContent } from '../chapter-13-premium'
import {
  chapter13ContentConceptMappings,
  chapter13FlashcardConceptMappings,
  chapter13QuizQuestionConceptMappings,
} from './mappings'
import { chapter13ConceptFamilies, chapter13LearningObjectives } from './concepts'

function collectIds(value: unknown, ids: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) collectIds(item, ids)
    return ids
  }
  if (!value || typeof value !== 'object') return ids
  const record = value as Record<string, unknown>
  if (typeof record.id === 'string') ids.push(record.id)
  for (const child of Object.values(record)) collectIds(child, ids)
  return ids
}

const serializedLesson = JSON.stringify(chapter13PremiumContent)

const SOURCE_PROXIMATE_PHRASES = [
  'When performed correctly, a full facial shave',
  'Shaving is one of the basic services performed in the barbershop',
  'Curly facial hair requires special care because it grows in a looped direction',
  'There are 14 shaving areas of the face to be shaved',
  'The term used to describe the correct angle of cutting with a razor',
  'The shave procedure begins with the barber standing at the client',
  'The three main steps of a standard professional shave are preparation, shaving, and finishing',
  'These terms have remained consistent for decades',
  'Care, artistry, and sensitivity to the client',
  'The correct shaping or design of the beard can emphasize pleasant facial features',
  'Some states prohibit the use of conventional straight razors',
] as const

describe('C13-2 source-grounded lesson hardening', () => {
  it('preserves the C13-1 lesson identity and canonical mapping coverage', () => {
    const authoredIds = collectIds(chapter13PremiumContent.sections)
    expect(authoredIds).toHaveLength(42)
    expect(new Set(authoredIds).size).toBe(42)
    expect(chapter13ContentConceptMappings).toHaveLength(42)
    expect(new Set(chapter13ContentConceptMappings.map((mapping) => mapping.contentBlockId))).toEqual(
      new Set(authoredIds),
    )

    // C13-2 is lesson-only: flashcard and assessment mapping inventory stays frozen.
    expect(chapter13FlashcardConceptMappings).toHaveLength(90)
    expect(chapter13QuizQuestionConceptMappings).toHaveLength(45)
  })

  it('records the direct Milady Chapter 13 lesson source boundary without claiming later-bank certification', () => {
    for (const objective of chapter13LearningObjectives) {
      expect(objective.sourceBasis).toContain('Milady Standard Barbering Chapter 13')
      expect(objective.sourceBasis).toContain('338–354')
      expect(objective.sourceBasis).toContain('flashcards and assessment remain pending')
    }
    expect(chapter13ConceptFamilies).toHaveLength(8)
  })

  it('does not retain the source-proximate prose identified during the page-by-page review', () => {
    for (const phrase of SOURCE_PROXIMATE_PHRASES) {
      expect(serializedLesson).not.toContain(phrase)
    }
  })

  it('keeps medical-condition language inside barbering scope', () => {
    expect(serializedLesson).toContain('rather than diagnose a medical condition')
    expect(serializedLesson).toContain('barbers should not diagnose these conditions')
    expect(serializedLesson).not.toContain('if left untreated')
    expect(serializedLesson).not.toContain('initiate a keloid condition')
  })

  it('treats jurisdictional shaving rules as variable rather than universal law', () => {
    expect(serializedLesson).toContain('vary by jurisdiction')
    expect(serializedLesson).toContain('rather than a universal legal rule')
    expect(serializedLesson).toContain('current requirements of the applicable state board')
  })

  it('keeps close-shave risk language cautious and source-aligned', () => {
    expect(serializedLesson).toContain('can increase irritation and ingrown-hair risk')
    expect(serializedLesson).not.toContain('lead to infection or ingrown hairs')
  })

  it('preserves source-supported core procedure concepts in original ASCYN wording', () => {
    expect(serializedLesson).toContain('14 training areas')
    expect(serializedLesson).toContain('prepare the client and beard')
    expect(serializedLesson).toContain('freehand, backhand, and reverse-freehand')
    expect(serializedLesson).toContain('approved sharps container')
    expect(serializedLesson).toContain('standard precautions')
  })

  it('does not add unsupported board-exam certainty or guarantees', () => {
    expect(serializedLesson.toLowerCase()).not.toContain('guaranteed to pass')
    expect(serializedLesson.toLowerCase()).not.toContain('will be on the state board exam')
    expect(serializedLesson.toLowerCase()).not.toContain('required on every licensing exam')
  })
})

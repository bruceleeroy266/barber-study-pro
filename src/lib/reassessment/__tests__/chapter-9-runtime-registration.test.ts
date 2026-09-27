import { beforeEach, describe, expect, it } from 'vitest'
import {
  getCanonicalMappingProvider,
  getConceptDetectionProvider,
  hasCanonicalMappingProvider,
  initializeChapterDetectionProvider,
  resetDetectionProviderRegistry,
  resetMappingProviderRegistry,
} from '../provider-registry'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getKnowledgeCheckLength } from '@/lib/remediation/knowledge-check'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import type { QuizAttempt } from '@/types'

describe('G3 Chapter 9 shared runtime registration', () => {
  beforeEach(() => {
    resetMappingProviderRegistry()
    resetDetectionProviderRegistry()
  })

  it('registers Chapter 9 canonical mapping and exposes only reserve questions for reassessment', () => {
    expect(hasCanonicalMappingProvider('ch-9')).toBe(true)

    const provider = getCanonicalMappingProvider('ch-9')
    expect(provider.getConceptForQuestion('q9-013')).toBe('ch9-primary-lesions')
    expect(provider.getConceptForQuestion('r9-primary-001')).toBe('ch9-primary-lesions')

    const reserve = provider.getQuestionsForConcept('ch9-primary-lesions')
    expect(reserve).toHaveLength(5)
    expect(reserve.every((id) => id.startsWith('r9-primary-'))).toBe(true)
    expect(reserve).not.toContain('q9-013')
  })

  it('registers Chapter 9 in the shared remediation content provider', () => {
    const provider = getChapterContentProvider('ch-9')
    expect(provider).toBeDefined()
    expect(provider?.getConceptName('ch9-primary-lesions')).toBe('Primary Skin Lesions')
    expect(provider?.filterFlashcardsByConcept('ch9-primary-lesions').length).toBeGreaterThan(0)
    expect(provider?.getQuizQuestionById('r9-primary-001')?.correct_answer).toBe('a')
  })

  it('enables Chapter 9 initial-quiz detection/remediation handoff', () => {
    expect(isConceptDetectionSupported('ch-9')).toBe(true)
    const provider = getChapterDetectionProvider('ch-9')
    expect(provider).toBeDefined()
    expect(provider?.getConceptName('ch9-primary-lesions')).toBe('Primary Skin Lesions')
    expect(provider?.buildAssignmentsForConcept('ch9-primary-lesions').length).toBeGreaterThan(0)
  })

  it('uses the shared five-question reassessment sequence for Chapter 9', () => {
    expect(getKnowledgeCheckLength('ch-9')).toBe(5)
  })

  it('initializes Chapter 9 concept detection through the shared provider registry', async () => {
    const attempts = [
      {
        id: 'attempt-1',
        user_id: 'student-1',
        quiz_id: 'quiz-9',
        score: 0,
        total_questions: 2,
        percentage: 0,
        answers_json: {
          'r9-primary-001': 'b',
          'r9-primary-002': 'b',
        },
        completed_at: '2026-09-27T12:00:00.000Z',
        is_reassessment: true,
        target_concept_id: 'ch9-primary-lesions',
      },
      {
        id: 'attempt-2',
        user_id: 'student-1',
        quiz_id: 'quiz-9',
        score: 0,
        total_questions: 1,
        percentage: 0,
        answers_json: {
          'r9-primary-003': 'a',
        },
        completed_at: '2026-09-27T12:01:00.000Z',
        is_reassessment: true,
        target_concept_id: 'ch9-primary-lesions',
      },
    ] as QuizAttempt[]

    const provider = initializeChapterDetectionProvider('ch-9', {
      fetchQuizAttempts: async () => attempts,
    })

    expect(provider).toBeDefined()
    expect(getConceptDetectionProvider('ch-9')).toBe(provider)

    const result = await provider?.detectConceptState('ch9-primary-lesions', ['attempt-1', 'attempt-2'])
    expect(result).not.toBeNull()
    expect(result?.conceptId).toBe('ch9-primary-lesions')
    expect(result?.evidence.totalObservations).toBe(3)
    expect(result?.evidence.misses).toBeGreaterThanOrEqual(2)
  })
})

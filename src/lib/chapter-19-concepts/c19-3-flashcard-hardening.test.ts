import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter19PremiumContent } from '../chapter-19-premium-content'
import { chapter19PremiumFlashcards } from '../chapter-19-premium-flashcards'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import {
  ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS,
  CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter19FlashcardConceptMappings,
  chapter19LessonSectionConceptMappings,
  chapter19QuizQuestionConceptMappings,
} from './mappings'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const source = readFileSync(
  join(process.cwd(), 'src/lib/chapter-19-premium-flashcards.ts'),
  'utf8',
)

const expectedFlashcardIds = Array.from(
  { length: 60 },
  (_, index) => `fc-ch19-${String(index + 1).padStart(3, '0')}`,
)

const expectedStandardIds = Array.from(
  { length: 60 },
  (_, index) => `CH19-F${String(index + 1).padStart(3, '0')}`,
)

const expectedQuizIds = Array.from(
  { length: 15 },
  (_, index) => `qq-19-${String(index + 1).padStart(2, '0')}`,
)

describe('C19-3 flashcard hardening and concept certification', () => {
  it('preserves the C19-1/C19-2 architecture and exact 60/15 inventories', () => {
    expect(chapter19PremiumContent.sections).toHaveLength(1)
    expect(chapter19PremiumContent.sections[0]?.id).toBe('chapter-19-lesson')
    expect(chapter19LessonSectionConceptMappings).toHaveLength(8)

    expect(chapter19PremiumFlashcards).toHaveLength(60)
    expect(chapter19PremiumFlashcards.map((card) => card.id)).toEqual(expectedFlashcardIds)
    expect(chapter19PremiumFlashcards.map((card) => card.standardId)).toEqual(expectedStandardIds)
    expect(chapter19PremiumFlashcards.map((card) => card.order_index)).toEqual(
      Array.from({ length: 60 }, (_, index) => index + 1),
    )
    expect(chapter19PremiumFlashcards.every((card) => card.chapter_id === 'ch-19')).toBe(true)
    expect(chapter19PremiumFlashcards.every((card) => card.is_active)).toBe(true)

    expect(chapter19PremiumQuizQuestions).toHaveLength(15)
    expect(chapter19PremiumQuizQuestions.map((question) => question.id)).toEqual(expectedQuizIds)
  })

  it('maps every stable flashcard ID exactly once to a valid canonical concept family', () => {
    const mappedIds = chapter19FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(mappedIds).toHaveLength(60)
    expect(new Set(mappedIds).size).toBe(60)
    expect([...mappedIds].sort()).toEqual([...expectedFlashcardIds].sort())

    for (const mapping of chapter19FlashcardConceptMappings) {
      expect(ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
    }
  })

  it('keeps all seven concept families represented in the hardened flashcard bank', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS) {
      expect(
        chapter19FlashcardConceptMappings.some(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('removes stale textbook page citations and publisher provenance from all 60 cards', () => {
    expect(source).not.toMatch(/\(p{1,2}\.\s*\d+/i)
    expect(source).not.toMatch(/Milady|Pivot Point|CIMA/i)

    for (const card of chapter19PremiumFlashcards) {
      expect(card.front).not.toMatch(/\(p{1,2}\.\s*\d+/i)
      expect(card.back).not.toMatch(/\(p{1,2}\.\s*\d+/i)
    }
  })

  it('removes universal two-exam and practical-exam assumptions', () => {
    expect(source).not.toContain('A written exam and a practical exam.')
    expect(source).not.toContain('Hands-on testing on a live model or mannequin.')
    expect(source).not.toContain(
      'Haircutting, shaving, shampooing, infection control, and sometimes blowdrying or chemical services.',
    )

    expect(source).toContain(
      'Requirements vary by jurisdiction. Verify the current written/theory and any practical or skills components',
    )
    expect(source).toContain(
      'Required procedures and safety steps vary by jurisdiction and exam provider',
    )
    expect(source).toContain(
      'the procedures, format, model or mannequin rules, timing, and scoring must be verified from official instructions',
    )
  })

  it('hardens accommodations and licensing-law cards to official-source verification', () => {
    expect(source).not.toContain(
      'Ask your instructor and contact your state licensing board well in advance.',
    )
    expect(source).toContain(
      'Verify the current request process, documentation rules, and deadlines with the authorized exam provider or licensing agency',
    )
    expect(source).toContain(
      'License types, fees, renewal, prohibited acts, and exam requirements can differ by jurisdiction and change over time',
    )
  })

  it('removes weak test-taking absolutes and universal navigation rules', () => {
    expect(source).not.toContain(
      'Words like all, none, always, and never are rarely accurate.',
    )
    expect(source).not.toContain(
      'It saves time for harder questions and builds confidence.',
    )
    expect(source).toContain(
      'Evaluate whether the content truly allows no exceptions instead of assuming the statement is automatically false',
    )
    expect(source).toContain(
      'When the testing system allows navigation',
    )
    expect(source).toContain(
      'return later only if the testing system and instructions allow it',
    )
  })

  it('removes unsupported résumé timing and application-material formulas', () => {
    expect(source).not.toContain('About 20 seconds.')
    expect(source).not.toContain(
      'Contact information, education, skills, accomplishments, references, and a cover letter.',
    )
    expect(source).toContain(
      'Employers may review application materials quickly',
    )
    expect(source).toContain(
      'current credentials actually earned',
    )
  })

  it('removes arbitrary job-search and interview timing formulas', () => {
    expect(source).not.toContain('About one week later.')
    expect(source).not.toContain('About two minutes or less')
    expect(source).not.toContain('You may be invited back for a second interview.')
    expect(source).toContain(
      'Follow the employer\'s stated instructions',
    )
    expect(source).toContain(
      'there is no universal time limit for every answer',
    )
  })

  it('hardens legal, work-authorization, and contract cards without claiming universal law', () => {
    expect(source).not.toContain(
      'Age, medical history, U.S. citizenship, native language, marital status, or children.',
    )
    expect(source).not.toContain(
      '\"Are you authorized to work in the United States?\"',
    )
    expect(source).toContain(
      'Interview-question rules and protected categories can vary by jurisdiction and situation',
    )
    expect(source).toContain(
      'exact wording and legal boundaries depend on applicable law and hiring procedures',
    )
    expect(source).toContain(
      'its meaning and enforceability depend on the wording and applicable law',
    )
  })

  it('preserves safety/compliance separation and the shared grading contract', () => {
    expect(CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-practical-exam-safety-readiness',
    ])
    expect(CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-licensing-requirements-verification',
      'ch19-employment-law-contracts-compliance',
    ])
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('preserves all 15 assessment mappings without rewriting the assessment bank in C19-3', () => {
    const mappedIds = chapter19QuizQuestionConceptMappings.map(
      (mapping) => mapping.questionId,
    )
    expect(mappedIds).toHaveLength(15)
    expect(new Set(mappedIds).size).toBe(15)
    expect([...mappedIds].sort()).toEqual([...expectedQuizIds].sort())
  })
})

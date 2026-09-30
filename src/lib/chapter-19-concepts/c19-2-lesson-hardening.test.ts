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
  chapter19ContentConceptMappings,
  chapter19FlashcardConceptMappings,
  chapter19LessonSectionConceptMappings,
  chapter19QuizQuestionConceptMappings,
} from './mappings'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const source = readFileSync(
  join(process.cwd(), 'src/lib/chapter-19-premium-content.ts'),
  'utf8',
)

describe('C19-2 lesson hardening certification', () => {
  it('preserves the C19-1 architecture and inventories', () => {
    expect(chapter19PremiumContent.sections).toHaveLength(1)
    expect(chapter19PremiumContent.sections[0]?.id).toBe('chapter-19-lesson')
    expect(chapter19PremiumFlashcards).toHaveLength(60)
    expect(chapter19PremiumQuizQuestions).toHaveLength(15)
    expect(ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS).toHaveLength(7)
    expect(chapter19LessonSectionConceptMappings).toHaveLength(8)
    expect(chapter19ContentConceptMappings).toHaveLength(1)
    expect(chapter19FlashcardConceptMappings).toHaveLength(60)
    expect(chapter19QuizQuestionConceptMappings).toHaveLength(15)
  })

  it('keeps every canonical concept durably represented in the semantic lesson map', () => {
    const lessonConcepts = new Set(
      chapter19LessonSectionConceptMappings.flatMap(
        (mapping) => mapping.conceptFamilyIds,
      ),
    )
    for (const conceptId of ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS) {
      expect(lessonConcepts.has(conceptId), conceptId).toBe(true)
    }
  })

  it('hardens licensing claims to current jurisdiction-specific official-source verification', () => {
    expect(source).not.toContain(
      'Before scheduling an examination or beginning paid professional work',
    )
    expect(source).toContain(
      'before performing any service that the jurisdiction requires a license to perform',
    )
    expect(source).toContain(
      'Requirements can differ by jurisdiction and can change',
    )
    expect(source).toContain(
      'applicable official licensing agency and authorized examination provider',
    )
    expect(source).toContain(
      'verify the current request process, documentation rules, and deadlines',
    )
  })

  it('hardens practical-exam wording without inventing universal format or kit rules', () => {
    expect(source).not.toContain(
      'use the official candidate guide as the source of truth',
    )
    expect(source).not.toContain(
      'Practice with the same type of kit or supplies allowed by the testing provider',
    )
    expect(source).toContain(
      'Do not assume that another jurisdiction’s procedure list, timing, kit, scoring, or sequence applies',
    )
    expect(source).toContain(
      'Verify the permitted or required kit, supplies, labeling, and setup rules',
    )
    expect(source).toContain(
      'infection-control, client-protection, tool-handling, or other safety steps',
    )
  })

  it('hardens employment-readiness and credential wording', () => {
    expect(source).not.toContain('Employment readiness begins before graduation')
    expect(source).toContain('Employment readiness can begin before graduation')
    expect(source).toContain('current licenses or credentials only when actually earned')
    expect(source).toContain('identify areas still developing')
  })

  it('does not present worker classification or compensation labels as legal conclusions', () => {
    expect(source).not.toContain(
      'employee-based, commission-based, booth rental, or another lawful arrangement',
    )
    expect(source).toContain(
      'labels such as employee, commission, or booth rental do not by themselves resolve tax, wage, benefit, or worker-classification questions',
    )
    expect(source).toContain(
      'Confirm important terms directly rather than assuming that public information is complete',
    )
  })

  it('narrows interview-law claims and keeps them outside urgent safety', () => {
    expect(source).not.toContain(
      'Questions about protected characteristics may be restricted or inappropriate',
    )
    expect(source).toContain(
      'Interview-question rules and protected categories can vary by jurisdiction and situation',
    )
    expect(source).toContain(
      'Do not treat a generic list of “legal” or “illegal” questions as universal law',
    )
    expect(CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-practical-exam-safety-readiness',
    ])
    expect(CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-licensing-requirements-verification',
      'ch19-employment-law-contracts-compliance',
    ])
  })

  it('narrows agreement and noncompete language to wording plus applicable-law review', () => {
    expect(source).toContain(
      'whose meaning and enforceability depend on the wording and applicable law',
    )
    expect(source).toContain(
      'do not assume that a provision is valid or invalid everywhere',
    )
    expect(source).toContain(
      'seek qualified legal advice before agreeing',
    )
  })

  it('preserves ASCYN independence and avoids publisher/textbook provenance in the lesson', () => {
    expect(source).toContain('independent supplemental learning platform')
    expect(source).toContain('written in original ASCYN PRO language')
    expect(source).not.toMatch(/Milady|Pivot Point|CIMA/i)
    expect(source).not.toMatch(/Textbook Pages|\bpp\.\s*\d+/i)
    expect(source).toContain(
      'It does not establish licensing requirements, examination rules, worker classification, contract enforceability, or employment-law rights for any jurisdiction',
    )
  })

  it('preserves the shared 20/10/40/15/15 grading contract', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})

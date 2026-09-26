import { describe, expect, it } from 'vitest'
import { CHAPTER7_GRADE_WEIGHTS } from './grading'
import {
  buildChapter7MicroCheckEvidence,
  chapter7MicroChecks,
  scoreChapter7MicroChecks,
  validateChapter7MicroCheckPlacements,
} from './micro-checks'
import { CHAPTER7_CONCEPT_FAMILY_IDS } from './concepts'

describe('Chapter 7 micro-check implementation', () => {
  it('implements all 10 planned placements with the planned question counts', () => {
    expect(chapter7MicroChecks).toHaveLength(10)
    expect(validateChapter7MicroCheckPlacements()).toBe(true)
    expect(chapter7MicroChecks.reduce((sum, check) => sum + check.questions.length, 0)).toBe(23)
  })

  it('gives every concept family exactly one micro-check', () => {
    const concepts = chapter7MicroChecks.map((check) => check.conceptFamilyId).sort()
    expect(concepts).toEqual([...CHAPTER7_CONCEPT_FAMILY_IDS].sort())
  })

  it('keeps micro-check grading below the chapter assessment weight', () => {
    expect(CHAPTER7_GRADE_WEIGHTS.micro_check).toBe(0.20)
    expect(CHAPTER7_GRADE_WEIGHTS.chapter_assessment).toBe(0.40)
    expect(CHAPTER7_GRADE_WEIGHTS.micro_check).toBeLessThan(CHAPTER7_GRADE_WEIGHTS.chapter_assessment)
  })

  it('scores unique valid responses deterministically', () => {
    const responses = [
      { questionId: 'mcq-7-001' as const, selectedAnswer: 'a' as const },
      { questionId: 'mcq-7-002' as const, selectedAnswer: 'b' as const },
      { questionId: 'mcq-7-001' as const, selectedAnswer: 'a' as const },
    ]
    expect(scoreChapter7MicroChecks(responses)).toEqual({ correct: 1, total: 2, percent: 50 })
  })

  it('converts responses into micro_check concept evidence without double counting', () => {
    const records = buildChapter7MicroCheckEvidence(
      'student-1',
      [
        { questionId: 'mcq-7-001', selectedAnswer: 'a' },
        { questionId: 'mcq-7-001', selectedAnswer: 'a' },
        { questionId: 'mcq-7-007', selectedAnswer: 'b' },
      ],
      '2026-09-25T12:00:00.000Z',
    )
    expect(records).toHaveLength(2)
    expect(records[0]).toMatchObject({
      source: 'micro_check',
      conceptFamilyId: 'ch7-organic-inorganic',
      correct: true,
      attemptPhase: 'initial',
    })
    expect(records[1]).toMatchObject({
      source: 'micro_check',
      conceptFamilyId: 'ch7-redox-reactions',
      correct: false,
    })
  })

  it('uses understanding/application/scenario evidence rather than recall-only items', () => {
    const difficulties = chapter7MicroChecks.flatMap((check) => check.questions.map((q) => q.difficulty))
    expect(difficulties).not.toContain('recall')
    expect(difficulties.filter((d) => d === 'application' || d === 'scenario').length).toBeGreaterThanOrEqual(15)
  })
})

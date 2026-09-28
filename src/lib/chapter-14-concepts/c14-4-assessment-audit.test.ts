import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter14PremiumQuizQuestions } from '../chapter-14-premium-quiz'
import { chapter14QuizQuestionConceptMappings } from './mappings'

const root = process.cwd()
const assessmentSource = readFileSync(join(root, 'src/lib/chapter-14-premium-quiz.ts'), 'utf8')

describe('C14-4 70-question assessment audit and repair', () => {
  it('retains all 70 stable unique assessment IDs', () => {
    expect(chapter14PremiumQuizQuestions).toHaveLength(70)
    const ids = chapter14PremiumQuizQuestions.map((question) => question.id)
    expect(new Set(ids).size).toBe(70)
    expect(ids[0]).toBe('qq-14-001')
    expect(ids[69]).toBe('qq-14-070')
  })

  it('maps every assessment item exactly once to the canonical C14 concept model', () => {
    const ids = chapter14PremiumQuizQuestions.map((question) => question.id)
    const mappedIds = chapter14QuizQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(mappedIds).toHaveLength(70)
    expect(new Set(mappedIds).size).toBe(70)
    expect([...mappedIds].sort()).toEqual([...ids].sort())
  })

  it('eliminates the A-only answer-key defect with a controlled distribution', () => {
    const counts = chapter14PremiumQuizQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.correct_answer] = (acc[question.correct_answer] ?? 0) + 1
      return acc
    }, {})

    expect(counts).toEqual({ a: 18, b: 18, c: 17, d: 17 })
  })

  it('keeps every keyed answer structurally valid and every explanation present', () => {
    for (const question of chapter14PremiumQuizQuestions) {
      expect(['a', 'b', 'c', 'd']).toContain(question.correct_answer)

      const answer = question[
        `answer_${question.correct_answer}` as 'answer_a' | 'answer_b' | 'answer_c' | 'answer_d'
      ]

      expect(answer, question.id).toBeTruthy()
      expect(question.explanation?.trim().length, question.id).toBeGreaterThan(10)
    }
  })

  it('removes the source-sensitive absolutes already rejected by C14 lesson/flashcard hardening', () => {
    expect(assessmentSource).not.toContain('typically NOT acceptable for state board practical exams')
    expect(assessmentSource).not.toContain('State board exams typically require demonstrating true freehand clipper control')
    expect(assessmentSource).not.toContain('The hair locking process takes 6 to 12 months to fully complete')
    expect(assessmentSource).not.toContain('Only non-petroleum-based oils should be used')
    expect(assessmentSource).not.toContain('no more than ¼ inch')
    expect(assessmentSource).not.toContain('1–2 inches distributed around the head form')
    expect(assessmentSource).not.toContain('Never cut into or above the natural hairline')
  })

  it('requires jurisdiction/provider verification instead of a universal licensing-exam rule', () => {
    expect(assessmentSource).toContain('Practical-exam requirements vary by jurisdiction and testing provider')
    expect(assessmentSource).toContain('current candidate bulletin and instructor guidance')
  })

  it('preserves the existing assessment difficulty inventory for later evidence calibration', () => {
    const counts = chapter14PremiumQuizQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1
      return acc
    }, {})

    expect(counts).toEqual({ hard: 7, easy: 40, medium: 23 })
  })
})

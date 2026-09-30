import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter16PremiumQuizQuestions } from '../chapter-16-premium-quiz'
import { chapter16QuizQuestionConceptMappings } from './mappings'
import { CHAPTER16_GRADE_WEIGHTS } from './grading'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const root = process.cwd()
const source = readFileSync(join(root, 'src/lib/chapter-16-premium-quiz.ts'), 'utf8')

const expectedAnswerKeys = [
  'b','b','b','c','b','c','c','b','b','b',
  'b','b','b','a','c','c','b','b','b','b',
  'b','b','c','b','a','b','c','b','b','b',
] as const

describe('C16-4 30-question assessment audit and hardening', () => {
  it('preserves all 30 stable question ids in order', () => {
    const ids = chapter16PremiumQuizQuestions.map((question) => question.id)
    expect(ids).toHaveLength(30)
    expect(ids).toEqual(
      Array.from({ length: 30 }, (_, index) => `qq-16-${String(index + 1).padStart(3, '0')}`),
    )
    expect(new Set(ids).size).toBe(30)
  })

  it('preserves the complete certified answer-key vector', () => {
    expect(chapter16PremiumQuizQuestions.map((question) => question.correct_answer)).toEqual(
      expectedAnswerKeys,
    )
  })

  it('preserves all 30 concept mappings and shared grading', () => {
    expect(chapter16QuizQuestionConceptMappings).toHaveLength(30)
    expect(CHAPTER16_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
  })

  it('removes source-risk absolutes narrowed by C16-2 and C16-3', () => {
    expect(source).not.toContain('coarse hair always requires graduation')
    expect(source).not.toContain('On which hair types is razor cutting generally inappropriate?')
    expect(source).not.toContain('Razor cutting is not universally safe and is inappropriate for fragile or porous hair')
    expect(source).not.toContain('Fine or damaged hair cannot tolerate high heat')
    expect(source).not.toContain('thermal tools on damp hair can cause steam damage')
    expect(source).not.toContain('Both must be assessed before choosing section sizes')
    expect(source).not.toContain('a straight-hair style cannot be copied exactly')
  })

  it('preserves condition-based razor guidance while keeping question 22 keyed to B', () => {
    const q22 = chapter16PremiumQuizQuestions.find((question) => question.id === 'qq-16-022')
    expect(q22?.correct_answer).toBe('b')
    expect(q22?.question).toContain('most caution')
    expect(q22?.explanation).toContain('Razor suitability depends on hair condition, texture, density')
  })

  it('preserves question 27 key while aligning thermal safety with the hardened lesson', () => {
    const q27 = chapter16PremiumQuizQuestions.find((question) => question.id === 'qq-16-027')
    expect(q27?.correct_answer).toBe('c')
    expect(q27?.answer_c).toContain('lowest effective heat')
    expect(q27?.explanation).toContain('tool and product directions')
    expect(q27?.explanation).toContain('designed and labeled for it')
  })

  it('preserves question 20 key while making curl behavior client-specific', () => {
    const q20 = chapter16PremiumQuizQuestions.find((question) => question.id === 'qq-16-020')
    expect(q20?.correct_answer).toBe('b')
    expect(q20?.explanation).toContain('may need adaptation')
    expect(q20?.explanation).toContain("client's curl pattern")
  })
})

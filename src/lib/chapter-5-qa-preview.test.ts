import { describe, expect, it } from 'vitest'
import { getLocalQuizQuestions } from './local-data'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const page = readFileSync(join(process.cwd(), 'src/app/instructor/qa/chapter-5-quiz/page.tsx'), 'utf8')

describe('QA-136: staff-only Chapter 5 premium quiz preview', () => {
  it('loads exactly the five corrected premium questions from canonical quiz-5', () => {
    const bank = getLocalQuizQuestions('quiz-5')
    expect(bank).toHaveLength(50)
    const expected: Record<string, string> = {
      'qq-5-002': '7-8 inches',
      'qq-5-003': 'Gradual blending in tight areas, around ears, and at necklines',
      'qq-5-023': 'Smoothing and aligning the cutting edge and polishing the blade with a strop',
      'qq-5-026': 'Concave grind has hollowed blade sides; wedge grind is not hollowed and forms an angle at the edge',
      'qq-5-030': 'Clamp the heated iron on tissue or toweling for five seconds; scorching indicates excessive heat',
    }
    for (const [id, expectedAnswer] of Object.entries(expected)) {
      const item = bank.find(q => q.id === id)
      expect(item, id).toBeDefined()
      expect(item![`answer_${item!.correct_answer}` as 'answer_a' | 'answer_b' | 'answer_c' | 'answer_d']).toBe(expectedAnswer)
    }
  })

  it('checks authenticated approved staff and school membership server-side', () => {
    expect(page).toContain("import 'server-only'")
    expect(page).toContain("supabase.auth.getUser()")
    expect(page).toContain("profile.school_id")
    expect(page).toContain("profile.is_disabled")
    expect(page).toContain("profile.approval_status !== 'approved'")
    expect(page).toContain("isInstructorOrAdmin(profile.role)")
    expect(page).toContain("redirect('/dashboard')")
  })

  it('renders static answers without student attempt or submit controls', () => {
    expect(page).toContain("getLocalQuizQuestions('quiz-5')")
    expect(page).toContain('question.correct_answer')
    expect(page).not.toMatch(/quiz_attempts|student_progress|\.insert\(|\.update\(|\.upsert\(|Submit Answer|startQuiz\(/)
    expect(page).not.toContain("'use client'")
  })
})

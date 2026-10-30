import { describe, expect, it } from 'vitest'
import { chapter6PremiumQuizQuestions } from '@/lib/chapter-6-premium-quiz'
import { chapter7PremiumQuizQuestions } from '@/lib/chapter-7-premium-quiz'
import { chapter6QuizQuestionConceptMappings } from '@/lib/chapter-6-concepts/mappings'
import { chapter7QuizQuestionConceptMappings } from '@/lib/chapter-7-concepts/mappings'
import { calculateQuizScore } from '@/lib/quiz-scoring'
import { convertRowsToCSV } from '@/lib/export-utils'

for (const [chapter, questions, mappings] of [
  [6, chapter6PremiumQuizQuestions, chapter6QuizQuestionConceptMappings],
  [7, chapter7PremiumQuizQuestions, chapter7QuizQuestionConceptMappings],
] as const) {
  describe(`Chapter ${chapter} deterministic analytics regression`, () => {
    it('maps each of 50 unique questions to exactly one concept', () => {
      expect(questions).toHaveLength(50)
      expect(new Set(questions.map(q => q.id)).size).toBe(50)
      const counts = new Map<string, number>()
      for (const m of mappings) counts.set(m.questionId, (counts.get(m.questionId) ?? 0) + 1)
      for (const q of questions) {
        expect(['a','b','c','d']).toContain(q.correct_answer)
        expect(counts.get(q.id)).toBe(1)
      }
      expect([...counts.keys()].sort()).toEqual(questions.map(q => q.id).sort())
    })

    it('reconciles 40 correct, 10 misses, concept totals and CSV rows', () => {
      const sorted = [...questions].sort((a,b) => a.id.localeCompare(b.id))
      const missIds = new Set(sorted.slice(0,10).map(q => q.id))
      const letters = ['a','b','c','d']
      const answers: Record<string,string> = {}
      for (const q of sorted) {
        const index = letters.indexOf(q.correct_answer)
        answers[q.id] = missIds.has(q.id) ? letters[(index + 1) % 4] : q.correct_answer
      }
      const score = calculateQuizScore(sorted.map(q => ({id:q.id,correctKey:q.correct_answer})), answers)
      expect(score).toMatchObject({ score:40, total:50, percentage:80, missedCount:10 })
      const missed = sorted.filter(q => answers[q.id] !== q.correct_answer)
      expect(missed.map(q => q.id).sort()).toEqual([...missIds].sort())
      const concept = new Map<string,string>(mappings.map(m => [m.questionId,m.conceptFamilyId]))
      const missesByConcept = new Map<string,number>()
      for (const q of missed) {
        const id = concept.get(q.id)
        expect(id).toBeTruthy()
        missesByConcept.set(id!, (missesByConcept.get(id!) ?? 0) + 1)
      }
      expect([...missesByConcept.values()].reduce((a,b) => a + b, 0)).toBe(10)
      const rows = sorted.map(q => ({
        question_id:q.id,
        selected_answer:answers[q.id],
        correct_answer:q.correct_answer,
        is_correct:String(answers[q.id] === q.correct_answer),
        concept_id:concept.get(q.id)!,
      }))
      const csv = convertRowsToCSV(rows)
      expect(csv).toContain('question_id')
      for (const row of rows) expect(csv).toContain(row.question_id)
      expect(rows.filter(row => row.is_correct === 'false')).toHaveLength(10)
    })
  })
}

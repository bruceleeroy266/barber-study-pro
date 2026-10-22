import { describe, expect, it } from 'vitest'
import { calculateQuizScore } from '@/lib/quiz-scoring'
import { calculateChapterProgress } from '@/lib/progress'
import { buildLiveInstructorChapterGrade } from '@/lib/concept-mastery/live-instructor-grade'
import { calculateSharedConceptMastery } from '@/lib/concept-mastery/shared-grading'

const questions = Array.from({ length: 20 }, (_, index) => ({
  id: `q-${index + 1}`,
  correctKey: 'b',
}))

const answersFor = (correctCount: number) =>
  Object.fromEntries(questions.map((question, index) => [
    question.id,
    index < correctCount ? 'b' : 'a',
  ]))

describe('QUIZ-GRADING-QA-4 completion versus performance regression', () => {
  it.each([
    [0, 0],
    [12, 60],
    [16, 80],
    [20, 100],
  ])('scores %i/20 correct as %i%% regardless of completion', (correct, expected) => {
    const attempt = calculateQuizScore(questions, answersFor(correct))
    expect(attempt.total).toBe(20)
    expect(attempt.score).toBe(correct)
    expect(attempt.percentage).toBe(expected)
    expect(attempt.missedCount).toBe(20 - correct)
  })

  it('a fully completed chapter does not convert a 60% assessment into a 100% academic grade', () => {
    const completion = calculateChapterProgress(true, true, {
      lessonCompleted: true,
      knowledgeChecksCompleted: true,
    })
    const quiz = calculateQuizScore(questions, answersFor(12))
    const instructor = buildLiveInstructorChapterGrade({
      chapterId: 'ch-1',
      microCheckPercent: null,
      chapterAssessmentPercent: quiz.percentage,
      remediationReassessmentPercent: null,
      activityRows: [],
    })
    expect(completion).toBe(100)
    expect(quiz.percentage).toBe(60)
    expect(instructor.grade.finalGrade).toBeLessThanOrEqual(60)
    expect(instructor.grade.finalGrade).toBeLessThan(100)
    expect(instructor.evidenceComplete).toBe(false)
  })

  it('one correct question does not establish reliable concept mastery', () => {
    const result = calculateSharedConceptMastery([{
      source: 'chapter_assessment',
      itemId: 'q-1',
      difficulty: 'recall',
      correct: true,
      attemptPhase: 'initial',
      timestamp: '2026-10-21T12:00:00Z',
    }], '2026-10-21T12:01:00Z')
    expect(result.mastery).toBe(100)
    expect(result.confidence).toBe('insufficient_evidence')
    expect(result.observationCount).toBe(1)
  })
})

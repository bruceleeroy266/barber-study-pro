import { describe, expect, it } from 'vitest'
import { generateStudyPlan } from '@/lib/recommendations/study-plan'
import type { BoardReadiness, Chapter, QuizAttempt, StudentProgress } from '@/types'
import { localChapters } from '@/lib/local-data'

const readiness: BoardReadiness = {
  userId: 'qa', score: 50, level: 'At Risk', quizAverage: 60,
  quizCompletionRate: 5, chapterCompletionRate: 0, flashcardEngagementRate: 0,
  consistencyScore: 0, improvementTrend: 'stable', totalQuestionsAnswered: 30,
  chaptersCompleted: 0, totalChapters: 21, recommendedStudyMinutes: 60,
  updatedAt: '2026-10-11T00:00:00.000Z',
}
const chapters = localChapters.filter((ch) => ch.chapter_number === 2) as Chapter[]
const chapter2 = chapters.find((ch) => ch.chapter_number === 2)!
const progress = (score: number | null, percentage = 50): StudentProgress => ({
  id: 'progress-2', user_id: 'qa', chapter_id: chapter2.id, flashcards_completed: false,
  quiz_completed: score !== null && score >= 80, best_quiz_score: score,
  progress_percentage: percentage, last_studied_at: null,
})
const attempt = (score: number): QuizAttempt => ({
  id: 'attempt-2', user_id: 'qa', quiz_id: 'quiz-2', score,
  total_questions: 100, percentage: score, answers_json: {},
  completed_at: '2026-10-11T00:00:00.000Z',
})
function plan(p: StudentProgress[], attempts: QuizAttempt[]) {
  return generateStudyPlan({
    userId: 'qa', readiness, weakAreas: [{
      id: 'chapter-2', name: 'Ch.2 Life Skills', chapterNumber: 2, category: 'Life Skills',
      score: 50, attempts: 1, trend: 'stable', lastAttemptAt: null,
    }], strongAreas: [], missedQuestions: [], totalChapters: 21,
    chapterProgress: p, quizAttempts: attempts, chapters, hasEvidence: true,
  })
}
describe('TLS-RECOMMENDATION-1A chapter-pass-aware guidance', () => {
  it('targets a real chapter quiz for practice without changing progress evidence', () => {
    const savedProgress = progress(45)
    const savedAttempt = attempt(45)
    const beforeProgress = JSON.stringify(savedProgress)
    const beforeAttempt = JSON.stringify(savedAttempt)
    const results = plan([savedProgress], [savedAttempt])
    expect(results.find((r) => r.type === 'practice')?.chapterNumber).toBe(2)
    expect(JSON.stringify(savedProgress)).toBe(beforeProgress)
    expect(JSON.stringify(savedAttempt)).toBe(beforeAttempt)
  })
  it('does not offer a dead-end practice quiz when no chapter quiz is available', () => {
    const results = generateStudyPlan({
      userId: 'qa', readiness, weakAreas: [], strongAreas: [], missedQuestions: [],
      totalChapters: 0, chapters: [], hasEvidence: true,
    })
    expect(results.some((r) => r.type === 'practice')).toBe(false)
  })
  it('does not mark a passed but incomplete chapter critical', () => {
    const results = plan([progress(88)], [attempt(88)])
    const chapter2Study = results.find((r) => r.type === 'study' && r.chapterNumber === 2)
    expect(chapter2Study?.priority).toBe('medium')
    expect(chapter2Study?.description).toMatch(/quiz is passed/i)
    expect(results.some((r) => r.title.includes('Flashcard Review: Ch.2'))).toBe(false)
  })
  it('does not recommend a completely finished and passed chapter for study', () => {
    const results = plan([progress(90, 100)], [attempt(90)])
    expect(results.some((r) => r.type === 'study' && r.chapterNumber === 2)).toBe(false)
  })
  it('preserves priority for genuine failed assessment evidence', () => {
    const results = plan([progress(45)], [attempt(45)])
    expect(results.find((r) => r.type === 'study' && r.chapterNumber === 2)?.priority).toBe('critical')
  })
  it('treats no quiz result as incomplete work, not a confirmed critical failure', () => {
    const results = plan([progress(null)], [])
    expect(results.find((r) => r.type === 'study' && r.chapterNumber === 2)?.priority).toBe('high')
  })
  it('does not let overall readiness alone make a passing chapter critical', () => {
    const results = plan([progress(80)], [attempt(80)])
    expect(results.find((r) => r.type === 'study' && r.chapterNumber === 2)?.priority).not.toBe('critical')
  })
})

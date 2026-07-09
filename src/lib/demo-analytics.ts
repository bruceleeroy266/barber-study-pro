/**
 * DEMO ANALYTICS DATA
 * ASCYN PRO / ASCYN PRO V2
 *
 * Realistic analytics for demo mode when Supabase tables are empty.
 */

import { MissedQuestion, StudentProgress } from '@/types'
import { demoStudents } from './demo-data'
import { allQuizQuestions } from './quiz-data'

export function generateDemoMissedQuestions(userId: string): MissedQuestion[] {
  const seedMap: Record<string, { chapter: number; count: number }[]> = {
    'demo-student-1': [
      { chapter: 4, count: 2 },
      { chapter: 6, count: 1 },
      { chapter: 9, count: 1 },
    ],
    'demo-student-2': [
      { chapter: 4, count: 3 },
      { chapter: 7, count: 2 },
      { chapter: 2, count: 1 },
    ],
    'demo-student-3': [
      { chapter: 4, count: 4 },
      { chapter: 1, count: 2 },
      { chapter: 6, count: 2 },
      { chapter: 17, count: 1 },
    ],
    'demo-student-4': [
      { chapter: 1, count: 3 },
      { chapter: 4, count: 2 },
    ],
  }

  const seeds = seedMap[userId] || [{ chapter: 4, count: 2 }]
  const missed: MissedQuestion[] = []

  const categories: Record<number, string> = {
    1: 'History & Professionalism',
    2: 'Life Skills',
    3: 'Professional Image',
    4: 'Infection Control',
    5: 'Tools & Equipment',
    6: 'Anatomy & Physiology',
    7: 'Chemistry',
    8: 'Electricity',
    9: 'Skin',
    10: 'Hair & Scalp',
    11: 'Hair Treatments',
    12: 'Facial Massage',
    13: 'Shaving',
    14: 'Haircutting',
    15: 'Hair Replacement',
    16: 'State Board Prep',
    17: 'Barbershop Management',
    18: 'Advanced Cutting',
    19: 'Hair Replacement Systems',
    20: 'Color Theory',
    21: 'Final Exam Prep',
  }

  for (const seed of seeds) {
    const questions = allQuizQuestions[`quiz-${seed.chapter}`] || []
    for (let i = 0; i < Math.min(seed.count, questions.length); i++) {
      const q = questions[i]
      const wrongOptions = ['a', 'b', 'c', 'd'].filter((k) => k !== q.correct_answer)
      const wrongKey = wrongOptions[i % wrongOptions.length]

      const correctText =
        q.correct_answer === 'a'
          ? q.answer_a
          : q.correct_answer === 'b'
          ? q.answer_b
          : q.correct_answer === 'c'
          ? q.answer_c
          : q.answer_d

      const wrongText =
        wrongKey === 'a'
          ? q.answer_a
          : wrongKey === 'b'
          ? q.answer_b
          : wrongKey === 'c'
          ? q.answer_c
          : q.answer_d

      missed.push({
        id: `missed-${userId}-${q.id}-${i}`,
        userId,
        questionId: q.id,
        question: q.question,
        correctAnswer: correctText,
        studentAnswer: wrongText,
        explanation: q.explanation,
        chapterId: `ch-${seed.chapter}`,
        chapterNumber: seed.chapter,
        category: categories[seed.chapter],
        quizId: `quiz-${seed.chapter}`,
        missedAt: new Date(Date.now() - i * 86400000).toISOString(),
        retakenAt: null,
        timesMissed: 1 + (i % 2),
      })
    }
  }

  return missed
}

export function getDemoMissedQuestionsForUser(userId: string): MissedQuestion[] {
  if (!demoStudents.some((s) => s.id === userId) && userId !== 'demo-user') {
    return []
  }
  return generateDemoMissedQuestions(userId)
}

export function seedDemoProgressWithFlashcards(
  progress: StudentProgress[]
): StudentProgress[] {
  return progress.map((p) => ({
    ...p,
    flashcards_completed: p.quiz_completed || p.flashcards_completed,
  }))
}

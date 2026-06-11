// Local curriculum data for real-auth mode
// Supabase handles: auth, profiles, schools, student_progress, quiz_attempts
// This file handles: chapters, flashcards, quizzes, quiz_questions

import { Chapter, Flashcard, Quiz, QuizQuestion } from '@/types'
import { demoChapters, demoFlashcards, demoQuizzes, demoQuizQuestions } from './demo-data'

// Re-export chapters as local chapters (21 total)
export const localChapters: Chapter[] = demoChapters

// Helper: get flashcards for a chapter
export function getLocalFlashcards(chapterId: string): Flashcard[] {
  return demoFlashcards[chapterId] || []
}

// Helper: get quiz metadata for a chapter
export function getLocalQuiz(chapterId: string): Quiz | null {
  return demoQuizzes[chapterId] || null
}

// Helper: get quiz questions for a quiz
export function getLocalQuizQuestions(quizId: string): QuizQuestion[] {
  return demoQuizQuestions[quizId] || []
}

// Helper: get a single chapter by number
export function getLocalChapterByNumber(chapterNumber: number): Chapter | undefined {
  return localChapters.find(ch => ch.chapter_number === chapterNumber)
}

// Helper: get chapter ID from chapter number
export function getLocalChapterId(chapterNumber: number): string {
  return `ch-${chapterNumber}`
}

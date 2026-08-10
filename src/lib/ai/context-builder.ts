/**
 * AI CONTEXT BUILDER — ASCYN PRO Phase 5
 * Builds student context objects for AI prompts
 */

import { createClient } from '@/lib/supabase-server'
import { AITutorContext } from '@/types/ai'
import { BoardReadiness, AreaPerformance, MissedQuestion, StudyRecommendation } from '@/types'
import { calculateBoardReadiness } from '@/lib/readiness'
import { analyzePerformance } from '@/lib/analytics'
import { generateStudyPlan } from '@/lib/recommendations'
import { localChapters } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'

/**
 * Build complete AI tutor context for a student
 */
export async function buildAITutorContext(
  userId: string,
  currentChapter?: number
): Promise<AITutorContext> {
  const supabase = await createClient()
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single()
  
  // Get student progress
  const { data: progressData } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', userId)
  
  // Get quiz attempts
  const { data: attemptsData } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
  
  const chapters = localChapters
  const progress = progressData || []
  const attempts = attemptsData || []
  const questions = Object.values(allQuizQuestions).flat()
  
  // Calculate readiness
  const readiness = calculateBoardReadiness({
    userId,
    attempts,
    progress,
    totalChapters: chapters.length,
    streakDays: 0, // Would calculate from study history
  })
  
  // Analyze performance
  const analytics = analyzePerformance({
    userId,
    attempts,
    progress,
    chapters,
    questions,
  })
  
  // Build missed questions
  const { buildMissedQuestions } = await import('@/lib/analytics')
  const missedQuestions = buildMissedQuestions({
    userId,
    attempts,
    progress,
    chapters,
    questions,
  })
  
  // Generate recommendations
  const recommendations = generateStudyPlan({
    userId,
    readiness,
    weakAreas: analytics.weakAreas,
    strongAreas: analytics.strongAreas,
    missedQuestions,
    totalChapters: chapters.length,
  })
  
  // Get current chapter info
  const currentChapterData = currentChapter 
    ? chapters.find(c => c.chapter_number === currentChapter)
    : null
  
  return {
    userId,
    studentName: profile?.full_name || 'Student',
    currentChapter: currentChapter || undefined,
    currentChapterTitle: currentChapterData?.title,
    readiness,
    weakAreas: analytics.weakAreas,
    strongAreas: analytics.strongAreas,
    missedQuestions,
    recentRecommendations: recommendations,
    studyStreakDays: 0, // Would calculate from study history
    lastStudyDate: attempts[0]?.completed_at || null,
  }
}

/**
 * Build lightweight context for quick responses
 */
export function buildQuickContext(
  userId: string,
  studentName: string,
  readinessScore: number,
  weakAreaNames: string[]
): Partial<AITutorContext> {
  return {
    userId,
    studentName,
    readiness: {
      userId,
      score: readinessScore,
      level: readinessScore >= 80 ? 'Ready' : readinessScore >= 60 ? 'Nearly Ready' : 'Needs Review',
      quizAverage: 0,
      quizCompletionRate: 0,
      chapterCompletionRate: 0,
      flashcardEngagementRate: 0,
      consistencyScore: 0,
      improvementTrend: 'stable',
      totalQuestionsAnswered: 0,
      chaptersCompleted: 0,
      totalChapters: 21,
      recommendedStudyMinutes: 20,
      updatedAt: new Date().toISOString(),
    },
    weakAreas: weakAreaNames.map((name, i) => ({
      id: `weak-${i}`,
      name,
      chapterNumber: null,
      category: name.toLowerCase().replace(/\s+/g, '-'),
      score: 50,
      attempts: 1,
      trend: 'stable' as const,
      lastAttemptAt: null,
    })),
    strongAreas: [],
    missedQuestions: [],
    recentRecommendations: [],
    studyStreakDays: 0,
    lastStudyDate: null,
  }
}

/**
 * AI RECOMMENDATION ENGINE — ASCYN PRO Phase 5
 * AI-enhanced study recommendations
 */

import { AIStudyRecommendation, AIRecommendationSet, AITutorContext } from '@/types/ai'
import { StudyRecommendation } from '@/types'
import { buildAITutorContext } from './context-builder'
import { generateStudyPlan } from '@/lib/recommendations'

// ============================================================================
// RECOMMENDATION ENGINE CLASS
// ============================================================================

export class AIRecommendationEngine {
  
  /**
   * Generate AI-enhanced study recommendations
   */
  async generateRecommendations(userId: string): Promise<AIRecommendationSet> {
    const context = await buildAITutorContext(userId)
    
    // Get base recommendations from rule-based engine
    const baseRecommendations = generateStudyPlan({
      userId,
      readiness: context.readiness,
      weakAreas: context.weakAreas,
      strongAreas: context.strongAreas,
      missedQuestions: context.missedQuestions,
      totalChapters: context.readiness.totalChapters,
    })
    
    // Enhance with AI insights
    const aiRecommendations = this.enhanceRecommendations(baseRecommendations, context)
    
    // Generate daily focus
    const dailyFocus = this.generateDailyFocus(context)
    
    // Generate weekly goal
    const weeklyGoal = this.generateWeeklyGoal(context)
    
    // Generate motivational message
    const motivationalMessage = this.generateMotivationalMessage(context)
    
    return {
      userId,
      generatedAt: new Date().toISOString(),
      recommendations: aiRecommendations,
      dailyFocus,
      weeklyGoal,
      motivationalMessage,
    }
  }
  
  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================
  
  private enhanceRecommendations(
    baseRecommendations: StudyRecommendation[],
    context: AITutorContext
  ): AIStudyRecommendation[] {
    return baseRecommendations.map(rec => {
      const relatedWeakAreas = context.weakAreas
        .filter(w => rec.chapterNumber === w.chapterNumber)
        .map(w => w.name)
      
      return {
        ...rec,
        aiGenerated: false, // Will be true when AI API is configured
        reasoning: this.generateReasoning(rec, context),
        confidence: this.calculateConfidence(rec, context),
        relatedWeakAreas,
        adaptiveDifficulty: this.calculateAdaptiveDifficulty(rec, context),
      }
    })
  }
  
  private generateReasoning(rec: StudyRecommendation, context: AITutorContext): string {
    if (rec.priority === 'critical') {
      return `This is critical because your readiness score is ${context.readiness.score}% and you have ${context.missedQuestions.length} missed questions in this area.`
    }
    if (rec.type === 'review' && context.missedQuestions.length > 0) {
      return `Reviewing missed questions is one of the fastest ways to improve your score. You have ${context.missedQuestions.length} questions to review.`
    }
    if (rec.type === 'practice') {
      return `Practice quizzes will help you identify remaining weak spots before the state board exam.`
    }
    return `This recommendation is based on your current progress and performance data.`
  }
  
  private calculateConfidence(rec: StudyRecommendation, context: AITutorContext): number {
    let confidence = 70 // Base confidence
    
    if (rec.priority === 'critical') confidence += 20
    if (rec.priority === 'high') confidence += 10
    if (context.readiness.score > 70) confidence += 5
    if (context.missedQuestions.length > 5) confidence += 5
    
    return Math.min(100, confidence)
  }
  
  private calculateAdaptiveDifficulty(
    rec: StudyRecommendation,
    context: AITutorContext
  ): 'easier' | 'standard' | 'harder' {
    if (context.readiness.score < 50) return 'easier'
    if (context.readiness.score > 85) return 'harder'
    return 'standard'
  }
  
  private generateDailyFocus(context: AITutorContext): string {
    if (context.weakAreas.length > 0) {
      const topWeak = context.weakAreas[0]
      return `Focus on ${topWeak.name} today. This is your highest-priority area for improvement.`
    }
    if (context.readiness.chaptersCompleted < context.readiness.totalChapters) {
      const nextChapter = context.readiness.chaptersCompleted + 1
      return `Continue with Chapter ${nextChapter}. You're making good progress through the curriculum.`
    }
    return `Review and practice today. You're close to exam readiness — keep reinforcing your knowledge.`
  }
  
  private generateWeeklyGoal(context: AITutorContext): string {
    if (context.readiness.score < 60) {
      return `This week, aim to complete ${Math.min(3, context.readiness.totalChapters - context.readiness.chaptersCompleted)} chapters and review all missed questions.`
    }
    if (context.readiness.score < 80) {
      return `This week, focus on your weak areas and take at least 2 practice quizzes.`
    }
    return `This week, take a full practice exam and review any remaining weak areas. You're almost ready!`
  }
  
  private generateMotivationalMessage(context: AITutorContext): string {
    if (context.readiness.score >= 80) {
      return `Excellent work! You're ${context.readiness.score}% ready for the state board exam. Keep up the great work — you're almost there!`
    }
    if (context.readiness.score >= 60) {
      return `Good progress! You're ${context.readiness.score}% ready. Stay consistent with your studying and you'll reach your goal.`
    }
    if (context.studyStreakDays > 0) {
      return `You've been studying for ${context.studyStreakDays} days in a row — that dedication will pay off on exam day!`
    }
    return `Every study session brings you closer to your goal. Stay consistent, stay focused, and you will succeed.`
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const aiRecommendationEngine = new AIRecommendationEngine()

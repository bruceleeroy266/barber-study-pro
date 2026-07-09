/**
 * WEAK AREA MAPPING + ADAPTIVE LEARNING INTELLIGENCE SYSTEM
 * ASCYN PRO v2.0
 * 
 * This system transforms the platform from static to intelligent
 * by tracking, analyzing, and adapting to student weaknesses.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WeakArea {
  id: string
  userId: string
  chapterNumber: number
  conceptId: string
  conceptName: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  weaknessType: 'quiz' | 'flashcard' | 'both'
  missCount: number
  lastAttempt: Date
  confidenceScore: number // 0-100
  priority: 'low' | 'medium' | 'high' | 'critical'
  recommendedActions: string[]
  relatedConcepts: string[]
}

export interface QuizPerformance {
  questionId: string
  chapterNumber: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  isCorrect: boolean
  timeSpent: number // seconds
  attempts: number
  hintsUsed: number
  timestamp: Date
}

export interface FlashcardPerformance {
  cardId: string
  chapterNumber: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  confidenceRating: 1 | 2 | 3 | 4 | 5 // 1=again, 5=easy
  timeSpent: number // seconds
  flipCount: number
  timestamp: Date
}

export interface ConceptDifficulty {
  conceptId: string
  conceptName: string
  chapterNumber: number
  category: string
  overallDifficulty: number // 0-100
  quizFailureRate: number // percentage
  flashcardLowConfidenceRate: number // percentage
  avgTimeToAnswer: number // seconds
  highRiskForExam: boolean
  prerequisiteConcepts: string[]
}

export interface AdaptiveLearningPath {
  userId: string
  currentFocus: string[]
  recommendedChapters: number[]
  priorityWeakAreas: WeakArea[]
  suggestedStudyTime: number // minutes
  nextMilestone: string
  confidenceTrend: 'improving' | 'stable' | 'declining'
}

export interface StudentAnalytics {
  userId: string
  totalStudyTime: number // minutes
  quizzesCompleted: number
  flashcardsReviewed: number
  weakAreasCount: number
  improvingAreasCount: number
  masteredAreasCount: number
  streakDays: number
  lastStudyDate: Date
  overallConfidence: number // 0-100
  examReadiness: number // 0-100
}

// ============================================================================
// HIGH-RISK STATE BOARD CONCEPTS
// ============================================================================

export const highRiskExamConcepts = {
  // Chapter 4: Infection Control (Critical for state boards)
  infectionControl: [
    'universal_precautions',
    'bloodborne_pathogens',
    'sterilization_methods',
    'disinfection_procedures',
    'contaminated_sharps',
    'exposure_incident',
    'msds_sheets',
    'osha_standards'
  ],
  
  // Chapter 6: Anatomy (High exam frequency)
  anatomy: [
    'cranial_nerves',
    'facial_muscles',
    'facial_bones',
    'circulatory_system',
    'skin_structure',
    'hair_anatomy'
  ],
  
  // Chapter 7: Chemistry (Often difficult)
  chemistry: [
    'ph_scale',
    'oxidation_reduction',
    'ammonia_compounds',
    'chemical_reactions',
    'product_ingredients'
  ],
  
  // Chapter 8: Electricity (Safety critical)
  electricity: [
    'electrical_safety',
    'grounding',
    'circuit_breakers',
    'galvanic_current',
    'tesla_high_frequency'
  ],
  
  // Chapter 9: Skin (High exam frequency)
  skin: [
    'skin_disorders',
    'contagious_conditions',
    'skin_analysis',
    'lesion_types',
    'dermatology_terms'
  ],
  
  // Chapter 17: State Board (Critical)
  stateBoard: [
    'licensing_requirements',
    'scope_of_practice',
    'sanitation_regulations',
    'continuing_education',
    'license_renewal',
    'reciprocity'
  ]
}

// ============================================================================
// WEAK AREA DETECTION ENGINE
// ============================================================================

export class WeakAreaDetector {
  
  /**
   * Analyze quiz performance to identify weak areas
   */
  static analyzeQuizWeaknesses(
    performances: QuizPerformance[],
    userId: string
  ): WeakArea[] {
    const weakAreas: WeakArea[] = []
    const conceptMap = new Map<string, QuizPerformance[]>()
    
    // Group by concept
    performances.forEach(perf => {
      const key = `${perf.chapterNumber}-${perf.category}`
      if (!conceptMap.has(key)) {
        conceptMap.set(key, [])
      }
      conceptMap.get(key)!.push(perf)
    })
    
    // Analyze each concept
    conceptMap.forEach((perfs, key) => {
      const failures = perfs.filter(p => !p.isCorrect)
      const failureRate = failures.length / perfs.length
      
      // Weak if failure rate > 40% or multiple failures
      if (failureRate > 0.4 || failures.length >= 3) {
        const [chapterStr, category] = key.split('-')
        const chapterNumber = parseInt(chapterStr)
        
        weakAreas.push({
          id: `weak-${userId}-${key}-${Date.now()}`,
          userId,
          chapterNumber,
          conceptId: key,
          conceptName: this.getConceptName(category),
          category,
          difficulty: this.calculateDifficulty(perfs),
          weaknessType: 'quiz',
          missCount: failures.length,
          lastAttempt: perfs[perfs.length - 1].timestamp,
          confidenceScore: Math.max(0, 100 - (failureRate * 100)),
          priority: this.calculatePriority(failureRate, failures.length),
          recommendedActions: this.getRecommendedActions('quiz', category),
          relatedConcepts: this.getRelatedConcepts(category)
        })
      }
    })
    
    return weakAreas.sort((a, b) => this.priorityWeight(b.priority) - this.priorityWeight(a.priority))
  }
  
  /**
   * Analyze flashcard performance to identify weak areas
   */
  static analyzeFlashcardWeaknesses(
    performances: FlashcardPerformance[],
    userId: string
  ): WeakArea[] {
    const weakAreas: WeakArea[] = []
    const conceptMap = new Map<string, FlashcardPerformance[]>()
    
    // Group by concept
    performances.forEach(perf => {
      const key = `${perf.chapterNumber}-${perf.category}`
      if (!conceptMap.has(key)) {
        conceptMap.set(key, [])
      }
      conceptMap.get(key)!.push(perf)
    })
    
    // Analyze each concept
    conceptMap.forEach((perfs, key) => {
      const lowConfidence = perfs.filter(p => p.confidenceRating <= 2)
      const lowConfidenceRate = lowConfidence.length / perfs.length
      
      // Weak if low confidence rate > 50% or multiple low ratings
      if (lowConfidenceRate > 0.5 || lowConfidence.length >= 3) {
        const [chapterStr, category] = key.split('-')
        const chapterNumber = parseInt(chapterStr)
        
        weakAreas.push({
          id: `weak-${userId}-${key}-${Date.now()}`,
          userId,
          chapterNumber,
          conceptId: key,
          conceptName: this.getConceptName(category),
          category,
          difficulty: this.calculateDifficultyFromFlashcards(perfs),
          weaknessType: 'flashcard',
          missCount: lowConfidence.length,
          lastAttempt: perfs[perfs.length - 1].timestamp,
          confidenceScore: Math.max(0, 100 - (lowConfidenceRate * 100)),
          priority: this.calculatePriority(lowConfidenceRate, lowConfidence.length),
          recommendedActions: this.getRecommendedActions('flashcard', category),
          relatedConcepts: this.getRelatedConcepts(category)
        })
      }
    })
    
    return weakAreas.sort((a, b) => this.priorityWeight(b.priority) - this.priorityWeight(a.priority))
  }
  
  /**
   * Combine quiz and flashcard weaknesses
   */
  static combineWeaknesses(
    quizWeaknesses: WeakArea[],
    flashcardWeaknesses: WeakArea[],
    userId: string
  ): WeakArea[] {
    const combined = new Map<string, WeakArea>()
    
    // Add quiz weaknesses
    quizWeaknesses.forEach(weak => {
      combined.set(weak.conceptId, weak)
    })
    
    // Merge or add flashcard weaknesses
    flashcardWeaknesses.forEach(weak => {
      if (combined.has(weak.conceptId)) {
        const existing = combined.get(weak.conceptId)!
        existing.weaknessType = 'both'
        existing.missCount += weak.missCount
        existing.confidenceScore = Math.min(existing.confidenceScore, weak.confidenceScore)
        existing.priority = this.calculateCombinedPriority(existing)
        existing.recommendedActions = [
          ...existing.recommendedActions,
          ...weak.recommendedActions
        ].filter((v, i, a) => a.indexOf(v) === i) // dedupe
      } else {
        combined.set(weak.conceptId, weak)
      }
    })
    
    return Array.from(combined.values())
      .sort((a, b) => this.priorityWeight(b.priority) - this.priorityWeight(a.priority))
  }
  
  // Helper methods
  private static getConceptName(category: string): string {
    const names: Record<string, string> = {
      'infection-control': 'Infection Control & Safety',
      'anatomy': 'Human Anatomy',
      'chemistry': 'Chemistry Basics',
      'electricity': 'Electrical Safety',
      'skin': 'Skin Structure & Conditions',
      'hair': 'Hair Structure & Growth',
      'tools': 'Barbering Tools & Equipment',
      'shaving': 'Shaving Techniques',
      'haircutting': 'Haircutting Methods',
      'state-board': 'State Board Preparation',
      'professional': 'Professional Practices',
      'business': 'Barbershop Business'
    }
    return names[category] || category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
  
  private static calculateDifficulty(perfs: QuizPerformance[]): 'easy' | 'medium' | 'hard' {
    const avgTime = perfs.reduce((sum, p) => sum + p.timeSpent, 0) / perfs.length
    const failureRate = perfs.filter(p => !p.isCorrect).length / perfs.length
    
    if (failureRate > 0.7 || avgTime > 60) return 'hard'
    if (failureRate > 0.4 || avgTime > 30) return 'medium'
    return 'easy'
  }
  
  private static calculateDifficultyFromFlashcards(perfs: FlashcardPerformance[]): 'easy' | 'medium' | 'hard' {
    const avgConfidence = perfs.reduce((sum, p) => sum + p.confidenceRating, 0) / perfs.length
    const avgTime = perfs.reduce((sum, p) => sum + p.timeSpent, 0) / perfs.length
    
    if (avgConfidence < 2 || avgTime > 45) return 'hard'
    if (avgConfidence < 3 || avgTime > 25) return 'medium'
    return 'easy'
  }
  
  private static calculatePriority(rate: number, count: number): 'low' | 'medium' | 'high' | 'critical' {
    if (rate > 0.8 || count >= 5) return 'critical'
    if (rate > 0.6 || count >= 3) return 'high'
    if (rate > 0.4 || count >= 2) return 'medium'
    return 'low'
  }
  
  private static calculateCombinedPriority(weak: WeakArea): 'low' | 'medium' | 'high' | 'critical' {
    if (weak.weaknessType === 'both' && weak.missCount >= 5) return 'critical'
    if (weak.confidenceScore < 30) return 'critical'
    if (weak.confidenceScore < 50) return 'high'
    if (weak.confidenceScore < 70) return 'medium'
    return 'low'
  }
  
  private static priorityWeight(priority: string): number {
    const weights = { critical: 4, high: 3, medium: 2, low: 1 }
    return weights[priority as keyof typeof weights] || 0
  }
  
  private static getRecommendedActions(type: 'quiz' | 'flashcard', category: string): string[] {
    const actions: string[] = []
    
    if (type === 'quiz') {
      actions.push('Review flashcards for this topic')
      actions.push('Read chapter study notes')
      actions.push('Watch tutorial videos if available')
    } else {
      actions.push('Take practice quiz on this topic')
      actions.push('Create custom flashcards')
      actions.push('Study with a partner')
    }
    
    // Category-specific actions
    if (category === 'infection-control') {
      actions.push('CRITICAL: Master for state board exam')
      actions.push('Practice sanitation procedures')
    }
    if (category === 'anatomy') {
      actions.push('Use anatomical diagrams')
      actions.push('Practice with 3D models if available')
    }
    
    return actions
  }
  
  private static getRelatedConcepts(category: string): string[] {
    const related: Record<string, string[]> = {
      'infection-control': ['sanitation', 'safety', 'state-board'],
      'anatomy': ['physiology', 'skin', 'hair'],
      'chemistry': ['haircoloring', 'chemical-texture'],
      'skin': ['anatomy', 'disorders', 'treatments'],
      'hair': ['anatomy', 'chemistry', 'treatments'],
      'state-board': ['infection-control', 'professional', 'legal']
    }
    return related[category] || []
  }
}

// ============================================================================
// ADAPTIVE LEARNING PATH GENERATOR
// ============================================================================

export class AdaptiveLearningEngine {
  
  /**
   * Generate personalized learning path based on weak areas
   */
  static generateLearningPath(
    userId: string,
    weakAreas: WeakArea[],
    studentAnalytics: StudentAnalytics
  ): AdaptiveLearningPath {
    
    // Sort weak areas by priority
    const sortedWeakAreas = [...weakAreas].sort((a, b) => {
      const priorityDiff = WeakAreaDetector['priorityWeight'](b.priority) - 
                          WeakAreaDetector['priorityWeight'](a.priority)
      if (priorityDiff !== 0) return priorityDiff
      return b.missCount - a.missCount
    })
    
    // Get top priority areas (max 5)
    const priorityWeakAreas = sortedWeakAreas.slice(0, 5)
    
    // Determine chapters to focus on
    const chapterSet = new Set(priorityWeakAreas.map(w => w.chapterNumber))
    const recommendedChapters = Array.from(chapterSet).sort((a, b) => a - b)
    
    // Calculate suggested study time
    const suggestedStudyTime = this.calculateStudyTime(priorityWeakAreas, studentAnalytics)
    
    // Determine confidence trend
    const confidenceTrend = this.calculateConfidenceTrend(studentAnalytics)
    
    // Set next milestone
    const nextMilestone = this.determineNextMilestone(priorityWeakAreas, studentAnalytics)
    
    return {
      userId,
      currentFocus: priorityWeakAreas.map(w => w.conceptName),
      recommendedChapters,
      priorityWeakAreas,
      suggestedStudyTime,
      nextMilestone,
      confidenceTrend
    }
  }
  
  /**
   * Calculate recommended study time based on weak areas
   */
  private static calculateStudyTime(
    weakAreas: WeakArea[],
    analytics: StudentAnalytics
  ): number {
    let baseTime = 15 // minimum 15 minutes
    
    // Add time based on weak areas
    weakAreas.forEach(area => {
      if (area.priority === 'critical') baseTime += 15
      else if (area.priority === 'high') baseTime += 10
      else if (area.priority === 'medium') baseTime += 5
      else baseTime += 3
    })
    
    // Adjust based on student's overall progress
    if (analytics.examReadiness < 50) baseTime *= 1.2
    if (analytics.streakDays < 3) baseTime *= 0.8 // Don't overwhelm new students
    
    // Cap at reasonable limits
    return Math.min(Math.max(baseTime, 15), 90)
  }
  
  /**
   * Calculate confidence trend based on recent performance
   */
  private static calculateConfidenceTrend(
    analytics: StudentAnalytics
  ): 'improving' | 'stable' | 'declining' {
    // This would typically compare recent vs older performance
    // For now, use overall confidence as indicator
    if (analytics.overallConfidence > 70) return 'improving'
    if (analytics.overallConfidence > 50) return 'stable'
    return 'declining'
  }
  
  /**
   * Determine next milestone based on progress
   */
  private static determineNextMilestone(
    weakAreas: WeakArea[],
    analytics: StudentAnalytics
  ): string {
    if (weakAreas.length === 0) {
      return 'Complete full practice exam'
    }
    
    if (analytics.examReadiness < 60) {
      return `Master ${weakAreas[0].conceptName}`
    }
    
    if (analytics.examReadiness < 80) {
      return 'Review all high-risk exam concepts'
    }
    
    return 'Ready for state board exam - take final practice test'
  }
  
  /**
   * Generate daily study recommendation
   */
  static generateDailyRecommendation(
    userId: string,
    learningPath: AdaptiveLearningPath,
    weakAreas: WeakArea[]
  ): {
    focusArea: string
    activities: string[]
    estimatedTime: number
    priority: string
  } {
    const criticalAreas = weakAreas.filter(w => w.priority === 'critical')
    const highAreas = weakAreas.filter(w => w.priority === 'high')
    
    let focusArea: string
    let activities: string[]
    let estimatedTime: number
    let priority: string
    
    if (criticalAreas.length > 0) {
      const area = criticalAreas[0]
      focusArea = area.conceptName
      activities = [
        `Review ${area.missCount} missed quiz questions`,
        'Study flashcards for this concept',
        'Read chapter study notes',
        'Take focused practice quiz'
      ]
      estimatedTime = 30
      priority = 'CRITICAL - Focus here first!'
    } else if (highAreas.length > 0) {
      const area = highAreas[0]
      focusArea = area.conceptName
      activities = [
        'Review flashcards',
        'Practice with 10 quiz questions',
        'Study related concepts'
      ]
      estimatedTime = 20
      priority = 'High Priority'
    } else {
      focusArea = 'General Review'
      activities = [
        'Review previously mastered concepts',
        'Take mixed chapter quiz',
        'Study new chapter material'
      ]
      estimatedTime = 15
      priority = 'Maintenance'
    }
    
    return { focusArea, activities, estimatedTime, priority }
  }
}

// ============================================================================
// ANALYTICS DASHBOARD DATA
// ============================================================================

export class AnalyticsDashboard {
  
  /**
   * Generate comprehensive student analytics
   */
  static generateStudentAnalytics(
    userId: string,
    quizPerformances: QuizPerformance[],
    flashcardPerformances: FlashcardPerformance[],
    weakAreas: WeakArea[]
  ): StudentAnalytics {
    
    const totalStudyTime = this.calculateTotalStudyTime(quizPerformances, flashcardPerformances)
    const quizzesCompleted = new Set(quizPerformances.map(p => p.questionId)).size
    const flashcardsReviewed = flashcardPerformances.length
    
    const improvingAreas = weakAreas.filter(w => w.confidenceScore > 50).length
    const masteredAreas = weakAreas.filter(w => w.confidenceScore > 80).length
    
    const overallConfidence = this.calculateOverallConfidence(quizPerformances, flashcardPerformances)
    const examReadiness = this.calculateExamReadiness(weakAreas, overallConfidence)
    
    return {
      userId,
      totalStudyTime,
      quizzesCompleted,
      flashcardsReviewed,
      weakAreasCount: weakAreas.length,
      improvingAreasCount: improvingAreas,
      masteredAreasCount: masteredAreas,
      streakDays: 0, // Would track from study history
      lastStudyDate: new Date(),
      overallConfidence,
      examReadiness
    }
  }
  
  private static calculateTotalStudyTime(
    quizPerfs: QuizPerformance[],
    flashcardPerfs: FlashcardPerformance[]
  ): number {
    const quizTime = quizPerfs.reduce((sum, p) => sum + p.timeSpent, 0)
    const flashcardTime = flashcardPerfs.reduce((sum, p) => sum + p.timeSpent, 0)
    return Math.round((quizTime + flashcardTime) / 60) // Convert to minutes
  }
  
  private static calculateOverallConfidence(
    quizPerfs: QuizPerformance[],
    flashcardPerfs: FlashcardPerformance[]
  ): number {
    let totalScore = 0
    let count = 0
    
    quizPerfs.forEach(p => {
      totalScore += p.isCorrect ? 100 : 0
      count++
    })
    
    flashcardPerfs.forEach(p => {
      totalScore += (p.confidenceRating / 5) * 100
      count++
    })
    
    return count > 0 ? Math.round(totalScore / count) : 0
  }
  
  private static calculateExamReadiness(
    weakAreas: WeakArea[],
    overallConfidence: number
  ): number {
    // Start with overall confidence
    let readiness = overallConfidence
    
    // Penalize for critical weak areas
    const criticalCount = weakAreas.filter(w => w.priority === 'critical').length
    const highCount = weakAreas.filter(w => w.priority === 'high').length
    
    readiness -= criticalCount * 10
    readiness -= highCount * 5
    
    // Check for high-risk exam concepts
    const highRiskWeak = weakAreas.filter(w => 
      Object.values(highRiskExamConcepts).flat().includes(w.category)
    ).length
    
    readiness -= highRiskWeak * 8
    
    return Math.max(0, Math.min(100, readiness))
  }
  
  /**
   * Generate progress report data
   */
  static generateProgressReport(userId: string, analytics: StudentAnalytics): {
    summary: string
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    examDateEstimate: string
  } {
    const summary = this.generateSummary(analytics)
    const strengths = this.identifyStrengths(analytics)
    const weaknesses = this.identifyWeaknesses(analytics)
    const recommendations = this.generateRecommendations(analytics)
    const examDateEstimate = this.estimateExamReadiness(analytics)
    
    return { summary, strengths, weaknesses, recommendations, examDateEstimate }
  }
  
  private static generateSummary(analytics: StudentAnalytics): string {
    if (analytics.examReadiness >= 80) {
      return `Excellent progress! You're ${analytics.examReadiness}% ready for the state board exam. Keep up the great work!`
    } else if (analytics.examReadiness >= 60) {
      return `Good progress! You're ${analytics.examReadiness}% ready. Focus on your weak areas to reach exam readiness.`
    } else if (analytics.examReadiness >= 40) {
      return `Making progress. You're ${analytics.examReadiness}% ready. Dedicate more time to studying your weak areas.`
    } else {
      return `Just getting started. You're ${analytics.examReadiness}% ready. Consistent daily study will help you improve quickly.`
    }
  }
  
  private static identifyStrengths(analytics: StudentAnalytics): string[] {
    const strengths: string[] = []
    
    if (analytics.masteredAreasCount > 5) {
      strengths.push(`Strong knowledge in ${analytics.masteredAreasCount} concept areas`)
    }
    if (analytics.streakDays >= 7) {
      strengths.push('Consistent study habits with 7+ day streak')
    }
    if (analytics.totalStudyTime > 300) {
      strengths.push('Dedicated study time (5+ hours)')
    }
    if (analytics.overallConfidence > 70) {
      strengths.push('High overall confidence in material')
    }
    
    return strengths.length > 0 ? strengths : ['Building foundation - keep studying!']
  }
  
  private static identifyWeaknesses(analytics: StudentAnalytics): string[] {
    const weaknesses: string[] = []
    
    if (analytics.weakAreasCount > 10) {
      weaknesses.push(`${analytics.weakAreasCount} areas need improvement`)
    }
    if (analytics.examReadiness < 50) {
      weaknesses.push('Not yet ready for state board exam')
    }
    if (analytics.streakDays < 3) {
      weaknesses.push('Study consistency could improve')
    }
    
    return weaknesses
  }
  
  private static generateRecommendations(analytics: StudentAnalytics): string[] {
    const recs: string[] = []
    
    if (analytics.weakAreasCount > 0) {
      recs.push('Focus on your top 3 weak areas first')
    }
    if (analytics.streakDays < 3) {
      recs.push('Study daily to build consistent habits')
    }
    if (analytics.examReadiness < 60) {
      recs.push('Review high-risk exam concepts (infection control, anatomy)')
    }
    if (analytics.totalStudyTime < 120) {
      recs.push('Aim for at least 20 minutes of study daily')
    }
    
    return recs
  }
  
  private static estimateExamReadiness(analytics: StudentAnalytics): string {
    if (analytics.examReadiness >= 85) {
      return 'Ready now - schedule your exam!'
    } else if (analytics.examReadiness >= 70) {
      return '2-3 weeks of focused study'
    } else if (analytics.examReadiness >= 50) {
      return '4-6 weeks of consistent study'
    } else if (analytics.examReadiness >= 30) {
      return '8-10 weeks of dedicated study'
    } else {
      return '12+ weeks - start with fundamentals'
    }
  }
}

// ============================================================================
// SPACED REPETITION INTEGRATION
// ============================================================================

export class SpacedRepetitionEngine {
  
  /**
   * Calculate next review date for a weak area
   */
  static calculateNextReview(
    weakArea: WeakArea,
    performance: 'poor' | 'fair' | 'good' | 'excellent'
  ): Date {
    const now = new Date()
    const intervals = {
      poor: 1,      // 1 day
      fair: 3,      // 3 days
      good: 7,      // 1 week
      excellent: 14 // 2 weeks
    }
    
    // Adjust based on priority
    let multiplier = 1
    if (weakArea.priority === 'critical') multiplier = 0.5
    if (weakArea.priority === 'high') multiplier = 0.75
    
    const days = intervals[performance] * multiplier
    return new Date(now.setDate(now.getDate() + days))
  }
  
  /**
   * Generate daily review queue
   */
  static generateReviewQueue(
    weakAreas: WeakArea[],
    maxItems: number = 10
  ): WeakArea[] {
    const now = new Date()
    
    return weakAreas
      .filter(w => w.lastAttempt <= now)
      .sort((a, b) => {
        // Priority first
        const priorityDiff = WeakAreaDetector['priorityWeight'](b.priority) - 
                            WeakAreaDetector['priorityWeight'](a.priority)
        if (priorityDiff !== 0) return priorityDiff
        
        // Then by last attempt (oldest first)
        return a.lastAttempt.getTime() - b.lastAttempt.getTime()
      })
      .slice(0, maxItems)
  }
}

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

export const WeakAreaMappingSystem = {
  detector: WeakAreaDetector,
  learning: AdaptiveLearningEngine,
  analytics: AnalyticsDashboard,
  spacedRepetition: SpacedRepetitionEngine,
  highRiskConcepts: highRiskExamConcepts
}

console.log('Weak Area Mapping + Adaptive Learning Intelligence System loaded')
console.log('Features: Weak area detection, adaptive paths, analytics, spaced repetition')

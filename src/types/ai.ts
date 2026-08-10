/**
 * AI PLATFORM TYPES — ASCYN PRO Phase 5
 * Type definitions for AI Tutor, Remediation, and Recommendations
 */

import { BoardReadiness, AreaPerformance, MissedQuestion, StudyRecommendation } from './index'

// ============================================================================
// AI CONVERSATION TYPES
// ============================================================================

export type AIMessageRole = 'user' | 'assistant' | 'system'

export interface AIMessage {
  id: string
  conversationId: string
  role: AIMessageRole
  content: string
  timestamp: string
  metadata?: {
    contextChapter?: number
    contextWeakAreas?: string[]
    remediationTriggered?: boolean
    recommendationTriggered?: boolean
  }
}

export interface AIConversation {
  id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
  lastMessagePreview: string
  contextChapter?: number | null
  isActive: boolean
}

export interface AITutorContext {
  userId: string
  studentName: string
  currentChapter?: number
  currentChapterTitle?: string
  readiness: BoardReadiness
  weakAreas: AreaPerformance[]
  strongAreas: AreaPerformance[]
  missedQuestions: MissedQuestion[]
  recentRecommendations: StudyRecommendation[]
  studyStreakDays: number
  lastStudyDate: string | null
}

export interface AITutorResponse {
  message: string
  conversationId: string
  messageId: string
  suggestedActions?: AIQuickAction[]
  remediationPlan?: RemediationPlan
  metadata: {
    model: string
    tokensUsed?: number
    responseTimeMs: number
    fallbackUsed: boolean
  }
}

export interface AIQuickAction {
  id: string
  label: string
  action: 'explain' | 'quiz' | 'remediate' | 'review' | 'encourage' | 'plan'
  chapterNumber?: number
  prompt: string
}

// ============================================================================
// AI REMEDIATION TYPES
// ============================================================================

export interface RemediationPlan {
  id: string
  userId: string
  generatedAt: string
  targetWeakAreas: string[]
  focusChapter: number | null
  steps: RemediationStep[]
  estimatedMinutes: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'completed' | 'abandoned'
  completedSteps: number
  effectivenessScore?: number
}

export interface RemediationStep {
  id: string
  order: number
  type: 'review_chapter' | 'flashcards' | 'practice_quiz' | 'missed_questions' | 'ai_tutor_session'
  title: string
  description: string
  chapterNumber?: number
  estimatedMinutes: number
  isCompleted: boolean
  completedAt?: string
}

// ============================================================================
// AI RECOMMENDATION TYPES
// ============================================================================

export interface AIStudyRecommendation extends StudyRecommendation {
  aiGenerated: boolean
  reasoning: string
  confidence: number
  relatedWeakAreas: string[]
  adaptiveDifficulty: 'easier' | 'standard' | 'harder'
}

export interface AIRecommendationSet {
  userId: string
  generatedAt: string
  recommendations: AIStudyRecommendation[]
  dailyFocus: string
  weeklyGoal: string
  motivationalMessage: string
}

// ============================================================================
// AI SERVICE TYPES
// ============================================================================

export interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'fallback'
  apiKey?: string
  model: string
  maxTokens: number
  temperature: number
}

export interface AIServiceRequest {
  messages: Array<{ role: AIMessageRole; content: string }>
  context: AITutorContext
  stream?: boolean
}

export interface AIServiceResponse {
  content: string
  model: string
  tokensUsed?: number
  responseTimeMs: number
  fallbackUsed: boolean
}

// ============================================================================
// AI PROMPT TYPES
// ============================================================================

export interface PromptTemplate {
  id: string
  name: string
  systemPrompt: string
  userPromptTemplate: string
  requiredContext: (keyof AITutorContext)[]
}

export interface BrandVoiceGuidelines {
  personality: string[]
  tone: string
  prohibitedPhrases: string[]
  requiredElements: string[]
  greetingTemplates: string[]
  encouragementTemplates: string[]
}

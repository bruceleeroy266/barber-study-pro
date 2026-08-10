/**
 * AI TUTOR SERVICE — ASCYN PRO Phase 5
 * Core AI tutor logic with provider-agnostic API calls
 */

import { 
  AITutorContext, 
  AITutorResponse, 
  AIServiceConfig, 
  AIServiceRequest, 
  AIServiceResponse,
  AIQuickAction,
  AIMessage 
} from '@/types/ai'
import { buildSystemPrompt, FALLBACK_RESPONSES, QUICK_ACTION_PROMPTS } from './prompt-templates'
import { buildAITutorContext } from './context-builder'

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: AIServiceConfig = {
  provider: (process.env.AI_PROVIDER as 'openai' | 'anthropic') || 'fallback',
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL || 'gpt-4',
  maxTokens: 1000,
  temperature: 0.7,
}

// ============================================================================
// AI SERVICE CLASS
// ============================================================================

export class AITutorService {
  private config: AIServiceConfig
  
  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }
  
  /**
   * Send a message to the AI tutor
   */
  async sendMessage(
    userId: string,
    message: string,
    conversationId?: string,
    currentChapter?: number
  ): Promise<AITutorResponse> {
    const startTime = Date.now()
    
    // Build context
    const context = await buildAITutorContext(userId, currentChapter)
    
    // Build messages array
    const messages = this.buildMessages(message, context)
    
    // Call AI service
    const response = await this.callAIService({
      messages,
      context,
    })
    
    const responseTimeMs = Date.now() - startTime
    
    // Generate suggested actions
    const suggestedActions = this.generateQuickActions(context, message)
    
    return {
      message: response.content,
      conversationId: conversationId || `conv-${Date.now()}`,
      messageId: `msg-${Date.now()}`,
      suggestedActions,
      metadata: {
        model: response.model,
        tokensUsed: response.tokensUsed,
        responseTimeMs,
        fallbackUsed: response.fallbackUsed,
      },
    }
  }
  
  /**
   * Generate a remediation plan
   */
  async generateRemediationPlan(
    userId: string,
    targetArea: string,
    currentChapter?: number
  ): Promise<AITutorResponse> {
    const startTime = Date.now()
    
    const context = await buildAITutorContext(userId, currentChapter)
    
    const remediationPrompt = `I need focused help with ${targetArea}. Please create a personalized remediation plan.`
    const messages = this.buildMessages(remediationPrompt, context)
    
    const response = await this.callAIService({
      messages,
      context,
    })
    
    const responseTimeMs = Date.now() - startTime
    
    return {
      message: response.content,
      conversationId: `remediation-${Date.now()}`,
      messageId: `msg-${Date.now()}`,
      metadata: {
        model: response.model,
        tokensUsed: response.tokensUsed,
        responseTimeMs,
        fallbackUsed: response.fallbackUsed,
      },
    }
  }
  
  /**
   * Generate study recommendations
   */
  async generateRecommendations(userId: string): Promise<AITutorResponse> {
    const startTime = Date.now()
    
    const context = await buildAITutorContext(userId)
    
    const recommendationPrompt = 'Based on my progress, what should I focus on today? Please give me personalized study recommendations.'
    const messages = this.buildMessages(recommendationPrompt, context)
    
    const response = await this.callAIService({
      messages,
      context,
    })
    
    const responseTimeMs = Date.now() - startTime
    
    return {
      message: response.content,
      conversationId: `rec-${Date.now()}`,
      messageId: `msg-${Date.now()}`,
      metadata: {
        model: response.model,
        tokensUsed: response.tokensUsed,
        responseTimeMs,
        fallbackUsed: response.fallbackUsed,
      },
    }
  }
  
  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================
  
  private buildMessages(userMessage: string, context: AITutorContext): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    const systemPrompt = buildSystemPrompt(context)
    
    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ]
  }
  
  private async callAIService(request: AIServiceRequest): Promise<AIServiceResponse> {
    // If no API key, use fallback
    if (!this.config.apiKey || this.config.provider === 'fallback') {
      return this.getFallbackResponse(request)
    }
    
    try {
      if (this.config.provider === 'openai') {
        return await this.callOpenAI(request)
      } else if (this.config.provider === 'anthropic') {
        return await this.callAnthropic(request)
      }
    } catch (error) {
      console.error('AI service error:', error)
      return this.getFallbackResponse(request)
    }
    
    return this.getFallbackResponse(request)
  }
  
  private async callOpenAI(request: AIServiceRequest): Promise<AIServiceResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: request.messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      content: data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.',
      model: this.config.model,
      tokensUsed: data.usage?.total_tokens,
      responseTimeMs: 0,
      fallbackUsed: false,
    }
  }
  
  private async callAnthropic(request: AIServiceRequest): Promise<AIServiceResponse> {
    const systemMessage = request.messages.find(m => m.role === 'system')
    const userMessages = request.messages.filter(m => m.role !== 'system')
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model,
        system: systemMessage?.content,
        messages: userMessages,
        max_tokens: this.config.maxTokens,
      }),
    })
    
    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      content: data.content[0]?.text || 'I apologize, but I couldn\'t generate a response. Please try again.',
      model: this.config.model,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
      responseTimeMs: 0,
      fallbackUsed: false,
    }
  }
  
  private getFallbackResponse(request: AIServiceRequest): AIServiceResponse {
    const lastMessage = request.messages[request.messages.length - 1]?.content.toLowerCase() || ''
    
    let content: string
    
    if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey')) {
      content = FALLBACK_RESPONSES.greeting(request.context.studentName)
    } else if (lastMessage.includes('overwhelmed') || lastMessage.includes('stressed') || lastMessage.includes('give up')) {
      content = FALLBACK_RESPONSES.encourage()
    } else if (lastMessage.includes('explain') || lastMessage.includes('what is') || lastMessage.includes('how do')) {
      const concept = this.extractConcept(lastMessage)
      content = FALLBACK_RESPONSES.explain(concept)
    } else {
      content = FALLBACK_RESPONSES.unknown()
    }
    
    return {
      content,
      model: 'fallback',
      responseTimeMs: 0,
      fallbackUsed: true,
    }
  }
  
  private extractConcept(message: string): string {
    // Simple concept extraction
    const words = message.split(' ')
    const conceptWords = words.filter(w => w.length > 4 && !['about', 'explain', 'what', 'how', 'does', 'mean'].includes(w))
    return conceptWords.slice(0, 3).join(' ') || 'this concept'
  }
  
  private generateQuickActions(context: AITutorContext, lastMessage: string): AIQuickAction[] {
    const actions: AIQuickAction[] = []
    
    // Add chapter-specific actions
    if (context.currentChapter) {
      actions.push({
        id: 'explain-chapter',
        label: `Explain Chapter ${context.currentChapter}`,
        action: 'explain',
        chapterNumber: context.currentChapter,
        prompt: QUICK_ACTION_PROMPTS.explain(context.currentChapterTitle || `Chapter ${context.currentChapter}`),
      })
      
      actions.push({
        id: 'quiz-chapter',
        label: `Practice Quiz`,
        action: 'quiz',
        chapterNumber: context.currentChapter,
        prompt: QUICK_ACTION_PROMPTS.quiz(context.currentChapter),
      })
    }
    
    // Add weak area remediation
    if (context.weakAreas.length > 0) {
      const topWeak = context.weakAreas[0]
      actions.push({
        id: 'remediate-weak',
        label: `Review ${topWeak.name}`,
        action: 'remediate',
        prompt: QUICK_ACTION_PROMPTS.remediate(topWeak.name),
      })
    }
    
    // Add encouragement
    actions.push({
      id: 'encourage',
      label: 'I need encouragement',
      action: 'encourage',
      prompt: QUICK_ACTION_PROMPTS.encourage(),
    })
    
    // Add study plan
    actions.push({
      id: 'study-plan',
      label: 'What should I study today?',
      action: 'plan',
      prompt: QUICK_ACTION_PROMPTS.plan(),
    })
    
    return actions.slice(0, 4) // Max 4 quick actions
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const aiTutorService = new AITutorService()

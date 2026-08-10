/**
 * AI PLATFORM — ASCYN PRO Phase 5
 * Public exports for AI services
 */

export { AITutorService, aiTutorService } from './tutor-service'
export { AIRemediationEngine, aiRemediationEngine } from './remediation-engine'
export { AIRecommendationEngine, aiRecommendationEngine } from './recommendation-engine'
export { buildAITutorContext, buildQuickContext } from './context-builder'
export { 
  BRAND_VOICE, 
  buildSystemPrompt, 
  buildRemediationPrompt, 
  buildRecommendationPrompt,
  QUICK_ACTION_PROMPTS,
  FALLBACK_RESPONSES 
} from './prompt-templates'

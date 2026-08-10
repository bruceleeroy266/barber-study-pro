# AI PLATFORM IMPLEMENTATION PLAN — ASCYN PRO Phase 5
**Date:** 2026-08-09  
**Agent:** Agent 4 — AI Platform  
**Based on:** `AI_PLATFORM_AUDIT.md`

---

## Implementation Strategy

Given the constraint that **no AI/LLM dependencies exist** in the project, I will implement a **provider-agnostic AI service layer** that:
1. Uses **fetch-based API calls** (no SDK dependency) to OpenAI/Anthropic
2. Falls back to **intelligent rule-based responses** when no API key is configured
3. Stores conversation history in **Supabase** for persistence
4. Follows **Phase 4 design system** for all UI components

---

## Phase 1: Foundation (Types & Service Layer)

### 1.1 AI Types (`src/types/ai.ts`)
- `AIMessage` — single message in conversation
- `AIConversation` — full conversation thread
- `AITutorContext` — student context injected into prompts
- `AITutorResponse` — structured AI response
- `RemediationPlan` — AI-generated remediation
- `StudyRecommendationAI` — AI-enhanced recommendation

### 1.2 AI Service (`src/lib/ai/`)
- `tutor-service.ts` — Core AI tutor logic
- `context-builder.ts` — Builds student context from progress data
- `prompt-templates.ts` — Brand voice system prompts
- `remediation-engine.ts` — AI-powered remediation
- `recommendation-engine.ts` — AI-enhanced recommendations
- `conversation-store.ts` — Supabase persistence

### 1.3 Database Schema (`supabase/migrations/`)
- `ai_conversations` table
- `ai_messages` table
- `ai_remediation_plans` table

---

## Phase 2: Conversation UI Components

### 2.1 Core Chat Components (`src/components/ai/`)
- `AITutorChat.tsx` — Main chat container
- `ChatMessage.tsx` — Individual message bubble
- `ChatInput.tsx` — Message input with send button
- `TypingIndicator.tsx` — AI typing animation
- `ChatHeader.tsx` — Chat header with context info
- `QuickActions.tsx` — Suggested questions/actions

### 2.2 Integration Components
- `AITutorWidget.tsx` — Dashboard widget
- `AITutorPanel.tsx` — Full-page tutor view
- `RemediationChat.tsx` — Remediation-focused chat

---

## Phase 3: Pages & Routes

### 3.1 Student Pages
- `/dashboard/ai-tutor` — Full AI tutor page
- `/dashboard/ai-tutor/[conversationId]` — Continue conversation

### 3.2 API Routes
- `POST /api/ai/tutor` — Send message to AI tutor
- `GET /api/ai/conversations` — List conversations
- `GET /api/ai/conversations/[id]` — Get conversation history
- `POST /api/ai/remediation` — Generate remediation plan

---

## Phase 4: Brand Voice Integration

### 4.1 System Prompts
- Base personality prompt (9 traits)
- Context-aware prompt injection
- Response formatting guidelines
- "Would Gabriel say this?" validation

### 4.2 Voice Validation
- Response tone checker
- Prohibited phrase filter
- Encouragement injector

---

## Phase 5: Testing & Polish

### 5.1 Unit Tests
- `tutor-service.test.ts`
- `context-builder.test.ts`
- `remediation-engine.test.ts`

### 5.2 Component Tests
- `AITutorChat.test.tsx`
- `ChatMessage.test.tsx`

### 5.3 Accessibility Audit
- WCAG AA compliance check
- Keyboard navigation
- Screen reader support

---

## File Structure

```
src/
├── types/
│   └── ai.ts                          # AI type definitions
├── lib/
│   └── ai/
│       ├── index.ts                   # Public exports
│       ├── tutor-service.ts           # Core AI tutor
│       ├── context-builder.ts         # Student context builder
│       ├── prompt-templates.ts        # Brand voice prompts
│       ├── remediation-engine.ts      # AI remediation
│       ├── recommendation-engine.ts   # AI recommendations
│       ├── conversation-store.ts      # Supabase persistence
│       └── fallback-responses.ts      # Rule-based fallback
├── components/
│   └── ai/
│       ├── AITutorChat.tsx            # Main chat container
│       ├── ChatMessage.tsx            # Message bubble
│       ├── ChatInput.tsx              # Input component
│       ├── TypingIndicator.tsx        # Typing animation
│       ├── ChatHeader.tsx             # Chat header
│       ├── QuickActions.tsx           # Suggested actions
│       ├── AITutorWidget.tsx          # Dashboard widget
│       └── index.ts                   # Component exports
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       └── ai-tutor/
│   │           ├── page.tsx           # AI tutor page
│   │           └── [conversationId]/
│   │               └── page.tsx       # Conversation detail
│   └── api/
│       └── ai/
│           ├── tutor/
│           │   └── route.ts           # Tutor API
│           ├── conversations/
│           │   └── route.ts           # List conversations
│           │   └── [id]/
│           │       └── route.ts       # Get conversation
│           └── remediation/
│               └── route.ts           # Remediation API
└── supabase/
    └── migrations/
        └── 20260809_ai_platform.sql   # Database schema
```

---

## Dependencies

No new npm dependencies required. Implementation uses:
- **Native `fetch`** for AI API calls
- **Existing `lucide-react`** for icons
- **Existing `supabase`** for persistence
- **Existing `tailwindcss`** for styling

---

## Success Criteria

1. ✅ AI Tutor responds to student questions with brand voice
2. ✅ Conversation UI follows Phase 4 design system
3. ✅ Context awareness (current chapter, weak areas, progress)
4. ✅ AI remediation generates personalized plans
5. ✅ Study recommendations enhanced with AI insights
6. ✅ All components pass WCAG AA accessibility
7. ✅ Graceful fallback when AI API unavailable
8. ✅ Conversation history persisted in Supabase

---

*Plan complete. Ready for implementation.*

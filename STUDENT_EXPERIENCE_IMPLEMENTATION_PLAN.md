# Student Experience Implementation Plan — ASCYN PRO Phase 5

**Date:** 2026-08-09  
**Planner:** Agent 2 — Student Experience  
**Based On:** STUDENT_EXPERIENCE_AUDIT.md  
**Target:** Phase 4 Design System Compliance + Educational Clarity

---

## Executive Summary

This plan transforms the ASCYN PRO student experience from a **functionally complete but visually inconsistent** platform into a **Phase 4-compliant, cognitively optimized learning environment**.

**Key Principle:** Every design decision must answer: "Does this help the student know where they are, how they're doing, and what to do next?"

---

## Phase 4 Design System Foundation

### 1. Design Tokens

Create `src/lib/design-tokens.ts`:

```typescript
export const tokens = {
  // Color System
  colors: {
    // Brand
    primary: '#D4AF37',      // Gold
    primaryLight: '#F4E4A6',
    primaryDark: '#B8941F',
    
    // Semantic
    success: '#22c55e',      // Green
    warning: '#eab308',      // Yellow
    error: '#ef4444',        // Red
    info: '#3b82f6',         // Blue
    
    // Neutrals
    background: '#030712',   // gray-950
    surface: '#111827',      // gray-900
    surfaceAlt: '#1f2937',   // gray-800
    border: '#374151',       // gray-700
    
    // Text
    textPrimary: '#f9fafb',  // gray-50
    textSecondary: '#d1d5db', // gray-300
    textMuted: '#9ca3af',    // gray-400
    textDisabled: '#6b7280', // gray-500
  },
  
  // Spacing Scale (4px base)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },
  
  // Border Radius
  radius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  
  // Typography
  typography: {
    // Headings
    h1: { size: '1.875rem', weight: 700, lineHeight: 1.2 },  // 30px
    h2: { size: '1.5rem', weight: 600, lineHeight: 1.3 },    // 24px
    h3: { size: '1.25rem', weight: 600, lineHeight: 1.4 },   // 20px
    h4: { size: '1.125rem', weight: 600, lineHeight: 1.4 },  // 18px
    
    // Body
    body: { size: '1rem', weight: 400, lineHeight: 1.5 },    // 16px
    bodySmall: { size: '0.875rem', weight: 400, lineHeight: 1.5 }, // 14px
    
    // Labels
    label: { size: '0.75rem', weight: 500, lineHeight: 1.4 }, // 12px
    labelSmall: { size: '0.625rem', weight: 500, lineHeight: 1.4 }, // 10px
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgb(212 175 55 / 0.15)',
  },
} as const
```

### 2. Component Library

Create `src/components/ui/` components:

#### 2.1 Card Component
```typescript
// src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}
```

#### 2.2 Progress Components
```typescript
// src/components/ui/ProgressBar.tsx
// src/components/ui/ProgressRing.tsx
// src/components/ui/StatCard.tsx
```

#### 2.3 Layout Components
```typescript
// src/components/ui/PageHeader.tsx
// src/components/ui/Section.tsx
// src/components/ui/Grid.tsx
```

---

## Implementation Tasks

### Task 1: Dashboard Redesign (Priority: Critical)

**Goal:** Implement 3-zone structure answering "Where am I? How am I doing? What should I do next?" in 5 seconds.

**Current Issues:**
- 12+ information elements
- No clear hierarchy
- Mixed card styles

**Implementation:**

```
┌─────────────────────────────────────────────────────────┐
│  ZONE 1: ORIENTATION (Max 2 elements)                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Welcome back, [Name]                           │   │
│  │  Chapter X: [Title] — [Progress]% complete      │   │
│  │  [Continue Button]                              │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  ZONE 2: KEY METRICS (Max 3 elements)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ Board    │ │ Overall  │ │ Study    │               │
│  │ Readiness│ │ Progress │ │ Streak   │               │
│  │ [Score]  │ │ [%]      │ │ [Days]   │               │
│  └──────────┘ └──────────┘ └──────────┘               │
├─────────────────────────────────────────────────────────┤
│  ZONE 3: DETAIL CONTENT (Max 2 visible, rest below fold)│
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Tab: Chapters | Analytics | Recommendations]  │   │
│  │                                                 │   │
│  │  Content based on selected tab                  │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Files to Modify:**
- `src/app/(dashboard)/dashboard/page.tsx` — Complete redesign
- `src/components/ui/Card.tsx` — New
- `src/components/ui/StatCard.tsx` — New
- `src/components/ui/ProgressRing.tsx` — New

**Success Criteria:**
- [ ] Maximum 7 distinct information elements visible
- [ ] 3-zone structure clearly implemented
- [ ] "Where am I?" answered by welcome + current chapter
- [ ] "How am I doing?" answered by 3 key metrics
- [ ] "What should I do next?" answered by continue button + recommendations preview
- [ ] All cards use design system tokens
- [ ] Responsive: stacks vertically on mobile

---

### Task 2: Chapter List Enhancement (Priority: High)

**Goal:** Consistent card styling with clear progress indication.

**Implementation:**
- Apply Card component to chapter grid
- Add curriculum progress bar at top
- Implement consistent status badges
- Add empty state

**Files to Modify:**
- `src/app/(dashboard)/dashboard/chapters/page.tsx`
- `src/components/ui/Card.tsx` (reuse)
- `src/components/ui/Badge.tsx` — New

**Success Criteria:**
- [ ] All chapter cards use consistent styling
- [ ] Progress bars use semantic colors
- [ ] Status badges consistent with design system
- [ ] Empty state implemented

---

### Task 3: Chapter Detail Consistency (Priority: High)

**Goal:** Unified theming and consistent content block styling.

**Implementation:**
- Audit all content block components
- Apply design tokens to ChapterHeader
- Standardize spacing between sections
- Add progress indicator within chapter

**Files to Modify:**
- `src/components/chapter/ChapterHeader.tsx`
- `src/components/chapter/ChapterContent.tsx`
- All content block components (InfoCard, Timeline, etc.)

**Success Criteria:**
- [ ] All chapters use consistent header styling
- [ ] Content blocks have consistent spacing
- [ ] Theme system uses design tokens
- [ ] Progress indicator shows position in chapter

---

### Task 4: Progress Page Redesign (Priority: High)

**Goal:** Clear hierarchy with focused metrics.

**Implementation:**
- Implement 3-zone structure
- Reduce visible sections
- Add tabbed interface for detailed analytics
- Apply design system to all components

**Files to Modify:**
- `src/app/(dashboard)/dashboard/progress/page.tsx`
- `src/components/AnalyticsCharts.tsx`

**Success Criteria:**
- [ ] Maximum 7 distinct elements
- [ ] Clear visual hierarchy
- [ ] Consistent card styling
- [ ] Charts use design system colors

---

### Task 5: Missed Questions Polish (Priority: Medium)

**Goal:** Consistent styling with improved empty states.

**Implementation:**
- Apply Card component
- Improve filter UI with design system
- Add empty state illustrations
- Consistent badge styling

**Files to Modify:**
- `src/app/(dashboard)/dashboard/missed-questions/page.tsx`
- `src/components/MissedQuestionBank.tsx`

**Success Criteria:**
- [ ] Consistent card styling
- [ ] Filter UI uses design system
- [ ] Empty state implemented
- [ ] Badge styling consistent

---

### Task 6: Grades & Assessments Consistency (Priority: Medium)

**Goal:** Unified styling with clear data presentation.

**Implementation:**
- Apply design system to stats cards
- Consistent table styling
- Unified color coding for grades

**Files to Modify:**
- `src/app/(dashboard)/dashboard/grades/page.tsx`
- `src/app/(dashboard)/dashboard/assessments/page.tsx`
- `src/components/gradebook/StudentGradeWidget.tsx`

**Success Criteria:**
- [ ] Stats cards consistent with dashboard
- [ ] Tables use design system
- [ ] Color coding semantic and consistent

---

### Task 7: Navigation Enhancement (Priority: Medium)

**Goal:** Consistent active states and improved mobile experience.

**Implementation:**
- Apply design tokens to DashboardNav
- Improve active state visibility
- Add current page indicator
- Enhance mobile menu

**Files to Modify:**
- `src/components/DashboardNav.tsx`

**Success Criteria:**
- [ ] Active states use design system colors
- [ ] Current page clearly indicated
- [ ] Mobile menu smooth and accessible

---

### Task 8: Accessibility Improvements (Priority: High)

**Goal:** WCAG AA compliance across all student pages.

**Implementation:**
- Add prefers-reduced-motion support
- Audit and fix color contrast issues
- Add skip links
- Improve focus management

**Files to Modify:**
- `src/app/globals.css` — Add reduced motion
- All components — Color contrast audit

**Success Criteria:**
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Reduced motion respected
- [ ] Skip links implemented

---

### Task 9: Loading & Empty States (Priority: Medium)

**Goal:** Consistent loading and empty state patterns.

**Implementation:**
- Create LoadingSpinner component
- Create EmptyState component
- Add skeleton screens for dashboard
- Implement error boundaries

**Files to Create:**
- `src/components/ui/LoadingSpinner.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/Skeleton.tsx`

**Success Criteria:**
- [ ] All async data has loading state
- [ ] All lists have empty state
- [ ] Error boundaries catch and display errors gracefully

---

### Task 10: Micro-interactions & Polish (Priority: Low)

**Goal:** Smooth transitions and delightful interactions.

**Implementation:**
- Add page transitions
- Implement hover states
- Add success animations
- Smooth scroll behavior

**Files to Modify:**
- `src/app/globals.css`
- All interactive components

**Success Criteria:**
- [ ] Transitions smooth (150-300ms)
- [ ] Hover states clear
- [ ] Success feedback immediate
- [ ] No janky animations

---

## Implementation Order

### Week 1: Foundation
1. Create design tokens
2. Build Card, StatCard, ProgressRing components
3. Dashboard redesign (Task 1)

### Week 2: Core Pages
4. Chapter list enhancement (Task 2)
5. Chapter detail consistency (Task 3)
6. Progress page redesign (Task 4)

### Week 3: Supporting Pages
7. Missed questions polish (Task 5)
8. Grades & assessments consistency (Task 6)
9. Navigation enhancement (Task 7)

### Week 4: Polish
10. Accessibility improvements (Task 8)
11. Loading & empty states (Task 9)
12. Micro-interactions & polish (Task 10)

---

## Success Metrics

### Quantitative:
- [ ] Dashboard: ≤7 distinct information elements
- [ ] All pages: 100% design token usage
- [ ] Accessibility: WCAG AA compliance
- [ ] Performance: <100ms interaction response

### Qualitative:
- [ ] Student can answer "Where am I?" in <2 seconds
- [ ] Student can answer "How am I doing?" in <3 seconds
- [ ] Student can answer "What should I do next?" in <5 seconds
- [ ] Visual consistency across all pages
- [ ] Educational clarity prioritized over decoration

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking existing functionality | Comprehensive testing after each task |
| Design system inconsistency | Single source of truth in design-tokens.ts |
| Accessibility regression | Automated a11y testing in CI |
| Performance degradation | Bundle size monitoring, lazy loading |
| Scope creep | Strict adherence to Phase 4 standards only |

---

## Dependencies

- Agent 1's component library (if available)
- Existing Supabase schema (no changes required)
- Current quiz/flashcard functionality (preserved)

---

## Deliverables

1. `src/lib/design-tokens.ts` — Design system tokens
2. `src/components/ui/` — Reusable component library
3. Updated student pages with Phase 4 design system
4. `STUDENT_EXPERIENCE_COMPLETION_REPORT.md`

---

**Plan Approved:** [Pending]  
**Implementation Start:** 2026-08-09  
**Target Completion:** 2026-08-23

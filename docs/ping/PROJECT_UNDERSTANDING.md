# Project Understanding — ASCYN PRO Deep Knowledge

**Purpose:** This file provides the deep architectural, curricular, and business understanding needed to work effectively on ASCYN PRO. Read this after [RECOVERY.md](RECOVERY.md).

---

## Table of Contents

1. [Business Model](#business-model)
2. [Application Architecture](#application-architecture)
3. [Curriculum System](#curriculum-system)
4. [Authentication & Authorization](#authentication--authorization)
5. [Database Schema](#database-schema)
6. [Component System](#component-system)
7. [Content Pipeline](#content-pipeline)
8. [Security Architecture](#security-architecture)
9. [Deployment Architecture](#deployment-architecture)
10. [Integration Points](#integration-points)

---

## Business Model

### What ASCYN PRO Does

ASCYN PRO is an AI-powered education platform for vocational licensing schools. It helps students pass licensing exams on the first attempt through:

- **Interactive lessons** — Premium content with immersive design elements
- **Flashcards** — Spaced repetition and adaptive review
- **Quizzes** — Chapter-level assessments with immediate feedback
- **Final exams** — Comprehensive exam simulation
- **AI tutoring** — Personalized remediation and weak-area identification
- **Instructor dashboards** — Progress monitoring, weak-area analytics, intervention tools
- **School administration** — Compliance tracking, hour management, configuration

### Revenue Model

- **B2B SaaS** — Schools pay for student seats
- **Pilot Program** — Initial validation through RISE Program (Patty Pineda, student; Tessa Myers, instructor)
- **Target Market** — Barbering schools first, then expanding to cosmetology, esthetics, nail technology

### Key Differentiators

1. **AI-powered remediation** — Identifies weak areas and provides targeted content
2. **Compliance tracking** — Built-in hour tracking and state board compliance
3. **Instructor effectiveness tools** — Analytics, intervention workflows, reporting
4. **Affordable** — Priced for vocational schools, not enterprise
5. **Accessible** — Mobile-responsive, works on any device

---

## Application Architecture

### High-Level Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication route group
│   │   ├── login/
│   │   ├── signup/
│   │   ├── reset-password/
│   │   └── update-password/
│   ├── (dashboard)/       # Student dashboard route group
│   │   └── dashboard/
│   │       ├── chapters/
│   │       ├── assessments/
│   │       ├── compliance/
│   │       ├── grades/
│   │       ├── messages/
│   │       ├── missed-questions/
│   │       ├── profile/
│   │       └── progress/
│   ├── admin/             # Admin dashboard
│   │   └── school/
│   │       └── configuration/
│   ├── auth/              # Auth callback
│   │   └── callback/
│   ├── demo/              # Demo mode
│   └── instructor/        # Instructor portal
│       ├── assessments/
│       ├── attendance/
│       ├── compliance/
│       ├── gradebook/
│       ├── messages/
│       ├── rubrics/
│       └── student/[studentId]/
├── components/            # React components
│   ├── admin/
│   ├── assessments/
│   ├── attendance/
│   ├── chapter/           # Chapter content components
│   ├── compliance/
│   ├── gradebook/
│   ├── messaging/
│   ├── reports/
│   └── school-owner/
├── lib/                   # Utility libraries and content
│   ├── chapter-*-premium.ts
│   ├── chapter-*-premium-flashcards.ts
│   ├── chapter-*-premium-quiz.ts
│   ├── security/
│   ├── supabase.ts
│   └── supabase-server.ts
├── middleware.ts          # Edge auth enforcement
└── types/                 # TypeScript type definitions
```

### Routing Architecture

| Route Group | Purpose | Auth Required |
|-------------|---------|---------------|
| `(auth)` | Login, signup, password reset | No (but redirects if authenticated) |
| `(dashboard)` | Student learning interface | Yes (student role) |
| `instructor/` | Instructor portal | Yes (instructor role) |
| `admin/` | School administration | Yes (admin/owner role) |
| `demo/` | Demo mode | No |
| `auth/callback` | Supabase auth callback | No |

### Data Flow

1. **Authentication:** Supabase Auth → JWT → Middleware validation → Role-based routing
2. **Content Delivery:** Static TypeScript content files → React components → Client rendering
3. **Progress Tracking:** User interactions → Supabase database → Analytics aggregation
4. **Instructor Analytics:** Student progress → Weak-area mapping → Intervention recommendations

---

## Curriculum System

### Chapter Structure

ASCYN PRO follows the Milady Standard Barbering textbook structure with 21 chapters:

| Chapter | Title | Premium Content | Flashcards | Quiz |
|---------|-------|----------------|------------|------|
| 1 | History of Barbering | ❌ | ✅ | ✅ |
| 2 | Life Skills | ❌ | ✅ | ✅ |
| 3 | Professional Image | ❌ | ✅ | ✅ |
| 4 | Infection Control | ✅ | ✅ | ✅ |
| 5 | Implements, Tools & Equipment | ✅ | ✅ | ✅ |
| 6 | General Anatomy & Physiology | ✅ | ❌ | ✅ |
| 7 | Basics of Chemistry | ✅ | ✅ | ✅ |
| 8 | Basics of Electricity | ✅ | ✅ | ✅ |
| 9 | The Skin | ✅ | ✅ | ✅ |
| 10 | Properties and Disorders of the Hair and Scalp | ✅ | ✅ | ✅ |
| 11 | Treatment of the Hair and Scalp | ✅ | ✅ | ✅ |
| 12 | Men's Facial Massage and Treatments | ✅ | ✅ | ✅ |
| 13 | Shaving and Facial-Hair Design | ✅ | ✅ | ✅ |
| 14 | Men's Haircutting and Styling | ✅ | ✅ | ✅ |
| 15 | Men's Hair Replacement | ✅ | ✅ | ✅ |
| 16 | Women's Haircutting & Styling | ✅ | ✅ | ✅ |
| 17 | Chemical Texture Services | ✅ | ✅ | ✅ |
| 18 | Haircoloring and Lightening | ✅ | ✅ | ✅ |
| 19 | Preparing for Licensure and Employment | ✅ | ✅ | ✅ |
| 20 | Working Behind the Chair | ✅ | ✅ | ✅ |
| 21 | The Business of Barbering | ✅ | ✅ | ✅ |

**Note:** Chapters 16–21 were restored from HTML files into premium TypeScript content in commit `ea2535b`.

### Content File Naming Convention

| Pattern | Content Type | Example |
|---------|-------------|---------|
| `chapter-N-premium.ts` | Lesson content | `chapter-4-premium.ts` |
| `chapter-N-premium-flashcards.ts` | Flashcards | `chapter-4-premium-flashcards.ts` |
| `chapter-N-premium-quiz.ts` | Quiz questions | `chapter-4-premium-quiz.ts` |
| `chapter-N-premium-content.ts` | Alternative lesson format | `chapter-19-premium-content.ts` |
| `chapter-N-premium-remediation.ts` | Remediation content | `chapter-19-premium-remediation.ts` |

### Content Block Types

Chapter lessons are built from reusable content blocks defined in `src/components/chapter/`:

| Component | Purpose |
|-----------|---------|
| `ChapterHeader` | Chapter title, objectives, estimated time |
| `ContentBlock` | Generic content container |
| `HtmlContentBlock` | Raw HTML content (for chapters 18–21) |
| `InfoCard` | Key concept highlight |
| `ProTip` | Professional advice callout |
| `QuoteBlock` | Inspirational or expert quote |
| `ScenarioBlock` | Real-world scenario with decision points |
| `ProScenario` | Advanced professional scenario |
| `ChallengeCard` | Interactive challenge question |
| `Checklist` | Step-by-step procedure checklist |
| `AppearanceChecklist` | Professional appearance verification |
| `ConfidenceBuilder` | Self-assessment and confidence tracking |
| `LevelUp` | Achievement and progress milestone |
| `MilestoneList` | Learning milestone tracking |
| `ProLevelSystem` | Professional skill level indicator |
| `TabbedContent` | Multi-tab content organization |
| `Timeline` | Historical or process timeline |
| `ToolCard` | Tool or equipment highlight |
| `ActionPrompt` | Call-to-action for practice |
| `FeatureGrid` | Feature or benefit grid |
| `ReflectionBlock` | Student reflection prompt |

### Chapter Content Integration

The `chapter-content.ts` file in `src/lib/` serves as the central registry that:
1. Imports all premium content files
2. Maps chapter numbers to content objects
3. Exports a unified `chapterContentData` structure
4. Provides type-safe access to lessons, flashcards, and quizzes

---

## Authentication & Authorization

### Authentication Flow

```
User → Login Page → Supabase Auth → JWT Token → Middleware → Role Check → Route Access
```

### Role Hierarchy

| Role | Access Level | Routes |
|------|-------------|--------|
| **Student** | Basic | `/dashboard/*` |
| **Instructor** | Elevated | `/instructor/*`, `/dashboard/*` |
| **Admin** | Full | `/admin/*`, `/instructor/*`, `/dashboard/*` |
| **Owner** | Full + Config | All routes + school configuration |

### Middleware Enforcement

`src/middleware.ts` enforces authentication at the edge:

1. **Public routes:** `/`, `/login`, `/signup`, `/reset-password`, `/auth/callback`, `/demo`
2. **Protected routes:** All others require valid JWT
3. **Role-based redirects:** Unauthorized users redirected to appropriate dashboard
4. **Approval workflow:** Pending users redirected to login with error message

### Key Auth Files

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Edge auth enforcement |
| `src/lib/security/permissions.ts` | RBAC permission definitions |
| `src/lib/security/server-auth.ts` | Server-side auth helpers |
| `src/lib/security/audit-logger.ts` | Security event logging |
| `src/lib/auth-helpers.ts` | Client-side auth utilities |
| `src/app/(auth)/actions.ts` | Auth server actions |

### Known Auth Issues (Fixed)

- **Redirect loop:** Pending users caused infinite redirects — fixed by skipping approval checks on auth routes
- **Recovery link:** Password recovery callback didn't redirect correctly — fixed in callback route

---

## Database Schema

### Supabase Project

| Field | Value |
|-------|-------|
| **Project Name** | `ascyn-pro` |
| **Project Ref** | `hgyznydxepjsvbjsirpv` |
| **Region** | West US (Oregon) |
| **Org ID** | `jxclbwknnlkeontyeizw` |

### Migration Files (23 total)

Key migrations in order:

1. `20250625009900_create_legacy_core_tables.sql` — Legacy compatibility
2. `20250625010000_create_core_production_tables.sql` — Core tables
3. `20250625010050_fix_schools_anon_select_policy.sql` — RLS fix
4. `20250625010100_create_school_settings.sql` — School configuration
5. `20250625010200_production_indexes_and_rls.sql` — Performance and security
6. `20250625020000_security_hardening.sql` — Additional security
7. `20250625160000_create_enterprise_services_tables.sql` — Enterprise features
8. `20250625180000_create_operational_tables.sql` — Operations
9. `20250628000000_fix_schools_select_rls.sql` — RLS repair
10. `20250701100000_create_beta_agreements_table.sql` — Beta program
11. `20250705210000_create_beta_feedback_table.sql` — Feedback
12. `20260706091600_align_schools_schema.sql` — Schema alignment
13. `20260706120500_complete_schools_schema.sql` — Schema completion
14. `20260711180000_pilot_invite_only_access.sql` — Pilot access control
15. `20260712030000_admin_user_management.sql` — Admin user management
16. `20260712140000_create_missed_questions_table.sql` — Missed questions tracking
17. `20260713100000_create_pilot_inquiries_table.sql` — Pilot inquiries
18. `20260713140000_add_pilot_inquiry_columns.sql` — Inquiry columns
19. `20260714010000_fix_quiz_progress_missed_rls.sql` — RLS fixes
20. `20260715141000_convert_missed_questions_question_id_to_text.sql` — ID type fix
21. `20260715142000_add_missing_table_grants.sql` — Permission grants
22. `20260722010000_create_owner_notifications.sql` — Owner notifications
23. `20260727150000_backfill_missing_profiles.sql` — Profile backfill

### Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles with role and school assignment |
| `schools` | School/organization records |
| `school_settings` | School configuration and preferences |
| `chapters` | Chapter metadata |
| `lessons` | Lesson content and progress |
| `flashcards` | Flashcard content and review history |
| `quizzes` | Quiz questions and attempts |
| `quiz_progress` | Student quiz progress |
| `missed_questions` | Questions answered incorrectly |
| `attendance` | Clock in/out records |
| `grades` | Gradebook entries |
| `messages` | Internal messaging |
| `compliance_records` | State board compliance tracking |
| `beta_agreements` | Beta program agreements |
| `beta_feedback` | Beta user feedback |
| `pilot_inquiries` | Pilot program inquiries |
| `owner_notifications` | Owner notification queue |

### Row Level Security (RLS)

All tables have RLS policies enforcing:
- Users can only access their own data
- Instructors can access their students' data
- Admins can access their school's data
- Service role has full access for system operations

---

## Component System

### Component Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Chapter** | Content rendering | `ChapterHeader`, `ContentBlock`, `ScenarioBlock` |
| **Assessments** | Quiz and exam UI | Quiz forms, results displays |
| **Attendance** | Clock in/out | Time tracking, attendance reports |
| **Compliance** | State board compliance | Hour tracking, compliance reports |
| **Gradebook** | Grade management | Grade entry, grade reports |
| **Messaging** | Internal communication | Message threads, notifications |
| **Reports** | Analytics and reporting | Progress reports, weak-area analysis |
| **Admin** | School administration | Configuration, user management |
| **School Owner** | Owner dashboard | School analytics, compliance overview |

### Component Design Principles

1. **Reusability** — Components are designed for reuse across chapters
2. **Type Safety** — All components have TypeScript interfaces
3. **Accessibility** — ARIA labels, keyboard navigation, screen reader support
4. **Responsiveness** — Mobile-first design with Tailwind CSS
5. **Consistency** — Unified design language across all components

---

## Content Pipeline

### Content Creation Workflow

```
Textbook Reference → Original Content Creation → TypeScript File → Component Integration → QA Review → Production
```

### Content Standards

1. **Originality** — All content must be original; no copying from textbooks
2. **Accuracy** — Content must be technically accurate for barbering
3. **Clarity** — Written at appropriate reading level for vocational students
4. **Engagement** — Interactive elements, scenarios, and real-world applications
5. **Compliance** — Aligned with state board licensing requirements

### HTML to TypeScript Migration

Chapters 16–21 were originally HTML files in the repository root. They were migrated to TypeScript premium content in commit `ea2535b`. The migration process:

1. Extract content from HTML files
2. Convert to TypeScript content blocks
3. Create premium lesson, flashcard, and quiz files
4. Integrate into `chapter-content.ts` registry
5. Verify rendering in the application

---

## Security Architecture

### Security Layers

| Layer | Implementation | Status |
|-------|---------------|--------|
| **Authentication** | Supabase Auth with JWT | ✅ Active |
| **Authorization** | RBAC in `permissions.ts` | ✅ Active |
| **Edge Enforcement** | Middleware auth checks | ✅ Active |
| **Database Security** | RLS policies | ✅ Active |
| **Audit Logging** | `audit-logger.ts` | ✅ Active |
| **Demo Mode Separation** | `demo-helpers.ts` | ✅ Active |
| **Rate Limiting** | Not implemented | ❌ Missing |
| **Secure Invitations** | Not implemented | ❌ Missing |
| **Password Lifecycle** | Not implemented | ❌ Missing |

### Security Files

| File | Purpose |
|------|---------|
| `src/lib/security/permissions.ts` | Role-based access control definitions |
| `src/lib/security/server-auth.ts` | Server-side auth helpers (`requireAuth`, `requirePermission`) |
| `src/lib/security/audit-logger.ts` | Security event logging (console + optional DB) |
| `src/middleware.ts` | Edge authentication enforcement |
| `src/lib/demo-helpers.ts` | Demo mode separation from production |

### Security Best Practices

1. **Never expose service role key** — Use only in server-side code
2. **Always validate on server** — Client-side validation is UX only
3. **Log security events** — Failed logins, permission denials, suspicious activity
4. **Use RLS** — Database-level security is the last line of defense
5. **Separate demo mode** — Demo data must never mix with production data

---

## Deployment Architecture

### Current State

| Component | Status | Notes |
|-----------|--------|-------|
| **Vercel** | ❌ Not verified | CLI not installed |
| **Custom Domain** | ❌ Not verified | `ascynpro.com` not configured |
| **Email** | ❌ Not configured | No provider configured |
| **Analytics** | ❌ Not configured | No Vercel Analytics |
| **CI/CD** | ❌ Not configured | No GitHub Actions |
| **Storage** | ⚠️ Unknown | Supabase Storage not verified |

### Deployment Checklist (When Ready)

1. [ ] Install Vercel CLI and authenticate
2. [ ] Link project to Vercel
3. [ ] Configure environment variables
4. [ ] Deploy to production
5. [ ] Configure custom domain
6. [ ] Set up SSL certificate
7. [ ] Configure email provider
8. [ ] Set up analytics
9. [ ] Configure CI/CD pipeline
10. [ ] Verify all routes in production

---

## Integration Points

### External Services

| Service | Purpose | Status |
|---------|---------|--------|
| **Supabase** | Database, Auth, Storage | ✅ Linked |
| **Vercel** | Hosting, Deployment | ❌ Not configured |
| **Resend/SendGrid** | Email | ❌ Not configured |
| **GitHub** | Version control | ✅ Active |
| **OpenClaw** | AI assistant platform | ✅ Active |

### API Routes

| Route | Purpose | Method |
|-------|---------|--------|
| `/auth/callback` | Supabase auth callback | GET |

### Environment Variables

Required environment variables (from `.env.local` and `.env.production`):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |

---

## Cross-References

- **[CURRENT_STATE.md](CURRENT_STATE.md)** — Current verified state of all systems
- **[OPERATING_PROCEDURES.md](OPERATING_PROCEDURES.md)** — How to work on each system
- **[VERIFICATION_PROTOCOL.md](VERIFICATION_PROTOCOL.md)** — How to verify claims about each system
- **[ENVIRONMENT_REFERENCE.md](ENVIRONMENT_REFERENCE.md)** — Tool versions and paths
- **[GLOSSARY.md](GLOSSARY.md)** — Term definitions

---

*This document provides the foundational understanding needed to work on ASCYN PRO. For current state, see [CURRENT_STATE.md](CURRENT_STATE.md). For work procedures, see [OPERATING_PROCEDURES.md](OPERATING_PROCEDURES.md).*

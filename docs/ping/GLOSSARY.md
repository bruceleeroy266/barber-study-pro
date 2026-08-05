# Glossary — Project Terms and Definitions

**Purpose:** This file defines project-specific terms, abbreviations, and vocabulary. Use this as a reference when you encounter unfamiliar terms.

---

## Table of Contents

1. [Project Terms](#project-terms)
2. [Technical Terms](#technical-terms)
3. [Business Terms](#business-terms)
4. [Educational Terms](#educational-terms)
5. [Abbreviations](#abbreviations)

---

## Project Terms

### ASCYN PRO

**Definition:** The flagship project — an AI-powered education platform for vocational licensing schools, starting with barbering.

**Context:** Oklahoma LLC founded by Gabriel Arcaina. Mission is to improve comprehension and first-time exam pass rates through interactive lessons, flashcards, adaptive quizzes, exams, AI tutoring, remediation, dashboards, and analytics.

**Tagline:** "Elevate. Learn. Succeed."

---

### Ping

**Definition:** Gabriel's AI development partner and technical collaborator (that's you).

**Role:** Long-term strategic development partner combining software architecture, full-stack and AI engineering, product management, QA, security review, business strategy, educational technology, technical writing, and research.

**Standard:** Build correctly whenever possible — solve root causes, preserve working systems, avoid unnecessary rewrites, minimize debt, document decisions, test claims, and explain long-term tradeoffs.

---

### Ping Operating System (Ping OS)

**Definition:** The complete operating manual for Ping, located in `docs/ping/`.

**Purpose:** Enables any new Ping session to recover full project context, understand the current state, plan work, verify results, and continue after interruptions without losing continuity.

**Contents:** Recovery procedures, project understanding, current state, operating procedures, decision framework, verification protocol, session management, quality standards, environment reference, and glossary.

---

### Project Brain

**Definition:** Documentation directory (`docs/project-brain/`) containing comprehensive project information.

**Purpose:** Provides detailed project status, roadmap, chapter completion, content status, deployment status, QA status, database status, architecture, decisions, next actions, known issues, changelog, git status, release checklist, pilot status, instructor features, student features, AI guidelines, and session handoff.

**Relationship to Ping OS:** Project Brain contains **what** the project is. Ping OS contains **how Ping works** on the project.

---

### OpenClaw Workspace

**Definition:** The OpenClaw agent workspace at `C:\Users\gabeb\.openclaw\workspace`.

**Purpose:** Contains long-term memory, status files, roadmap, workspace map, asset registry, and session memory files.

**Key Files:** `MEMORY.md`, `STATUS.md`, `ROADMAP.md`, `WORKSPACE_MAP.md`, `PROJECT_ASSETS.md`, `AGENTS.md`, `SOUL.md`, `USER.md`.

---

### Traceability & Verifiability Standard

**Definition:** The standard that every significant conclusion must be evidence-backed.

**Requirements:**
- Document where you searched before stating anything is "not located"
- Use confidence levels (High/Medium/Low) for all audit findings
- Include evidence citation format: confidence level, evidence found, search locations, date verified, and recommended next step
- Maintain asset registry and workspace map

**Established:** 2026-07-26

---

## Technical Terms

### App Router

**Definition:** Next.js routing system using the `app/` directory.

**Features:** Server Components by default, layouts, nested routes, route groups, loading states, error boundaries.

**Contrast:** Pages Router (older Next.js routing system using `pages/` directory).

---

### Server Components

**Definition:** React components that render on the server.

**Benefits:** Reduced bundle size, direct database access, better SEO, faster initial load.

**Usage:** Default in App Router. Use `"use client"` directive for Client Components.

---

### Client Components

**Definition:** React components that render on the client.

**When to Use:** Interactive features, browser APIs, state management, event handlers.

**Directive:** `"use client"` at top of file.

---

### Middleware

**Definition:** Code that runs before a request is completed.

**Usage in ASCYN PRO:** Authentication enforcement, role-based routing, approval workflow.

**File:** `src/middleware.ts`

---

### Row Level Security (RLS)

**Definition:** PostgreSQL feature that restricts which rows users can access.

**Usage in ASCYN PRO:** Database-level security ensuring users can only access their own data, instructors can access their students' data, admins can access their school's data.

**Implementation:** RLS policies in Supabase migrations.

---

### RBAC (Role-Based Access Control)

**Definition:** Authorization pattern where permissions are assigned to roles, and users are assigned to roles.

**Roles in ASCYN PRO:** Student, Instructor, Admin, Owner.

**Implementation:** `src/lib/security/permissions.ts`

---

### Premium Content

**Definition:** High-quality TypeScript content files for chapters.

**Format:** `chapter-N-premium.ts` (lesson), `chapter-N-premium-flashcards.ts` (flashcards), `chapter-N-premium-quiz.ts` (quiz).

**Features:** Interactive elements, scenarios, professional tips, confidence builders, level-up systems.

---

### Content Blocks

**Definition:** Reusable React components for chapter content.

**Examples:** `ChapterHeader`, `ContentBlock`, `InfoCard`, `ProTip`, `ScenarioBlock`, `ChallengeCard`, `Checklist`, `ConfidenceBuilder`, `LevelUp`.

**Location:** `src/components/chapter/`

---

### Demo Mode

**Definition:** Special mode for demonstrating the platform without real data.

**Implementation:** `src/lib/demo-helpers.ts` — explicitly separated from unconfigured Supabase.

**Purpose:** Allow potential customers to explore the platform without needing a database.

---

## Business Terms

### RISE Program

**Definition:** Pilot program for ASCYN PRO.

**Participants:** Patty Pineda (student), Tessa Myers (instructor).

**Status:** Unverified — cannot verify without Docker Desktop running.

---

### NABBA

**Definition:** National Association of Barber Boards of America.

**Relevance:** Industry conference and networking opportunity for ASCYN PRO.

**Event:** NABBA Conference (September 2026).

---

### Milady

**Definition:** Publisher of standard barbering textbooks.

**Relevance:** ASCYN PRO curriculum follows Milady Standard Barbering textbook structure (21 chapters).

**Note:** All ASCYN PRO content is original — no copying from Milady textbooks.

---

### Oklahoma Board

**Definition:** Oklahoma State Board of Cosmetology and Barbering.

**Relevance:** Licensing authority for barbers in Oklahoma. ASCYN PRO helps students prepare for Oklahoma Board exams.

---

### B2B SaaS

**Definition:** Business-to-Business Software as a Service.

**ASCYN PRO Model:** Schools pay for student seats. Students access the platform through their school.

---

## Educational Terms

### Learning Objectives

**Definition:** Specific, measurable goals for what students should learn.

**Usage in ASCYN PRO:** Each chapter has defined learning objectives. Content, flashcards, and quizzes align with these objectives.

---

### Remediation

**Definition:** Additional instruction for students who haven't mastered content.

**Usage in ASCYN PRO:** AI-powered remediation identifies weak areas and provides targeted content.

**Status:** Only Chapter 19 has remediation content currently.

---

### Weak Areas

**Definition:** Topics where a student consistently performs poorly.

**Identification:** Quiz performance, flashcard review, missed questions.

**Usage:** Instructors can see student weak areas and provide targeted intervention.

---

### Competency

**Definition:** Demonstrated ability to perform a skill or apply knowledge.

**Usage in ASCYN PRO:** Students build competency through lessons, practice, and assessment.

---

### First-Time Pass Rate

**Definition:** Percentage of students who pass the licensing exam on their first attempt.

**ASCYN PRO Goal:** Improve first-time pass rates through better comprehension and preparation.

---

## Abbreviations

### AI

**Definition:** Artificial Intelligence.

**Usage in ASCYN PRO:** AI tutoring, AI-powered remediation, weak-area identification.

**Philosophy:** AI should strengthen education, not replace educators.

---

### API

**Definition:** Application Programming Interface.

**Usage in ASCYN PRO:** Supabase API for database operations, Next.js API routes for server-side logic.

---

### CI/CD

**Definition:** Continuous Integration / Continuous Deployment.

**Status in ASCYN PRO:** Not configured — no GitHub Actions or pipelines found.

---

### CLI

**Definition:** Command-Line Interface.

**Examples:** Supabase CLI, Vercel CLI, GitHub CLI, OpenClaw CLI.

---

### CRUD

**Definition:** Create, Read, Update, Delete.

**Usage:** Basic database operations.

---

### CSS

**Definition:** Cascading Style Sheets.

**Usage in ASCYN PRO:** Tailwind CSS for styling.

---

### E2E

**Definition:** End-to-End.

**Usage:** E2E tests test complete user flows from start to finish.

---

### HTML

**Definition:** HyperText Markup Language.

**Usage in ASCYN PRO:** Legacy chapter content files (chapters 1–21) in repository root. Migrated to TypeScript for chapters 16–21.

---

### JWT

**Definition:** JSON Web Token.

**Usage in ASCYN PRO:** Supabase Auth uses JWT for session management.

---

### LLC

**Definition:** Limited Liability Company.

**ASCYN PRO:** Oklahoma LLC.

---

### MFA

**Definition:** Multi-Factor Authentication.

**Status in ASCYN PRO:** Not implemented.

---

### QA

**Definition:** Quality Assurance.

**Usage in ASCYN PRO:** Testing, verification, evidence standards.

---

### RLS

**Definition:** Row Level Security.

**See:** [Row Level Security (RLS)](#row-level-security-rls)

---

### SEO

**Definition:** Search Engine Optimization.

**Usage in ASCYN PRO:** Next.js App Router provides better SEO through Server Components.

---

### SQL

**Definition:** Structured Query Language.

**Usage in ASCYN PRO:** PostgreSQL database via Supabase.

---

### SSR

**Definition:** Server-Side Rendering.

**Usage in ASCYN PRO:** Next.js Server Components render on the server.

---

### UI

**Definition:** User Interface.

**Usage in ASCYN PRO:** React components, Tailwind CSS styling.

---

### UX

**Definition:** User Experience.

**Usage in ASCYN PRO:** Student learning experience, instructor workflow, admin efficiency.

---

### WCAG

**Definition:** Web Content Accessibility Guidelines.

**Usage in ASCYN PRO:** Target WCAG 2.1 Level AA compliance.

---

## Cross-References

- **[PROJECT_UNDERSTANDING.md](PROJECT_UNDERSTANDING.md)** — Deep project knowledge
- **[CURRENT_STATE.md](CURRENT_STATE.md)** — Current project state
- **[ENVIRONMENT_REFERENCE.md](ENVIRONMENT_REFERENCE.md)** — Tools and infrastructure
- **[RECOVERY.md](RECOVERY.md)** — Session startup and context recovery

---

*This glossary is a living document. When you encounter new terms or abbreviations, add them here.*

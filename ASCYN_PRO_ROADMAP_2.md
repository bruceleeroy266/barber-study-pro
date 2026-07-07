# ASCYN PRO Roadmap 2.0

**Version:** 2.1  
**Date:** 2026-07-07  
**Branch:** `workstation-transfer-safety`  
**Current verified commit:** `bbf925a chore(config): add .env.example and allow it in gitignore`  

---

## Priority Reorder Notice (2026-07-07)

Per Gabriel's direction, the immediate work order has changed:

1. **Oklahoma Board Presentation Package** — new top priority
2. **NABBA Booth Launch** — second priority; booth production begins only after Oklahoma package is presentation-ready
3. **Product Development** (Beta Stabilization, Student Platform, Instructor Platform, School/Admin) — resumes around NABBA preparation and after
4. **Commercial Release** — remains final phase

The phase definitions below remain accurate, but the execution order is now driven by the external deadlines above. See `01-plan/Executive-Dashboard.md` for live status.

---

## Executive Summary

This roadmap turns ASCYN PRO from a feature-heavy demo into a disciplined, release-ready product. Work is organized into six phases, each with a clear goal, exit criteria, and dependency chain. No phase is declared complete until its exit criteria are verified by Gabe and Ping.

---

## Phase 0: Oklahoma Board Presentation Package

**Goal:** Win the confidence of Oklahoma licensing regulators with a complete, professional presentation package.

**Focus Areas:**
- Understand the board's priorities, concerns, and decision criteria
- Frame ASCYN PRO as a force multiplier for compliance, student success, and school accountability
- Demonstrate the platform with a live or recorded demo
- Leave behind materials that continue selling after the meeting

**Deliverables:**
- Presentation deck
- Speaker notes
- Handout
- Leave-behind packet
- Executive summary
- FAQ sheet
- Demo script
- Supporting visuals

**Exit Criteria:**
- Gabriel reviews and approves every deliverable
- Demo can be delivered smoothly in the allotted time
- Materials are board-ready and professionally formatted
- Presentation-ready status confirmed

---

## Phase 1: Beta Stabilization

**Goal:** Make the existing platform trustworthy enough for real beta users.

**Focus Areas:**
- Fix auth, signup, email verification, login/logout flows
- Stabilize dashboard navigation and progress tracking
- Complete Chapter 16 polish and verification
- Implement and verify Beta Agreement + Beta Checklist flows
- Ensure failed quizzes do not mark chapters complete; passed quizzes do
- Flashcard progress tracks correctly (target: 50% = completion threshold)
- Feedback capture and admin visibility
- Mobile responsiveness pass for all beta-facing screens

**Deliverables:**
- `BETA_PHASE_1_QA_CHECKLIST.md` completed and signed off
- All P1 bugs fixed or documented with workarounds
- Beta onboarding flow (signup → agreement → checklist → dashboard) is frictionless
- Feedback table wired for students; admin view functional

**Exit Criteria:**
- `npm run build` passes
- `npx tsc --noEmit` passes
- QA checklist 100% complete
- Gabe approves beta release

---

## Phase 2: Student Learning Platform Polish

**Goal:** The student experience is complete, consistent, and exam-ready for Chapters 1–16.

**Focus Areas:**
- Migrate remaining legacy curriculum gaps (Chapter 6 premium flashcards)
- Standardize all chapter lesson formats and themes
- Improve quiz retest, missed-questions bank, and study recommendations
- Add timed, randomized board-exam simulation mode
- Strengthen weak-area concept mapping and adaptive study plans
- Profile page becomes editable (name, school, preferences)
- Progress analytics and streaks/gamification (lightweight)

**Deliverables:**
- Chapter 6 premium flashcards
- Board exam simulation feature
- Enhanced missed-questions retest flow
- Editable student profile

**Exit Criteria:**
- Chapters 1–16 are premium-format complete
- All student-facing flows pass QA
- Build and typecheck clean
- Gabe signs off on student experience

---

## Phase 3: Instructor Platform

**Goal:** Instructors can confidently manage students, track progress, and identify at-risk learners.

**Focus Areas:**
- Complete instructor dashboard (roster, student detail, analytics)
- Make instructor notes persistence production-ready
- Printable reports for students and classes
- Weak-area analytics and recommended focus
- Messaging / announcements between instructors and students
- Attendance and gradebook workflows
- Instructor onboarding and role verification

**Deliverables:**
- Production-grade instructor notes table and UI
- Class-level and student-level printable reports
- Instructor messaging center
- Attendance logging and gradebook views

**Exit Criteria:**
- Instructor flows tested with demo and live data
- Build and typecheck clean
- Gabe approves instructor release

---

## Phase 4: School / Admin Platform

**Goal:** Schools can onboard, manage users, configure curriculum, and operate at scale.

**Focus Areas:**
- Replace admin placeholder buttons with real functionality
- School creation / selection / configuration workflows
- User management (students, instructors, admins)
- Bulk enrollment and invite flows
- Content management (chapters, quizzes, flashcards visibility)
- Compliance and reporting dashboards
- Role-based access control (RBAC) hardening

**Deliverables:**
- Functional admin school management
- User management UI
- Bulk enrollment system
- Admin analytics dashboard

**Exit Criteria:**
- Admin can fully onboard a school without code changes
- RBAC and RLS policies verified
- Build and typecheck clean
- Gabe approves admin release

---

## Phase 5: NABBA Booth Launch

**Goal:** Present ASCYN PRO as an established ed-tech company at NABBA, September 20, 2026.

**Dependency:** Phase 0 (Oklahoma Board Presentation Package) must be presentation-ready before booth production begins.

**Focus Areas:**
- Polish demo flows for 30s, 3min, and 10min booth demos
- Create cinematic promo video and loop it on booth TV
- Print brochures (Student / Instructor / School Owner editions)
- Order branded apparel (black polos or quarter-zips, gold logo)
- Prepare booth materials: backdrop, banners, tablecloth, floor mat, QR signs, business cards
- Build lead capture process
- Prepare answers for difficult questions
- Practice demo repeatedly
- Ensure mobile demo works offline-ish or on conference Wi-Fi

**Deliverables:**
- Booth material checklist complete
- Promo video finalized
- Lead capture system live
- Demo script and FAQ document
- NABBA-ready production deploy

**Exit Criteria:**
- Oklahoma Board package is presentation-ready
- All booth materials ordered/printed
- Demo practiced and timed
- Production environment stable
- Gabe approves booth readiness

---

## Phase 6: Commercial Release

**Goal:** Launch ASCYN PRO as a paid, scalable product for barbering and cosmetology schools.

**Focus Areas:**
- Payment integration (Stripe / Paddle / school invoicing)
- Subscription and school licensing tiers
- Privacy policy, terms of service, and legal review
- LLC, domain, and trademark readiness
- Email notifications and marketing automation
- Expanded curriculum: cosmetology, nail tech, esthetics, instructor training, apprenticeships
- White-label and multi-tenant school support
- Customer support workflow and documentation

**Deliverables:**
- Payment and billing system
- Legal docs finalized
- Multi-program curriculum expansion plan
- Customer support playbook

**Exit Criteria:**
- First paying school or pilot agreement signed
- Production deploy is stable and monitored
- Gabe approves commercial launch

---

## Dependency Map

```
Phase 0: Oklahoma Board Presentation Package (priority interrupt)
    │
    ├──► Phase 5: NABBA Booth Launch (begins only after Phase 0 is presentation-ready)
    │
    ▼
Phase 1: Beta Stabilization
    │
    ▼
Phase 2: Student Learning Platform Polish
    │
    ▼
Phase 3: Instructor Platform
    │
    ▼
Phase 4: School / Admin Platform
    │
    ▼
Phase 6: Commercial Release
```

**Note:** Phase 0 and Phase 5 are driven by external deadlines and take precedence over product phases until presentation-ready and booth-ready status are achieved.


---

## Current Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 | In Progress | Beta agreement, checklist, and feedback admin visibility recently added; QA checklist is next |
| Phase 2 | Not Started | Waiting for Phase 1 completion |
| Phase 3 | Partial | Instructor dashboard scaffolded; notes persistence needs live DB |
| Phase 4 | Partial | Admin UI exists but is mostly placeholder |
| Phase 5 | Planning | NABBA 2026-09-20 is hard deadline |
| Phase 6 | Not Started | Blocked on business/legal readiness |

---

## Decision Log

| Date | Decision | Owner |
|------|----------|-------|
| 2026-07-03 | Adopt `origin/workstation-transfer-safety` as single source of truth | Gabe + Ping |
| 2026-07-03 | Phase 1 = Beta Stabilization before any further feature expansion | Gabe + Ping |
| 2026-07-03 | NABBA booth = Phase 5, dependent on School/Admin platform readiness | Gabe + Ping |

---

**Next Action:** Complete `BETA_PHASE_1_QA_CHECKLIST.md` and execute Phase 1 QA.

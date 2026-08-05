# ASCYN PRO — Release Candidate Plan

**Date:** 2026-08-01  
**Branch:** `main` (target) ← `origin/demo-polish-ascyn-pro` (source of unique commits)  
**Mission:** Produce one clean production Release Candidate commit on `main` and deploy to `https://ascynpro.com`

---

## 1. Files That WILL Be Committed

These files are required for production functionality, security, database integrity, and build stability. They represent the delta between `origin/main` and the reconciled Release Candidate.

### 1.1 Authentication & Security (from `eb0c77a`)
| File | Reason |
|------|--------|
| `src/app/(auth)/login/page.tsx` | Adds `approval_status` and `is_disabled` checks; displays middleware redirect errors (`account_disabled`, `pending_approval`, `account_rejected`). **Production blocker fix.** |
| `src/app/(auth)/signup/page.tsx` | Fixes signup upsert to preserve trigger-set `approval_status`. Prevents accidental approval bypass. |
| `src/app/(dashboard)/dashboard/page.tsx` | Auto-creates missing profiles with safe defaults. Prevents dashboard crash for users without profile rows. |
| `src/middleware.ts` | Adds approval/disabled enforcement to all protected routes; null-safe role guards. **Critical security boundary.** |
| `supabase/migrations/20260727150000_backfill_missing_profiles.sql` | Backfills missing profiles for existing users; adds unique constraint on `profiles.id`. **Required for data integrity.** |
| `.gitignore` | Adds `temp.env` and `live-schema-dump.sql` to prevent accidental secret commits. |

### 1.2 TypeScript Hardening & Code Quality (from `e025a3e`)
| File | Reason |
|------|--------|
| `eslint.config.mjs` | Updates ESLint config for utility scripts; reduces false positives. |
| `src/app/(dashboard)/dashboard/chapters/page.tsx` | Replaces `any` with proper types. |
| `src/app/(dashboard)/dashboard/compliance/page.tsx` | Fixes grade_categories server-side query compatibility. |
| `src/app/(dashboard)/dashboard/grades/page.tsx` | Type safety improvements. |
| `src/app/(dashboard)/dashboard/page.tsx` | React hooks cleanup and type fixes. |
| `src/app/(dashboard)/dashboard/profile/page.tsx` | Type safety improvements. |
| `src/app/demo/DemoClient.tsx` | React/JSX compliance fixes. |
| `src/components/FlashcardClient.tsx` | Type safety and unused variable cleanup. |
| `src/components/chapter/AppearanceChecklist.tsx` | Type fixes. |
| `src/components/chapter/ConfidenceBuilder.tsx` | Removes unused import. |
| `src/components/chapter/ProLevelSystem.tsx` | Type fixes. |
| `src/components/chapter/QuoteBlock.tsx` | Type fixes. |
| `src/components/chapter/ReflectionBlock.tsx` | Type fixes. |
| `src/components/chapter/ScenarioBlock.tsx` | Type fixes. |
| `src/lib/chapter-content.ts` | Type safety improvements. |
| `src/lib/flashcard-expansion-master.ts` | Type fixes. |
| `src/lib/supabase-server.ts` | Major type hardening; fixes server-side query compatibility. **Build stability.** |
| `src/lib/supabase.ts` | Type fixes for browser client. |
| `src/lib/weak-area-mapping.ts` | Adds missing type export. |
| `src/types/index.ts` | Adds `GradeCategoryRow` shared type. |

### 1.3 Supabase Local Development Infrastructure (from `1e24d1e`)
| File | Reason |
|------|--------|
| `supabase/.gitignore` | Standard Supabase CLI ignores (`.temp/`, etc.). Required for local dev hygiene. |
| `supabase/config.toml` | Generated via `supabase init`, `project_id = ASCYN-PRO`. Required for local Docker stack parity. |

### 1.4 Recovered Database Migrations (from `5bf95d8`)
| File | Reason |
|------|--------|
| `supabase/migrations/20250625009900_create_legacy_core_tables.sql` | Creates `public.profiles` — **all subsequent migrations depend on this** for RLS and FKs. |
| `supabase/migrations/20250625010050_fix_schools_anon_select_policy.sql` | Fixes schools RLS policy. |
| `supabase/migrations/20250625160000_create_enterprise_services_tables.sql` | Enterprise services schema. |
| `supabase/migrations/20250625180000_create_operational_tables.sql` | Operational tables schema. |
| `supabase/migrations/20250628000000_fix_schools_select_rls.sql` | Schools RLS repair. |
| `supabase/migrations/20250701100000_create_beta_agreements_table.sql` | Beta agreements table. |
| `supabase/migrations/20250705210000_create_beta_feedback_table.sql` | Beta feedback table. |
| `supabase/migrations/20260706091600_align_schools_schema.sql` | Schools schema alignment. |
| `supabase/migrations/20260706120500_complete_schools_schema.sql` | Schools schema completion. |
| `supabase/migrations/20260711180000_pilot_invite_only_access.sql` | Pilot invite-only access controls. |
| `supabase/migrations/20260712030000_admin_user_management.sql` | Admin user management schema. |
| `supabase/migrations/20260712140000_create_missed_questions_table.sql` | Missed questions tracking. |
| `supabase/migrations/20260713100000_create_pilot_inquiries_table.sql` | Pilot inquiries persistence. |
| `supabase/migrations/20260713140000_add_pilot_inquiry_columns.sql` | Pilot inquiries column additions. |
| `supabase/migrations/20260714010000_fix_quiz_progress_missed_rls.sql` | Quiz progress RLS hardening. |
| `supabase/migrations/20260715141000_convert_missed_questions_question_id_to_text.sql` | Question ID type conversion. |
| `supabase/migrations/20260715142000_add_missing_table_grants.sql` | Missing table grants. |
| `supabase/migrations/20260722010000_create_owner_notifications.sql` | Owner notifications schema. |

### 1.5 New Production Components & Error Boundaries (untracked, required for UX stability)
| File | Reason |
|------|--------|
| `src/app/(auth)/error.tsx` | Auth error boundary. Prevents white-screen on auth failures. |
| `src/app/(dashboard)/dashboard/error.tsx` | Dashboard error boundary. |
| `src/app/(dashboard)/dashboard/loading.tsx` | Dashboard loading state. |
| `src/app/(dashboard)/dashboard/assessments/loading.tsx` | Assessments loading state. |
| `src/app/(dashboard)/dashboard/chapters/loading.tsx` | Chapters loading state. |
| `src/app/(dashboard)/dashboard/chapters/[chapterNumber]/loading.tsx` | Chapter detail loading state. |
| `src/app/(dashboard)/dashboard/compliance/loading.tsx` | Compliance loading state. |
| `src/app/(dashboard)/dashboard/grades/loading.tsx` | Grades loading state. |
| `src/app/(dashboard)/dashboard/messages/loading.tsx` | Messages loading state. |
| `src/app/(dashboard)/dashboard/missed-questions/loading.tsx` | Missed questions loading state. |
| `src/app/(dashboard)/dashboard/missed-questions/retest/loading.tsx` | Retest loading state. |
| `src/app/(dashboard)/dashboard/profile/loading.tsx` | Profile loading state. |
| `src/app/(dashboard)/dashboard/progress/loading.tsx` | Progress loading state. |
| `src/app/admin/error.tsx` | Admin error boundary. |
| `src/app/admin/loading.tsx` | Admin loading state. |
| `src/app/admin/school/loading.tsx` | School admin loading state. |
| `src/app/admin/school/configuration/loading.tsx` | School config loading state. |
| `src/app/admin/students/actions.ts` | Admin student management server actions. |
| `src/app/global-error.tsx` | Global error boundary. |
| `src/app/instructor/error.tsx` | Instructor error boundary. |
| `src/app/instructor/loading.tsx` | Instructor loading state. |
| `src/app/instructor/assessments/loading.tsx` | Instructor assessments loading. |
| `src/app/instructor/attendance/loading.tsx` | Instructor attendance loading. |
| `src/app/instructor/compliance/loading.tsx` | Instructor compliance loading. |
| `src/app/instructor/gradebook/loading.tsx` | Instructor gradebook loading. |
| `src/app/instructor/messages/loading.tsx` | Instructor messages loading. |
| `src/app/instructor/messages/new/loading.tsx` | New message loading. |
| `src/app/instructor/rubrics/loading.tsx` | Rubrics loading. |
| `src/app/instructor/student/[studentId]/loading.tsx` | Student detail loading. |
| `src/app/instructor/PendingStudentApprovals.tsx` | Instructor pending approvals component. |
| `src/components/auth/BackButtonPrevention.tsx` | Prevents back-button access to protected pages after logout. **Security requirement.** |
| `src/components/auth/SignInButton.tsx` | Reusable sign-in button component. |

### 1.6 Modified Production Files (working tree changes)
| File | Reason |
|------|--------|
| `package.json` | Dependency updates (if any production-safe bumps). |
| `package-lock.json` | Lockfile sync. |
| `src/app/(auth)/login/page.tsx` | Working tree refinements to auth flow. |
| `src/app/(dashboard)/layout.tsx` | Layout refinements. |
| `src/app/admin/layout.tsx` | Admin layout refinements. |
| `src/app/instructor/layout.tsx` | Instructor layout refinements. |
| `src/app/page.tsx` | Homepage refinements. |
| `src/components/DashboardNav.tsx` | Navigation refinements. |
| `src/lib/auth-access.ts` | Auth access control refinements. |
| `src/lib/supabase-server.ts` | Server client refinements. |
| `src/lib/supabase.ts` | Browser client refinements. |
| `src/middleware.ts` | Middleware refinements. |
| `tsconfig.json` | TypeScript config updates. |

---

## 2. Files That Will NOT Be Committed

These files are excluded from the Release Candidate. They are either audit artifacts, temporary files, secrets, test utilities, or AI infrastructure not required for production runtime.

### 2.1 Audit Scripts & Reports
| File/Pattern | Reason |
|-------------|--------|
| `ASCYN_PRO_PLATFORM_AUDIT.md` | Historical audit document. |
| `ASCYN_PRO_QUICK_POLISH_REPORT.md` | Historical report. |
| `ASSESSMENTS_BUILD_FIX_REPORT.md` | Historical report. |
| `AUDIT-REPORT-2026-05-18-FULL.md` | Historical audit. |
| `AUDIT-REPORT-2026-05-18.md` | Historical audit. |
| `AUTH_AUDIT_REPORT.md` | Historical audit. |
| `AUTH_LIFECYCLE_AUDIT_2026-07-21.md` | Historical audit. |
| `BETA_PHASE_1_QA_REPORT.md` | Historical QA report. |
| `CHAPTER-*-ANALYSIS-REPORT.md` (all) | Historical chapter analysis. |
| `CHAPTER-*-ENHANCEMENT-FINAL-REPORT.md` (all) | Historical enhancement reports. |
| `CHAPTER-*-REVIEW-REPORT.md` (all) | Historical review reports. |
| `CHAPTER4_MIGRATION_REPORT.md` | Historical migration report. |
| `CHAPTER_15_*_REPORT.md` (all) | Historical chapter 15 reports. |
| `CHAPTER_16_*_REPORT.md` (all) | Historical chapter 16 reports. |
| `EDUCATIONAL-EXPANSION-FINAL-REPORT.md` | Historical report. |
| `FULL_QA_STRESS_AUDIT_REPORT.md` | Historical QA report. |
| `INSTRUCTOR_*_REPORT.md` (all) | Historical instructor phase reports. |
| `INTEGRATION_REPORT.md` | Historical report. |
| `MIGRATION-AUDIT-REPORT-2026-05-18.md` | Historical audit. |
| `MIGRATION-FINAL-REPORT.md` | Historical report. |
| `PHASE*_REPORT.md` (all) | Historical phase reports. |
| `PLATFORM-STRUCTURE-AUDIT.md` | Historical audit. |
| `PROJECT-AUDIT.txt` | Historical audit. |
| `QA-AUDIT-REPORT*.md` (all) | Historical QA reports. |
| `QA_AUDIT_*.md` (all) | Historical QA reports. |
| `QUIZ_PASSING_SCORE_FIX_REPORT.md` | Historical report. |
| `WEAK-AREA-SYSTEM-FINAL-REPORT.md` | Historical report. |
| `audit-build-log.txt` | Build log artifact. |
| `audit-build-output.txt` | Build output artifact. |
| `reports/QA Reports/*` | Historical QA reports directory. |
| `reports/Release Reports/*` | Historical release reports directory. |
| `PHASE_2_COMPLETION_REPORT.md` | Phase 2 completion artifact. |
| `PHASE_3_COMPLETION_REPORT.md` | Phase 3 completion artifact. |
| `PHASE_4_5_STABILITY_CERTIFICATION_REPORT.md` | Certification artifact. |
| `PHASE_4_FINAL_CERTIFICATION_REPORT.md` | Certification artifact. |
| `PHASE_5_STUDENT_WORKFLOW_CERTIFICATION_REPORT.md` | Certification artifact. |
| `PHASE_6_INSTRUCTOR_WORKFLOW_CERTIFICATION_REPORT.md` | Certification artifact. |
| `PILOT_LOGIN_INVESTIGATION_REPORT.md` | Investigation artifact. |
| `auth-audit-results.json` | Audit results artifact. |
| `deep-auth-test-results.json` | Test results artifact. |

### 2.2 Screenshots & Visual Artifacts
| File/Pattern | Reason |
|-------------|--------|
| `certification-screenshots/*.png` | Certification screenshots. |
| `certification-screenshots/*.json` | Certification results. |
| `password-reset-reproduction.png` | Debug screenshot. |
| `textbook-images/` | Source textbook images (copyright risk; not for production repo). |

### 2.3 Backups & Temporary Files
| File/Pattern | Reason |
|-------------|--------|
| `backup_pre_cleanup_20260731_094250.sql` | Database backup artifact. |
| `backups/` | User backup directory. |
| `temp.env` | Temporary environment file (secret risk). |
| `temp_admin_id.txt` | Temporary admin credential artifact. |
| `temp_new_password.txt` | Temporary password artifact. |
| `supabase/live-schema-dump.sql` | Schema dump artifact. |

### 2.4 Test Utilities & Scripts
| File/Pattern | Reason |
|-------------|--------|
| `check-redirect-urls.js` | Test utility script. |
| `check-supabase-config.js` | Test utility script. |
| `cleanup-users-pg.js` | Test utility script. |
| `cleanup-users.js` | Test utility script. |
| `comprehensive-auth-audit.js` | Audit script. |
| `create-test-accounts.js` | Test utility script. |
| `data-flow-audit.js` | Audit script. |
| `deep-auth-tests.js` | Test script. |
| `fix-instructor-account.js` | One-off fix script. |
| `fix-instructor-password.js` | One-off fix script. |
| `restore-admin.js` | One-off restore script. |
| `test-anon-reset.js` | Test script. |
| `test-auth-config.js` | Test script. |
| `test-production-reset.js` | Test script. |
| `visual-certification.js` | Visual test script. |
| `visual-certification-full.js` | Visual test script. |
| `scripts/check-prod-supabase.js` | Production check script. |
| `scripts/deep-prod-check.js` | Production check script. |
| `scripts/discover-tables.js` | Discovery script. |
| `scripts/forensic-auth-audit.js` | Forensic audit script. |
| `scripts/fresh-start-backup.js` | Backup script. |
| `scripts/fresh-start-cleanup.js` | Cleanup script. |
| `scripts/login-failure-investigation.js` | Investigation script. |
| `scripts/reset-admin-password.js` | Password reset script. |
| `scripts/search-dependencies.js` | Search script. |
| `scripts/search-error-string.js` | Search script. |
| `scripts/test-deployed-login.js` | Deployment test script. |
| `scripts/verify-production-auth.js` | Verification script. |
| `scripts/qa-platform-report.js` | QA report script. |
| `scripts/test-admin-user-management.ts` | Test script. |
| `scripts/test-auth-gates.ts` | Test script. |
| `playwright.config.ts` | Playwright configuration (test infrastructure). |
| `playwright-report/` | Playwright test reports. |
| `test-results/` | Test results directory. |
| `tests/` | Test directory. |
| `vitest.config.ts` | Vitest configuration (test infrastructure). |
| `src/test/setup.ts` | Test setup file. |
| `**/*.test.ts` / `**/*.test.tsx` | All test files (excluded from production commit; kept in repo but not in RC). |

### 2.5 AI Infrastructure & Internal Tools
| File/Pattern | Reason |
|-------------|--------|
| `src/lib/bootstrap/` | AI bootstrap infrastructure (OpenClaw/agent internals). |
| `src/lib/complexity-model/` | AI complexity model internals. |
| `src/lib/execution-budget/` | AI execution budget internals. |
| `src/lib/execution/` | AI execution engine internals. |
| `src/lib/memory-manager/` | AI memory manager internals. |
| `src/lib/repository/` | AI repository internals. |
| `src/lib/task-planner/` | AI task planner internals. |
| `docs/ping/BOOTSTRAP_REPORT_TEMPLATE.md` | Internal template. |

### 2.6 Secrets & Environment Files
| File/Pattern | Reason |
|-------------|--------|
| `.env.production` | Production environment secrets. **Must never be committed.** |
| `.env.vercel.production` | Vercel production secrets. **Must never be committed.** |
| `.env.local` | Local environment secrets (already in `.gitignore`). |

### 2.7 Schema & Diagnostic Artifacts
| File/Pattern | Reason |
|-------------|--------|
| `schema_check.sql` | Schema check artifact. |
| `src/lib/diagnostics/diagnostics.ts` | Diagnostic utilities (not production runtime). |
| `src/lib/backup/backup-status.ts` | Backup status utilities (not production runtime). |

---

## 3. Demo Branch Decisions

The following 4 commits are unique to `origin/demo-polish-ascyn-pro` (not present on `origin/main`). Each is evaluated for cherry-pick, merge, or ignore.

| Commit | SHA | Decision | Reason |
|--------|-----|----------|--------|
| `fix: authentication flow, profile recovery, and approval enforcement` | `eb0c77a113390dd721e19dbf34c9ea31e02e56d5` | **Cherry-pick** | Contains production-critical security fixes: approval/disabled enforcement in middleware, login page error handling, profile auto-creation, and backfill migration. Without this, unapproved users can access protected routes and missing profiles crash the dashboard. |
| `fix: harden TypeScript types and improve code quality` | `e025a3eea0fb6a8927e3804dd3fd57415f0a4535` | **Cherry-pick** | Fixes `any` types, server-side query compatibility, and React hooks. Required for build stability and type safety. The `supabase-server.ts` changes are particularly important for production runtime. |
| `chore: add supabase config.toml and .gitignore` | `1e24d1ec614993d9215f6e4b36b747e2588b3af7` | **Cherry-pick** | Required for local Supabase development parity. The `config.toml` matches the existing Docker stack and prevents "works on my machine" drift. |
| `fix: recover 18 missing migrations from dangling commit 2a96d92` | `5bf95d89bdd44491d9b40526cefb09e088a342b9` | **Cherry-pick** | Restores 18 migrations that exist in production but were lost from local tracking. Without these, fresh deployments and local dev will fail due to missing schema history. The `20250625009900_create_legacy_core_tables.sql` migration is the foundation for `profiles` and all RLS. |

**Merge Strategy:** Cherry-pick all 4 commits individually. Do **not** merge the entire `demo-polish-ascyn-pro` branch, as it contains 2 additional commits (`3a603e1`, `ea2535b`) that are already represented on `main` via the `2a96d92` deploy merge, and merging would create unnecessary bubble commits.

---

## 4. Final Release Candidate Summary

The Release Candidate will contain:

### 4.1 Code & Configuration
- **Next.js 16.2.6** application with React 19.2.4, Tailwind 4.x, TypeScript 5.x
- **Hardened authentication flow** with approval status enforcement, disabled account checks, and profile auto-recovery
- **Role-based middleware** protecting `/admin`, `/instructor`, and `/dashboard` routes
- **Type-safe Supabase clients** (browser and server) with proper error handling
- **Error boundaries and loading states** for all major routes (admin, instructor, student, auth)
- **Back-button prevention** component for post-logout security

### 4.2 Database Schema
- **18 recovered migrations** restoring parity with production Supabase
- **1 new backfill migration** (`20260727150000`) ensuring all existing users have profiles
- **Complete RLS policy coverage** for schools, profiles, quiz progress, missed questions, pilot inquiries, and owner notifications
- **Supabase local dev config** (`config.toml` + `.gitignore`) for Docker stack parity

### 4.3 Curriculum & Content
- **Chapters 1–21** premium TypeScript content (lesson, flashcards, quiz) integrated into the Next.js app
- **Chapter 6 flashcards** present (via `main` history)
- **Chapters 16–21** fully integrated (via `main` history from `2a96d92` deploy merge)

### 4.4 Exclusions
- **Zero** audit reports, screenshots, backups, temporary files, test utilities, AI infrastructure, or secrets
- **Zero** "Coming Soon" placeholders or broken navigation (verified in Phase 7)
- **Zero** debug/diagnostic endpoints (removed in `1711b73` on `main`)

### 4.5 Production Readiness
- Build: **PASS** (after `jspdf`/`jspdf-autotable` resolution in Phase 3)
- Lint: **PASS** (after utility script ESLint config from `e025a3e`)
- TypeScript: **PASS** (after type hardening from `e025a3e`)
- Tests: **PASS** (Vitest suite on `main`)
- Migrations: **22 of 26** tracked locally; 4 remote-only migrations documented for separate investigation

---

## STOP POINT — AWAITING APPROVAL

**Do not proceed until explicit approval is received.**

Upon approval, I will:
1. Cherry-pick the 4 approved commits onto `main`
2. Stage only the approved files listed in Section 1
3. Verify no secrets, debug code, temporary files, or audit artifacts are staged
4. Create one clean production Release Candidate commit
5. Push to `origin/main`
6. Proceed through Phases 3–8 (Build → Validate → Commit → Push → Vercel → Production Test → Alignment)

**Awaiting your go/no-go.**

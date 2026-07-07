# ASCYN PRO — Beta Phase 1 QA Report

**Date:** 2026-07-05  
**Tester:** Ping  
**Branch/Repo:** `/home/openclaw/.openclaw/workspace/ascyn-pro-audit`  
**Scope:** Code QA for the Barber Study Pro v2 beta application. Live deployment QA is pending the URL from Gabe.

---

## Executive Summary

| Area | Verdict | Notes |
|------|---------|-------|
| TypeScript | ✅ Pass | `tsc --noEmit` produces no errors. |
| Production Build | ✅ Pass | `next build` completes successfully; all 38 routes render. |
| Lint | ⚠️ 125 issues | 63 errors, 62 warnings. Build still passes, but code quality and accessibility issues need cleanup. |
| Beta Agreement | ⚠️ Partial | Acceptance form and DB table exist, but it is not enforced before dashboard access. |
| Beta Checklist | ❌ Missing | Page is a "Coming Soon" placeholder. |
| Feedback Storage | ❌ Missing | No user-facing feedback form and no admin view. |
| Mobile Responsiveness | ⚠️ Adequate but gaps | Tailwind grids adapt; flashcards lack swipe, some lesson components need visual verification. |

**Highest-priority blockers before beta launch:**
1. Beta Checklist is not implemented.
2. Feedback collection is not implemented.
3. Beta Agreement acceptance is not enforced on login.
4. Lint errors and Next.js deprecation warnings should be cleaned up.

---

## Methodology

1. Read implementation files for each checklist area.
2. Ran `npx tsc --noEmit`.
3. Ran `npm run build`.
4. Ran `npm run lint`.
5. Verified data shapes, RLS policies, and migration files.
6. Local smoke test was prepared but could not be executed because the OpenClaw browser control host is not reachable in this environment.

---

## 1. Signup

**Files reviewed:**
- `src/app/(auth)/signup/page.tsx`
- `src/lib/demo-helpers.ts`
- `src/lib/supabase.ts`
- `src/lib/supabase-server.ts`

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| Form renders with required fields | ✅ | Full name, email, password, confirm password, role, school. |
| Password mismatch handled | ✅ | Checked before submit; inline error shown. |
| Short password handled | ✅ | Minimum 6 characters enforced (`password.length < 6`). |
| Weak/complex password rejected | ⚠️ No | Only length is checked; no complexity rules. |
| Invalid email format rejected | ⚠️ Partial | Uses native `type="email"`; no custom regex or server-side email validation beyond Supabase. |
| Duplicate email handled | ✅ | Supabase `signUp` error surfaced to the user. |
| Student must select school | ✅ | Active schools loaded from `schools` table; if none match, signup is rejected. |
| Instructor creates pending school | ✅ | In production mode (`!demo && supabaseConfigured`) school is inserted with `is_active: false`. |
| Apprentice role available | ❌ | Role selector only offers `student` and `instructor`. `AppRole` type includes `apprentice`, but there is no UI path to register as one. |
| Profile upsert on signup | ✅ | `profiles` upserted with `onConflict: 'id'`. |
| Error handling | ✅ | Try/catch surfaces Supabase message. |

**Findings:**
- **Medium:** No server-side validation for email format or password complexity beyond Supabase defaults.
- **Medium:** Apprentice signup is impossible from the current UI even though the data model supports it.
- **Low:** The page logs the Supabase URL to the browser console in `loadSchools` — remove before production.

---

## 2. Email Verification

**Files reviewed:**
- `src/app/(auth)/signup/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/auth/callback/route.ts`

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| Signup sends verification email | ✅ | Default Supabase `signUp` behavior when email confirmation is enabled. |
| Login blocks unverified users | ✅ | `email_confirmed_at === null` check shows a clear message. |
| Resend verification link | ❌ | No resend button or route exists. |
| Verification callback handled | ⚠️ Partial | `/auth/callback` exchanges the code and redirects. If exchange fails, it redirects to `/auth/auth-code-error`, but **that page does not exist** in the app. |

**Findings:**
- **Medium:** Missing `/auth/auth-code-error` page will produce a 404 for invalid/expired verification links.
- **Medium:** No "Resend verification email" flow; users who lose the first email are stuck until they contact support.
- **Low:** On login, when an unverified email is detected, the code returns an error message but does not explicitly call `signOut`. The Supabase client may still hold the session briefly. This is unlikely to cause a redirect but is worth hardening.

---

## 3. Login / Logout

**Files reviewed:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/actions.ts`
- `src/components/DashboardNav.tsx`
- `src/middleware.ts`

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| Login with valid credentials | ✅ | `signInWithPassword` + redirect. |
| Invalid credentials error | ✅ | Error surfaced from Supabase. |
| Failed login audit log | ✅ | `logFailedLogin` server action called (best-effort). |
| Demo mode bypass | ✅ | Only allowed when `NEXT_PUBLIC_DEMO_MODE=true` and Supabase is not configured. |
| Logout clears session | ✅ | `supabase.auth.signOut()` then redirect to `/login`. |
| Protected routes enforced | ✅ | Middleware redirects unauthenticated users to `/login`. |
| Auth routes redirect logged-in users | ✅ | `/login`, `/signup`, `/reset-password` redirect to `/dashboard`. |

**Findings:**
- **Low:** Dashboard logout is client-side only. If the Supabase `signOut` network call fails, the user is still pushed to `/login`, but the session cookie may remain. Consider awaiting success before redirecting or showing an error.
- **Low:** `middleware.ts` uses the deprecated `middleware` file convention; Next.js 16 warns: *"The 'middleware' file convention is deprecated. Please use 'proxy' instead."* This is not a runtime blocker yet but will be in a future Next.js release.

---

## 4. Dashboard

**Files reviewed:**
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/components/DashboardNav.tsx`

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| Loads after login | ✅ | Server component fetches user and profile. |
| Role-based routing | ✅ | Admin → `/admin`, instructor → `/instructor`, inactive school → `/pending-approval`. |
| Chapter grid displayed | ✅ | All `localChapters` rendered with progress bars. |
| Progress stats accurate | ✅ | Completed / in-progress / average computed from `student_progress`. |
| Continue studying CTA | ⚠️ Partial | Always picks the **first** incomplete chapter, not the most relevant based on analytics. |
| Recent activity section | ⚠️ Partial | Shows messages, notifications, grades, and assessments. **No recent quiz attempts or flashcard activity.** |
| Mobile nav | ✅ | Responsive sidebar + hamburger menu. |

**Findings:**
- **Medium:** Dashboard displays **all 21 chapters**, not just chapters 1–16 as the Phase 1 checklist implies. This is fine if intentional, but it should be confirmed against the beta scope.
- **Low:** Continue Studying CTA is not driven by the weak-area/recommendation engine; it is a simple linear scan.
- **Low:** DashboardNav active state uses exact `pathname === item.href`; sub-routes (e.g., `/dashboard/chapters/16`) do not highlight the parent Dashboard link.
- **Low:** Mobile menu button lacks an `aria-label`.

---

## 5. Chapter 16

**Files reviewed:**
- `src/app/(dashboard)/dashboard/chapters/[chapterNumber]/page.tsx`
- `src/lib/chapter-16-premium.ts`
- `src/lib/chapter-16-premium-quiz.ts`
- `src/lib/chapter-16-premium-flashcards.ts`
- `src/lib/demo-data.ts`
- `src/components/chapter/ChapterContent.tsx`
- `src/components/chapter/ChapterHeader.tsx`

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| Chapter 16 route resolves | ✅ | `/dashboard/chapters/16` renders. |
| Premium immersive content | ✅ | `chapter16PremiumContent` and rose-gold theme loaded. |
| Flashcard count | ✅ | 68 premium flashcards. |
| Quiz question count | ✅ | 30 questions. |
| Passing score | ✅ | `passing_score: 80` for `quiz-16` (`src/lib/demo-data.ts:285`). |
| Prev/Next navigation | ✅ | Links to chapter 15 and 17. |
| Not found handling | ✅ | `notFound()` for invalid chapter numbers. |

**Findings:**
- **Low:** The chapter description says "30 board-exam style questions" while the flashcard file header says "68 premium flashcards"; counts are accurate, but the UI simply says "Flashcards" and "Quiz Questions" without distinguishing Board vs. Professional tiers.
- **Low:** Content components rely on `style={{ color: ... }}` for theming; no dark-mode fallback is needed because the app is dark, but verify contrast ratios for the rose-gold palette on mobile screens.

---

## 6. Flashcards

**Files reviewed:**
- `src/components/FlashcardClient.tsx`
- `src/lib/progress.ts`

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| Flashcards display front/back | ✅ | Click flips; keyboard Space flips; arrow keys navigate. |
| Progress saved on completion | ✅ | `handleMarkComplete` upserts `student_progress` with `flashcards_completed: true` and `progress_percentage: 50`. |
| Progress preserved across sessions | ✅ | `localStorage` saves current card index. |
| Per-card "Got it" tracking | ❌ | There is only a **single "Mark Complete" button on the last card**. The checklist expects marking 50% of cards as "Got it"; the current implementation marks the whole deck complete at the end. |
| Swipe on mobile | ❌ | No touch/swipe handlers; mobile users must tap buttons. |
| Accessibility | ⚠️ Partial | Space/arrow keys work, but the card is a `<div onClick>` rather than a button, so screen-reader users and keyboard-only users may not discover the flip action. |

**Findings:**
- **High (scope mismatch):** Flashcard progress logic does not match the Beta Checklist expectation of marking individual cards as "Got it". A user could skip to the last card and click "Mark Complete" without reviewing the deck.
- **Medium:** Mobile users cannot swipe through cards.
- **Low:** Flip card is not keyboard-focusable or announced as interactive.

---

## 7. Quiz Progress Logic

**Files reviewed:**
- `src/components/QuizClient.tsx`
- `src/lib/progress.ts`
- `src/lib/demo-data.ts`

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| Questions randomized | ✅ | `shuffleArray` on questions and answer options each attempt. |
| Answer selection | ✅ | Buttons highlight selected answer. |
| Explanation shown | ✅ | After submitting, explanation and correct answer display. |
| Score calculated | ✅ | Final score computed from `answers` + current answer. |
| Attempt saved | ✅ | Inserted into `quiz_attempts` with `answers_json`. |
| Progress updated | ✅ | `student_progress` upserted; quiz only marked complete on pass (`percentage >= passing_score`). |
| Best score preserved | ✅ | `best_quiz_score` uses `Math.max(...)` across existing, new, and prior best attempt. |
| Retake available | ✅ | "Retake Quiz" button resets state. |
| Passing score configurable | ✅ | Falls back to 75% if `quiz.passing_score` is undefined. |
| Chapter 16 passing score | ✅ | 80% as specified. |
| Before-unload guard | ✅ | Warns if quiz is in progress. |

**Findings:**
- **Low:** If a user refreshes mid-quiz, progress is lost. There is no autosave or resume logic.
- **Low:** Missed-question review after a failed quiz is good, but the app does not surface a direct link back to the missed-questions retest page from the results screen.

---

## 8. Beta Agreement

**Files reviewed:**
- `src/app/(dashboard)/beta-agreement/page.tsx`
- `supabase/migrations/20250701100000_create_beta_agreements_table.sql`

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| Agreement text rendered | ✅ | Full legal text, version, and effective date displayed. |
| Name/email fields | ✅ | Required; empty fields block acceptance. |
| Checkbox acceptance | ✅ | Acceptance saved to Supabase `beta_agreements` and `localStorage`. |
| Unique acceptance per user/version | ✅ | DB constraint `beta_agreements_user_version_unique`. |
| Print support | ✅ | `window.print()` and `print:` Tailwind variants. |
| Continue to checklist | ✅ | Button navigates to `/dashboard/beta-checklist`. |
| Enforcement before dashboard | ❌ | Nothing in middleware, layout, or login flow forces a user to sign the agreement. A user can ignore the nav link and use the rest of the app. |
| Version-change handling | ⚠️ Partial | If `AGREEMENT_VERSION` changes, existing DB records are loaded without filtering by version, and `localStorage` from an old version still shows as accepted. |

**Findings:**
- **High:** Beta Agreement is not enforced. New beta testers can log in and use the dashboard without ever accepting it.
- **Medium:** No admin/instructor view of accepted agreements (see Section 10).
- **Low:** `err: any` in `handleAgreedChange` triggers a lint error.

---

## 9. Beta Checklist

**Files reviewed:**
- `src/app/(dashboard)/dashboard/beta-checklist/page.tsx`

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| Checklist renders | ⚠️ | Page renders a "Coming Soon" card. |
| Tasks can be checked off | ❌ | No tasks, no checkboxes, no state. |
| Progress saved | ❌ | Not implemented. |
| Admin/instructor can view | ❌ | Not implemented. |

**Findings:**
- **High:** The entire Beta Checklist feature is a placeholder. This is a direct Phase 1 scope gap.

---

## 10. Feedback Storage

**Files reviewed:**
- Searched `src/` for feedback-related routes and components.
- Reviewed `src/app/admin/page.tsx`.

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| User feedback form | ❌ | No route or component found. |
| Feedback stored in DB | ❌ | No `feedback` table or column usage outside of instructor assessment feedback. |
| Admin/instructor view | ❌ | Admin dashboard has no feedback management card. |
| Beta agreements admin view | ❌ | Admin dashboard has no beta-agreement viewer. |

**Findings:**
- **High:** Feedback collection is not implemented. The checklist calls for submitting and reviewing beta feedback; the app has no facility for this.
- **High:** Admin cannot view accepted beta agreements or tester checklists.

---

## 11. Mobile Responsiveness

**Files reviewed:**
- All components above plus Tailwind class usage.

| Check | Result | Evidence / Notes |
|-------|--------|------------------|
| Auth forms scale | ✅ | `max-w-md` container with `p-4`. |
| Dashboard grid adapts | ✅ | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. |
| Sidebar → hamburger | ✅ | `DashboardNav` collapses on `lg:hidden`. |
| Chapter header wraps | ✅ | `flex-col sm:flex-row` and `break-words`. |
| Flashcard tap to flip | ✅ | Works, but no swipe. |
| Quiz options full-width | ✅ | Buttons are `w-full`. |
| Lesson content overflow | ⚠️ Unverified | Some premium components (timelines, tabbed content, feature grids) need real-device visual QA to confirm no horizontal overflow. |

**Findings:**
- **Medium:** Flashcards lack swipe gestures on mobile.
- **Medium:** Cannot confirm no overflow on all lesson components without browser-based visual testing.
- **Low:** Mobile menu overlay has no focus trap; tabbing can move focus behind the overlay.

---

## 12. Build Verification

**Commands run:**

```bash
npx tsc --noEmit
npm run build
npm run lint
```

| Check | Result | Evidence |
|-------|--------|----------|
| TypeScript compile | ✅ Pass | No output from `tsc --noEmit`. |
| Next.js build | ✅ Pass | 38 routes generated; no build errors. |
| Lint | ⚠️ 125 problems | 63 errors, 62 warnings. Full log saved at `/tmp/lint.log`. |

**Build notes:**
- Build emitted many *"Supabase not configured"* warnings because the local environment has no `NEXT_PUBLIC_SUPABASE_URL`. This is expected behavior; the deployed environment must set those variables.
- Next.js 16 warns that the `middleware` file convention is deprecated in favor of `proxy`.
- `next.config.ts` uses `turbopack: { root: "." }`; Next.js warns it should be an absolute path.

**Lint highlights (files in scope):**
- `src/lib/supabase-server.ts` — many `any` types and unused variables in the mock query builder.
- `src/lib/supabase.ts` — `any` types in mock client.
- `src/components/FlashcardClient.tsx` — `any` types in error handling.
- `src/app/(dashboard)/beta-agreement/page.tsx` — unused catch variable and `any` error.
- `src/app/(dashboard)/dashboard/chapters/page.tsx` — `any` error type.
- `src/components/chapter/QuoteBlock.tsx`, `ReflectionBlock.tsx` — unescaped quotes.
- `src/app/demo/DemoClient.tsx` — unescaped entities.
- Various `scripts/*.js` files — `require()` imports flagged by ESLint.

---

## Part 2 — Live QA (Pending)

**Status:** Waiting for Gabe to provide the deployed URL.

Once the URL is supplied, I will:
1. Run the same checklist against the live site.
2. Verify Supabase-backed flows (real signup, real email verification, real progress persistence).
3. Capture console errors, network failures, and visual issues on desktop and mobile viewports.
4. Compare live behavior to the code review findings above and append results to this report.

**Note:** The local OpenClaw browser control host was not reachable during this session, so live browser automation will require either the browser control host to be started or a manual testing pass with recorded evidence.

---

## Recommended Priority Order

1. **Implement Beta Checklist** — replace placeholder with real tasks, checkboxes, and persistence.
2. **Implement Feedback Storage** — user feedback form + admin/instructor review page.
3. **Enforce Beta Agreement** — redirect new/unsigned users to `/beta-agreement` before allowing dashboard access.
4. **Add admin views** for beta agreements and feedback.
5. **Harden flashcard tracking** — either implement per-card "Got it" tracking or update the checklist to match the current deck-completion model.
6. **Clean up lint errors** and address Next.js deprecation warnings.
7. **Add mobile swipe** to flashcards and verify lesson component overflow.
8. **Add missing `/auth/auth-code-error` page** and a "Resend verification email" flow.

---

## No Code Changes Made

This report documents findings only. No source code was modified or committed. The only untracked file in the repo is the pre-existing `supabase/migrations/20250628000000_fix_schools_select_rls.sql` migration.

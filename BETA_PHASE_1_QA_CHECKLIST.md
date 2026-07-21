# ASCYN PRO — Beta Phase 1 QA Checklist

**Phase:** Phase 1 — Beta Stabilization  
**Date:** 2026-07-03  
**Branch:** `workstation-transfer-safety`  
**Commit:** `f618e2b fix: prevent failed quiz attempts from completing chapter progress`  

---

## How to Use This Checklist

1. Run the platform locally with `npm run dev`.
2. Execute each test in order.
3. Mark each item **PASS**, **FAIL**, or **N/A**.
4. For failures, record the step, expected result, actual result, and blocker.
5. No Phase 1 item may be skipped without Gabe's approval.

---

## Test Environment

| Variable | Value |
|----------|-------|
| **Tester** | |
| **Date** | |
| **Branch** | `workstation-transfer-safety` |
| **Commit** | |
| **Browser (desktop)** | |
| **Browser (mobile)** | |
| **Supabase env** | Demo mode / Live |

---

## 1. Signup

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 1.1 | Navigate to `/signup` | Signup page loads without errors | | |
| 1.2 | Enter valid email, password, full name, role = Student | Form accepts input | | |
| 1.3 | Submit signup | Account created; confirmation email sent (live) or demo success shown | | |
| 1.4 | Signup with invalid email format | Inline validation error displayed | | |
| 1.5 | Signup with weak/short password | Inline validation error displayed | | |
| 1.6 | Signup with duplicate email | Error message indicating account exists | | |
| 1.7 | Signup as Instructor role | Role stored correctly; pending approval flow triggered | | |
| 1.8 | Signup as Apprentice role | Role stored correctly | | |

---

## 2. Email Verification

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 2.1 | Click verification link from email | User verified and redirected to login or dashboard | | |
| 2.2 | Attempt login before verification | Error or prompt to verify email | | |
| 2.3 | Resend verification email | Resend succeeds and user is notified | | |
| 2.4 | Use expired/invalid verification link | Clear error message and recovery path | | |

---

## 3. Login / Logout

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 3.1 | Navigate to `/login` | Login page loads | | |
| 3.2 | Login with valid credentials | Redirected to dashboard | | |
| 3.3 | Login with invalid password | Error message, no redirect | | |
| 3.4 | Login with unverified email | Prompt to verify | | |
| 3.5 | Click logout | Session cleared; redirected to login or home | | |
| 3.6 | Use browser back after logout | No access to protected dashboard | | |
| 3.7 | Reset password flow | Email sent; reset link works | | |

---

## 4. Dashboard

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 4.1 | Student logs in and lands on `/dashboard` | Dashboard loads with progress overview | | |
| 4.2 | Chapter grid displays Chapters 1–16 | All active chapters visible | | |
| 4.3 | Click "Continue Studying" CTA | Navigates to most relevant next chapter/section | | |
| 4.4 | Recent activity section | Shows recent quiz/flashcard activity | | |
| 4.5 | Navigation sidebar / menu | All links route correctly | | |
| 4.6 | Dashboard loads on mobile (375 px) | Layout adapts, no horizontal overflow | | |

---

## 5. Chapter 16

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 5.1 | Navigate to `/dashboard/chapters/16` | Chapter 16 lesson loads | | |
| 5.2 | Chapter title reads "Women's Haircutting & Styling" | Correct title displayed | | |
| 5.3 | Premium content sections render | Content blocks, info cards, scenarios visible | | |
| 5.4 | Chapter progress bar | Initially empty or reflects prior progress | | |
| 5.5 | No console errors on chapter load | Clean console | | |
| 5.6 | Mobile chapter load | Lesson readable and navigable on mobile | | |

---

## 6. Flashcards Progress = 50%

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 6.1 | Open Chapter 16 flashcards | Flashcard deck loads | | |
| 6.2 | Flip a card | Back side revealed | | |
| 6.3 | Mark 50% of cards as "Got it" | Progress increments correctly | | |
| 6.4 | Reach exactly 50% completion | Chapter flashcard progress shows complete | | |
| 6.5 | Verify progress persists | On reload, progress is retained | | |
| 6.6 | Score < 50% | Chapter flashcard progress remains incomplete | | |

---

## 7. Failed Quiz Does Not Complete Chapter

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 7.1 | Start Chapter 16 quiz | 30 questions loaded | | |
| 7.2 | Answer enough questions incorrectly to score < 80% | Quiz result shows "Did not pass" | | |
| 7.3 | Check chapter progress | Chapter 16 is **not** marked complete | | |
| 7.4 | Check retest availability | Retest option is offered | | |
| 7.5 | Attempt to retake quiz | New quiz attempt begins | | |
| 7.6 | Verify failed attempt recorded | Best score remains below passing; attempts incremented | | |

---

## 8. Passed Quiz Completes Chapter

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 8.1 | Start Chapter 16 quiz | 30 questions loaded | | |
| 8.2 | Answer enough correctly to score ≥ 80% | Quiz result shows "Passed" | | |
| 8.3 | Check chapter progress | Chapter 16 marked complete | | |
| 8.4 | Verify best score stored | Highest score displayed in progress | | |
| 8.5 | Verify completion persists | On reload, chapter remains complete | | |

---

## 9. Beta Agreement

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 9.1 | New beta user logs in | Prompted to accept Beta Agreement | | |
| 9.2 | Read Beta Agreement content | Terms displayed clearly | | |
| 9.3 | Decline agreement | User cannot proceed; appropriate message shown | | |
| 9.4 | Accept agreement | Agreement recorded; user proceeds to dashboard or checklist | | |
| 9.5 | Verify acceptance persisted | On reload, agreement prompt does not reappear | | |
| 9.6 | Admin/instructor can view accepted agreements | Agreement status visible in admin view | | |

---

## 10. Beta Checklist

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 10.1 | Navigate to `/dashboard/beta-checklist` | Beta checklist page loads | | |
| 10.2 | View checklist items | All onboarding tasks listed | | |
| 10.3 | Mark an item complete | Item shows checked; progress updates | | |
| 10.4 | Complete all items | Checklist shows 100% complete | | |
| 10.5 | Progress persists on reload | Completed items remain checked | | |
| 10.6 | Mobile layout | Checklist usable on mobile | | |

---

## 11. Feedback Storage & Admin Visibility

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 11.1 | Student submits feedback | Feedback saved successfully | | |
| 11.2 | Student sees confirmation | Success message displayed | | |
| 11.3 | Admin navigates to feedback view | List of submitted feedback visible | | |
| 11.4 | Feedback shows user, message, timestamp, category | Metadata displayed correctly | | |
| 11.5 | Admin can mark feedback as reviewed | Status updates persist | | |
| 11.6 | Empty feedback state | Helpful message shown when no feedback exists | | |

---

## 12. Mobile Testing

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 12.1 | Signup flow on mobile | Completable without zooming or horizontal scroll | | |
| 12.2 | Login flow on mobile | Completable smoothly | | |
| 12.3 | Dashboard on mobile | Cards and navigation usable | | |
| 12.4 | Chapter lesson on mobile | Content readable; no overflow | | |
| 12.5 | Flashcards on mobile | Swipe/flip/tap works | | |
| 12.6 | Quiz on mobile | Questions and answers fit screen; submit accessible | | |
| 12.7 | Beta agreement/checklist on mobile | Usable without layout issues | | |

---

## 13. Instructor Portal

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 13.1 | Instructor dashboard roster | Displays school-scoped students using canonical profile identity | PASS | 2026-07-21 identity audit |
| 13.2 | Student detail Progress Report modal | Opens; has Close/X; closes on Escape and backdrop click; restores focus | PASS | Modal triggerRef + tests |
| 13.3 | Secondary instructor/admin pages | Back button present with safe role-dashboard fallback | PASS | Added to `/admin/school/configuration`; others already had BackButton |
| 13.4 | Recommended Next Steps in instructor view | Does not link to student dashboard unless labeled student preview | PASS | MissedQuestionBank `instructorView` + StudyRecommendations `instructorView` |

## 14. Pilot School & Instructor Invitation Setup

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 14.1 | Confirm first pilot school exists in production | `RISE Program` school found (ID `12b09747-7391-4811-bc22-db7eebbb12c1`), active, subscription active; no duplicate created | PASS | Verified 2026-07-21; treated as `R.I.S.E Program` per Gabe |
| 14.2 | Confirm instructor account does not exist | No Auth user or profile for `tessamyers2911@gmail.com` | PASS | Verified 2026-07-21 |
| 14.3 | Build secure invitation server action | `inviteUser` action added to `/admin/users/actions.ts`; uses service-role client; requires authenticated admin; calls `auth.admin.inviteUserByEmail`; prevents duplicate Auth users; validates role and active school; writes audit log | PASS | Implemented 2026-07-21 |
| 14.4 | Build admin invitation UI | "Invite User" form added to `/admin/users/UserManagementClient.tsx`; allows selecting role `instructor` and school `RISE Program`; no password field exposed | PASS | Implemented 2026-07-21 |
| 14.5 | Invitation redirect uses approved production origin | `getSiteUrl()` returns `https://ascynpro.com` in production; redirect is `/auth/callback` | PASS | Implemented 2026-07-21 |
| 14.6 | Do not send Tessa's invitation yet | No production Auth invite sent; no production data modified; no commit/push/deploy | PASS | Awaiting final approval and Supabase redirect config confirmation |

## 15. Authentication Lifecycle Audit

### 15.1 Profile Creation

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 15.1.1 | Trigger inspection | `on_auth_user_created` trigger in `supabase-schema.sql` and current migration auto-inserts a `profiles` row from `auth.users` | PASS | Trigger reads `raw_user_meta_data->>'role'` and `raw_user_meta_data->>'full_name'`; sets `approval_status = 'pending'`; does **not** set `school_id` |
| 15.1.2 | No duplicate profile insert | `inviteUser` no longer `insert`s a second profile; uses `upsert ... onConflict('id')` to overwrite the trigger-created row with validated values | PASS | Prevents unique-constraint failure and ensures exactly one profile |
| 15.1.3 | Metadata flow | Invitation metadata (`full_name`, `role`, `school_id`, `approval_status`) is written to `raw_user_meta_data` and then applied to the profile row | PASS | `options.data` passed to `inviteUserByEmail`; profile upsert validates and overrides trigger defaults |
| 15.1.4 | Exactly one Auth user and one profile | A single invitation produces one `auth.users` record and one `profiles` record | PASS | Verified by `actions.test.ts` upsert test |

### 15.2 Password Setup

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 15.2.1 | Set Password page exists | `/auth/set-password/page.tsx` created with session verification, password + confirmation fields, strong-password validation (≥8 chars, uppercase, lowercase, number) | PASS | Implemented 2026-07-21 |
| 15.2.2 | No service-role key in browser | Password update uses `supabase.auth.updateUser` from the browser client (`@/lib/supabase`) | PASS | No `service_role` key exposed to client |
| 15.2.3 | Expired/invalid link handling | Missing or invalid session shows clear error: "Invitation link is invalid or has expired. Please request a new invitation." | PASS | Implemented 2026-07-21 |
| 15.2.4 | Callback routes typed correctly | `type=recovery` → `/auth/update-password`; `type=invite` → `/auth/set-password` | PASS | `src/app/auth/callback/route.ts` |

### 15.3 Instructor Destination

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 15.3.1 | Instructor lands at `/instructor` | After password setup, instructors are redirected via existing `getRoleBasedRedirect` | PASS | `src/lib/auth-access.ts` |
| 15.3.2 | Students and apprentices land at `/dashboard` | Non-instructor roles redirect to `/dashboard` | PASS | `getRoleBasedRedirect` |
| 15.3.3 | Open-redirect protection | `next` parameter validated against internal path allow-list; external and protocol-relative URLs rejected | PASS | Implemented in `src/app/auth/callback/route.ts` |

### 15.4 Testing

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 15.4.1 | Invitation action tests | `src/app/admin/users/actions.test.ts` covers success, duplicate auth user, trigger-created profile upsert, unauthorized, invalid role, invalid school, invitation failure, and profile-failure cleanup | PASS | 8 tests |
| 15.4.2 | Callback route tests | `src/app/auth/callback/route.test.ts` covers recovery, invite, instructor/student/apprentice redirects, safe `next` usage, and open-redirect rejection | PASS | 10 tests |
| 15.4.3 | Set Password page tests | `src/app/auth/set-password/page.test.tsx` covers session verification, mismatch, weak password, success redirects, and update errors | PASS | 8 tests |
| 15.4.4 | Full verification suite | `npm test` 185/185 pass, `npx tsc --noEmit` clean, `npm run lint` 0 errors, `npm run build` succeeds | PASS | 2026-07-21 |

## 14. Authentication & Invitation Lifecycle

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|-----------------|--------|-------|
| 14.1 | Auth-user trigger | Creates exactly one profile per auth user; upsert handles invited users | PASS | `handle_new_user()` + `inviteUser` upsert |
| 14.2 | Secure Set Password page | Requires valid session, matching passwords, and strong password | PASS | `/auth/set-password` |
| 14.3 | Instructor invite login | Redirects invited instructor to `/instructor` | PASS | callback + set-password routes |
| 14.4 | Student invite login | Redirects invited student to `/dashboard` | PASS | callback + set-password routes |
| 14.5 | Invalid/expired invitation | Shows error or redirects to auth-code-error page | PASS | missing session → error; bad code → `/auth/auth-code-error` |
| 14.6 | Open-redirect protection | Rejects external and protocol-relative `next` params | PASS | `isSafeRedirectPath` in callback route |
| 14.7 | Two-commit separation proposed | Backend/auth commits separate from admin UI commits | PASS | `AUTH_LIFECYCLE_AUDIT_2026-07-21.md` |

## Build & Typecheck Verification

| # | Check | Command | Expected Result | Status |
|---|-------|---------|-----------------|--------|
| B.1 | TypeScript | `npx tsc --noEmit` | No errors | PASS |
| B.2 | Production build | `npm run build` | Exits 0; all pages generated | PASS |
| B.3 | No console errors on initial load | Browser dev tools | Clean console for `/login`, `/dashboard`, `/dashboard/chapters/16` | |
| B.4 | Lint | `npm run lint` | 0 errors | PASS |

---

## Sign-Off

| Role | Name | Date | Signature / Approval |
|------|------|------|----------------------|
| Tester | | | |
| Product Owner (Gabe) | | | |
| Implementation (Ping) | | | |

---

## Failure Log

| # | Item | Step | Expected | Actual | Severity | Owner | Status |
|---|------|------|----------|--------|----------|-------|--------|
| | | | | | | | |

---

**Next Step:** After all Phase 1 items pass, Gabe approves beta release and work proceeds to Phase 2.

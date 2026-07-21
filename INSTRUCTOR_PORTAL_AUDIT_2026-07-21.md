# ASCYN PRO — Instructor Portal Identity & UX Audit

**Date:** 2026-07-21
**Project:** ASCYN PRO
**Repository:** `C:\AI\ACTIVE\ASCYN-PRO\02-work\app`
**Scope:** Read-only production identity audit + instructor-portal hardening

---

## 1. Identity Audit Findings

### Accounts Compared

| Field | `gabebot24+student@gmail.com` | `student@ascyn-smoke.test` |
|-------|-------------------------------|----------------------------|
| **auth.users id** | `49047d6f-7976-4ee4-b79f-865480035f52` | `24879a43-b402-4f88-82b6-44d66a67263b` |
| **profiles id** | same as auth id | same as auth id |
| **Email (auth)** | `gabebot24+student@gmail.com` | `student@ascyn-smoke.test` |
| **Email (profile)** | `gabebot24+student@gmail.com` | `student@ascyn-smoke.test` |
| **Full name** | Pilot Student | Test Student |
| **Role** | student | student |
| **School ID** | `11ab99a1-0f9d-4f9b-813e-d88a59e3f5d7` (ASCYN PRO Pilot School) | `null` |
| **Approval status** | approved | approved |

### Instructor Context

- The instructor currently configured in the environment (`ASCYN_INSTRUCTOR_EMAIL`) is `gabebot24+instructor@gmail.com`.
- That instructor is assigned to **ASCYN PRO Pilot School** (`11ab99a1-…`).
- The only student in that school is `gabebot24+student@gmail.com`.
- A third account, `instructor@ascyn-smoke.test`, exists but has `school_id = null` and `approval_status = pending`, so it cannot access the instructor portal.

### Chapter 1 Progress & Quiz Ownership

The Chapter 1 progress and quiz attempt belong to **`student@ascyn-smoke.test`**:

- `student_progress` record: chapter `ch-1`, 100% complete, flashcards done, quiz passed, best score 83%.
- `quiz_attempts` record: `quiz-1`, 25/30, 83%, completed 2026-07-21 03:14 UTC.

`gabebot24+student@gmail.com` has a `ch-1` progress record at only 10% with no quiz completion and no quiz attempts.

---

## 2. Root Cause

1. **Two separate accounts, not one.** `gabebot24+student@gmail.com` and `student@ascyn-smoke.test` have different auth UUIDs, different profile emails, and different progress records. They are not aliases of the same user.
2. **School-assignment mismatch.** The expected smoke-test student (`student@ascyn-smoke.test`) and the expected smoke-test instructor (`instructor@ascyn-smoke.test`) are both unassigned to any school. Because the instructor portal enforces school-scoped student selection, those accounts cannot see each other.
3. **Displayed email is the canonical profile email.** The instructor dashboard correctly shows the only school-assigned student in the instructor's school, which is `gabebot24+student@gmail.com`. The code was already school-scoped and already reading the profile email; the mismatch is data-level, not display-level.
4. **No production data was changed.** Per instructions, no accounts were merged, reassigned, or deleted.

---

## 3. Code Changes Made

### Hardening implemented

- **Canonical student identity display:** Added `src/components/StudentIdentity.tsx` and used it in the instructor roster, at-risk/readiness tables, pending-hour queue, gradebook top performers, Progress Report modal, and Board Hours report. This guarantees the instructor always sees the profile-record name/email.
- **School-scoped student selection:** Already enforced via `.eq('school_id', schoolId)` and `.in('role', ['student', 'apprentice'])`. Added an explicit render test proving the roster contains the school-scoped student's canonical identity.
- **Progress Report Close/X, Escape, backdrop, focus:** The modal shell (`src/components/ui/Modal.tsx`) already provided these. Hardened focus restoration by accepting an optional `triggerRef` and restoring focus to the trigger element on close. `ProgressReportModal` now passes its open button ref.
- **Back navigation:** Added `BackButton` to `/admin/school/configuration` (the one secondary admin page that was missing it). Other instructor/admin secondary pages already had BackButtons.
- **Instructor-scoped Recommended Next Step behavior:** `StudyRecommendations` already supported `instructorView`. Extended the same pattern to `MissedQuestionBank` so that "Retest Weak Areas" and "Study Chapter" links do not navigate instructors into the student dashboard; they are rendered as clearly labeled student-preview text.

### Files touched in this session

- `src/components/ui/Modal.tsx`
- `src/components/ui/Modal.test.tsx`
- `src/components/StudentIdentity.tsx` (new)
- `src/components/StudentIdentity.test.tsx` (new)
- `src/components/MissedQuestionBank.tsx`
- `src/components/MissedQuestionBank.test.tsx` (new)
- `src/app/instructor/page.tsx`
- `src/app/instructor/page.test.tsx`
- `src/app/instructor/student/[studentId]/page.tsx`
- `src/app/instructor/student/[studentId]/ProgressReportModal.tsx`
- `src/app/instructor/student/[studentId]/ProgressReportModal.test.tsx`
- `src/app/admin/school/configuration/page.tsx`
- `scripts/identity-audit.mjs` (read-only audit script)
- `scripts/identity-audit-instructor.mjs` (read-only audit script)
- `BETA_PHASE_1_QA_CHECKLIST.md`
- `INSTRUCTOR_PORTAL_AUDIT_2026-07-21.md` (this file)

### Note on uncommitted baseline

The working tree already contained uncommitted changes from the previous session (e.g., BackButtons on most secondary pages, extraction of `ProgressReportModal`, `StudyRecommendations` `instructorView`). This session's edits are layered on top of that baseline. No commit or push was performed.

---

## 4. Test Results

| Command | Result |
|---------|--------|
| `npm test` | ✅ 21 files, 159 tests passed |
| `npx tsc --noEmit` | ✅ No errors |
| `npm run lint` | ✅ 0 errors (59 pre-existing warnings) |
| `npm run build` | ✅ Exit 0; all pages generated |

---

## 5. Blockers / Recommended Next Steps

1. **Production data assignment required.** To make `student@ascyn-smoke.test` appear in the instructor dashboard, that profile must be assigned to the same school as the instructor (`11ab99a1-0f9d-4f9b-813e-d88a59e3f5d7`) and the instructor account must be approved and school-assigned. This is a production data change and was intentionally not done without approval.
2. **Smoke-test environment alignment.** Consider aligning `ASCYN_INSTRUCTOR_EMAIL` / `ASCYN_STUDENT_EMAIL` with the `*@ascyn-smoke.test` accounts, or explicitly assigning those accounts to a dedicated smoke-test school.
3. **No deployment blockers.** Code builds, types check, lint is clean of errors, and all tests pass.

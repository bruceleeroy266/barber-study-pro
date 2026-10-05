# PO-1C.4 — Comprehensive Exam Simulator UI Contract

**Workstream:** PO-1 — Pilot Operations Hardening / Gate 6 Automated Pilot Measurement  
**Baseline:** production `main` at `d4a2b83819c2dd871777354f5fa01c4f43b8bcd7`  
**Status:** CONTRACT LOCKED — UI implementation not started in this slice

## Goal

Expose the already-built comprehensive-exam backend as a student-facing **Exam Ready** simulator so Elevate pilot learners can generate a repeatable baseline and later 30/60/90 comparison evidence.

This slice does not change question content, scoring, mastery, readiness math, H&A, Communications, or chapter grading.

## Existing certified backend

The simulator UI must use the current authenticated API/runtime:

- `GET /api/comprehensive-exam/config`
- `POST /api/comprehensive-exam/attempts`
- `GET /api/comprehensive-exam/attempts/[attemptId]`
- `PUT /api/comprehensive-exam/attempts/[attemptId]/answers/[position]`
- `PUT /api/comprehensive-exam/attempts/[attemptId]/flags/[position]`
- `POST /api/comprehensive-exam/attempts/[attemptId]/submit`
- `GET /api/comprehensive-exam/history`

The backend already provides:
- one active versioned exam configuration,
- 110 items per attempt,
- 100 scored + 10 unscored,
- 35/10/40/15 scored-domain weighting,
- server-authoritative expiration,
- persisted answer + flag state,
- start/resume,
- idempotent submission/finalization,
- student-safe result/history payloads,
- PO-1B study-session linkage.

## Route

Student route:

`/dashboard/exam-ready`

The student dashboard may link to this route only after the route itself is implemented and certified.

## Entry state

On load, the page:

1. fetches active exam config;
2. fetches student exam history;
3. shows:
   - exam title,
   - total questions,
   - scored vs unscored explanation,
   - time limit,
   - passing threshold,
   - prior attempt summaries;
4. exposes **Start Exam** when no active attempt exists;
5. uses the backend start/resume endpoint so an existing active attempt is resumed rather than duplicated.

No client-generated attempt ID, score, timer, user ID, school ID, or answer key is authoritative.

## Active attempt UI

The active simulator must include:

- visible countdown timer derived from server `expiresAt` / `remainingSeconds`;
- current question number out of 110;
- one question prompt;
- four answer choices;
- Previous / Next navigation;
- **Flag for review** control;
- question navigator showing:
  - unanswered,
  - answered,
  - flagged,
  - current;
- answered count;
- flagged count;
- explicit **Review & Submit** flow.

### Persistence

When a learner selects an answer:
- save immediately through the existing answer API;
- update local UI only after a successful response or reconcile on failure;
- never reveal correctness during the simulator.

When a learner flags/unflags:
- save immediately through the existing flag API.

Refresh/re-entry:
- fetch the attempt from the server;
- restore saved answers, flags, current attempt status, and server timer;
- do not restart or extend the timer.

## Timer rules

The browser timer is display-only.

Authoritative rules:
- server `expiresAt` wins;
- client clock cannot extend an attempt;
- periodic attempt refresh/reconciliation may correct visual drift;
- when displayed time reaches zero, request the attempt from the server and transition to finalized results;
- submission after server expiration returns the server-finalized attempt.

No pause button.

## Review & submit

Before submission, show:
- answered count;
- unanswered count;
- flagged count;
- navigator for quick return to any question;
- explicit warning that submission ends the attempt.

Submission requires a deliberate confirmation action.

Do not require all 110 questions to be answered. Unanswered questions remain unanswered and are scored by the server contract.

Double-submit must be safe; the backend is idempotent.

## Results

After finalization, show only student-safe result data returned by the runtime:

- percentage;
- pass/not-yet-pass status using the snapshotted passing threshold;
- scored correct / scored total;
- domain breakdown;
- elapsed time;
- unanswered-at-submit count;
- flagged-at-submit count;
- attempt number.

Do not expose:
- answer key,
- per-item correctness,
- unscored-item score,
- internal scoring snapshots,
- source question IDs,
- hidden provenance.

Result language must not claim licensing-exam pass probability.

## Attempt history

History shows prior attempts in reverse chronological order with:
- attempt number;
- status;
- date/time;
- percentage;
- pass/not-yet-pass;
- domain breakdown;
- elapsed time;
- active study seconds when available.

History is observational and must not rewrite readiness, grades, mastery, or H&A.

## Mobile/accessibility requirements

The simulator must be usable on phone, tablet, and desktop.

Required:
- large touch targets;
- keyboard-accessible answer options/navigation;
- visible focus states;
- semantic buttons/labels;
- timer not conveyed by color alone;
- no horizontal-scroll dependency for question navigation;
- confirmation dialogs readable on small screens;
- autosave status/error communicated in text.

## Failure behavior

Fail closed without losing persisted evidence.

- config unavailable → show unavailable state, no fake exam;
- start/resume failure → no local-only attempt;
- answer save failure → keep learner on the question and show retry state;
- flag save failure → show retry state;
- attempt refresh failure → preserve last rendered state but do not extend timer;
- submit failure → keep review state and allow safe retry;
- finalized attempt returned during any mutation → immediately transition to results.

## Security/integrity boundaries

The UI must never:
- fetch comprehensive-exam tables directly;
- receive or contain correct answers;
- calculate the official score;
- calculate pass/fail authoritatively;
- accept arbitrary user/school identity;
- mutate another user's attempt;
- turn exam time into attendance hours;
- alter chapter grades/mastery/remediation;
- expose unscored-item correctness;
- implement anti-cheating theater such as blocking screenshots/devtools as a security control.

## Pilot measurement boundary

PO-1C.4 enables a usable, repeatable **Exam Ready baseline attempt** for Elevate.

It does not yet build:
- school-admin/instructor comprehensive-exam oversight,
- instant-feedback practice mode,
- automated 30/60/90 checkpoint reporting.

Those remain later Gate 6 slices.

## Implementation file plan

Expected implementation files:

- `src/app/(dashboard)/dashboard/exam-ready/page.tsx`
- `src/components/comprehensive-exam/ExamShell.tsx`
- `src/components/comprehensive-exam/ExamQuestion.tsx`
- `src/components/comprehensive-exam/QuestionNavigator.tsx`
- `src/components/comprehensive-exam/ReviewScreen.tsx`
- `src/components/comprehensive-exam/ExamResults.tsx`
- `src/lib/comprehensive-exam/types.ts`

Existing API routes remain the server boundary.

Historical PO-1C.1/2/3 tests that intentionally asserted no UI existed in those earlier slices must be updated narrowly during implementation so they certify their original migration boundaries rather than forbid later authorized UI.

## Required certification

PO-1C.4 is GREEN only when:

1. start/resume works;
2. all 110 questions render without answer-key leakage;
3. answer persistence survives refresh;
4. flag persistence survives refresh;
5. timer cannot be extended by refresh/client clock;
6. expired attempts finalize correctly;
7. review screen accurately counts answered/unanswered/flagged;
8. submit is explicit and idempotent;
9. results expose only student-safe fields;
10. history renders prior attempts safely;
11. mobile and keyboard flows pass;
12. no H&A write/import is introduced;
13. no chapter-grade/mastery/readiness mutation is introduced;
14. TypeScript passes;
15. changed-file lint passes;
16. unit/regression tests pass;
17. production build passes;
18. Pilot Onboarding Certification passes;
19. exact-head Vercel preview is READY.

## Locked decision

**PO-1C.4 Simulator UI contract is LOCKED.**

The next implementation slice may build the route/components above against the existing comprehensive-exam API without changing the certified backend contract.

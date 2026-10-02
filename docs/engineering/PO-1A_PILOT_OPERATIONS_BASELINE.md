# PO-1A — Pilot Operations Baseline Audit

**Workstream:** PO-1 — Pilot Operations Hardening  
**Baseline:** production `main` at `498545ff388ce5049b2a5fd0a2098f6142bfd088`  
**Status:** COMPLETE — evidence audit locked  
**Rule:** Audit first. Do not add overlapping pilot systems until current capabilities and gaps are proven.

## Executive result

PO-1A confirms that ASCYN PRO already has strong pilot onboarding, school/role isolation, login-vs-learning separation, chapter assessment history, weak-area/readiness signals, and a usable feedback path.

The two material product gaps are:

1. **No production study-session / time-spent measurement.**
2. **No distinct instant-feedback practice mode.** The production chapter quiz intentionally delays correctness and full review until the end.

Pilot reporting also exists mainly as operations documents and generic analytics, not as an automated 30/60/90 school-pilot reporting surface.

A separate comprehensive 110-question production exam runtime could not be verified on this baseline. Current-main does expose chapter quiz attempts and readiness analytics; legacy/static practice-exam artifacts and an anti-cheating TODO are not sufficient evidence of a current production simulator.

## Evidence matrix

| Requirement | Status | Current-main evidence | Operational meaning |
|---|---|---|---|
| School-admin / instructor / student invite lifecycle | **GREEN** | `src/app/admin/users/actions.ts`, `src/app/auth/set-password/page.tsx`, `supabase/migrations/20260822000000_phase_7a_school_onboarding.sql`, `tests/e2e/admin/onboarding-journey.spec.ts` | Invite, role, school, activation, and first-login paths are implemented and tested. |
| Role and tenant permissions | **GREEN** | user-management server actions/tests, onboarding migration constraints, cross-school enrollment tests, instructor school-scoped roster/detail queries | Current pilot roles have explicit school boundaries and cross-school protections. |
| Last Login visibility | **GREEN** | `src/lib/instructor/last-login.ts` → `auth.users.last_sign_in_at` | Instructor can see account-access recency without treating it as learning. |
| Last Learning Activity visibility | **GREEN** | `src/lib/instructor/activity-signals.ts`, `student_progress.last_studied_at`, instructor pages | Meaningful learning recency is independently visible. |
| Login vs learning separation | **GREEN** | `src/lib/instructor/activity-signals.test.ts` | A login cannot masquerade as actual learning work. |
| Chapter assessment attempt history | **GREEN** | `quiz_attempts`, `QuizClient.tsx`, instructor student detail query ordered by `completed_at` | Scores, question counts, percentages, answers and completion timestamps are persisted for chapter quizzes. |
| Weak-area / readiness signals | **GREEN** | remediation pipeline, missed-question persistence, `src/lib/readiness/board-readiness.ts`, instructor student detail | Instructors can see performance/gap signals built from learning evidence. |
| Study-session / time-spent tracking | **RED** | no production `study_sessions` runtime/table found; `quiz_attempts` insert has no duration; prior dashboard blueprint explicitly lists study time as missing | ASCYN PRO cannot truthfully report how long a student studied or how long a quiz attempt took. |
| Attempt-duration persistence | **RED** | `QuizClient.tsx` persists score/total/percentage/answers/`completed_at`, but no started/duration field on the attempt | Login and completion timestamps cannot be converted into defensible study duration. |
| Separate instant-feedback practice mode | **RED** | `QuizClient.tsx` explicitly advances without revealing correctness and states “full answer review at the end”; no separate current-main practice-mode runtime located | The pilot request for immediate correct/incorrect feedback after each practice question is not currently satisfied as a distinct mode. |
| Current production comprehensive exam/simulator oversight | **YELLOW** | chapter quizzes/readiness are live; only `final_exam_attempts` demo placeholder, legacy/static practice-exam artifacts, old QA notes and anti-cheating TODO located for a comprehensive final | Do not claim current-main simulator oversight is certified until a concrete production route/runtime and persistence path are identified. |
| Pilot checklist + feedback collection | **GREEN** | `src/components/BetaChecklist.tsx`, `beta_feedback`, `src/app/admin/beta-feedback/page.tsx` | Testers can submit categorized/severity feedback and admins can review it. |
| Production communication/support path | **GREEN** | frozen Production Communications workstream + owner beta-feedback notifications | Pilot support has an in-product communication path and feedback escalation path. |
| Pilot operational metrics documents | **YELLOW** | `pilot/METRICS.md`, `pilot/WEEKLY_SUMMARY.md`, `pilot/EXECUTIVE_DASHBOARD.md` | Operating framework exists but relies significantly on manual updating. |
| Automated 30/60/90-day pilot reporting | **RED** | no current-main 30/60/90 runtime/reporting implementation located | School pilot outcomes cannot yet be generated as a repeatable in-product checkpoint report. |

## Detailed YELLOW / RED findings

### RED — Study-session and time-spent tracking

**Existing path**
- `src/lib/instructor/last-login.ts`
- `src/lib/instructor/activity-signals.ts`
- `src/components/QuizClient.tsx`
- `student_progress.last_studied_at`
- `quiz_attempts.completed_at`

**Gap**
These are recency/completion signals, not duration evidence. A login timestamp does not prove study time, and a completion timestamp does not prove how long an attempt lasted.

**Impact**
Pilot instructors/admins cannot answer “How much time did this student actually spend in ASCYN PRO?” with defensible data.

**Smallest safe repair**
Add a purpose-built pilot learning-session/attempt-duration telemetry layer with explicit start/heartbeat/end semantics. Keep it completely separate from H&A attendance hours.

**Database migration**
Yes, unless an existing suitable event table is deliberately reused after schema review.

**Required regressions**
- no cross-school session visibility,
- no conversion of study time into attendance hours,
- duplicate/abandoned session handling,
- inactive-tab/timeout behavior defined,
- login-only activity never counts as study duration,
- server-authoritative timestamps where practical.

### RED — Attempt duration

**Existing path**
`QuizClient.tsx` saves:
- user,
- quiz,
- score,
- total questions,
- percentage,
- answer payload,
- completion timestamp.

**Gap**
No attempt start timestamp/duration is persisted in the quiz attempt itself.

**Smallest safe repair**
Prefer joining quiz attempts to the PO-1B activity/session event layer instead of bloating grading semantics unless an attempt-specific duration column proves cleaner.

**Database migration**
Likely yes as part of PO-1B.

**Required regressions**
- retry cannot overwrite prior attempt duration,
- abandoned attempt is distinguishable from submitted attempt,
- duration is never used to alter mastery percentage.

### RED — Separate instant-feedback practice mode

**Existing path**
`src/components/QuizClient.tsx` intentionally uses end-of-quiz feedback:
- answer is recorded,
- next question loads,
- correctness is not revealed,
- full answer review occurs at the end.

**Gap**
No distinct practice mode was found that reveals correct/incorrect plus explanation immediately while preserving the simulator/assessment behavior.

**Impact**
The requested pilot practice experience cannot be enabled without changing or adding runtime behavior.

**Smallest safe repair**
Do **not** change the certified assessment flow. Add a separate practice-mode surface that reuses approved question content but has its own non-grade-bearing attempt semantics and immediate feedback.

**Database migration**
Not necessarily. Start with a runtime contract; only persist practice evidence if product requirements demand it.

**Required regressions**
- practice responses do not inflate grades/mastery,
- practice cannot overwrite assessment evidence,
- immediate explanations do not leak into exam/simulator mode,
- instructor analytics clearly label practice vs assessment evidence.

### YELLOW — Comprehensive exam/simulator oversight

**Existing evidence**
- live chapter `quiz_attempts`,
- board-readiness engine,
- missed-question/remediation evidence,
- legacy/static practice exam artifacts,
- `final_exam_attempts` only as an empty demo-server case,
- `docs/ANTI_CHEATING_TODO.md` references a 110-question final.

**Gap**
The audit did not locate a current Next.js production simulator route/component plus authoritative persisted final-exam attempt flow.

**Impact**
We can certify chapter assessment history, but we should not claim a production 110-question simulator is observable from this evidence alone.

**Smallest safe repair**
Before implementation, run a targeted route/runtime discovery. If the simulator lives under unexpected naming, register it in PO-1 with exact files/tables. If it does not, treat it as a separate implementation slice.

**Database migration**
Unknown until route/runtime discovery is complete.

### YELLOW — Pilot metrics operations

**Existing path**
- `pilot/METRICS.md`
- `pilot/WEEKLY_SUMMARY.md`
- `pilot/EXECUTIVE_DASHBOARD.md`
- `pilot/SUCCESS_CRITERIA.md`

**Gap**
The operating model is document-driven and partially manual.

**Impact**
Useful for an early pilot, but weak for repeatable multi-school measurement.

**Smallest safe repair**
Build reporting from existing production evidence after PO-1B telemetry is trustworthy.

**Database migration**
No new reporting schema should be authorized yet; first prove which metrics can be derived from existing tables plus PO-1B.

### RED — Automated 30/60/90 reporting

**Gap**
No in-product 30/60/90 checkpoint generator, stored checkpoint snapshots, or pilot-school comparison surface was found.

**Smallest safe repair**
Defer to PO-1E. Define metrics only after PO-1B activity telemetry and any simulator evidence are stable.

## PO-1A decision

### What does NOT need rebuilding
- invite lifecycle,
- school/role assignment,
- tenant boundaries,
- Last Login,
- Last Learning Activity,
- login-vs-learning distinction,
- chapter quiz attempt persistence,
- feedback intake/admin review,
- core communications.

### What is genuinely missing
1. trustworthy learning-session / time-spent observability;
2. attempt-duration telemetry;
3. a separate non-grade-bearing instant-feedback practice mode;
4. automated 30/60/90 pilot reporting.

### What needs one more discovery pass
- current production comprehensive/final exam simulator runtime and persistence.

## PO-1B authorization boundary

PO-1B should be limited to **Pilot Activity / Session Observability Hardening**.

It may add:
- a minimal server-authoritative study-session/event contract,
- quiz-attempt start/end duration linkage,
- instructor/admin read visibility,
- tenant-safe RLS,
- regressions proving study duration is separate from attendance hours.

It must **not**:
- alter H&A hour totals,
- alter grading/mastery percentages,
- modify Production Communications,
- modify chapter content,
- add instant-feedback practice behavior,
- build 30/60/90 reporting yet.

PO-1D and PO-1E remain separately gated.

## Freeze boundaries

Remain frozen unless a real regression is discovered:
- Production Communications
- CH2-PROV
- TLS certified core
- H&A certified runtime
- Chapters 1–21 certified learning architecture

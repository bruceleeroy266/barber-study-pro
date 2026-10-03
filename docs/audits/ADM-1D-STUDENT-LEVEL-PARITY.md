# ADM-1D — Student-Level Metric Parity Contract

**Status:** In progress  
**Scope:** Student → Instructor → School/Admin report parity only. No new product features.

## Canonical metric map

| Metric | Canonical evidence / calculation | Student surfaces | Instructor surfaces | Admin / report surfaces | ADM-1D action |
| --- | --- | --- | --- | --- | --- |
| Identity | `profiles` row for the learner | Dashboard/profile | roster + student detail | User Management/report | Keep |
| Overall / curriculum progress | Average of each persisted `student_progress.progress_percentage` over the full curriculum chapter count; missing chapters = 0 | dashboard, progress, chapters | roster, student detail | Student Progress Report | **Lock now** |
| Chapters completed | Count chapter progress rows exactly 100% | dashboard/progress/chapters | roster/detail | report | **Lock now** |
| Flashcard decks completed | Count `flashcards_completed=true` | progress | detail | report/detail | **Lock now** |
| Quizzes passed | Count canonical `student_progress.quiz_completed=true` flags | progress | detail | report/detail | **Lock now**; pass semantics receive deeper grading review in ADM-1F |
| Quiz average | Arithmetic mean of persisted `quiz_attempts.percentage`; no attempts = no evidence / display dash where supported | progress | roster/detail | report | **Lock now** |
| Board readiness | `calculateBoardReadiness()` using the same progress + attempts + total chapter inputs on every parity surface | dashboard/progress | roster/detail | report | **Lock now**; remove legacy 50/50 readiness estimate and surface-only streak bonus |
| Chapter progress | Exact persisted `progress_percentage` for that chapter | chapters/progress | detail diagnostics | report | Keep |
| Weak / strong areas | `analyzePerformance()` from the same attempts/progress/question bank | dashboard/progress | detail | report context | Keep; deeper grading semantics ADM-1F |
| Last learning activity | Latest meaningful learning evidence; current surfaces still mix legacy progress activity and trusted activity | dashboard | roster/detail | report | Mapped; normalize in a later ADM-1D slice |
| Last login | Auth `last_sign_in_at`, server-resolved | account context | roster/detail | report | Keep |
| Attendance | `calculateAttendanceSummary()` over same-school attendance records | dashboard/progress | detail | later admin parity | Mapped; full parity belongs to ADM-1E |
| Official hours | `getOfficialMinutes()` + program required-hours resolver | hours surface | detail | later admin parity | Mapped; full parity belongs to ADM-1E |
| Grades | Canonical gradebook calculation | grades surface | detail/gradebook | reports | Mapped; full parity belongs to ADM-1F |
| Assessments | Persisted assessments + canonical pass/completion semantics | dashboard | detail | reports | Mapped; full parity belongs to ADM-1F |

## First certified repair target

Before ADM-1D, the same learner could have conflicting progress/readiness values because:

1. Student `/dashboard/progress` and `/dashboard/chapters` used **completed chapters ÷ total chapters** for “Overall Progress”.
2. Instructor student detail and the main student dashboard used **average chapter progress ÷ total curriculum chapters**.
3. Instructor reports displayed a separate legacy readiness estimate: **50% overall progress + 50% quiz average**.
4. The main student dashboard passed a dashboard-only study streak into board readiness while other surfaces did not.

ADM-1D locks these shared metrics to one calculation path in `src/lib/student-level/metrics.ts`.

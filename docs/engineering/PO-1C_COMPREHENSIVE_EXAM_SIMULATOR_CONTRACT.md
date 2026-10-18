# PO-1C — Comprehensive Exam Simulator Contract

**Status:** LOCKED FOR DESIGN / NO SIMULATOR CODE AUTHORIZED  
**Baseline main:** `822fef660170726b36a5e81809dc40342ac743a9`

## Purpose

PO-1C restores the previously intended ASCYN PRO comprehensive exam simulator as a current-production feature without reviving obsolete static HTML or creating a second competing assessment system.

This contract locks the behavior that must be true before any simulator runtime, database migration, or UI implementation is authorized.

The simulator is a **comprehensive exam attempt**, distinct from:
- chapter quizzes,
- remediation reassessments,
- instant-feedback practice mode,
- attendance/hour tracking.

---

## 1. Exam composition

Each comprehensive exam attempt contains **exactly 110 questions**.

### Scored items

Exactly **100 questions are scored**.

The scored 100 must use this verified domain distribution:

| Domain | Weight | Scored questions |
| --- | ---: | ---: |
| Scientific Concepts | 35% | 35 |
| Implements & Equipment | 10% | 10 |
| Hair Care Services | 40% | 40 |
| Facial Hair & Skin Care Services | 15% | 15 |
| **Total** | **100%** | **100** |

The percentage score is calculated from the 100 scored items only.

### Unscored items

Exactly **10 additional questions are unscored/pilot items**.

Rules:
- they are mixed into the 110-question attempt,
- the student is not told which questions are unscored,
- they do not affect raw score, percentage, pass/fail, readiness, remediation, or mastery,
- they may be analyzed separately for future question-bank calibration,
- an unscored item must still come from an approved comprehensive-exam question bank.

### Attempt score

Authoritative score fields:
- `scored_correct` — 0–100
- `scored_total` — always 100 for a completed standard attempt
- `percentage` — `scored_correct / 100 * 100`
- `unscored_correct` — diagnostic only
- `unscored_total` — always 10 for a completed standard attempt

No implementation may accidentally divide by 110.

---

## 2. Question-bank contract

The simulator must use an explicitly registered comprehensive-exam question bank.

It must not:
- scrape chapter UI state,
- randomly pull every available chapter quiz item without domain qualification,
- use reassessment reserve questions as ordinary exam items by default,
- use legacy static HTML questions as an authoritative production source.

Each eligible question must have at minimum:
- stable question ID,
- domain,
- scored/unscored eligibility,
- active/inactive status,
- prompt,
- four answer options,
- canonical correct answer,
- explanation/rationale retained server-side,
- provenance/content-source metadata where the current curriculum architecture requires it.

### Selection

For every new attempt:
1. select the exact scored domain counts,
2. select 10 unscored items,
3. ensure no duplicate question IDs,
4. randomize the overall 110-question order,
5. randomize answer-option presentation using the same anti-position-bias principles used by current quiz runtime,
6. persist the selected question IDs/order so refresh/recovery does not silently generate a different exam.

The exact bank size is **not** part of this contract. The bank must simply contain enough certified items to satisfy the selection rules without unsafe duplication.

---

## 3. Timer contract

The comprehensive simulator is timed.

### Locked behavior

- The timer begins from a server-authoritative attempt start timestamp.
- The timer must survive browser refresh/reload.
- Client clock manipulation cannot extend the exam.
- Server time is authoritative for expiration.
- When time expires, the attempt moves to submission/finalization using whatever answers were actually persisted.
- Leaving the tab open does not pause the exam clock.
- Hidden/background state may be recorded as telemetry but does not stop the exam timer.
- The exam timer and PO-1B active-study telemetry are **different measurements**.

### Time-limit value

The historical repo does not contain a trustworthy surviving value for the exact comprehensive-exam time limit.

Therefore:

**The duration must be stored as an explicit server-side exam configuration value and must not be hard-coded until the authoritative target exam/CIB configuration is selected.**

No engineer may invent a time limit merely to complete implementation.

---

## 4. Answer persistence and refresh recovery

Answers must persist during the attempt.

Minimum persistence behavior:
- current answer selection is saved before advancing,
- persisted answers survive refresh,
- question order survives refresh,
- flagged-question state survives refresh,
- attempt start/expiration survives refresh,
- completed attempts cannot be reopened as active attempts.

A browser crash or connectivity interruption must not manufacture answers or extra time.

If a write fails:
- the UI must show a visible recoverable error,
- the system must not falsely display the answer as safely saved.

---

## 5. Flag / review contract

Students can flag any question for later review.

Required states:
- answered / unanswered,
- flagged / unflagged,
- current question,
- review summary before final submission.

The review screen must allow students to:
- jump to unanswered questions,
- jump to flagged questions,
- change previously selected answers while the attempt is still active,
- see counts of answered, unanswered, and flagged questions.

Flagging:
- has no scoring effect,
- is persisted,
- is retained in attempt evidence for later operational analysis if desired,
- is not itself treated as weakness/mastery evidence.

---

## 6. Submission contract

There are only three legitimate completion paths:

1. **Student submission**
2. **Timer expiration**
3. **Authorized recovery/finalization of an interrupted attempt**

Submission must be idempotent.

After authoritative completion:
- answers are immutable,
- question order is immutable,
- score is immutable except through a separately audited correction process if one is ever created,
- the same attempt cannot be submitted twice,
- retrying a failed network response must not create a second attempt.

---

## 7. Student feedback / answer-key boundary

The comprehensive simulator is an **exam mode**, not instant-feedback practice.

During an active attempt:
- no correct/incorrect feedback,
- no answer explanation,
- no hint revealing the correct option,
- no mastery/remediation result that leaks the answer before submission.

After submission:
- student may see overall score,
- domain-level performance,
- readiness/weak-area summary,
- targeted study recommendations.

The comprehensive simulator must **not expose a reusable full answer key** to the student.

Any future detailed post-exam item review must be separately authorized and must not undermine the exam-only pilot requirement.

PO-1D instant-feedback practice remains a separate feature and may not share this exam-mode feedback behavior.

---

## 8. Attempt history contract

Every completed or formally finalized attempt must remain in immutable history.

Minimum attempt record:

- attempt ID
- user ID
- school ID
- exam configuration/version ID
- question-set/version identifier
- started_at
- expires_at
- completed_at
- completion_reason
- scored_correct
- scored_total
- percentage
- unscored_correct
- unscored_total
- domain breakdown
- selected question IDs/order
- persisted answer map
- flag map
- attempt number / retake lineage
- linked PO-1B study-session ID or telemetry linkage
- created_at / updated_at

History must distinguish separate retakes rather than overwrite a student's prior result.

---

## 9. PO-1B duration telemetry linkage

The comprehensive exam must integrate with the certified PO-1B telemetry system.

Locked rules:

- `surface_type = 'quiz'` may not be overloaded ambiguously if a distinct `comprehensive_exam` surface is needed; implementation must choose one explicit registered surface and update the telemetry allowlist deliberately.
- Each comprehensive attempt links to exactly one logical PO-1B telemetry session chain.
- The authoritative exam wall-clock duration comes from exam start/expiration/completion timestamps.
- PO-1B `active_seconds` measures observed active learning interaction.
- The two values must remain separately visible and separately named.
- Active study seconds never change the exam score.
- Exam wall-clock duration never becomes attendance/H&A time.
- Duplicate tabs/devices must not multiply PO-1B active seconds.
- A second tab may not create a second active comprehensive exam attempt for the same student/configuration unless the first attempt is formally ended.

Instructor/admin reporting may show:
- elapsed exam duration,
- PO-1B active seconds,
- the difference between them,
but must not label either as official barber-school hours.

---

## 10. Instructor visibility

Authorized same-school instructors must be able to see comprehensive-exam oversight for permitted students.

Minimum instructor view:
- student identity,
- attempt date/time,
- attempt number,
- completed / expired / interrupted status,
- overall scored percentage,
- scored correct out of 100,
- domain percentages,
- duration,
- PO-1B active study time,
- flagged-question count,
- unanswered-at-submit count,
- retake history,
- trend across attempts,
- resulting weak-area/readiness signals.

Instructor visibility is **read-only** for completed attempts.

Instructors may not:
- alter answers,
- alter score,
- turn exam time into attendance hours,
- reveal or export a reusable full answer key to students through this oversight view.

---

## 11. School-admin visibility

Authorized school admins receive the same school-scoped exam oversight plus aggregate school reporting.

Minimum school-admin capabilities:
- same per-student attempt visibility as instructor,
- filter by student/date/status,
- cohort average,
- domain-level cohort weakness,
- completion/attempt counts,
- duration/active-time summaries.

School admins may not directly mutate completed attempt evidence.

---

## 12. Platform-admin visibility

Platform admins may inspect cross-school exam records for:
- support,
- integrity investigation,
- question calibration,
- production troubleshooting.

Platform-admin access must remain auditable and must not weaken ordinary tenant isolation.

---

## 13. RLS / tenant boundary

Any simulator persistence must derive school identity from authoritative profile/relationship data.

Client input may never authoritatively set:
- `user_id`,
- `school_id`,
- score,
- scored/unscored classification,
- correct answers,
- completion timestamps,
- duration.

Required visibility:
- student: own attempts only,
- instructor: authorized same-school/roster students,
- school admin: own school,
- platform admin: privileged support access.

Question answer keys must not be directly readable through ordinary student RLS paths.

---

## 14. Readiness / weak-area integration

A completed comprehensive exam may contribute to readiness and weak-area analytics.

Rules:
- only the 100 scored questions contribute to scored performance,
- unscored/pilot items never lower or raise readiness,
- original attempt history remains immutable,
- later remediation does not rewrite historical exam result,
- comprehensive-exam evidence must be labeled separately from chapter-quiz evidence,
- one comprehensive attempt must not silently replace the existing chapter mastery pipeline.

The initial implementation must consume the existing readiness architecture instead of creating a second readiness score unless a separate later contract explicitly authorizes one.

---

## 15. H&A firewall

The comprehensive exam has **zero direct write path** to official attendance/hour records.

It must never write to or approve:
- `hour_logs`,
- `effective_hour_logs`,
- attendance records,
- attendance corrections,
- hour adjustments,
- official approved-minute functions.

Exam duration and active-study time are engagement/assessment telemetry only.

---

## 16. Anti-cheating boundary

PO-1C may preserve integrity evidence, including:
- tab/focus-loss events,
- unusual answer velocity,
- interrupted/resumed states,
- duplicate-session attempts,
- approval/access events if required.

However:
- browser blocking is not considered a security guarantee,
- copy/paste/right-click/developer-tool restrictions are at most deterrents,
- no invasive device surveillance is part of this contract,
- any future Secure Exam Mode must be separately authorized.

PO-1C does not add Secure Exam Mode merely because historical TODO documentation mentioned it.

---

## 17. Failure / recovery behavior

The simulator must fail safely.

Examples:
- if question-set generation fails, no active attempt is created;
- if persistence fails, do not pretend an answer is saved;
- if score finalization fails, do not mark the attempt complete;
- if telemetry linkage fails, preserve the valid exam result and surface the telemetry fault separately;
- if readiness update fails after a valid completed attempt, preserve the attempt and retry/reconcile analytics separately;
- if the timer expires while offline, the server expiration timestamp still governs when connection returns.

---

## 18. Versioning

The simulator must be versionable.

At minimum persist:
- exam configuration version,
- domain blueprint version,
- selected question-bank version/snapshot,
- scoring-policy version.

A future blueprint change must not reinterpret historical attempts using newer weights.

---

## 19. Required regression certification before production merge

Before PO-1C implementation can be certified GREEN, tests must prove at least:

1. Every standard attempt contains exactly 110 unique questions.
2. Exactly 100 questions are scored.
3. Exactly 10 are unscored.
4. Scored distribution is exactly 35/10/40/15 by the locked domains.
5. Unscored questions never affect percentage.
6. Student cannot identify unscored questions from payload metadata.
7. Client cannot submit authoritative score/correctness.
8. Server clock controls expiration.
9. Refresh preserves attempt/question order.
10. Refresh preserves answers.
11. Refresh preserves flags.
12. Student can review unanswered and flagged questions before submission.
13. No answer feedback leaks during active exam.
14. Final submission is idempotent.
15. Expiration finalization is idempotent.
16. Retake creates a new attempt without overwriting history.
17. Student sees only own attempts.
18. Instructor sees only authorized student/school attempts.
19. School admin sees only own-school attempts.
20. Platform admin privileged read remains server-side/auditable.
21. Answer keys are not exposed through ordinary student query paths.
22. Overall score uses denominator 100, never 110.
23. Domain scores use scored items only.
24. PO-1B active seconds remain distinct from exam elapsed duration.
25. Duplicate tabs cannot multiply active-study seconds.
26. Duplicate tabs cannot create two concurrent standard attempts for the same student/configuration.
27. Exam telemetry never writes H&A.
28. Exam result never changes official barber-school hours.
29. Readiness integration ignores unscored items.
30. Historical attempt remains unchanged after remediation/reassessment.
31. A telemetry-link failure does not erase a valid completed exam.
32. A readiness-update failure does not erase a valid completed exam.
33. Failed question generation creates no partial active attempt.
34. Failed answer persistence is visible to the student.
35. Completed attempt answers/score are immutable through ordinary user paths.

---

## 20. Implementation boundary

### Allowed in later PO-1C implementation

Only after explicit authorization:

- comprehensive-exam question-bank registry,
- exam configuration/version records,
- comprehensive attempt persistence,
- answer/flag persistence,
- start/resume/submit/finalize server actions/RPCs,
- timer UI,
- flag/review UI,
- student attempt history,
- instructor/school-admin oversight,
- PO-1B telemetry integration,
- readiness/weak-area adapter,
- regression tests.

### Not authorized by this contract

- instant-feedback practice mode,
- Secure Exam Mode,
- attendance/hour conversion,
- a new readiness formula,
- new curriculum chapters,
- new question content solely to inflate bank size,
- answer-key export,
- arbitrary anti-cheating surveillance,
- rewriting current chapter quiz behavior.

---

## 21. Design decisions requiring implementation-time resolution

These are intentionally **not invented** in the contract:

1. **Exact exam time limit** — must come from the authoritative target exam/CIB/configuration.
2. **Exact final question-bank size** — must be audited from current certified content.
3. **Exact database table/function names** — lock during PO-1C schema design before migration.
4. **Whether PO-1B uses a new `comprehensive_exam` surface type or a precisely identified quiz subtype** — must be explicit and non-ambiguous.
5. **Passing threshold** — must come from the selected exam configuration or an explicitly approved ASCYN PRO policy; do not infer it from chapter quiz thresholds.

---

# Certification statement

PO-1C Comprehensive Exam Simulator behavior is now **LOCKED ON PAPER**.

No simulator route, migration, attempt table, timer runtime, or instructor exam UI is authorized by this document alone.

The next allowed step is **PO-1C schema/runtime architecture design only**, where exact tables, server functions, question-selection algorithm, concurrency rules, and route structure are specified before code is written.

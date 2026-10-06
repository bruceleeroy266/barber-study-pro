# PO-1E — Pilot Measurement + 30/60/90 Reporting Contract

**Workstream:** PO-1 — Pilot Operations Hardening / Gate 6 Automated Pilot Measurement  
**Baseline:** production `main` at `177f2bfceaa4dd5127123d8fd8e2ca76e4412a60`  
**Status:** CONTRACT LOCKED — reporting implementation not started in this slice

## Goal

Turn trusted ASCYN PRO evidence into a repeatable staff-facing pilot measurement system for Elevate and future schools.

PO-1E must let authorized staff answer, with evidence:

- Are included pilot learners using ASCYN PRO?
- Are scores, progress, and readiness changing over time?
- Which exam domains are improving or weakening?
- Which learners need intervention?
- What changed between baseline, Day 30, Day 60, and Day 90?
- Can school leadership review the pilot without cosmetology/supplemental learners contaminating the barber pilot aggregate?

This work is observational/reporting only. It must not change grades, mastery, readiness math, H&A, chapter content, Communications, or Exam Ready scoring.

---

## Existing certified evidence

PO-1E must reuse the certified evidence already in production rather than create a second measurement system.

### Identity / cohort membership
- `profiles.school_id`
- `profiles.role`
- `profiles.include_in_school_metrics`
- instructor/student assignment relationships

### Learning progress / performance
- canonical student progress and readiness calculations already used by student/instructor/admin surfaces
- `student_progress`
- `quiz_attempts`
- remediation / reassessment evidence where already certified

### Trusted activity
- PO-1B `study_sessions`
- PO-1B `study_session_events`
- trusted daily activity rollups
- `active_seconds`

### Exam Ready
- `comprehensive_exam_attempts`
- student-safe comprehensive exam results
- domain breakdown
- elapsed time
- attempt number
- completion state

### Existing metric inclusion rule
A learner with:

`include_in_school_metrics = false`

remains active and individually visible, but is excluded from school/class aggregate pilot metrics.

PO-1E must preserve that rule everywhere.

---

## Pilot measurement period

ASCYN PRO currently has no authoritative school-level pilot start date suitable for 30/60/90 checkpoint math.

PO-1E therefore requires an explicit pilot measurement period rather than inferring a start from:

- school creation date,
- invitation date,
- first login,
- first study session,
- first quiz,
- first Exam Ready attempt.

Those are evidence dates, not the legal/operational pilot start.

### Proposed record

A school may have one active pilot measurement period.

Logical fields:

- `id uuid`
- `school_id uuid`
- `status`: `draft | active | completed | cancelled`
- `pilot_start_date date`
- `pilot_end_date date`
- `timezone text`
- `created_by uuid`
- `activated_by uuid null`
- `activated_at timestamptz null`
- `completed_at timestamptz null`
- `created_at timestamptz`
- `updated_at timestamptz`

For the standard external-school pilot:

`pilot_end_date = pilot_start_date + 90 days`

unless an authorized admin explicitly records a different approved end date.

### Start authority

Pilot start may be activated only by:

- platform admin, or
- authorized school admin for that school if product policy later permits it.

Instructor cannot change the official pilot measurement period.

The start date must be explicit and auditable.

---

## Checkpoints

PO-1E supports four measurement checkpoints:

- **Baseline**
- **Day 30**
- **Day 60**
- **Day 90**

Checkpoint target dates are calculated from `pilot_start_date`.

### Baseline

Baseline is the starting measurement state for the pilot.

It may include incomplete coverage when not every included student has produced evidence yet.

The report must state coverage instead of manufacturing missing values.

Examples:
- 9 of 13 included learners have completed an Exam Ready baseline
- 11 of 13 have qualifying study activity
- 13 of 13 have accounts but 2 have no graded evidence

Missing evidence is not converted to zero unless the underlying canonical metric explicitly defines zero.

### Checkpoint generation

A checkpoint is generated from evidence available through a clearly recorded cutoff timestamp.

A checkpoint must not silently move after generation.

---

## Immutable checkpoint snapshots

30/60/90 reporting must not be a historical screen that changes every time current data changes.

Each finalized checkpoint stores an immutable snapshot.

Logical checkpoint fields:

- `id uuid`
- `pilot_period_id uuid`
- `school_id uuid`
- `checkpoint_type`: `baseline | day_30 | day_60 | day_90`
- `target_date date`
- `cutoff_at timestamptz`
- `generated_at timestamptz`
- `generated_by uuid`
- `status`: `draft | finalized`
- `included_student_count integer`
- `excluded_student_count integer`
- `coverage jsonb`
- `metrics jsonb`
- `notes jsonb`
- `schema_version text`

Unique finalized checkpoint:

`(pilot_period_id, checkpoint_type)`

### Why snapshot

This preserves what ASCYN PRO actually knew at Day 30 even if:

- students later take more exams,
- assignments change,
- a learner becomes excluded/included later,
- grades change,
- remediation evidence changes,
- the school reaches Day 60 or Day 90.

Current dashboards remain live. Finalized pilot checkpoints remain historical evidence.

---

## Metrics inclusion semantics

### School-level checkpoint

Aggregate calculations include only learners who are:

- in the checkpoint school,
- learner role,
- not disabled where the metric requires active accounts,
- `include_in_school_metrics <> false` at checkpoint generation.

The finalized checkpoint stores:
- included learner IDs or a deterministic membership snapshot,
- included count,
- excluded count,
- enough membership evidence to explain the report later.

### Excluded learners

Excluded learners:
- remain visible in individual staff views,
- retain their own study/exam/progress history,
- do not contribute to school pilot aggregate averages, rates, distributions, or trend deltas.

This is essential for Elevate so cosmetology/supplemental students can use ASCYN PRO without distorting the barber pilot measurement.

### Instructor view

Instructor aggregate views include only:
- learners the instructor is authorized to view,
- and learners included in metrics.

Instructor cannot see another instructor's unauthorized students merely because they belong to the same school.

### School-admin view

School admin may view:
- the full school checkpoint aggregate,
- all same-school individual learner drilldowns allowed by existing authorization.

### Platform admin view

Platform admin may view:
- any school pilot period,
- any finalized checkpoint,
- cross-school support/audit views.

Cross-school comparisons remain a later optional presentation layer; PO-1E does not rank schools.

---

## Core checkpoint metrics

The initial contract intentionally uses evidence already certified.

### 1. Cohort / coverage
- included learner count
- excluded learner count
- enabled included learners
- learners with qualifying learning evidence
- learners with Exam Ready evidence
- learners with chapter quiz evidence
- learners with readiness evidence

### 2. Engagement
- total trusted active study seconds
- average active study seconds per included learner
- median active study seconds where practical
- active learners in the checkpoint window
- learners with no qualifying activity
- qualifying study days
- latest learning activity distribution

Study seconds are PO-1B telemetry only.

They are never:
- attendance hours,
- clocked school hours,
- approved minutes,
- completion credit.

### 3. Exam Ready
- learners with completed Exam Ready attempts
- completion coverage rate
- average latest Exam Ready percentage
- median latest Exam Ready percentage where practical
- passing-result rate
- average domain percentages:
  - Scientific Concepts
  - Implements & Equipment
  - Hair Care Services
  - Facial Hair & Skin Care Services
- average elapsed time
- average unanswered-at-submit
- repeat-attempt count

Use the latest completed attempt at or before the checkpoint cutoff for checkpoint state unless a later implementation slice explicitly locks another rule.

Do not include unscored-question correctness.

### 4. Chapter learning performance
- chapter quiz attempt count
- latest/best canonical quiz percentages using existing semantics
- overall canonical progress
- canonical readiness status/score only through the existing readiness resolver
- number / rate of included learners needing attention

PO-1E must not invent a second readiness formula.

### 5. Intervention / remediation
Where existing certified evidence supports it:
- learners with active remediation
- learners with completed remediation
- unresolved high-priority/safety escalations
- change in needs-attention population between checkpoints

Do not infer instructor intervention quality from absence of data.

---

## Comparison rules

Each checkpoint may compare against:

- baseline, and
- immediately prior finalized checkpoint.

Examples:
- Exam Ready average: +6 percentage points vs baseline
- Scientific Concepts: +9 points vs Day 30
- included learners active: 8/13 → 11/13
- average trusted study time: 42 min → 71 min
- needs-attention learners: 5 → 3

### Delta language

Use:
- percentage points for percentage metric differences,
- absolute counts for learner-count differences,
- seconds/minutes for telemetry differences.

Do not label correlation as causation.

The UI must not claim:
- ASCYN PRO caused the improvement,
- ASCYN PRO guarantees licensing-exam success,
- a learner will pass a state board exam,
- study time alone proves learning quality.

Approved language:
- improved while using ASCYN PRO,
- increased/decreased during the pilot window,
- evidence observed in ASCYN PRO,
- requires more evidence.

---

## Staff-facing surfaces

### Instructor

Proposed route:

`/instructor/pilot-measurement`

Purpose:
- assigned-student pilot view,
- current cohort activity,
- Exam Ready status,
- checkpoint trends,
- students needing attention,
- individual drilldown links.

Instructor cannot finalize school-wide official checkpoints unless later explicitly authorized.

### School admin

Use the existing school-admin dashboard/navigation pattern and expose:

**Pilot Measurement**

Purpose:
- official school cohort summary,
- Baseline / Day 30 / Day 60 / Day 90 timeline,
- coverage indicators,
- Exam Ready/domain trends,
- trusted activity trends,
- progress/readiness trends,
- at-risk/intervention counts,
- finalized checkpoint review.

### Platform admin

Within the existing Admin School surface:

**Pilot Measurement**

Purpose:
- activate/inspect pilot period,
- generate/finalize checkpoint,
- inspect source coverage,
- troubleshoot missing evidence,
- review finalized report.

Do not create a second school-management system.

---

## Individual learner drilldown

Staff must be able to inspect why a school aggregate looks the way it does.

Per included learner show:
- metrics inclusion state,
- latest qualifying activity,
- trusted active study time in window,
- Exam Ready attempt history summary,
- latest Exam Ready percentage/domain breakdown,
- canonical progress/readiness,
- chapter assessment summary,
- remediation/intervention state where authorized.

Excluded learners may be viewed individually but must carry a clear:

**Excluded from aggregate pilot metrics**

label.

---

## Finalization workflow

### Draft preview

Authorized staff may preview a checkpoint before finalization.

Preview:
- derives live evidence through cutoff,
- shows coverage warnings,
- shows inclusion/exclusion membership,
- is not historical evidence yet.

### Finalize

Finalization requires explicit confirmation.

Finalization stores:
- exact cutoff,
- exact cohort membership,
- exact aggregate metrics,
- exact coverage,
- exact generator,
- schema version.

Finalization is idempotent.

A finalized checkpoint cannot be silently regenerated or edited.

If a correction is necessary:
- create an audited replacement/revision mechanism in a later implementation slice,
- never overwrite finalized evidence invisibly.

---

## Coverage / evidence quality

Every report must show evidence coverage.

Examples:
- Exam Ready: 9 / 13 included learners
- Trusted activity: 12 / 13
- Chapter quiz evidence: 10 / 13
- Readiness evidence: 8 / 13

If coverage is weak, ASCYN PRO must say so.

No-data and partial-data states must not render misleading 0% performance.

Use:
- No evidence yet
- Partial coverage
- 9 of 13 learners measured

instead of invented zeros.

---

## Security and tenant boundaries

PO-1E is read-heavy but must remain fail-closed.

### Required
- school_id always derived/validated server-side
- instructor assignment/school scope enforced
- school admin same-school enforcement
- platform admin explicit privileged path
- no arbitrary client-supplied school/user IDs without authorization checks
- finalized snapshots not writable by ordinary clients
- RLS / privileged RPC boundaries covered by tests
- no cross-school checkpoint visibility

### No answer-key exposure

Staff pilot reporting may use Exam Ready aggregate/student-safe result fields.

It must never expose:
- correct-option snapshots,
- unscored correctness,
- hidden question provenance,
- source question bank secrets.

---

## H&A firewall

PO-1E may read trusted study telemetry.

PO-1E must never:
- write `hour_logs`,
- write attendance,
- write attendance corrections,
- write hour adjustments,
- convert active study seconds to official school hours,
- label telemetry as attendance credit.

A report may say:

**ASCYN PRO active study time**

It may not say:

**Hours earned**

unless that value comes from the separate certified H&A system and is explicitly presented as H&A, not pilot learning telemetry.

The first PO-1E implementation should avoid mixing official H&A metrics into the pilot learning report unless a later contract intentionally adds them.

---

## No grade / mastery / readiness mutation

Checkpoint generation is observational.

It must not:
- write `student_progress`,
- write quiz grades,
- alter Exam Ready attempts,
- alter readiness,
- create remediation solely because a report was generated,
- change student status.

Generating a report can never change the evidence it is reporting.

---

## Report presentation

Each checkpoint report should contain:

1. School / pilot identity
2. Checkpoint and cutoff
3. Cohort size + inclusion/exclusion count
4. Evidence coverage
5. Engagement
6. Exam Ready
7. Domain performance
8. Progress/readiness
9. Intervention/needs-attention summary
10. Change vs baseline
11. Change vs prior checkpoint
12. Data-quality notes
13. Recommended staff follow-up based on existing certified status/action rules

The report must distinguish:
- observed fact,
- comparison,
- recommended action.

---

## Export

Initial implementation may support printable browser output.

A dedicated PDF/export file generator is optional and separately gated unless the implementation can reuse an already-certified report/export path without adding risk.

CSV exports must preserve:
- checkpoint ID,
- cutoff,
- metric definitions,
- cohort inclusion semantics.

Do not export answer keys or hidden exam fields.

---

## Elevate acceptance scenario

For Elevate Barber & Beauty Academy, the system must support:

- one 90-day pilot measurement period,
- barber cohort included in aggregate measurement,
- currently excluded cosmetology/supplemental learners remaining individually visible,
- baseline Exam Ready measurement,
- Day 30 report,
- Day 60 report,
- Day 90 report,
- Aaron/school-admin school-level visibility,
- authorized instructor assigned-student visibility,
- ASCYN PRO platform-admin audit/support visibility.

If the current Elevate configuration has 13 included and 7 excluded learners at checkpoint generation, the aggregate report must clearly show that cohort split and calculate pilot aggregates from the 13 included learners only.

The contract does not hard-code those counts; live authorized profile state at checkpoint generation is authoritative.

---

## Implementation slices

PO-1E should be implemented in bounded slices.

### PO-1E.1 — Measurement resolver
- server-only school/instructor cohort resolver
- metric definitions
- cutoff-window semantics
- coverage model
- exact inclusion firewall
- no UI

### PO-1E.2 — Pilot period + checkpoint persistence
- migration
- RLS
- activation/finalization
- immutable snapshots
- audit

### PO-1E.3 — Instructor measurement view
- assigned cohort
- activity / Exam Ready / progress / intervention evidence
- trends
- individual drilldowns

### PO-1E.4 — School-admin / Admin School measurement view
- school-wide included cohort
- checkpoint timeline
- preview/finalization for authorized actor
- support diagnostics

### PO-1E.5 — 30/60/90 report presentation
- Baseline / 30 / 60 / 90 views
- baseline/prior deltas
- coverage notes
- print/export boundary

### PO-1E.6 — Final certification
- cross-role parity
- inclusion/exclusion regressions
- cross-school security
- immutable-history tests
- mobile/accessibility
- production verification

---

## Required certification

PO-1E is GREEN only when:

1. pilot start/end are explicit and auditable;
2. Baseline/30/60/90 target dates are deterministic;
3. finalized checkpoints are immutable;
4. school aggregates exclude `include_in_school_metrics=false`;
5. excluded learners remain individually visible;
6. instructor aggregation is assignment/scope safe;
7. school-admin aggregation is same-school safe;
8. platform admin can audit supported schools;
9. PO-1B activity seconds are used without H&A conversion;
10. Exam Ready metrics use student-safe result fields only;
11. no answer-key/unscored correctness leakage exists;
12. no second readiness formula exists;
13. no report generation mutates grades/mastery/readiness/remediation;
14. partial coverage is explicit;
15. No Grade / no evidence is not rendered as false zero;
16. baseline and prior-checkpoint deltas are mathematically correct;
17. cross-school access fails closed;
18. finalized report membership and cutoff are reproducible;
19. TypeScript passes;
20. changed-file lint passes;
21. unit/regression tests pass;
22. production build passes;
23. Pilot Onboarding Certification passes;
24. exact-head Vercel preview is READY;
25. final production main + Vercel deployment are verified after merge.

---

## Out of scope

This contract does not implement:
- PO-1D instant-feedback practice mode,
- licensing-exam pass-probability predictions,
- causal effectiveness claims,
- school rankings,
- commercial billing,
- H&A policy changes,
- curriculum changes,
- new readiness math,
- automatic instructor grading changes.

PO-1D remains separately gated and can be completed independently without changing PO-1E reporting semantics.

---

## Locked decision

**PO-1E Pilot Measurement + 30/60/90 Reporting contract is LOCKED.**

The next slice is **PO-1E.1 — Measurement Resolver**: define the canonical server-only cohort/window/coverage/metric resolver before creating persistence or staff UI.

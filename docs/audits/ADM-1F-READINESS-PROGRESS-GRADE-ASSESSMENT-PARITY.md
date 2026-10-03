# ADM-1F — Readiness / Progress / Grade / Assessment Parity

## Scope
Audit and align Student → Instructor → School/Admin/report semantics for:
- curriculum progress
- board readiness
- grades
- assessments

## Canonical progress/readiness contract
Student learning progress and board readiness remain rooted in:
`src/lib/student-level/metrics.ts` → `calculateCanonicalStudentLearningMetrics`.

School analytics must consume that same helper rather than recalculating readiness independently.

## Findings

1. **School analytics recalculated readiness independently**
   - School overview, performance rows, instructor aggregates, and alerts called `calculateBoardReadiness` directly.
   - This created a second implementation path instead of the ADM-1D canonical student metric path.

2. **No-evidence students could receive low-readiness alerts**
   - `buildSchoolAlerts` treated readiness score 0 as low readiness even with no quiz/progress evidence.

3. **A real 0% grade was conflated with “No Grade”**
   - Grade distribution classified `overallGrade === 0` as no grade.
   - Gradebook risk logic required `overallGrade > 0`, so a genuine graded 0% could avoid the failing-grade risk condition.

4. **Student grade surfaces could show 0% when there was no grade evidence**
   - The grade widget/report had no explicit evidence flag.

5. **Assessment pass-rate UI showed 0% with no assessments**
   - A missing assessment record set was visually indistinguishable from a true 0% pass rate.

6. **Snapshot readiness and assessment averages included no-evidence zero rows**
   - This depressed school snapshot values by treating missing evidence as performance evidence.

## First repair slice
- School readiness paths now use `calculateCanonicalStudentLearningMetrics`.
- Low-readiness alerts require actual readiness evidence.
- Grade performance now carries explicit `hasGradeEvidence`.
- A genuine 0% grade is treated as failing evidence.
- “No Grade” is rendered separately from a true 0%.
- School grade distribution separates real zero grades from no-data students.
- Readiness and assessment snapshot averages exclude students with no relevant evidence.
- Student assessment pass-rate card shows an em dash when no assessments exist.
- Regression coverage added in `src/__tests__/adm-1f-readiness-progress-grade-assessment-parity.test.ts`.

## Deferred within ADM-1F
- Verify instructor class-grade summary parity against school/admin and student grade surfaces.
- Verify assessment completion vs pass-rate labels and program-required assessment semantics across every report.
- Verify progress/readiness no-data presentation on all instructor/admin cards.
- Verify printable/export paths do not reintroduce local formulas.

## Boundary
No historical trend correction is part of this slice. Historical trend accuracy remains ADM-1I.


## Deeper audit findings and repairs
- Instructor class quiz/readiness cards previously used `> 0` as the evidence test, which hid legitimate 0 values as “—”. They now use explicit evidence counts.
- Instructor learning-support flags could classify students with no persisted progress/readiness evidence as low progress/readiness. Those flags now require relevant evidence.
- Board-readiness overview counts now exclude students with no readiness evidence rather than silently counting their default readiness level.
- Instructor “Assessment Queue” was a sliced list of failed assessments, so the metric could never exceed five and its label implied a workflow queue that did not exist. The dashboard now shows the full failed-assessment count while keeping the five-item display list.
- School student-performance rows now carry explicit readiness, grade, and assessment evidence flags.
- School filters and cells no longer treat missing readiness/grade/assessment evidence as a failing 0.
- Gradebook missing-category risk now requires actual grade evidence. A completely ungraded student is not labeled at risk merely because configured categories contain no grades yet.
- Real 0% grades and real 0% assessment pass rates remain valid evidence and remain visible as zero.

## Report/export parity
- School readiness/grade/assessment reports already use evidence-aware `No Data`, `No Grade`, and `No Assessments` output and remain the canonical school report behavior.
- Student printable grade report now preserves the same “No Grade” semantic as the student grade widget.
- Record-level CSV exports remain raw evidence exports; no local aggregate percentage formula is introduced there.
- Compliance reporting retains requirement-based 0 values because those reports measure requirement fulfillment rather than “did evidence exist?” presentation semantics.

## Remaining certification work
- Exact-head Engineering Verification and Vercel must pass after the deeper repairs.
- If they pass unchanged, ADM-1F is ready for merge authorization. Historical trend reconstruction remains ADM-1I.

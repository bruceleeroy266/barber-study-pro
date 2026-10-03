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

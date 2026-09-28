# Chapters 1–10 Student → Instructor → School-Admin Role Connection Certification

**Baseline:** C10-8 exact certified head `5e5f540c45088200ec9c4514525745ce0f26a48f`  
**Branch:** `cert/chapters-1-10-role-connection`

## Certification objective

Prove that Chapters 1–10 do not calculate different mastery results for different oversight roles.

The required chain is:

`student evidence → one persisted evidence source → chapter diagnostics → instructor view = school-admin view`

Authorization may differ by role. The educational evidence and calculations must not.

## Audit findings

The audit confirmed that the instructor student-detail page is already the canonical detailed diagnostics surface and that `school_admin` has the `view_instructor_portal` permission used by that route.

Two connection weaknesses were found and repaired:

1. The page issued ten separate reads against `chapter_micro_check_attempts`. They all targeted the same student but duplicated the evidence-loading path.
2. Chapter 7 accepted every reassessment row in its page-level filter before its builder rejected non-Chapter-7 concepts. That was unnecessarily broad.
3. The school-admin performance table showed aggregate student metrics but did not link directly to the canonical detailed diagnostics page.

## Repairs

### One immutable micro-check read

The student-detail page now reads Chapters 1–10 micro-check rows once:

- one student ID;
- one `chapter_micro_check_attempts` query;
- chapter IDs `ch-1` through `ch-10`;
- rows partitioned in memory by chapter.

The page already uses one student-level `quiz_attempts` read and one student-level `student_progress` read. Those same collections feed all ten chapter diagnostic builders.

### Chapter 7 reassessment isolation

Chapter 7 now accepts only:

- `quiz-7` initial attempts; or
- reassessment attempts whose target concept starts with `ch7-`.

This prevents unrelated chapter reassessments from entering the Chapter 7 diagnostic input.

### School-admin drill-down

The School Dashboard student-performance table now links each student to:

`/instructor/student/[studentId]`

That is intentionally the same page used by instructors. There is no separate admin-side mastery formula or duplicate diagnostic implementation.

## Authorization and tenant isolation

The canonical student-detail route permits roles with instructor-portal access, including:

- `instructor`;
- `school_admin`;
- `admin`.

Learner roles are rejected.

The page additionally constrains the selected student to the viewer's `school_id` and to learner roles.

Database RLS independently allows same-school staff to read the evidence used by the diagnostics:

- `student_progress`;
- `quiz_attempts`;
- `chapter_micro_check_attempts`;
- `remediation_cycles`.

The shared `is_school_staff` database helper includes `instructor`, `admin`, and `school_admin`.

## Chapters 1–10 evidence contract

For every chapter 1 through 10, the canonical diagnostics surface receives:

- the same `studentId`;
- the same student-level quiz-attempt collection, chapter-filtered before the chapter builder;
- the chapter's rows from the same immutable micro-check collection;
- the same student-progress collection for completion state.

Chapter 7 additionally receives its persisted remediation-cycle records because its intervention model uses cycle history.

No role-specific grading or mastery branch is introduced.

## Automated certification

`src/lib/oversight/chapters-1-10-role-connection.test.ts` certifies:

- instructor, school-admin, and admin access to the shared diagnostics route;
- learner denial;
- one common Chapters 1–10 micro-check read;
- one common quiz-attempt read;
- one common progress read;
- all ten chapter diagnostics builders are present on the shared page;
- Chapter 7 reassessment evidence is chapter-scoped;
- school-admin student rows link to the same canonical diagnostics route;
- RLS grants same-school staff read visibility to the evidence tables;
- all ten chapter diagnostic sections render from the same authorized page.

## Status

Implementation and audit repairs are complete. Exact-head Engineering Verification and Vercel Preview must be GREEN before this role-connection certification can be closed.

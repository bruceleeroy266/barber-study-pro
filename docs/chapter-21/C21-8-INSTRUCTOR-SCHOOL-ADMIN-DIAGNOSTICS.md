# C21-8 — Instructor / School-Admin Diagnostics + Final Visibility Integration

## Parent head
C21-8 is stacked on C21-7 head `f9acd43723d77bfe77eabcddd7730fd81bfb3f1a`.

## Objective
Expose Chapter 21's combined mastery and recovery signals to authorized instructional staff without leaking raw student answer payloads or internal persistence identifiers.

## Authorized surface
Chapter 21 is integrated into the existing server-rendered student detail route:

`/instructor/student/[studentId]`

The route already requires an authenticated profile whose role passes `isInstructorOrAdmin`.

The student query is additionally constrained to:

- the current staff member's `school_id`;
- learner roles `student` or `apprentice`.

This means instructors and school admins use the same educational diagnostic surface while same-school authorization remains enforced before the student's Chapter 21 records are read or rendered.

## Durable evidence
Both shared staff evidence reads now include `ch-21`:

- `chapter_micro_check_attempts`
- `chapter_activity_evidence`

The Chapter 21 diagnostic builder also consumes initial and reassessment `quiz_attempts`.

## Visible Chapter 21 signals
The staff panel shows:

- live shared chapter grade;
- overall mastery;
- mastery confidence;
- completion percentage;
- micro-check percentage;
- chapter-assessment percentage;
- strongest concepts;
- weakest concepts;
- per-concept mastery;
- per-concept observation count;
- preserved initial-miss count;
- reassessment-correct count;
- most recent evidence date;
- business/legal compliance intervention state;
- targeted-remediation status;
- latest formal reassessment/recovery.

## Compliance visibility
When the Chapter 21 compliance evaluator requires instructor review, the panel explicitly surfaces the intervention level and the instructor-facing reason.

If formal reassessment is required, staff see the Chapter 21 recovery contract:

**5 questions · 80% required**

No Chapter 21 business/legal compliance condition is presented as bodily-safety escalation.

## Recovery history
Successful reassessment can increase current mastery, but preserved initial misses remain visible in both the chapter summary and concept-level rows.

This lets staff distinguish:

- no historical gap;
- an unresolved gap;
- a gap that has been remediated and recovered.

## Privacy boundary
The rendered Chapter 21 panel deliberately exposes aggregated educational signals only.

It does not render:

- `answers_json`;
- student IDs;
- question IDs;
- activity item IDs;
- remediation cycle IDs;
- raw internal evidence rows.

## Shared grade
The panel uses the same live shared grade pipeline:

- micro-checks: **20%**
- flashcards/study: **10%**
- chapter assessment: **40%**
- scenario/application: **15%**
- remediation/reassessment: **15%**

Chapter completion remains separate from mastery.

## Next phase
**C21-9 — Final End-to-End Certification:** audit the complete Chapter 21 chain from lesson → 60 flashcards → 17-question assessment → 16 micro-checks → combined gap detection → business/legal compliance escalation → targeted remediation → 40 fresh reassessment questions → mastery recovery → instructor/school-admin visibility, then run the final exact-head Engineering Verification and Vercel gates before any merge authorization.

# C7-6 — UI, Persistence & Diagnostic Wiring

## Validation gate entering this stage

The micro-check definition/evidence foundation passed:
- Engineering Verification #492: GREEN
- Vercel preview: READY

## Persistence

A new `public.chapter_micro_check_attempts` table stores immutable first-attempt evidence.

Database protections:
- one row per student/chapter/question
- authenticated students may SELECT their own rows
- authenticated students may INSERT only their own rows
- students have no UPDATE or DELETE grant
- same-school staff may SELECT student evidence
- platform admins may read
- super admins retain privileged management access
- RLS is enabled
- explicit Data API grants are used

This design preserves the first attempt rather than allowing later answers to overwrite the diagnostic history.

## Student lesson UI

For authenticated Chapter 7 students:
- each of the 10 micro-checks renders immediately after its planned lesson section,
- existing first-attempt rows load when the lesson opens,
- answered questions remain locked after reload,
- the saved result and explanation are restored,
- duplicate insert races resolve back to the original persisted attempt.

## Mastery and grade feed

Persisted rows convert to the existing Chapter 7 evidence schema:
- source: `micro_check`
- attempt phase: `initial`
- exact canonical concept family
- original question ID
- difficulty
- correct/incorrect
- persisted timestamp

The persisted percentage feeds `microCheckPercent`.

The locked grade hierarchy remains unchanged:
- micro checks: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment recovery: 15%

## Instructor diagnostics

The instructor student-detail page reads the same RLS-protected rows and presents:
- overall Chapter 7 micro-check percentage,
- all 10 concept families,
- correct / answered count,
- concept percentage,
- mastery contribution from micro-check evidence,
- confidence state,
- explicit reminder that micro checks are 20% and the chapter assessment remains 40%.

Unanswered concept families remain visible as insufficient evidence rather than disappearing.

## Supabase verification

The deployed table was verified with:
- RLS enabled,
- authenticated SELECT = true,
- authenticated INSERT = true,
- authenticated UPDATE = false,
- authenticated DELETE = false.

Security/performance advisors were re-run after the schema change. Existing project-level warnings remain; the new micro-check table did not introduce an RLS-disabled or overexposed-table finding.

## Remaining C7-6 exit work

C7-6 closes only after the current head passes:
1. Engineering Verification,
2. Vercel preview,
3. micro-check persistence tests,
4. lesson rendering/build validation,
5. instructor diagnostics build validation.

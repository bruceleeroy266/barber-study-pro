# C20-8 — Instructor / School-Admin Diagnostics + Final Visibility Integration

## Parent head
C20-8 is stacked on C20-7 head `b87723dc782b9b2193c03d906f6ea40ec1cf549e`.

## Objective
C20-8 exposes Chapter 20 learning diagnostics to authorized instructors and school administrators through the existing student-detail surface.

The view now summarizes:

- shared live Chapter 20 grade;
- overall concept mastery and confidence;
- strongest and weakest concepts;
- preserved initial misses;
- compliance-escalation state;
- targeted-remediation status;
- latest formal reassessment and recovery;
- completion percentage;
- concept-level observations and reassessment-correct counts.

## Authorization
Chapter 20 uses the existing protected instructor student-detail route.

Before student data is read, the server requires:

- an authenticated current user;
- an instructor/admin-capable role;
- a student/apprentice learner record;
- the learner to belong to the authorized viewer's school.

The same calculation is used for instructor and school-admin roles. Role changes authorization, not mastery mathematics.

## Privacy boundary
The visible Chapter 20 panel intentionally does **not** render:

- raw `answers_json`;
- question IDs;
- activity item IDs;
- database row IDs;
- remediation-cycle IDs;
- student IDs as diagnostic evidence.

Instead, staff see aggregated educational signals such as concept name, mastery, confidence, observation count, preserved initial-miss count, latest evidence date, remediation state, and reassessment summary.

## Evidence sources
The Chapter 20 diagnostics combine:

1. persisted micro-check first attempts;
2. initial 17-question assessment evidence;
3. durable 60-card flashcard evidence;
4. durable 13-item scenario/application evidence;
5. formal `r20-*` reassessment evidence.

The shared activity-evidence reads on the instructor page now explicitly include `ch-20`.

## Compliance visibility
The panel surfaces Chapter 20 compliance intervention status for:

- worker classification / compensation;
- tax / income reporting;
- privacy / client consent.

When elevated compliance requires a formal recovery cycle, staff see:

**5-question reassessment · 80% required**

Chapter 20 does not display a bodily-safety escalation because its canonical architecture has no bodily-safety concept family.

## Recovery visibility
Initial misses remain historical evidence after reassessment.

The panel exposes:

- total preserved initial misses;
- per-concept initial misses;
- per-concept reassessment-correct count;
- latest five-question reassessment status;
- recovered mastery.

This lets staff see improvement without rewriting the student's original diagnostic history.

## Shared live grade
Chapter 20 is now included in the instructor live-grade surface using the established:

- 20% micro-check;
- 10% flashcard;
- 40% chapter assessment;
- 15% scenario/application;
- 15% remediation/reassessment

contract.

Because Chapter 20 has both mapped flashcard and scenario/application inventories, the live grade can become evidence-complete once the required sources are present.

## Certification target
C20-8 is GREEN only when the exact final head passes:

1. Chapter 20 instructor diagnostic unit tests;
2. preserved-initial-miss and recovery visibility tests;
3. compliance visibility tests;
4. 60-card + 13-scenario shared grade integration;
5. instructor/school-admin role authorization tests;
6. same-school lookup certification;
7. diagnostic-panel privacy checks;
8. both durable evidence reads including `ch-20`;
9. all prior C20-1 through C20-7 tests;
10. TypeScript/unit/build Engineering Verification;
11. exact-head Vercel deployment.

## Next phase
**C20-9 — Final End-to-End Certification:** audit the complete Chapter 20 chain from hardened lesson → 60 flashcards → 17-question assessment → 12 micro-checks → combined gap detection → compliance escalation → targeted remediation → 30-question reassessment reserve → mastery recovery → instructor/school-admin visibility, then run final exact-head Engineering Verification and Vercel before any merge authorization.

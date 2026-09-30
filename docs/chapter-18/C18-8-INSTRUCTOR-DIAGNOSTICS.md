# C18-8 — Instructor / School-Admin Diagnostics + Final Visibility Integration

C18-8 exposes Chapter 18 learning diagnostics to authorized staff without exposing raw academic payloads.

## Authorized visibility

The existing instructor student-detail route remains protected by:

- instructor/school-admin/admin role authorization;
- same-school student lookup;
- student/apprentice learner-role scoping.

Chapter 18 uses that same authorization boundary. It does not add a separate bypass or cross-school query.

## Staff-visible Chapter 18 summary

Authorized staff can now see:

- live Chapter 18 grade;
- overall mastery;
- mastery confidence;
- completion percentage;
- micro-check percentage;
- chapter-assessment percentage;
- strongest concepts;
- weakest concepts;
- per-concept observations;
- preserved initial-miss count;
- reassessment-correct count;
- latest evidence date;
- current safety-escalation state;
- targeted-remediation status;
- latest formal reassessment and score/progress.

## Evidence sources

The diagnostic builder uses:

- immutable Chapter 18 micro-check evidence;
- initial Chapter 18 assessment attempts;
- durable flashcard activity evidence;
- scenario/application evidence when a durable Chapter 18 scenario source exists;
- formal Chapter 18 reassessment attempts.

Reassessment evidence is appended separately and does not rewrite initial evidence.

## Privacy boundary

The staff panel intentionally renders aggregate diagnostic fields only.

It does not render:

- `answers_json`;
- student IDs;
- question IDs;
- item IDs;
- raw micro-check selected answers;
- internal remediation-cycle IDs.

## Same-school boundary

The page resolves the viewer profile first and requires an instructor-capable role. The learner lookup is scoped to `instructorProfile.school_id` before any Chapter 18 diagnostic panel can be rendered.

## Shared live grade

Chapter 18 now flows through the same live-grade surface used by hardened chapters.

The grade contract remains:

- micro-check: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

Chapter 18 currently has no durable scenario/application inventory because its certified lesson remains one HTML runtime shell with no scenarioBlock/proScenario items.

C18-8 does not fabricate a 15% scenario score. The instructor panel therefore reports the live grade as provisional until that evidence source genuinely exists.

This preserves the Chapter 17 precedent: certify the architecture that actually exists rather than inventing symmetry.

## C18-9 boundary

C18-9 will perform the final end-to-end certification of the complete Chapter 18 chain and all exact-head gates before any merge authorization.

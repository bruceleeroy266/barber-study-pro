# C19-8 — Instructor / School-Admin Diagnostics + Final Visibility Integration

**Chapter:** 19 — Preparing for Licensure and Employment  
**Parent certified head:** `7dd2e8f51e6640e345c35cfdd6cb1608896d8c1d`  
**Scope:** authorized staff diagnostics, shared live-grade integration, safety/compliance visibility, privacy-preserving student-detail rendering

## Authorized visibility

Chapter 19 uses the existing instructor student-detail authorization boundary.

The route remains protected by:

- instructor / school-admin / admin role authorization;
- same-school learner lookup using the viewer's `school_id`;
- learner-role restriction to student/apprentice;
- existing row-level security and server-side query path.

No Chapter 19-specific bypass or cross-school lookup is added.

## Visible Chapter 19 signals

Authorized staff can see:

- live Chapter 19 grade;
- overall mastery;
- mastery confidence;
- completion percentage;
- micro-check percentage;
- chapter-assessment percentage;
- strongest concepts;
- weakest concepts;
- per-concept observation count;
- preserved initial-miss count;
- reassessment-correct count;
- latest evidence date;
- practical-safety escalation state;
- licensing/employment-law compliance escalation state;
- targeted-remediation status;
- latest formal reassessment and score/progress.

## Evidence chain

The diagnostic builder combines:

- immutable Chapter 19 micro-check rows;
- initial Chapter 19 assessment attempts;
- durable flashcard activity evidence;
- scenario/application evidence only if a genuine durable Chapter 19 scenario source exists;
- formal Chapter 19 reassessment attempts.

Reassessment evidence stays separate from initial evidence and does not erase original misses.

## Safety and compliance remain distinct

Practical-exam / infection-control misses continue through the bodily-safety intervention path.

Licensing and employment-law/contracts continue through the separate compliance/legal intervention path.

The instructor surface intentionally distinguishes the two.

Urgent safety recovery can display:

- 5-question reassessment;
- 100% required.

Formal compliance recovery can display:

- 5-question reassessment;
- 80% required.

Compliance concerns are not represented as bodily-safety emergencies.

## Shared live grade

Chapter 19 is now registered in the durable activity-evidence registry.

The live instructor grade therefore uses the shared contract:

- micro-check: 20%;
- flashcards: 10%;
- chapter assessment: 40%;
- scenario/application: 15%;
- remediation/reassessment: 15%.

All 60 certified Chapter 19 flashcards are available to the durable flashcard evidence inventory.

Chapter 19 still has no durable scenario/application inventory because the certified runtime remains one HTML lesson shell with no scenarioBlock/proScenario items.

C19-8 does not fabricate scenario evidence. The instructor grade remains provisional whenever required scenario evidence is absent.

## Privacy boundary

The Chapter 19 staff panel renders aggregate diagnostics only.

It does not display:

- `answers_json`;
- student IDs;
- question IDs;
- item IDs;
- selected-answer payloads;
- remediation-cycle IDs.

## School-admin parity

School administrators use the same authorized student-detail route and the same Chapter 19 diagnostic builder as instructors.

Role affects authorization, not academic calculations.

## Preserved certified architecture

C19-8 does not change:

- 1 Chapter 19 lesson shell;
- 60 hardened flashcards;
- 15 hardened assessment questions;
- 14 immutable micro-check questions;
- 35 fresh reassessment questions;
- 7 canonical concept families;
- 80% ordinary/compliance recovery;
- 100% urgent-safety recovery;
- immutable diagnostic history;
- stale legacy `CH19-R-*` quarantine;
- shared 20/10/40/15/15 grading.

## Certification gate

C19-8 is GREEN only when the exact final head passes:

1. preserved initial-miss + reassessment-recovery visibility;
2. durable flashcard-evidence visibility;
3. urgent practical-safety instructor visibility;
4. distinct compliance/legal instructor visibility;
5. shared live-grade integration;
6. no fabricated scenario score;
7. instructor/school-admin role authorization;
8. same-school learner boundary;
9. privacy/no raw-answer or internal-ID exposure;
10. Chapter 19 inclusion in both shared durable-evidence reads;
11. prior C19-1 through C19-7 certification tests;
12. TypeScript;
13. lint;
14. unit tests;
15. production build;
16. bundle-size check;
17. pilot onboarding certification;
18. exact-head Vercel deployment.

No merge is authorized by this certification.

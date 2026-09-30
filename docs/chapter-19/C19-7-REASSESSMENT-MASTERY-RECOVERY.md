# C19-7 — Fresh Reassessment Reserve + Mastery Recovery

**Chapter:** 19 — Preparing for Licensure and Employment  
**Parent certified head:** `02f96e2aa6fb6eff0f60715c49251f112a64080c`  
**Scope:** 35 fresh reassessment questions, ordinary/compliance versus urgent-safety recovery, exclusion/replay protection, immutable mastery recovery, and shared reassessment/remediation provider integration

## Fresh reserve

C19-7 adds exactly 35 reassessment questions:

- exactly 5 per each of the 7 canonical Chapter 19 concept families;
- all IDs use the dedicated `r19-*` namespace;
- all questions are understanding, application, or scenario level;
- every question carries its canonical concept-family ID and canonical `LO-19-01` through `LO-19-07` objective;
- no question ID overlaps the 15-question assessment namespace;
- no question ID overlaps the 14-question micro-check namespace;
- no reassessment prompt duplicates a certified assessment or micro-check prompt.

## Recovery thresholds

The C19-6 policy is preserved exactly:

- ordinary concept recovery: 5 questions, 80%;
- licensing/compliance recovery: 5 questions, 80%;
- urgent practical-safety recovery: 5 questions, 100%.

Only `ch19-practical-exam-safety-readiness` can receive the urgent 100% bodily-safety requirement.

Licensing and employment-law/contracts remain compliance/legal concerns and do not inherit the urgent bodily-safety threshold.

## Immutable evidence

Reassessment evidence uses:

- chapter: `ch-19`;
- source: `remediation_reassessment`;
- attempt phase: `reassessment`;
- stable reassessment item IDs.

Original assessment, flashcard, micro-check, and scenario evidence is not rewritten.

Appending a duplicate reassessment record with the same student/chapter/source/phase/item identity is ignored instead of replacing prior diagnostic evidence.

Successful reassessment may raise current mastery while preserved initial misses remain counted in diagnostic history.

## Exclusion and replay protection

C19-7 registers Chapter 19 with the shared canonical reassessment mapping provider.

The provider exposes only the 5 dedicated `r19-*` reserve questions for each concept to reassessment selection while still resolving both initial assessment and reassessment IDs canonically.

The shared historical exclusion engine can therefore exclude:

- previously attempted initial assessment questions when resolving historical evidence;
- previously attempted reassessment reserve questions from reassessment history.

Direct five-question cycle selection also accepts an exclusion set and fails closed when fewer than five fresh non-excluded questions remain.

This avoids silently replaying a previously attempted reassessment item as “fresh.”

## Shared providers

C19-7 adds:

- `Chapter19MappingProvider`;
- `Chapter19DetectionProvider`;
- Chapter 19 registration in the reassessment provider registry;
- Chapter 19 reserve lookup in the shared remediation-content provider.

The remediation content provider now serves both:

- the 15 certified initial assessment questions;
- the 35 fresh reassessment reserve questions.

## Preserved architecture

C19-7 preserves:

- 1 real Chapter 19 lesson shell;
- 60 hardened flashcards;
- 15 hardened assessment questions;
- 14 immutable micro-check questions;
- 7 canonical concepts and 7 canonical objectives;
- C19-6 safety/compliance separation;
- legacy `CH19-R-*` question-link quarantine;
- shared 20/10/40/15/15 grading;
- no fabricated scenario/application evidence.

## Certification gate

C19-7 is GREEN only when the exact final head passes:

1. exact 35-question / 5-per-concept reserve tests;
2. namespace and prompt-freshness tests;
3. ordinary 80% recovery tests;
4. compliance 80% recovery tests;
5. urgent-safety 100% recovery tests;
6. immutable-history / mastery-recovery tests;
7. exclusion and replay-protection tests;
8. shared reassessment mapping/detection provider tests;
9. shared remediation-content provider tests;
10. all prior C19-1 through C19-6 certification tests;
11. TypeScript;
12. lint;
13. unit tests;
14. production build;
15. bundle-size check;
16. pilot onboarding certification;
17. exact-head Vercel deployment.

No merge is authorized by this certification.

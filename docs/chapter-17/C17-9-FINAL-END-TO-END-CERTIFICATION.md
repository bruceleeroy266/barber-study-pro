# C17-9 — Final End-to-End Certification

C17-9 is the final certification pass for Chapter 17 before any merge authorization.

## Certified chain under audit

The final certification locks the complete Chapter 17 learning, safety, evidence, remediation, recovery, and staff-visibility path:

1. 24-section Chemical Texture Services lesson
2. 60 certified flashcards
3. 30-question certified chapter assessment
4. 16 certified learning questions
5. seven canonical concept families
6. 14 micro-check questions, exactly two per concept
7. immutable first-attempt evidence
8. shared gap detection
9. four-class chemical-safety escalation
10. canonical targeted lesson + flashcard remediation
11. 35 fresh reassessment questions, exactly five per concept
12. ordinary recovery at 4/5 (80%)
13. urgent multi-hazard safety recovery at 5/5 (100%)
14. mastery recovery without erasing initial misses
15. instructor/school-admin diagnostic visibility
16. shared live 20/10/40/15/15 academic grade
17. completion kept separate from academic mastery
18. same-school authorization and privacy-limited diagnostic rendering

## Inventory invariants

The final test requires:

- lesson sections = 24 unique IDs
- flashcards = 60 unique IDs
- initial assessment = 30 unique `qq-17-*` IDs
- learning questions = 16 unique `lq-17-*` IDs
- micro-check questions = 14 unique `mcq-17-*` IDs
- reassessment reserve = 35 unique `r17-*` IDs
- canonical concept families = 7
- all 16 learning questions remain uniquely mapped to valid Chapter 17 concept families; the certified learning bank is not required to place at least one learning question in every concept
- every concept has lesson, flashcard, assessment, micro-check, and five-question reassessment coverage
- reassessment IDs never overlap the assessment, learning-question, or micro-check namespaces

## Shared evidence + grading

Chapter 17 remains on the shared durable evidence architecture.

The final certification verifies:

- 60 flashcard evidence items
- one scenario/application evidence item (`scenario-1:0`)
- immutable micro-check evidence
- chapter-assessment evidence
- formal reassessment evidence
- live grading through the shared 20/10/40/15/15 contract

The only academic grade contract remains:

- micro-checks: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

No Chapter 17-specific alternate formula is permitted.

## Four-class chemical-safety model

The final certification locks exactly these Chapter 17 high-risk classes:

1. chemical incompatibility
2. scalp compromise / burning
3. overprocessing control
4. unsafe service sequencing

A single tagged miss can trigger priority safety review. Recent misses spanning at least two distinct hazard classes can trigger urgent intervention.

Urgent intervention requires:

- instructor review
- formal five-question reassessment
- 100% passing score

The final test proves 4/5 fails and 5/5 passes under urgent safety policy.

## Ordinary end-to-end recovery proof

The final certification creates a weak consultation/hair-analysis concept using immutable evidence from:

- micro-check
- flashcard
- chapter assessment
- scenario/application

It then proves:

1. the weak concept is targeted,
2. the remediation path resolves to canonical lesson blocks and flashcards,
3. exactly five fresh reassessment questions are served,
4. 4/5 passes ordinary recovery,
5. mastery rises after successful reassessment,
6. original initial misses remain unchanged in history,
7. reassessment-correct evidence is added without rewriting original evidence.

## Shared provider proof

Chapter 17 must remain registered with:

- the shared concept-detection registry,
- the shared remediation assignment registry,
- the remediation content-provider registry,
- the canonical reassessment mapping-provider registry.

Every concept must resolve to canonical lesson blocks, flashcards, and exactly five fresh `r17-*` reassessment items.

## Staff oversight proof

The final certification verifies that Chapter 17 uses the same protected student-detail route as the hardened earlier chapters:

- instructor allowed
- school_admin allowed
- admin allowed
- student denied
- requested learner must match the viewer's school
- requested profile must be a student/apprentice

Authorized staff can see:

- live Chapter 17 grade
- mastery and confidence
- completion separately
- weak/strong concepts
- preserved initial misses
- reassessment recovery
- remediation status
- chemical-safety intervention state
- latest reassessment

The Chapter 17 panel does not render raw answer payloads, question IDs, item IDs, raw answer selections, or internal student IDs.

## Chapter 16 concurrency boundary

Chapter 16 remains on a separate in-progress branch/workstream.

C17-9 certifies the actual supported shared oversight set as Chapters 1–15 plus Chapter 17 and does not pull unfinished Chapter 16 into this branch.

## Merge boundary

C17-9 certification does not authorize a merge.

Chapter 17 can be called final GREEN only when the exact C17-9 branch head has:

1. Engineering Verification = SUCCESS
2. Verify Build = SUCCESS
3. Bundle Size Check = SUCCESS
4. Pilot Onboarding Certification = SUCCESS
5. matching exact-head Vercel deployment = SUCCESS
6. PR #143 still points to that exact certified SHA and remains mergeable

After those gates pass, Chapter 17 must remain open until the user explicitly authorizes the merge.

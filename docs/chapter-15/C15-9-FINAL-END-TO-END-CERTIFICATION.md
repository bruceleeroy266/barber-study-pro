# C15-9 — Final End-to-End Certification

C15-9 is the final certification pass for Chapter 15 before any merge authorization.

## Certified chain under audit

The final certification locks the complete Chapter 15 learning and evidence path:

1. 54-section lesson
2. 90 certified flashcards
3. 72-question certified assessment
4. seven canonical concept families
5. 14 micro-check questions, exactly two per concept
6. immutable first-attempt evidence
7. shared concept-gap detection
8. high-risk medical/scope/attachment/chemical-care escalation
9. canonical targeted lesson + flashcard remediation
10. 35 fresh reassessment questions, exactly five per concept
11. ordinary recovery at 4/5 (80%)
12. urgent safety recovery at 5/5 (100%)
13. mastery recovery without erasing initial misses
14. instructor/school-admin diagnostic visibility
15. shared live 20/10/40/15/15 academic grade
16. completion kept separate from academic mastery
17. same-school authorization and privacy-limited diagnostic rendering

## Inventory invariants

The final test requires:

- lesson sections = 54 unique IDs
- flashcards = 90 unique IDs
- assessment = 72 unique IDs
- micro-check questions = 14 unique `mcq-15-*` IDs
- reassessment reserve = 35 unique `r15-*` IDs
- canonical concept families = 7
- every concept has lesson, flashcard, assessment, micro-check, and five-question reassessment coverage
- reassessment IDs never overlap the assessment or micro-check namespaces

## End-to-end recovery proof

The final certification creates a multi-source weak concept using immutable evidence from:

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
6. original initial misses remain unchanged in history.

## Safety proof

The final certification creates distinct recent medication-scope and surgical-scope misses.

It proves:

- urgent multi-hazard intervention activates,
- instructor review is required,
- formal reassessment is required,
- exactly five questions are required,
- the pass threshold is 100%,
- 4/5 fails,
- 5/5 passes.

## Staff oversight proof

The final certification verifies that Chapter 15 uses the same protected student-detail route as prior chapters:

- instructor allowed
- school_admin allowed
- admin allowed
- student denied
- requested learner must match the viewer's school
- requested profile must be a learner role

Authorized staff see mastery, weak concepts, preserved initial misses, reassessment recovery, remediation state, safety intervention state, and the latest reassessment.

The Chapter 15 panel does not render raw answer payloads, question IDs, or internal student IDs.

## Grade invariants

The only Chapter 15 academic grade contract remains:

- micro-checks: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

No Chapter 15-specific alternate formula is permitted.

## Merge boundary

C15-9 certification does not authorize a merge.

Chapter 15 can be called final GREEN only when the exact C15-9 branch head has:

1. Engineering Verification = SUCCESS
2. matching Vercel preview = SUCCESS

After that, PR #139 still requires explicit user authorization before merge. Production closure requires verification of the exact resulting production merge commit and production Vercel READY state.

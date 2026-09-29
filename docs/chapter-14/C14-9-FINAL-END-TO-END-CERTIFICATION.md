# C14-9 — Final End-to-End Certification

C14-9 is the final certification pass for Chapter 14 before any merge authorization.

## Certified chain under audit

The final test locks the complete Chapter 14 learning/evidence path:

1. 64-section lesson
2. 112 active flashcards
3. 70-question assessment
4. 7 canonical concept families
5. 14 targeted micro-check questions
6. immutable first-attempt evidence
7. concept-gap detection
8. high-risk safety escalation
9. targeted lesson/flashcard remediation
10. 35 fresh reassessment questions, exactly 5 per concept
11. ordinary recovery at 4/5 (80%)
12. urgent-safety recovery at 5/5 (100%)
13. mastery recovery without erasing original misses
14. instructor/school-admin diagnostics
15. shared live 20/10/40/15/15 grade
16. completion kept separate from academic mastery

## Inventory invariants

The final test requires:

- lesson sections = 64
- flashcards = 112 unique IDs
- assessment = 70 unique IDs
- assessment key distribution = A18 / B18 / C17 / D17
- micro-check questions = 14
- reassessment reserve = 35 unique r14-* items
- canonical concepts = 7
- every concept has lesson, flashcard, assessment, micro-check, and 5-question reassessment coverage

## Evidence and recovery invariants

The original first attempt remains historical evidence.

Ordinary recovery:
- exactly 5 fresh questions
- 4/5 = pass

Urgent multi-hazard safety recovery:
- exactly 5 fresh questions
- 4/5 = fail
- 5/5 = pass

Successful reassessment may improve current mastery while the original initial-miss count remains unchanged.

## Staff oversight invariants

Chapter 14 uses the same authorized staff route as prior chapters:

- instructor = allowed
- school_admin = allowed
- admin = allowed
- student = denied

The school-owner performance panel links to the same student diagnostics route rather than a parallel calculation surface.

The route reads Chapter 14 immutable micro-check and activity evidence alongside Chapters 1–13 and displays:

- live academic grade
- completion separately
- strongest/weakest concepts
- preserved initial misses
- reassessment recovery
- active remediation
- safety intervention state

## Grade invariants

The shared live grade remains:

- micro-checks 20%
- flashcards 10%
- chapter assessment 40%
- scenario/application 15%
- remediation/reassessment 15%

No Chapter 14-specific alternate grade formula is permitted.

## Merge boundary

C14-9 certification does not authorize a merge.

Chapter 14 may be called final GREEN only when the exact C14-9 branch head has:

1. Engineering Verification = SUCCESS
2. matching Vercel preview = SUCCESS

After that, merging still requires explicit user authorization. Production closure requires verification of the exact resulting production commit and production Vercel READY state.

# C15-1 — Canonical Concept Architecture + Shared Grading/Evidence Binding

Branch: `feat/c15-unified-grading-alignment`

C15-1 establishes Chapter 15's stable concept architecture from the existing runtime implementation. It does not rewrite or source-certify educational content.

## Canonical concept families

Chapter 15 now has seven stable concept families:

1. `ch15-client-consultation-ethics-marketing`
2. `ch15-alternatives-scope-referral`
3. `ch15-hair-materials-base-construction`
4. `ch15-system-selection-measurement-template`
5. `ch15-attachment-methods-bonding`
6. `ch15-cleaning-maintenance-chemical-care`
7. `ch15-cutting-blending-customization`

Seven corresponding learning objectives define the architectural scope without making new textbook, regulatory, medical, or exam-blueprint claims.

## Exact mapping coverage

The architecture maps the current runtime assets exactly once:

- 54 / 54 top-level lesson sections
- 90 / 90 flashcards
- 72 / 72 chapter-assessment questions

Nested tab IDs are intentionally not counted as separate lesson sections. Stable existing content, flashcard, and question IDs are preserved.

Every active concept family has lesson, flashcard, and assessment coverage.

## Shared grading and evidence binding

Chapter 15 delegates grading and mastery to the existing shared engines:

- micro-check evidence: 20%
- flashcard/study evidence: 10%
- chapter assessment: 40%
- scenario/application evidence: 15%
- remediation/reassessment recovery: 15%

No Chapter 15-specific weighting system was introduced.

Chapter 15 flashcards and the five existing scenario/application blocks are registered with the shared durable activity-evidence registry.

## Planned micro-check placements

C15-1 defines seven placement points, one per concept family, with two planned questions at each placement. The actual micro-check questions and immutable persistence implementation remain later Chapter 15 work.

## Scope boundary

C15-1 intentionally does **not**:

- change Chapter 15 lesson wording
- change any of the 90 flashcards
- change any of the 72 assessment questions or answer keys
- independently verify Milady source support
- endorse medical, medication, regulatory, or state-board claims
- create safety hazard escalation
- create reassessment reserve questions
- wire instructor diagnostics

Those remain later Chapter 15 phases.

## Certification gate

C15-1 is only GREEN after its architecture certification test, full Engineering Verification, and matching exact-head Vercel preview are GREEN. Any defect found by those gates must be repaired without weakening exact coverage assertions.

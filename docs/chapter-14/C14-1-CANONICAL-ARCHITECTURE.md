# C14-1 — Canonical Concept Architecture + Shared Grading/Evidence Binding

Branch: `feat/c14-unified-grading-alignment`

C14-1 establishes Chapter 14's stable concept architecture from the existing runtime implementation. It does not rewrite or source-certify the educational content.

## Canonical concept families

Chapter 14 now has seven stable concept families:

1. `ch14-consultation-professional-design`
2. `ch14-facial-head-design-analysis`
3. `ch14-cutting-geometry-guides`
4. `ch14-shear-clipper-razor-texturizing`
5. `ch14-haircut-styles-procedures`
6. `ch14-styling-volume-locks`
7. `ch14-service-safety-sanitation`

Seven corresponding learning objectives define the architectural scope without making new textbook, regulatory, or exam-blueprint claims.

## Exact mapping coverage

The architecture maps the current runtime assets exactly once:

- 64 / 64 lesson sections
- 112 / 112 flashcards
- 70 / 70 chapter-assessment questions

Stable existing IDs are preserved.

Every active concept family has lesson, flashcard, and assessment coverage.

## Shared grading and evidence binding

Chapter 14 delegates grading and mastery to the existing shared engines:

- micro-check evidence: 20%
- flashcard/study evidence: 10%
- chapter assessment: 40%
- scenario/application evidence: 15%
- remediation/reassessment recovery: 15%

No Chapter 14-specific weighting system was introduced.

Chapter 14 flashcards and the four existing scenario/application blocks are registered with the shared durable activity-evidence registry. The registry now determines unified support from actual registered chapter mappings rather than assuming a contiguous chapter-number range.

## Planned micro-check placements

C14-1 defines seven placement points, one per concept family, with two planned questions at each placement. The actual micro-check questions and immutable persistence implementation remain C14-5 work.

## Scope boundary

C14-1 intentionally does **not**:

- verify the current lesson against Milady pages
- endorse state-board or regulatory claims
- repair the A=70 assessment key defect
- create safety hazard escalation
- create reassessment reserve questions
- wire instructor diagnostics

Those remain later C14 phases.

## Certification gate

C14-1 is only GREEN after its architecture certification test, full Engineering Verification, and matching exact-head Vercel preview are GREEN. Any defect found by those gates must be repaired without weakening coverage assertions.

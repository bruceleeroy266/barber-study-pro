# C17-1 — Canonical Concept Architecture + Shared Grading/Evidence Binding

C17-1 establishes Chapter 17 — Chemical Texture Services — on the same shared ASCYN PRO mastery architecture used by the certified prior chapters.

## Baseline

C17-1 starts from production `main` at:

`6df1a6f6250fef6415e54b8e5df678b281447252`

That is the production Chapter 15 merge commit. Chapter 16 work remains isolated on its own branch and is not modified by C17-1.

## Locked Chapter 17 inventory

The current runtime contains:

- 24 top-level lesson sections
- 60 flashcards
- 30 chapter-assessment questions
- 16 existing learning questions
- seven existing competencies
- 12 existing runtime learning objectives
- seven existing remediation paths
- one scenario/application item

C17-1 does not rewrite any of those educational assets.

## Seven canonical concept families

1. Client Consultation & Hair Analysis
2. Chemical Texture Chemistry & Bond Transformation
3. Permanent Waving Procedures
4. Chemical Relaxing Procedures
5. Curl Reformation Procedures
6. Safety, Strand Tests & Chemical Compatibility
7. Texturizers & Chemical Blowouts

These concept families align to the seven existing Chapter 17 competency domains while giving the shared mastery system stable `ch17-*` IDs.

## Exact architecture mapping

C17-1 maps:

- 24 / 24 top-level lesson sections exactly once
- 60 / 60 flashcards exactly once
- 30 / 30 chapter-assessment questions exactly once
- 16 / 16 existing learning questions exactly once for traceability

Every concept family has lesson, flashcard, and chapter-assessment coverage.

## Shared grading and evidence

Chapter 17 delegates directly to the shared grade/mastery engines:

- micro-check: 20%
- flashcard: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

No Chapter 17-specific grade formula is introduced.

The current 60-card inventory and existing scenario/application section are registered in the shared durable activity-evidence registry.

## Planned micro-checks

C17-1 defines seven future micro-check placements, one per canonical concept family, with two planned questions per placement. It does not create the 14 questions or persistence behavior yet.

## Scope boundary

C17-1 intentionally does not:

- rewrite lesson wording
- rewrite any flashcard
- rewrite assessment answers or explanations
- independently verify textbook/source support
- certify chemical-service safety wording
- certify product/manufacturer timing claims
- certify compatibility or contraindication wording
- create safety escalation
- create fresh reassessment questions
- add instructor diagnostics

Those remain later Chapter 17 phases.

## Certification gate

C17-1 is GREEN only after its architecture certification test, full Engineering Verification, and matching exact-head Vercel preview all pass.

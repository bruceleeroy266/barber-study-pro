# C7-1 — Grading, Evidence & Deterministic Mastery Rules

## Status

Implementation started on the Chapter 7 framework branch.

## Grade model

Declared weights:

- Micro knowledge checks: 20%
- Flashcard mastery: 10%
- Chapter assessment: 40%
- Dedicated scenario/application evidence: 15%
- Remediation/reassessment recovery: 15%

### Conditional recovery rule

The ordinary four components total 85% and are normalized to a 0–100 base grade. A student who demonstrates mastery on the first attempt therefore does not lose 15 points simply because remediation was never needed.

When reassessment exists, the engine calculates a recovery blend using the 15% remediation weight. The final grade is the greater of the original base grade or the recovery blend. Remediation can recover performance; it cannot punish participation.

## Evidence model

Each graded interaction records:

- student ID
- chapter ID
- concept family ID
- source type
- item ID
- difficulty
- correct/incorrect result
- attempt phase
- timestamp

One interaction has exactly one source type. Scenario/application evidence is therefore not simultaneously counted again as chapter-assessment evidence.

## Mastery model

Concept mastery is separate from the chapter grade.

Evidence weight is determined by:

1. difficulty
2. evidence source
3. attempt phase
4. recency

Application and scenario evidence contribute more than recall. Flashcard interactions contribute less than formal assessment evidence. Reassessment can increase mastery, but initial misses remain in the evidence trail.

## Confidence model

Confidence is separate from mastery.

States:

- insufficient evidence
- emerging
- developing
- proficient
- strong

Strong confidence requires repeated observations, item diversity, multiple evidence sources, harder evidence, and consistency. One or two correct answers cannot produce stable confidence.

## Recency

Recent evidence receives modestly greater weight. Older evidence is reduced but not erased. Time alone does not aggressively lower mastery.

## Determinism

The calculation receives an explicit reference time. Identical evidence plus the same reference time always returns the same grade/mastery/confidence result.

## C7-1 exit criteria

- grading/evidence engine committed
- deterministic unit tests committed
- typecheck, lint, unit tests, and production build GREEN
- PR Engineering Verification GREEN

After those conditions pass, C7-1 can close and C7-2 can begin asset-to-concept mapping and micro-check placement before content hardening.

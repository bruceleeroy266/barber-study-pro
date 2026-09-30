# C20-1 — Canonical Concept Architecture

## Scope

C20-1 defines one authoritative Chapter 20 concept model across the existing production lesson, 60 premium flashcards, and 17-question chapter assessment.

This phase is architecture-only. It does not rewrite learner-facing content, add micro-check UI, change grading, add remediation behavior, or alter the 80% chapter-quiz passing threshold.

## Canonical concept families

1. `ch20-professional-transition-workplace-expectations` — Professional Transition & Workplace Expectations
2. `ch20-teamwork-workplace-relationships` — Teamwork & Workplace Relationships
3. `ch20-employment-classification-compensation` — Employment Classification & Compensation
4. `ch20-financial-responsibility-income-reporting` — Financial Responsibility & Income Reporting
5. `ch20-ethical-selling-retailing` — Ethical Selling & Retailing
6. `ch20-client-retention-marketing-consent` — Client Retention, Marketing & Consent

## Canonical learning objectives

| ID | Concept family | Production lesson section |
|---|---|---|
| `LO-20-01` | professional transition & workplace expectations | `ch20-lo1` |
| `LO-20-02` | teamwork & workplace relationships | `ch20-lo2` |
| `LO-20-03` | employment classification & compensation | `ch20-lo3` |
| `LO-20-04` | financial responsibility & income reporting | `ch20-lo4` |
| `LO-20-05` | ethical selling & retailing | `ch20-lo5` |
| `LO-20-06` | client retention, marketing & consent | `ch20-lo6` |

The existing `ch20-introduction` section summarizes all six families.

## Flashcard mapping

The existing flashcard inventory already forms six coherent ten-card blocks:

- `fc-ch20-001`–`010` → professional transition/workplace expectations
- `fc-ch20-011`–`020` → teamwork/workplace relationships
- `fc-ch20-021`–`030` → employment classification/compensation
- `fc-ch20-031`–`040` → financial responsibility/income reporting
- `fc-ch20-041`–`050` → ethical selling/retailing
- `fc-ch20-051`–`060` → client retention/marketing/consent

Every active card receives exactly one primary concept mapping.

## Assessment mapping

The current 17-question assessment maps by active question meaning:

- Q01–Q03 → professional transition/workplace expectations
- Q04–Q06 → teamwork/workplace relationships
- Q07–Q09 → employment classification/compensation
- Q10–Q12 → financial responsibility/income reporting
- Q13–Q14 → ethical selling/retailing
- Q15–Q17 → client retention/marketing/consent

All 17 IDs remain unchanged.

## Criticality policy

Chapter 20 currently has **no bodily-safety concept family**. C20-1 deliberately does not invent one.

Three families are compliance-sensitive:

- employment classification & compensation
- financial responsibility & income reporting
- client retention, marketing & consent

These may involve legal, tax, economic, privacy, or consent consequences. They must remain distinct from the shared urgent bodily-safety path. C20-6 may define compliance escalation, but it must not impose the 100% urgent-safety recovery rule merely because a mistake is serious.

## Shared grading contract

Chapter 20 inherits the existing shared weights unchanged:

- micro-checks: 20%
- flashcards/study: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

C20-1 does not fabricate scenario evidence. Any durable scenario/application evidence must come from real Chapter 20 runtime interactions established in a later phase.

## Certification invariants

C20-1 is GREEN only if:

1. Exactly six active concept families exist.
2. Exactly six canonical learning objectives exist.
3. Every family has real production lesson-section coverage.
4. All 60 flashcards map exactly once.
5. All 17 assessment questions map exactly once.
6. No bodily-safety family is invented.
7. Compliance-sensitive concepts remain separate from urgent safety.
8. Shared 20/10/40/15/15 grading remains unchanged.
9. Learner-facing Chapter 20 behavior remains unchanged.

## Next phase

**C20-2 — Lesson Hardening** should bind the current lesson more explicitly to these six concepts, preserve the current instructional meaning, remove legacy structural ambiguity where practical, and prepare real micro-check/application placement without duplicating curriculum.

# C21-1 — Canonical Concept Architecture

## Scope
C21-1 defines one authoritative Chapter 21 concept model across the current production lesson, 60 premium flashcards, and 17-question chapter assessment.

This phase is architecture-only. It does not yet rewrite learner-facing legal/tax/business language, add micro-check questions, change grading, create remediation cycles, or alter the 80% chapter-assessment threshold.

## Canonical concept families

1. `ch21-business-entry-paths` — Business Entry Paths
2. `ch21-shop-opening-planning` — Shop Opening & Planning
3. `ch21-ownership-legal-structures` — Ownership & Legal Structures
4. `ch21-business-plan-financial-planning` — Business Plan & Financial Planning
5. `ch21-recordkeeping-financial-compliance` — Recordkeeping & Financial Compliance
6. `ch21-booth-rental-independent-business-responsibilities` — Booth Rental & Independent Business Responsibilities
7. `ch21-shop-operations-management` — Shop Operations & Management
8. `ch21-advertising-marketing-client-consent` — Advertising, Marketing & Client Consent

The eight-family model intentionally follows the eight existing Chapter 21 learning objectives instead of forcing Chapter 21 into Chapter 20's six-family structure.

## Canonical learning objectives

| Canonical ID | Existing lesson section | Concept family |
|---|---|---|
| `LO-21-01` | `ch21-lo1` | Business Entry Paths |
| `LO-21-02` | `ch21-lo2` | Shop Opening & Planning |
| `LO-21-03` | `ch21-lo3` | Ownership & Legal Structures |
| `LO-21-04` | `ch21-lo4` | Business Plan & Financial Planning |
| `LO-21-05` | `ch21-lo5` | Recordkeeping & Financial Compliance |
| `LO-21-06` | `ch21-lo6` | Booth Rental & Independent Business Responsibilities |
| `LO-21-07` | `ch21-lo7` | Shop Operations & Management |
| `LO-21-08` | `ch21-lo8` | Advertising, Marketing & Client Consent |

The existing `CH21-LO01` through `CH21-LO08` strings remain legacy/source standard identifiers for now. C21-2/C21-4 will bind learner-facing/runtime metadata to the canonical `LO-21-0X` IDs while preserving useful legacy standard IDs.

## Flashcard mapping

All 60 active cards map exactly once by current meaning:

- `fc-ch21-001`–`005` → Business Entry Paths
- `fc-ch21-006`–`010` → Shop Opening & Planning
- `fc-ch21-011`–`020` → Ownership & Legal Structures
- `fc-ch21-021`–`030` → Business Plan & Financial Planning
- `fc-ch21-031`–`035` → Recordkeeping & Financial Compliance
- `fc-ch21-036`–`040` → Booth Rental & Independent Business Responsibilities
- `fc-ch21-041`–`050` → Shop Operations & Management
- `fc-ch21-051`–`060` → Advertising, Marketing & Client Consent

The resulting distribution is **5 / 5 / 10 / 10 / 5 / 5 / 10 / 10**. This uneven distribution is intentional because it follows the actual source material rather than inventing equal card counts.

## Assessment mapping

All 17 existing assessment IDs remain stable.

- Q01–Q02 → Business Entry Paths
- Q03 + Q17 → Shop Opening & Planning
- Q04–Q05 → Ownership & Legal Structures
- Q07–Q08 → Business Plan & Financial Planning
- Q09–Q10 → Recordkeeping & Financial Compliance
- Q06 + Q11 → Booth Rental & Independent Business Responsibilities
- Q12–Q13 → Shop Operations & Management
- Q14–Q16 → Advertising, Marketing & Client Consent

## Compliance-critical families

Five concept families are compliance/legal critical:

1. Shop Opening & Planning
2. Ownership & Legal Structures
3. Recordkeeping & Financial Compliance
4. Booth Rental & Independent Business Responsibilities
5. Advertising, Marketing & Client Consent

These families can involve licensing, permits, entity structure, liability, tax, record-retention, worker-classification, lease, insurance, privacy, consent, or advertising requirements.

C21-6 may escalate these as compliance concerns when the evidence warrants it.

## Safety boundary

Chapter 21 currently has **zero canonical bodily-safety families**.

Operational cleanliness appears in the business-operations material, but Chapter 21 is not the source-of-truth chapter for infection-control or immediate bodily-harm procedures.

Therefore:

- `CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS = []`
- compliance/legal misses must not automatically invoke the shared 100% urgent-safety recovery rule;
- true safety-critical evidence remains governed by the appropriate safety chapters and shared safety architecture.

## Planned micro-check placement

C21-1 reserves one micro-check block after each LO:

- `mc-21-01` after `ch21-lo1`
- `mc-21-02` after `ch21-lo2`
- `mc-21-03` after `ch21-lo3`
- `mc-21-04` after `ch21-lo4`
- `mc-21-05` after `ch21-lo5`
- `mc-21-06` after `ch21-lo6`
- `mc-21-07` after `ch21-lo7`
- `mc-21-08` after `ch21-lo8`

Each block reserves exactly **2 questions**, for a future C21-5 total of **16 fresh micro-check questions**.

C21-1 defines placement only. It does not create the questions or evidence writes yet.

## Shared grading contract

Chapter 21 inherits the existing shared weights unchanged:

- micro-checks: **20%**
- flashcards/study: **10%**
- chapter assessment: **40%**
- scenario/application: **15%**
- remediation/reassessment: **15%**

Completion remains separate from mastery.

## Certification invariants

C21-1 is GREEN only if:

1. Exactly 8 active concept families exist.
2. Exactly 8 canonical learning objectives exist.
3. Every family has real lesson-section coverage.
4. All 60 flashcards map exactly once.
5. All 17 assessment questions map exactly once.
6. The flashcard distribution remains 5/5/10/10/5/5/10/10.
7. Five compliance/legal families are explicitly identified.
8. No bodily-safety family is invented.
9. Two future micro-checks are reserved after each LO.
10. Shared 20/10/40/15/15 grading remains unchanged.
11. Learner-facing Chapter 21 behavior remains unchanged in this architecture-only phase.

## Next phase

**C21-2 — Lesson Hardening:** bind the existing lesson to the canonical families and IDs, harden business/legal/tax/licensing/classification/recordkeeping/advertising language, and prepare real application anchors without duplicating the shared grading or remediation architecture.

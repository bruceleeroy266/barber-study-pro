# C15-7 — Fresh Reassessment Reserve + Mastery Recovery

C15-7 adds a fresh Chapter 15 reassessment reserve and binds it to the existing remediation/reassessment runtime.

## Fresh reserve

- 35 total reassessment questions
- exactly 5 per canonical concept family
- IDs use the dedicated `r15-*` namespace
- no overlap with the certified 72-question `qq-15-*` assessment
- no overlap with the 14 `mcq-15-*` micro-check questions
- all reassessment items are understanding, application, or scenario level

## Recovery thresholds

Ordinary remediation:
- 5 questions
- 80% required
- 4/5 passes

Urgent safety remediation:
- 5 questions
- 100% required
- 4/5 fails
- 5/5 passes

Urgent safety status continues to come from C15-6. Distinct high-risk misses can therefore raise the same concept from the ordinary 80% standard to the 100% recovery standard.

## Immutable history

Reassessment answers are stored as:

- source: `remediation_reassessment`
- attempt phase: `reassessment`
- fresh `r15-*` item IDs

They are appended to the original evidence set. Initial misses remain present and continue to count as historical diagnostic evidence. Successful reassessment can raise current mastery without rewriting the learner's original record.

## Runtime wiring

C15-7 adds:

- Chapter 15 canonical reassessment mapping provider
- Chapter 15 reassessment-aware detection provider
- Chapter 15 remediation content-provider support for `r15-*` questions
- concept-to-reserve mapping of exactly five fresh questions per concept

The runtime can now resolve a weak concept, serve its five fresh reassessment questions, score the cycle, and append the new recovery evidence.

## Locked certified inventories

C15-7 does not modify:

- 54 lesson sections
- 90 flashcards
- 72 assessment questions
- 14 micro-check questions
- seven canonical concept families
- shared 20/10/40/15/15 grading weights

## Certification gate

C15-7 is GREEN only when the 35-question reserve, namespace separation, 80/100 policy, immutable-history recovery behavior, live mapping/content-provider wiring, full Engineering Verification, and exact-head Vercel preview all pass.

# C7-6 — Micro-Knowledge-Check Implementation & Evidence Wiring

## Implemented foundation

The ten C7-2 planned micro-check locations now have concrete question definitions and deterministic evidence conversion.

- 10 micro-checks
- 23 total questions
- exactly one micro-check per canonical concept family
- 1–3 questions per check, matching the locked placement plan
- no recall-only questions
- application/scenario evidence emphasized
- every answered item converts to one `micro_check` evidence record
- duplicate submissions for the same question are ignored by the deterministic scorer/evidence builder

## Grade protection

The Chapter 7 grading model remains locked:

- micro checks: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment recovery: 15%

Micro checks therefore cannot outweigh the chapter assessment.

The micro-check score is calculated only from valid unique answered micro-check items and feeds the existing `microCheckPercent` grade component.

## Concept evidence

Each micro-check question owns exactly one canonical concept family.

Evidence records include:
- student ID
- chapter ID
- concept family ID
- source = `micro_check`
- unique item ID
- difficulty
- correct/incorrect
- initial attempt phase
- timestamp

This keeps completion separate from mastery and prevents one micro-check response from being counted across multiple concepts.

## Remaining C7-6 work

The next implementation layer is UI/persistence integration:
1. render each check immediately after its planned lesson section,
2. persist first-attempt answers for authenticated students,
3. restore completed micro-check state on reload,
4. feed persisted evidence into student/instructor mastery views,
5. verify all 10 checks on mobile and desktop,
6. run Engineering Verification + Vercel before closing C7-6.

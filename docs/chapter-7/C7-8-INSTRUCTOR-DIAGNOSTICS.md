# C7-8 — Instructor-Facing Chapter 7 Diagnostics & Intervention Presentation

## Purpose

Present the Chapter 7 mastery framework to instructors in one human-readable diagnostic panel without exposing internal IDs or database implementation details.

## Instructor-visible chapter summary

The Chapter 7 panel now separates:

- completion,
- chapter grade,
- overall concept mastery,
- mastery confidence,
- micro-check performance,
- chapter assessment performance,
- remediation status,
- latest reassessment,
- strongest concepts,
- weakest concepts,
- active intervention signals,
- per-concept mastery evidence.

## Evidence reconstruction

The instructor adapter combines:

1. immutable Chapter 7 micro-check first-attempt rows,
2. Chapter 7 assessment `answers_json` resolved against the canonical question bank and concept map,
3. known reassessment evidence when the question can be resolved to the canonical bank,
4. remediation-cycle status/outcome metadata.

The adapter never derives mastery from chapter completion alone.

## Intervention presentation

C7-8 consumes the tested C7-7 intervention engine.

Instructor-facing flags display:
- severity,
- human-readable concept name when concept-scoped,
- plain-language reason.

They do not display:
- database row IDs,
- micro-check IDs,
- question IDs,
- remediation cycle IDs,
- raw concept IDs,
- idempotency keys,
- evidence-row identifiers.

## Chapter grade boundary

The locked Chapter 7 weights remain:

- Micro Knowledge Checks: 20%
- Flashcards: 10%
- Chapter Assessment: 40%
- Scenario/Application: 15%
- Remediation/Reassessment Recovery: 15%

The chapter assessment remains the heaviest component.

Only graded components actually available are passed to the grade engine. Completion activity is not substituted for missing mastery evidence.

## Confidence and concept presentation

All ten canonical concept families remain visible.

For each concept, instructors see:
- concept name,
- 0–100 mastery score when evidence exists,
- confidence state,
- evidence observation count,
- initial miss count,
- reassessment-correct count when available,
- latest evidence date.

Concepts without graded evidence remain visible as no evidence / insufficient evidence rather than disappearing.

## Strong/weak concept summaries

Strongest and weakest lists are derived only from concepts with graded evidence.

They are descriptive sorting views of mastery evidence; they do not alter grading or intervention thresholds.

## C7-8 exit criteria

C7-8 closes only when:

1. TypeScript passes.
2. Lint passes.
3. Unit tests pass.
4. Production build passes.
5. Pilot onboarding certification passes.
6. Vercel preview is READY on the exact current head.
7. Instructor-facing tests confirm no internal IDs are exposed.
8. The C7-7 intervention engine remains unchanged and GREEN.

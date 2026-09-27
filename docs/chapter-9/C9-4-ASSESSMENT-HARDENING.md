# C9-4 — 30-Question Assessment Hardening

## Scope

C9-4 hardens the existing 30-question Chapter 9 assessment in place.

The phase preserves:
- question IDs `q9-001` through `q9-030`
- exactly 30 questions
- existing canonical C9-1 concept-family mappings
- one correct answer per question

C9-4 changes the *quality and reasoning demand* of the assessment rather than changing the assessment size.

## Primary source

Primary reference: connected `chapter 9.pdf`, Chapter 9, *The Skin: Structure, Disorders, and Diseases*, book pages 222–240.

C9-4 also uses the source-grounded C9-2 lesson and C9-3 flashcard corrections as consistency guardrails.

## Baseline defects found

The pre-C9-4 bank was too recall-heavy and still contained content already removed from the hardened lesson/flashcards, including:

- exact pH 5.5 memorization as the target
- 50% blood-supply memorization
- `BOARD EXAM ALERT` / “most commonly tested” / “EVERY board exam” claims
- blackhead explanation including melanin instead of focusing on oxidized sebum
- pustule = active infection certainty
- unsupported darker-skin keloid prevalence wording
- blanket “never shave” / diagnosis-adjacent service language without scope framing
- incorrect sebaceous cyst = steatoma equivalence
- over-prescriptive rosacea guidance
- unsupported autoimmune wording for psoriasis in this source edition
- overly categorical herpes/wart language
- 80% / 20% skin-cancer prevalence figures
- “100% fatal” melanoma memory target
- mandatory documentation/legal rhetoric

The answer key was also heavily concentrated in one answer position and many distractors were obvious opposites rather than plausible discrimination choices.

## Hardening applied

All 30 questions were rewritten in place.

### Difficulty
- 0 easy
- 11 medium
- 19 hard

### Reasoning style
The new bank emphasizes:
- structure/function discrimination
- short service scenarios
- lesion identification from distinguishing features
- safe next-action decisions
- scope boundaries
- cause/effect reasoning
- comparison of similar disorders/lesions
- source-safe cancer recognition
- ABCDE observation and referral logic

### High-risk corrections

- `q9-003`: blood/lymph function replaces 50% blood-supply memorization
- `q9-004`: avascular epidermis tested through an injury/bleeding application
- `q9-012`: blackhead darkening tied to exposed sebum oxidation
- `q9-015`: pustule no longer treated as proof of a specific diagnosis
- `q9-018`: ulcer question uses affected-area service safety and referral scope
- `q9-020`: sebaceous cyst and steatoma are correctly distinguished
- `q9-021`: rosacea uses gentle service judgment without medical treatment claims
- `q9-022`: anhidrosis uses heat-regulation safety reasoning
- `q9-023`: psoriasis remains noncontagious without relying on unsupported autoimmune wording
- `q9-024`: active herpes uses service pause + sanitation/referral scope
- `q9-026`: verruca uses infectious-lesion safety without barber removal/treatment
- `q9-028`: skin-cancer distinction uses durable qualitative ordering without 80/20 percentages or survival statistics
- `q9-029`: ABCDE tested through evolution/change rather than one-letter recall alone
- `q9-030`: final safety question requires observe → do not diagnose → pause if unsafe → refer

## Answer-key hardening

Correct-answer positions are intentionally varied across A/B/C/D to reduce predictable answer-pattern cues.

## Guardrail test

`src/lib/chapter-9-concepts/assessment-hardening.test.ts` verifies:

- exactly 30 unique ordered questions
- exactly 30 unique concept mappings covering the same IDs
- no easy questions
- at least 18 hard questions
- answer-position distribution remains varied
- unsupported exam certainty/statistics remain absent
- high-risk corrected concepts remain repaired
- every answer key points to a valid non-empty answer

## Current status

**C9-4 IMPLEMENTATION COMPLETE — AWAITING EXACT-HEAD ENGINEERING VERIFICATION + VERCEL PREVIEW.**

C9-5 must not begin until C9-4 is GREEN.

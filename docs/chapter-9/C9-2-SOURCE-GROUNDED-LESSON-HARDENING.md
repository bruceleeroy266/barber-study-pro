# C9-2 — Source-Grounded Lesson Hardening

## Scope
C9-2 hardens only the Chapter 9 lesson in `src/lib/chapter-9-premium.ts`.

The Chapter 9 flashcards and 30-question assessment are intentionally unchanged in this phase.

## Primary source
C9-2 was independently checked against the connected textbook file `chapter 9.pdf`, covering Chapter 9, *The Skin: Structure, Disorders, and Diseases*, book pages 222–240.

The older `CHAPTER-9-ENHANCEMENT-FINAL-REPORT.md` is retained only as historical project context. It is not treated as authoritative when its claims conflict with the textbook or current professional-scope guardrails.

## Source-aligned concepts preserved
The hardened lesson preserves the chapter's core subject coverage:
- epidermis and dermis structure
- papillary and reticular layers
- subcutaneous tissue
- blood, lymph, nerves, glands, and skin functions
- primary and secondary lesions
- sebaceous and sudoriferous disorders
- inflammatory and infectious conditions
- pigment changes and hypertrophies
- basal cell carcinoma, squamous cell carcinoma, malignant melanoma, and the ABCDE observation framework
- barber observation, service-safety decisions, and medical referral boundaries

## Repairs made

### 1. Removed unsupported exam certainty
Visible `BOARD EXAM ALERT` / universal-test language was replaced with neutral study framing such as:
- `KEY STUDY POINTS`
- `STUDY CHECK`
- `COMMON CONFUSIONS — CHECK YOUR REASONING`

Claims such as “every board exam” and “every test” were removed because C9-2 does not independently verify a current exam blueprint or universal state-board frequency.

### 2. Removed medical-style credentialing and diagnostic framing
The lesson no longer portrays the learner as a medical authority or gives pseudo-credentials such as:
- Skin Safety Officer certification
- Dermatology Authority
- diagnostic tools
- “read the skin like a medical chart”

The replacement language emphasizes careful observation, service safety, sanitation, scope, communication, and referral.

### 3. Repaired skin-cancer claims
Volatile or over-certain statistics were removed, including:
- “100% fatal if untreated”
- 99% / 27% survival claims
- unsupported 80% / 20% prevalence claims

The lesson now keeps the source-grounded distinction that malignant melanoma is the most dangerous of the three skin cancers discussed while making clear that diagnosis, prognosis, and treatment belong to qualified medical professionals.

### 4. Removed unsupported blood-supply percentage
The source supports blood and lymph as nourishment/transport systems and supports dermal circulation in skin function, but C9-2 did not find support for the lesson's “half the body's blood supply” claim. That numerical claim was removed.

### 5. Tightened service-safety boundaries
The lesson now distinguishes:
- observing from diagnosing
- pausing an affected service from making a medical determination
- recommending medical evaluation from prescribing treatment
- chapter-level safety guidance from school/state sanitation requirements

Jurisdiction-specific penalty certainty such as automatic license suspension was removed.

### 6. Reduced unsupported numerical specificity
The visible lesson no longer treats an approximate numeric skin pH or unsupported population counts as required chapter facts when the reviewed source supports the broader concept without that precision.

## Guardrails
`lesson-hardening.test.ts` fails if the high-risk certainty/credentialing language returns and verifies that Chapter 9's core lesson structure remains present.

## C9-2 current status
Implementation complete on the working branch. C9-2 is not certified until the new exact-head Engineering Verification and Vercel Preview are both GREEN.

No flashcard or assessment content has been changed.

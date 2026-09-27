# C10-2 — Source-Grounded Lesson Hardening

**Chapter:** 10 — Properties and Disorders of the Hair and Scalp  
**Branch:** `feat/c10-2-source-grounded-lesson-hardening`  
**Certified architecture baseline:** C10-1 exact head `caff15ec6dd430316c70e0ae731fd933d46f2eb8`

## Scope

C10-2 hardens only the Chapter 10 lesson in `src/lib/chapter-10-premium.ts`.

It does **not** change:
- the 118 Chapter 10 flashcards;
- the 75 Chapter 10 assessment items;
- the C10-1 concept-family registry or mappings;
- shared grading weights or mastery semantics;
- Chapters 1–9 grading.

## Source basis

The repository contains the Chapter 10 source-image set in `textbook-images/chapter-10/` plus `CHAPTER-10-MATERIAL-SUMMARY.md`, which records textbook coverage for Chapter 10, *Properties and Disorders of the Hair and Scalp*, pages 248–268.

This hardening pass uses that repository source record to preserve the chapter's supported domains:
- hair root and shaft structure;
- cuticle, cortex, and medulla;
- keratin/protein chemistry and side bonds;
- pigment and wave pattern;
- hair-growth cycle and growth patterns;
- alopecia and hair disorders;
- contagious/infectious/parasitic scalp conditions;
- hair/scalp analysis;
- texture, density, porosity, and elasticity.

Important limitation: no standalone Chapter 10 PDF was located in the connected file library during this pass. The repository material summary is therefore the current textual grounding record. C10-2 does not claim a new independent page-by-page transcription of every source image.

## Repairs made

### 1. Removed unsupported exam-frequency certainty
The lesson no longer claims Chapter 10 concepts appear on “EVERY state board exam” or that missing them guarantees failure.

The old exam-alert section is now neutral Chapter 10 study guidance.

### 2. Removed pseudo-credentialing and diagnosis framing
Visible learner-facing language such as:
- “diagnostic instrument”;
- “diagnostic credentials”;
- “Master Trichologist”;
- “Trichology Authority”;

was replaced with hair-and-scalp analysis, observation, service-safety, and professional-boundary language.

Stable runtime IDs were preserved even where an older ID still contains a historical word such as `trichology-certification` or `diagnostic-scenarios`.

### 3. Tightened hair/scalp analysis language
The lesson now frames analysis as a pre-service decision tool rather than a universal medical examination.

It preserves source-recorded analysis factors and methods while distinguishing observable findings from medical diagnosis.

### 4. Tightened referral and contagion boundaries
The lesson preserves the source record that parasites and source-covered contagious conditions affect service decisions and may require referral.

It removes jurisdiction-specific claims that a particular service decision automatically causes license suspension.

### 5. Repaired medical-authority overreach
The lesson now explicitly keeps:
- diagnosis;
- prescribing;
- medical treatment selection;
- determining whether a growth is benign or malignant;

outside barbering scope.

Hair-loss treatments mentioned by the chapter are presented as source context rather than barber treatment recommendations.

### 6. Repaired hypertrophy / skin-cancer framing
The lesson no longer claims the barber performs “early detection of skin cancer.”

The barber-facing target is now careful observation, avoiding injury to raised areas, noticing visible change, and recommending appropriate medical evaluation without diagnosis.

### 7. Preserved lesson structure
C10-2 retains all **47** existing Chapter 10 lesson content IDs. The phase hardens wording rather than changing the C10-1 architecture.

## Guardrail

`src/lib/chapter-10-concepts/lesson-hardening.test.ts` fails if high-risk exam-certainty, pseudo-credential, license-penalty, or medical-authority wording returns, and it verifies that the source-covered core domains and all 47 lesson IDs remain intact.

## Status

**Implementation started and source/scope hardening is in place. Exact-head Engineering Verification and Vercel Preview are still required before C10-2 can be certified.**

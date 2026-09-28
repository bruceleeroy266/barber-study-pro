# C11-0 — Chapter 11 Baseline Audit

**Chapter:** 11 — Treatment of the Hair and Scalp  
**Baseline production commit:** `67590e4bcb624ad995df2286c2e2cfca236ef6df`  
**Goal:** Bring Chapter 11 onto the same certified learning/grading foundation used by Chapters 1–10 without changing that foundation.

## Locked Chapters 1–10 foundation to reuse

Chapter 11 must match the existing certified architecture:

- canonical concept families and learning objectives;
- immutable first-attempt micro-check evidence;
- shared grading/mastery engine;
- exact concept detection;
- targeted remediation mapped to lesson content;
- fresh 5-question reassessment;
- ordinary recovery threshold 80%;
- urgent safety recovery threshold 100% when applicable;
- preserved initial misses after recovery;
- instructor + school-admin visibility from the same student evidence;
- no chapter-specific replacement grading formula.

## Existing Chapter 11 inventory

Current production files:

- `src/lib/chapter-11-premium.ts`
- `src/lib/chapter-11-premium-flashcards.ts`
- `src/lib/chapter-11-premium-quiz.ts`
- `CHAPTER-11-MATERIAL-SUMMARY.md`

Current observed inventory:

- lesson structure: 25 unique authored IDs;
- flashcards: 80 unique cards;
- assessment: 50 unique questions;
- assessment difficulty: 21 easy / 24 medium / 5 hard;
- answer-key distribution: A=50 / B=0 / C=0 / D=0.

Chapter 11 currently has no dedicated `src/lib/chapter-11-concepts/` architecture comparable to Chapters 1–10.

## Source basis

The repository material summary states Chapter 11 is based on pages 276–285 and covers:

- product matching;
- draping procedures;
- shampoo service;
- consultation and analysis;
- scalp massage;
- scalp/hair treatments;
- steam and hot towels;
- treatment series;
- electric massage;
- hair tonic treatments;
- referral boundaries for parasitic/staphylococcal scalp conditions.

Until the underlying textbook pages are independently inspected, this remains repository-source-grounded rather than fresh page-by-page source certification.

## Baseline defects / risks found

### 1. Missing unified grading/evidence architecture

Chapter 11 lacks the dedicated concept package needed to match Chapters 1–10:

- no canonical concept registry;
- no content/flashcard/question mappings;
- no shared grading wrapper;
- no immutable Chapter 11 micro-check model;
- no Chapter 11 detection binding;
- no safety intervention engine;
- no targeted remediation/reassessment reserve;
- no Chapter 11 instructor diagnostics builder.

### 2. Assessment answer-position defect

All 50 current questions use answer position **A**.

This is not acceptable for a hardened assessment because students can exploit answer-position regularity even if question content is otherwise valid.

### 3. Difficulty imbalance

Only 5 of 50 questions are currently marked hard.

C11-4 should independently review difficulty and increase application/scenario demand where source-supported rather than simply relabeling items.

### 4. Scope / source-language risks

The baseline scan found language that must be reviewed against the Chapter 11 source record before certification, including:

- diagnosis/healing framing;
- claims that material appears on every state board exam;
- quantitative claims such as “40%” effectiveness;
- “dormant follicles” / growth-stimulation language;
- medicinal-treatment wording;
- dermatologist/referral wording.

These are audit flags only; C11-2 must decide what is directly source-supported and what needs repair/removal.

## Planned Chapter 11 sequence

- **C11-1 — Canonical Concept Architecture + Shared Grading/Evidence Model**
- **C11-2 — Source-Grounded Lesson Hardening**
- **C11-3 — Flashcard Source & Concept Hardening**
- **C11-4 — Assessment Source & Adversarial Hardening**
- **C11-5 — Micro-Checks + Immutable Evidence Binding**
- **C11-6 — Safety Escalation**
- **C11-7 — Targeted Remediation + 5-Question Reassessment**
- **C11-8 — Final Chapter 11 End-to-End Certification**

After Chapter 11 is GREEN, repeat the same controlled sequence for Chapters 12–21.

## Status

**C11-0 baseline audit complete.**  
No grading formula changes were made.  
No Chapter 11 content was changed during this baseline phase.

# C15-0 — Chapter 15 Improvement Baseline Audit

**Chapter:** 15 — Men's Hair Replacement  
**Baseline:** `206474b103c0940fb15bb2112532595668126c8e`  
**Scope:** Read-only baseline audit before any Chapter 15 content, grading, evidence, safety, remediation, or UI changes.

## Current live inventory

- 54 top-level lesson sections
- 90 flashcards (`fc-ch15-001` through `fc-ch15-090`)
- 72 assessment questions (`qq-15-001` through `qq-15-072`)
- 5 existing `scenarioBlock` sections / 5 scenario items
- Lesson registered at `ch-15`
- Flashcards registered at `ch-15`
- Quiz registered at `quiz-15`

### Lesson section types

- contentBlock: 27
- infoCards: 1
- quote: 1
- tabbed: 7
- scenarioBlock: 5
- checklist: 8
- featureGrid: 1
- challengeCard: 2
- levelUp: 2

## Existing strengths to preserve

1. Chapter 15 already has a substantial premium lesson and should be improved rather than rebuilt.
2. The 90-card flashcard bank is already live and sequentially identified.
3. The 72-question assessment is already live and sequentially identified.
4. Five application scenarios already exist in the lesson and are candidates for the shared 15% scenario/application evidence component.
5. Existing content covers consultation, system materials/construction, stock vs custom systems, measurement/templates, attachment, maintenance, chemical-service boundaries, cutting/blending, alternatives, and professional/scope topics.
6. Prior 2026 audits documented strong textbook coverage and original wording. Those reports are historical evidence only; they do not replace the current source-grounded re-audit required by the unified Chapter 1–14 standard.

## Modern architecture gap analysis

### Canonical concept architecture — RED

No `src/lib/chapter-15-concepts/` architecture exists on the current baseline.

Missing:
- stable Chapter 15 concept-family IDs
- learning objectives
- lesson-to-concept mappings
- flashcard-to-concept mappings
- assessment-to-concept mappings
- shared Chapter 15 grading wrapper
- Chapter 15 concept-detection adapter

### Durable activity evidence — RED

Chapter 15 is not registered in `activity-evidence-registry.ts`.

Current consequences:
- 90 flashcards are not yet mapped into the shared Chapter 15 mastery/evidence path.
- 5 existing lesson scenario items are not yet usable as Chapter 15 durable scenario/application evidence.
- the shared 20/10/40/15/15 live grade cannot be complete for Chapter 15.

### Micro-checks / immutable first-attempt evidence — RED

No Chapter 15 micro-check model, placement plan, persistence adapter, or `Chapter15MicroCheckCard` exists.

Required later:
- concept-balanced micro-checks
- non-recall questions
- first-attempt-only evidence
- existing `chapter_micro_check_attempts` database contract
- no Chapter 15-specific schema fork

### Assessment hardening — YELLOW/RED

Current assessment inventory: 72 questions.

Current source answer-key distribution:
- A: 72
- B: 0
- C: 0
- D: 0

This was accepted by an older audit because the application shuffles options at runtime. However, the current certified Chapter 14 bank uses a balanced source-bank distribution (18/18/17/17). Chapter 15 must therefore be independently audited item-by-item before certification.

Current difficulty distribution:
- Easy: 44
- Medium: 24
- Hard: 4

This is materially easier than the current hardened Chapter 13/14 standard and should be reviewed rather than automatically preserved.

### Safety / scope escalation — RED

Chapter 15 contains multiple high-risk or scope-sensitive topics but has no Chapter 15 safety-intervention engine.

Examples visible in current lesson/assessment:
- physician/medical referral boundaries
- Minoxidil / Finasteride discussion boundaries
- hair-transplant medical scope
- adhesive and solvent handling
- chemical-service limitations on replacement hair
- lightening / bleach restrictions
- hot-water / temperature cautions
- post-attachment cure-time instructions
- client sensitivity / allergy-related considerations

C15-6 must define only genuinely high-risk tagged hazards and must avoid escalating ordinary recall or design mistakes.

### Targeted remediation + reassessment — RED

Chapter 15 has no:
- shared remediation chapter provider
- Chapter 15 content provider
- canonical reassessment provider
- fresh reassessment reserve
- five-question recovery engine
- Chapter 15 reassessment detection provider

Required later:
- exactly five fresh questions per target concept
- ordinary recovery at 80%
- urgent safety recovery at 100%
- original misses preserved
- reassessment evidence stored separately as `remediation_reassessment`

### Instructor / school-admin diagnostics — RED

The authorized instructor/student-detail route currently has no Chapter 15 diagnostic adapter or Chapter 15 panel.

Missing:
- Chapter 15 mastery summary
- concept-level observations / original misses
- safety intervention visibility
- remediation status
- latest reassessment recovery
- Chapter 15 live 20/10/40/15/15 grade
- same-school instructor and school-admin visibility through the existing authorized route

## Historical audit caveat

Older Chapter 15 reports are useful references but are not certification artifacts for the current architecture. In particular:

- old reports describe a smaller structural chapter model than the current 54 top-level lesson sections;
- older assessment reasoning accepted 72/72 source answer keys as `a`;
- older reports predate unified concept mastery, durable activity evidence, immutable micro-check evidence, safety escalation, targeted remediation, reassessment recovery, and instructor/admin diagnostics.

C15 development must audit the current files directly.

## Recommended Chapter 15 phase plan

- **C15-0 — Baseline Audit**: inventory and gap classification only.
- **C15-1 — Canonical Concept Architecture + Shared Grading/Evidence**: define stable concepts and map all current lesson/flashcard/assessment assets.
- **C15-2 — Source-Grounded Lesson Hardening**: verify textbook support, medical/scope boundaries, unsupported certainty, terminology, and service-safety language without rebuilding the lesson.
- **C15-3 — Flashcard Source + Concept Hardening**: audit all 90 cards, map concepts, remove unsupported claims, and balance difficulty where justified.
- **C15-4 — Assessment Audit & Repair**: independently audit all 72 questions, correct answer-key/distractor weaknesses, difficulty imbalance, duplicates, and source alignment while preserving stable IDs where possible.
- **C15-5 — Micro-Checks + Immutable Evidence**: add concept-balanced micro-checks and durable first-attempt evidence.
- **C15-6 — Safety Escalation**: add narrow high-risk intervention logic for genuine scope/service hazards.
- **C15-7 — Targeted Remediation + Five-Question Reassessment**: add targeted lesson/flashcard remediation and fresh recovery questions using the shared architecture.
- **C15-8 — Final End-to-End Certification**: prove lesson → flashcards → assessment → micro-checks → detection → safety → remediation → reassessment → mastery recovery → instructor/admin visibility before merge authorization.

## C15-0 result

**Status: GREEN as a baseline audit.**

C15-0 makes no production behavior changes. Chapter 15 is live as content, flashcards, and assessment, but is not yet integrated into the unified Chapter 1–14 mastery architecture.

The next implementation phase is **C15-1 — Canonical Concept Architecture + Shared Grading/Evidence**.

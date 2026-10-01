# C21-0 — Chapter 21 Baseline + Collision Audit

## Baseline
Chapter 21 work begins from exact production `main`:

`6f8a5de79df862d3df14c85bde65fc098787c3c1`

Chapter 20 is closed and production-ready at this baseline.

## Existing Chapter 21 inventory

### Lesson
Source:

`src/lib/chapter-21-premium-content.ts`

Current lesson title:

**The Business of Barbering**

Current learning-objective sections:

1. `ch21-lo1` — paths into business;
2. `ch21-lo2` — opening a barbershop;
3. `ch21-lo3` — ownership structures;
4. `ch21-lo4` — business-plan components;
5. `ch21-lo5` — record keeping;
6. `ch21-lo6` — booth-renter responsibilities;
7. `ch21-lo7` — successful shop operations;
8. `ch21-lo8` — advertising/business growth.

The current lesson contains **64 section IDs** overall and five scenario/application sections:

- `ch21-kc1`
- `ch21-kc2`
- `ch21-kc3`
- `ch21-kc4`
- `ch21-real-shop-scenarios`

### Flashcards
Source:

`src/lib/chapter-21-premium-flashcards.ts`

Current inventory:

- **60 active premium flashcards**
- IDs `fc-ch21-001` through `fc-ch21-060`
- six current content categories:
  - Paths Into Business and Opening Considerations
  - Types of Barbershop Ownership
  - Business Plan Components
  - Record Keeping and Booth Rental
  - Successful Barbershop Operations
  - Advertising and Business Growth

Stable flashcard IDs must be preserved unless a later certification finds a genuine collision.

### Initial assessment
Source:

`src/lib/chapter-21-premium-quiz.ts`

Current inventory:

- **17 premium assessment questions**
- IDs `qq-21-01` through `qq-21-17`
- quiz ID `quiz-21`
- demo metadata already says 17 questions
- demo passing score is **80%**

Current assessment learning-objective metadata uses legacy IDs:

- `CH21-LO01`
- `CH21-LO02`
- `CH21-LO03`
- `CH21-LO04`
- `CH21-LO05`
- `CH21-LO06`
- `CH21-LO07`
- `CH21-LO08`

C21-1 should introduce canonical IDs while preserving legacy standard IDs for display/backward compatibility.

## Existing validation
Chapter 21 already has legacy/data-validation and component tests:

- `src/lib/chapter-21-data-validation.test.ts`
- `src/components/chapter/ChapterContent.ch21.test.tsx`
- `src/components/FlashcardClient.ch21.test.tsx`
- `src/components/QuizClient.ch21.test.tsx`
- `src/components/chapter/MasteryPanel.ch21.test.tsx`
- `src/components/chapter/RemediationPanel.ch21.test.tsx`

These are useful regression coverage but do not replace the shared C21-1 through C21-9 certification chain.

## Missing shared architecture
At this baseline there is **no Chapter 21 canonical concept registry** and no Chapter 21 registration in:

- `concept-mastery/activity-evidence-registry.ts`
- `remediation/chapter-registry.ts`
- `remediation/content-provider-registry.ts`
- `reassessment/provider-registry.ts`

There is therefore no certified Chapter 21 path yet for:

- canonical concept-family mapping;
- immutable micro-check evidence;
- combined gap detection;
- compliance/legal escalation;
- targeted remediation;
- fresh formal reassessment;
- mastery recovery;
- instructor/school-admin diagnostics.

## Business/legal/tax hardening boundary
Chapter 21 contains business, entity-structure, worker-classification, tax, record-retention, licensing, advertising, lease, and financing language.

C21 hardening must avoid presenting variable legal/tax/business rules as universal facts.

Examples that require review in C21-2/C21-3/C21-4 include:

- statements implying one ownership form is automatically best or most common;
- absolute liability-protection claims;
- simplified corporation / S-corporation tax descriptions;
- universal EIN, licensing, permit, record-retention, or booth-rental assumptions;
- fixed startup-cash rules stated as requirements rather than planning guidance;
- worker-classification statements that depend on labels instead of the actual working relationship;
- advertising/privacy statements that may depend on local law, platform policy, and client consent.

The hardened pattern should prefer:

- current applicable federal/state/local requirements;
- actual written agreements and facts/circumstances;
- official sources or qualified legal/tax/accounting guidance when rules vary.

## Safety vs compliance
Chapter 21 is primarily a business/compliance chapter.

C21-1 must explicitly determine whether any concept family qualifies as true bodily-safety critical.

Do **not** automatically apply the 100% urgent-safety recovery rule to:

- ownership structure;
- taxes;
- worker classification;
- licenses;
- leases;
- advertising;
- record keeping;
- client privacy/consent;
- financing.

Those belong to compliance/legal/business escalation unless a future concept actually involves immediate bodily harm.

## Shared grading
Chapter 21 must preserve the established shared grade:

- micro-checks: **20%**
- flashcards/study: **10%**
- chapter assessment: **40%**
- scenario/application: **15%**
- remediation/reassessment: **15%**

Completion remains separate from mastery.

## Proposed Chapter 21 certification sequence

### C21-1 — Canonical Concept Architecture
Define the canonical concept families, canonical LO IDs, lesson mapping, flashcard mapping, assessment mapping, compliance/legal criticality, and safety boundary.

### C21-2 — Lesson Hardening
Harden business/legal/tax/licensing/classification/recordkeeping/advertising language and add clean application anchors without changing the shared architecture.

### C21-3 — Flashcard Hardening
Audit all 60 flashcards against the hardened lesson and canonical concepts while preserving stable card IDs.

### C21-4 — Assessment Hardening
Audit all 17 assessment questions, canonicalize LO metadata, repair stale legal/tax/business assumptions, preserve IDs/order, and retain the 80% threshold.

### C21-5 — Micro-Checks + Immutable Evidence
Create exactly two fresh micro-check questions per canonical concept family, place them after the matching lesson sections, and persist first attempts through the shared immutable evidence path.

### C21-6 — Gap Detection + Compliance Escalation + Targeted Remediation
Combine assessment, micro-check, flashcard, and real scenario/application evidence; detect weak concepts; separate compliance/legal escalation from bodily safety; and create canonical targeted-remediation routing.

### C21-7 — Fresh Reassessment Reserve + Mastery Recovery
Create exactly five fresh formal reassessment questions per canonical concept family, apply the proper recovery threshold, preserve original misses, and prove recovery appends evidence without erasing history.

### C21-8 — Instructor / School-Admin Diagnostics
Expose mastery, weak concepts, preserved initial misses, compliance state, latest reassessment/recovery, and targeted-remediation status through same-school authorized staff surfaces.

### C21-9 — Final End-to-End Certification
Audit the complete Chapter 21 chain and run exact-head Engineering Verification plus Vercel before merge authorization.

## Collision rules
C21 implementation must not:

- duplicate the shared grading engine;
- duplicate remediation-cycle infrastructure;
- create a private per-chapter evidence table;
- overwrite first-attempt diagnostic history;
- reuse `qq-21-*`, `mcq-21-*`, and formal reassessment namespaces across phases;
- trust client-supplied correctness, concept IDs, student IDs, or authorization for authoritative writes;
- expose raw answer payloads/internal IDs in staff diagnostics;
- weaken tenant/same-school authorization.

## C21-0 result
The chapter has enough existing lesson, flashcard, assessment, and scenario content to proceed without replacing the current curriculum wholesale.

The next required phase is **C21-1 — Canonical Concept Architecture**.

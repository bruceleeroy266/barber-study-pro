# C10-4 — 75-Question Assessment Source & Adversarial Hardening

**Chapter:** 10 — Properties and Disorders of the Hair and Scalp  
**Branch:** `feat/c10-4-assessment-source-adversarial-hardening`  
**Certified C10-3 baseline:** `8bb8b70a2b708192c0bbd2a699588e1ca9e94752`

## Scope

C10-4 audits every active Chapter 10 assessment item against the repository Chapter 10 source record and the certified C10-1 concept architecture.

This phase preserves:
- all **75 stable question IDs**;
- all **75 order indexes**;
- the C10-1 concept-family mapping;
- the shared grading engine.

It changes only Chapter 10 assessment wording, answer placement, distractor quality, difficulty classification, and assessment-specific tests/documentation.

## Audit classification

All 75 items are classified exactly once:

- **KEEP: 18**
- **REPAIR: 20**
- **REWRITE: 37**

“KEEP” means the source-supported question concept was retained; answer ordering may still change because the original bank had a systemic answer-position defect.

## Major defects found

### 1. Answer-position collapse
The pre-C10-4 bank had:

- A: **75**
- B: **0**
- C: **0**
- D: **0**

That made the assessment structurally gameable regardless of content knowledge.

C10-4 rebalances the answer key deterministically to:

- A: **19**
- B: **19**
- C: **19**
- D: **18**

No question ID changes.

### 2. Unsupported source claims
The audit removed or replaced assessment content that was more specific than the current Chapter 10 textual source record, including:

- “63 million” abnormal hair-loss prevalence;
- alopecia senilis and alopecia syphilitica details;
- lanthionine claims;
- “one-third/final-third” bond-strength claims;
- extreme-heat disulfide claims;
- 48-hour lice survival timing;
- pharmacist-specific referral wording;
- fragilitas crinium;
- age-specific “most rapid growth” claims;
- hypertrophy / skin-cancer detection framing;
- cysteine/cystine details not present in the current textual record;
- tinea sycosis / sycosis barbae equivalence claims;
- pseudo-certification framing.

### 3. Recall-heavy items
C10-4 converts a substantial portion of the bank into application or discrimination prompts rather than pure definition recall.

The hardened bank contains at least **30 scenario/application-oriented prompts**, including:

- normal shedding versus abnormal loss;
- scalp findings that stop a service;
- texture and chemical-service implications;
- elasticity failure;
- hydrogen/salt/disulfide discrimination;
- permanent-wave neutralization;
- head-lice/scabies recognition;
- tinea recognition and referral;
- hair-shaft disorder recognition;
- anagen/telogen discrimination;
- cross-section/wave-pattern application;
- scalp-analysis contraindications.

### 4. Weak distractors
Distractors were tightened so the correct answer is not routinely identifiable from answer length or obviously unrelated wording.

A regression test now rejects items where the correct answer is dramatically longer or shorter than every distractor.

## Source-grounded anchors preserved

The assessment still tests the repository source record for:

- hair root/shaft anatomy;
- cuticle, cortex, medulla;
- COHNS percentages;
- peptide/polypeptide structure;
- hydrogen, salt, and disulfide bonds;
- permanent-wave bond changes and neutralization;
- melanin and wave-pattern cross sections;
- anagen/catagen/telogen;
- normal shedding and average growth rate;
- androgenic alopecia, areata, totalis, universalis;
- pityriasis and Malassezia;
- tinea barbae/capitis/favosa;
- pediculosis capitis and scabies;
- folliculitis/pseudofolliculitis/furuncles/carbuncles;
- texture, density, porosity, elasticity;
- service restrictions for parasites, irritation, and abrasions.

## Difficulty profile after hardening

The bank now contains:

- **21 easy**
- **24 medium**
- **30 hard**

This is intentionally more application-heavy than the pre-C10-4 bank while retaining foundational recall where appropriate.

## Guardrails

`src/lib/chapter-10-concepts/assessment-hardening.test.ts` verifies:

- 75 unique assessment IDs;
- exact KEEP / REPAIR / REWRITE coverage;
- stable order indexes;
- 75/75 one-to-one C10-1 concept mapping;
- coverage of every canonical Chapter 10 concept family;
- balanced A/B/C/D correct-answer distribution;
- at least 30 application-oriented prompts;
- absence of the unsupported legacy claims discovered in this audit;
- continued presence of source-recorded anchors;
- no obvious correct-answer length giveaway.

## Source limitation

As with C10-2 and C10-3, this phase is grounded in the repository Chapter 10 source-image set and the textual pages 248–268 material-summary/analysis record. It is not represented as a fresh page-by-page transcription from a standalone Chapter 10 PDF.

## Status

**C10-4 implementation complete. Exact-head Engineering Verification, Vercel Preview, and final 75-question adversarial certification are still required before GREEN status.**


Verification trigger: PR #117 is tested against `main`; no merge authorization is implied.

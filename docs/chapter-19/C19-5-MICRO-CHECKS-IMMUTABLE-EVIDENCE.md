# C19-5 — Micro-Checks + Immutable Evidence Integration

**Chapter:** 19 — Preparing for Licensure and Employment  
**Parent certified head:** `8f36b2dcdaf13de4086afbc2e4616f86318be665`  
**Scope:** 14 fresh micro-check questions, append-only first-attempt evidence, shared grading integration, and live ChapterContent wiring

## Inventory

C19-5 adds exactly 14 fresh micro-check questions:

- 2 per each of the seven canonical Chapter 19 concept families;
- stable micro-check question IDs `mcq-19-001` through `mcq-19-014`;
- seven placement IDs `mc-19-01` through `mc-19-07`;
- no overlap with the 15-question assessment namespace `qq-19-01` through `qq-19-15`;
- no recall-only items; each question uses understanding, application, or scenario difficulty.

Each question carries both canonical concept-family metadata and canonical `LO-19-01` through `LO-19-07` learning-objective metadata.

## Placement

Chapter 19 still has one real runtime lesson shell:

`chapter-19-lesson`

C19-5 anchors the seven micro-check groups to that real shell rather than inventing fake runtime section IDs. The semantic Chapter 19 lesson map continues to preserve the eight logical lesson sections.

## Immutable first-attempt evidence

C19-5 reuses the existing shared `chapter_micro_check_attempts` table.

The database contract remains append-only for authenticated students:

- select + insert are granted;
- update is not granted;
- delete is not granted;
- `unique (user_id, chapter_id, question_id)` prevents replacement of an original answer.

The Chapter 19 persistence adapter uses `chapter_id = 'ch-19'` and treats a duplicate insert as an already-recorded first attempt.

## Evidence preservation

Micro-check evidence records are emitted as:

- source: `micro_check`;
- attempt phase: `initial`;
- item ID: the stable `mcq-19-XXX` question ID;
- canonical Chapter 19 concept family;
- preserved correctness and timestamp.

The in-memory merge helper refuses to overwrite an existing evidence key, so a later duplicate answer cannot erase an original miss.

Future remediation/reassessment evidence uses the separate `remediation_reassessment` source and `reassessment` phase, allowing mastery recovery without mutating the original diagnostic history.

## Shared grading integration

C19-5 adds the Chapter 19 wrapper around the existing shared grading engine.

The shared weights remain unchanged:

- micro-check: 20%;
- flashcards: 10%;
- chapter assessment: 40%;
- scenario application: 15%;
- remediation/reassessment: 15%.

Persisted Chapter 19 first-attempt micro-check correctness feeds only the existing 20% micro-check component.

No scenario evidence is fabricated.

## Live runtime wiring

C19-5 wires Chapter 19 into `ChapterContent`:

- load existing `ch-19` micro-check attempts;
- restore already-recorded first attempts;
- render all seven Chapter 19 micro-check groups after the actual `chapter-19-lesson` shell;
- persist the first selected answer;
- lock the question after persistence;
- append the returned row locally without replacing an earlier row.

## Safety / compliance boundary

C19-5 preserves the certified distinction:

- urgent safety family: `ch19-practical-exam-safety-readiness`;
- compliance/legal-critical families:
  - `ch19-licensing-requirements-verification`;
  - `ch19-employment-law-contracts-compliance`.

The legal/compliance micro-checks do not classify employment-law or contract issues as bodily-safety emergencies.

## Preserved certified inventories

C19-5 does not change:

- one Chapter 19 runtime lesson shell;
- 60 hardened flashcards;
- 15 hardened assessment questions;
- seven canonical concept families;
- seven canonical learning objectives;
- the C19-4 assessment mappings;
- shared 20/10/40/15/15 weights.

## Certification gate

C19-5 is GREEN only when the exact final head passes:

1. C19-5 micro-check/evidence certification;
2. prior C19-1 through C19-4 certification tests;
3. TypeScript;
4. lint;
5. unit tests;
6. production build;
7. bundle-size check;
8. pilot onboarding certification;
9. exact-head Vercel deployment.

No merge is authorized by this certification.

# Exam Ready — prioritized remediation backlog (read-only)

Status: DRAFT / REVIEW REQUIRED. No production edits or source-bank release authorization.
Pinned question bank: `bb995882ecf95a00ee409a749114e13e5273c3e3`
Source assembly: `src/lib/exam-ready-import/index.ts` combines infection, anatomy, scientific gaps, hair/scalp, hair-structure, implements/equipment, hair-care, and facial hair/skin modules.
Release PR: #426 (draft); previous academic audit issue: #403.

## P0 — blocks publisher-sensitive real-bank release

| ID | Issue | Required evidence / independent decision | Acceptance criterion |
|---|---|---|---|
| ORIG-1 | Source wording and distractor similarity cannot be inferred safe from fact checks | Compare **assembled post-hardening** questions against licensed source within bounded reviewer process; record source PDF physical page and edition/version, provenance, independent-drafting evidence | Every in-scope item has a reviewer disposition: independently authored / needs rewrite / license evidence needed. Do not equate factual correctness with copyright clearance |
| LIC-1 | Commercial publisher-rights unknown | Authorized rights or legal/licensing review; preserve restrictions on internal reference and production usage | Explicit written clearance before import |
| REV-1 | No independent reviewer assigned/approved | Qualified independent curriculum/content reviewer and release signoff (cannot be simulated by CI or assistant) | Review findings closed and approval documented |
| SAFE-1 | HP-012 and HP-050 generalize chemical processing decisions | Validate safe alternatives against manufacturer instructions, contraindications, and strand-test practice | No instruction implies coarse texture automatically warrants stronger processing; source bank unchanged until approved |
| SCI-1 | HS-051 textbook canities taxonomy versus pili annulati optical explanation | Direct page cross-check plus independent dermatology source; review proposed language | Independently support scientific description without misattributing textbook or copying publisher expression |

## P1 — content accuracy and assessment quality

| ID | Issue | Scope / candidate question IDs | Acceptance criterion |
|---|---|---|---|
| FACT-1 | HP-020 strength-proportion claim lacks item-level source verification | HP-020, HP-038 | Remove unsupported numeral or cite precisely; distinguish factual basis from original wording |
| DEDUP-1 | Follicle, arrector pili, sebaceous repeats | HP-004/027/041; HP-006/042; HP-007/043 | Audit cognitive objective and blueprint coverage; retain distinct learning outcomes or propose independently authored replacements |
| DEDUP-2 | Hair-analysis cluster near-repeats | HP-008/009/021/025/028/029/040/049; HP-010/011/022/023/030/031/039/045/046 | Cluster by learning objective; mark near-identical stems and weak distractors for manual assessment |
| DEDUP-3 | Hair composition and bonds repetition | HP-016/017/035/047; HP-018/019/020/036/037/038 | Assess post-hardening key/distractor uniqueness and blueprint coverage |
| CAL-1 | Difficulty overstatement | HP-040, HP-044, HP-048, HP-049, HP-050; several 'scenario' items are recall-like | Expert-rated cognitive level, then optional item-statistics validation; not a mere label change without evidence |

## P2 — long-term measurement

| ID | Scope | Acceptance criterion |
|---|---|---|
| PSY-1 | Item discrimination and distractor functioning | Only characterize discrimination after adequate, consented pilot responses and minimum sample sizes; preflight judgments must be labeled editorial heuristics |
| GOV-1 | Versioned audit/change log | Keep original IDs, before/after representations, rationale, source citations, approvals, and rollback plan |

## First next verified assembled items after HP-050

The `hairStructurePropertyQuestionBank` comprises `HP-001` through `HP-050`. The next `examReadyQuestions` spread is `implementsEquipmentQuestions`, beginning at **IE-001**.
Preliminary read-only review:
- IE-001: A “Haircutting shears” — two opposing sharpened blades; supported common implement function. Distractors (neck strip, cape, towel) are weak.
- IE-002: A “Thinning shears” — reducing bulk while retaining length; supported. Distractors very implausible.
- IE-003: A “Control and elevate hair while guiding the cutting tool” — correct for clipper-over-comb. Distractors clearly irrelevant.
- IE-004: A “Brush” — smoothing/styling; basic recall. Minimal distractor discrimination.
- IE-005: A “Razor” — facial shaving; correct general function. ‘Medium’ difficulty likely overstated.
All IE-001–005 cite a generic 'NIC 2025 Barber Theory' implement-functions topic. **Precise official CIB edition and page mapping unverified**; this does not verify an official 2025 document or source text and does not certify originality.

## Tracking rules

- Academic progress counts *preliminary reviews* only, not question-release certifications.
- Engineering percentage measures previously defined technical/release gates and remains distinct.
- Pending licensing and human review cannot be self-approved by CI.
- No update to `src/lib/exam-ready-import/upstream` or database; no publisher content copied into this backlog.
